const FALLBACK_APP_VERSION = '0.0.0'
const APP_FRESHNESS_CACHE_KEY = 'software-teamwork:app-version:freshness'
const APP_FRESHNESS_CACHE_TTL_MS = 5 * 60 * 1000
const GITHUB_REPO_API_URL = 'https://api.github.com/repos/Sakayori-Iroha-168/Software_Teamwork'
const GITHUB_REQUEST_INIT: RequestInit = {
  cache: 'default',
  headers: {
    Accept: 'application/vnd.github+json',
  },
}

export const APP_UPDATE_COMMAND = 'git fetch upstream --prune && git rebase upstream/develop'

export type AppFreshnessStatus = 'current' | 'different' | 'unknown'

export type AppFreshnessResult = {
  checkedAt: Date
  commitsAhead: number
  commitsBehind: number
  currentSha: string
  latestSha: string
  latestUrl: string | null
  status: AppFreshnessStatus
}

type GitHubCommitResponse = {
  html_url?: unknown
  sha?: unknown
}

type GitHubCompareResponse = {
  ahead_by?: unknown
  behind_by?: unknown
  status?: unknown
}

type SerializedAppFreshnessResult = Omit<AppFreshnessResult, 'checkedAt'> & {
  checkedAt: string
}

type AppFreshnessCacheEntry = {
  cachedAt: number
  cacheKey: string
  result: SerializedAppFreshnessResult
}

let memoryFreshnessCache: AppFreshnessCacheEntry | null = null
let inFlightFreshnessCheck: { cacheKey: string; promise: Promise<AppFreshnessResult> } | null = null

export function formatAppVersion(version: string | null | undefined) {
  const versionNumber = version?.trim().replace(/^v/i, '').trim()

  return `v${versionNumber || FALLBACK_APP_VERSION}`
}

export const appVersionLabel = formatAppVersion(__APP_VERSION__)
export const appCommitSha = __APP_COMMIT_SHA__.trim()
export const appCommitShortSha = __APP_COMMIT_SHORT_SHA__.trim() || 'unknown'

function normalizeSha(value: string) {
  return value.trim().toLowerCase()
}

function shortSha(value: string) {
  return value.slice(0, 8) || 'unknown'
}

function warnGitHubFreshnessFallback(reason: string) {
  console.warn(`[app-version] ${reason}`)
}

function getAppVersionStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function freshnessCacheKey(currentSha: string) {
  return `${GITHUB_REPO_API_URL}:develop:${normalizeSha(currentSha) || 'unknown'}`
}

function isFreshCacheEntry(entry: AppFreshnessCacheEntry, cacheKey: string, now = Date.now()) {
  const age = now - entry.cachedAt

  return entry.cacheKey === cacheKey && age >= 0 && age < APP_FRESHNESS_CACHE_TTL_MS
}

function serializeFreshnessResult(result: AppFreshnessResult): SerializedAppFreshnessResult {
  return {
    ...result,
    checkedAt: result.checkedAt.toISOString(),
  }
}

function deserializeFreshnessResult(result: SerializedAppFreshnessResult): AppFreshnessResult {
  return {
    ...result,
    checkedAt: new Date(result.checkedAt),
  }
}

function isFreshnessStatus(value: unknown): value is AppFreshnessStatus {
  return value === 'current' || value === 'different' || value === 'unknown'
}

function parseCachedFreshnessEntry(value: unknown): AppFreshnessCacheEntry | null {
  if (!value || typeof value !== 'object') return null

  const entry = value as Partial<AppFreshnessCacheEntry>
  const result = entry.result as Partial<SerializedAppFreshnessResult> | undefined

  if (
    typeof entry.cachedAt !== 'number' ||
    !Number.isFinite(entry.cachedAt) ||
    typeof entry.cacheKey !== 'string' ||
    !result ||
    typeof result.checkedAt !== 'string' ||
    typeof result.commitsAhead !== 'number' ||
    typeof result.commitsBehind !== 'number' ||
    typeof result.currentSha !== 'string' ||
    typeof result.latestSha !== 'string' ||
    !(typeof result.latestUrl === 'string' || result.latestUrl === null) ||
    !isFreshnessStatus(result.status)
  ) {
    return null
  }

  return {
    cachedAt: entry.cachedAt,
    cacheKey: entry.cacheKey,
    result: {
      checkedAt: result.checkedAt,
      commitsAhead: result.commitsAhead,
      commitsBehind: result.commitsBehind,
      currentSha: result.currentSha,
      latestSha: result.latestSha,
      latestUrl: result.latestUrl,
      status: result.status,
    },
  }
}

function readCachedFreshness(cacheKey: string) {
  if (memoryFreshnessCache && isFreshCacheEntry(memoryFreshnessCache, cacheKey)) {
    return deserializeFreshnessResult(memoryFreshnessCache.result)
  }

  const storage = getAppVersionStorage()
  const rawEntry = storage?.getItem(APP_FRESHNESS_CACHE_KEY)

  if (!rawEntry) return null

  try {
    const entry = parseCachedFreshnessEntry(JSON.parse(rawEntry))

    if (!entry || !isFreshCacheEntry(entry, cacheKey)) return null

    memoryFreshnessCache = entry

    return deserializeFreshnessResult(entry.result)
  } catch {
    return null
  }
}

function writeCachedFreshness(cacheKey: string, result: AppFreshnessResult) {
  const entry: AppFreshnessCacheEntry = {
    cachedAt: Date.now(),
    cacheKey,
    result: serializeFreshnessResult(result),
  }

  memoryFreshnessCache = entry

  try {
    getAppVersionStorage()?.setItem(APP_FRESHNESS_CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Browser storage may be disabled; the in-memory cache still deduplicates this tab.
  }
}

export function clearAppFreshnessCache() {
  memoryFreshnessCache = null
  inFlightFreshnessCheck = null

  try {
    getAppVersionStorage()?.removeItem(APP_FRESHNESS_CACHE_KEY)
  } catch {
    // Best effort test/runtime reset.
  }
}

export function compareAppFreshness(currentSha: string, latestSha: string): AppFreshnessStatus {
  const current = normalizeSha(currentSha)
  const latest = normalizeSha(latestSha)

  if (!current || !latest) return 'unknown'
  if (current === latest) return 'current'

  return 'different'
}

function parseGitHubCompareResponse(payload: unknown) {
  const comparison = payload as GitHubCompareResponse
  const commitsBehind =
    typeof comparison.ahead_by === 'number' && Number.isFinite(comparison.ahead_by)
      ? comparison.ahead_by
      : 0
  const commitsAhead =
    typeof comparison.behind_by === 'number' && Number.isFinite(comparison.behind_by)
      ? comparison.behind_by
      : 0

  return { commitsAhead, commitsBehind }
}

function parseGitHubCommitResponse(payload: unknown) {
  const commit = payload as GitHubCommitResponse
  const latestSha = typeof commit.sha === 'string' ? commit.sha : ''
  const latestUrl = typeof commit.html_url === 'string' ? commit.html_url : null

  return { latestSha, latestUrl }
}

function unknownFreshnessResult(
  currentSha: string,
  latestSha = '',
  latestUrl: string | null = null,
): AppFreshnessResult {
  return {
    checkedAt: new Date(),
    commitsAhead: 0,
    commitsBehind: 0,
    currentSha,
    latestSha,
    latestUrl,
    status: 'unknown',
  }
}

function githubStatusReason(response: Response) {
  return response.statusText ? `${response.status} ${response.statusText}` : String(response.status)
}

async function readGitHubJson(response: Response, endpoint: string) {
  try {
    return await response.json()
  } catch {
    warnGitHubFreshnessFallback(`GitHub ${endpoint} 响应不是有效 JSON，版本状态记为 unknown。`)

    return null
  }
}

async function fetchLatestDevelopCommit(fetcher: typeof fetch) {
  const endpoint = 'commits/develop'
  let response: Response

  try {
    response = await fetcher(`${GITHUB_REPO_API_URL}/${endpoint}`, GITHUB_REQUEST_INIT)
  } catch (error) {
    warnGitHubFreshnessFallback(
      `GitHub ${endpoint} 请求失败：${error instanceof Error ? error.message : 'unknown error'}，版本状态记为 unknown。`,
    )

    return null
  }

  if (!response.ok) {
    warnGitHubFreshnessFallback(
      `GitHub ${endpoint} 返回 ${githubStatusReason(response)}，版本状态记为 unknown。`,
    )

    return null
  }

  const payload = await readGitHubJson(response, endpoint)
  if (!payload) return null

  const commit = parseGitHubCommitResponse(payload)

  if (!commit.latestSha) {
    warnGitHubFreshnessFallback(`GitHub ${endpoint} 响应缺少 SHA，版本状态记为 unknown。`)

    return null
  }

  return commit
}

async function fetchDevelopComparison(fetcher: typeof fetch, currentSha: string) {
  const endpoint = `compare/${encodeURIComponent(currentSha)}...develop`
  let response: Response

  try {
    response = await fetcher(`${GITHUB_REPO_API_URL}/${endpoint}`, GITHUB_REQUEST_INIT)
  } catch (error) {
    warnGitHubFreshnessFallback(
      `GitHub compare 请求失败：${error instanceof Error ? error.message : 'unknown error'}，版本状态记为 unknown。`,
    )

    return null
  }

  if (!response.ok) {
    warnGitHubFreshnessFallback(
      `GitHub compare 返回 ${githubStatusReason(response)}，版本状态记为 unknown。`,
    )

    return null
  }

  const payload = await readGitHubJson(response, 'compare')

  return payload ? parseGitHubCompareResponse(payload) : null
}

async function checkUpstreamDevelopFreshnessUncached(
  fetcher: typeof fetch = fetch,
  currentSha = appCommitSha,
): Promise<AppFreshnessResult> {
  const latestCommit = await fetchLatestDevelopCommit(fetcher)

  if (!latestCommit) return unknownFreshnessResult(currentSha)

  const { latestSha, latestUrl } = latestCommit

  if (!normalizeSha(currentSha)) {
    warnGitHubFreshnessFallback('当前构建缺少提交 SHA，版本状态记为 unknown。')

    return unknownFreshnessResult(currentSha, latestSha, latestUrl)
  }

  const comparison = await fetchDevelopComparison(fetcher, currentSha)

  if (!comparison) return unknownFreshnessResult(currentSha, latestSha, latestUrl)

  const { commitsAhead, commitsBehind } = comparison

  return {
    checkedAt: new Date(),
    commitsAhead,
    commitsBehind,
    currentSha,
    latestSha,
    latestUrl,
    status: commitsBehind > 0 ? 'different' : 'current',
  }
}

export async function checkUpstreamDevelopFreshness(
  fetcher: typeof fetch = fetch,
  currentSha = appCommitSha,
): Promise<AppFreshnessResult> {
  const cacheKey = freshnessCacheKey(currentSha)
  const cachedResult = readCachedFreshness(cacheKey)

  if (cachedResult) return cachedResult
  if (inFlightFreshnessCheck?.cacheKey === cacheKey) return inFlightFreshnessCheck.promise

  const promise = checkUpstreamDevelopFreshnessUncached(fetcher, currentSha)
    .then((result) => {
      writeCachedFreshness(cacheKey, result)

      return result
    })
    .finally(() => {
      if (inFlightFreshnessCheck?.promise === promise) {
        inFlightFreshnessCheck = null
      }
    })

  inFlightFreshnessCheck = { cacheKey, promise }

  return promise
}

export function formatCommitLabel(sha: string) {
  return shortSha(sha.trim())
}
