import { afterEach, describe, expect, it, vi } from 'vitest'

import { checkUpstreamDevelopFreshness, clearAppFreshnessCache } from './app-version'

describe('app version freshness', () => {
  afterEach(() => {
    clearAppFreshnessCache()
  })

  it('checks develop freshness with caching and returns behind commits', async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> = []
    const fetcher: typeof fetch = async (input, init) => {
      requests.push({ input, init })

      const url = String(input)
      if (url.endsWith('/commits/develop')) {
        return new Response(
          JSON.stringify({
            html_url: 'https://github.com/Sakayori-Iroha-168/Software_Teamwork/commit/develop',
            sha: '2222222222222222222222222222222222222222',
          }),
          { status: 200 },
        )
      }

      return new Response(
        JSON.stringify({
          ahead_by: 3,
          behind_by: 1,
        }),
        { status: 200 },
      )
    }

    const result = await checkUpstreamDevelopFreshness(
      fetcher,
      '1111111111111111111111111111111111111111',
    )

    expect(result.status).toBe('different')
    expect(result.commitsBehind).toBe(3)
    expect(result.commitsAhead).toBe(1)
    expect(result.latestSha).toBe('2222222222222222222222222222222222222222')
    expect(requests).toHaveLength(2)
    expect(requests.every((request) => request.init?.cache === 'default')).toBe(true)

    const cachedResult = await checkUpstreamDevelopFreshness(
      fetcher,
      '1111111111111111111111111111111111111111',
    )

    expect(cachedResult).toEqual(result)
    expect(requests).toHaveLength(2)
  })

  it('deduplicates concurrent freshness checks for the same commit', async () => {
    const fetcher = vi.fn<typeof fetch>(async (input) => {
      const url = String(input)
      if (url.endsWith('/commits/develop')) {
        return new Response(
          JSON.stringify({
            html_url: 'https://github.com/Sakayori-Iroha-168/Software_Teamwork/commit/develop',
            sha: '2222222222222222222222222222222222222222',
          }),
          { status: 200 },
        )
      }

      return new Response(
        JSON.stringify({
          ahead_by: 0,
          behind_by: 0,
        }),
        { status: 200 },
      )
    })

    const [firstResult, secondResult] = await Promise.all([
      checkUpstreamDevelopFreshness(fetcher, '1111111111111111111111111111111111111111'),
      checkUpstreamDevelopFreshness(fetcher, '1111111111111111111111111111111111111111'),
    ])

    expect(firstResult).toEqual(secondResult)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('returns unknown when the develop commit request is forbidden', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const fetcher = vi.fn<typeof fetch>(async () => new Response('rate limited', { status: 403 }))

    const result = await checkUpstreamDevelopFreshness(
      fetcher,
      '1111111111111111111111111111111111111111',
    )

    expect(result.status).toBe('unknown')
    expect(result.latestSha).toBe('')
    expect(fetcher).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('GitHub commits/develop 返回 403'))
  })

  it('returns unknown when the local commit is not available to GitHub compare', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const fetcher: typeof fetch = async (input) => {
      const url = String(input)
      if (url.endsWith('/commits/develop')) {
        return new Response(
          JSON.stringify({
            html_url: 'https://github.com/Sakayori-Iroha-168/Software_Teamwork/commit/develop',
            sha: '2222222222222222222222222222222222222222',
          }),
          { status: 200 },
        )
      }

      return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 })
    }

    const result = await checkUpstreamDevelopFreshness(
      fetcher,
      'local-only-local-only-local-only-local-only',
    )

    expect(result.status).toBe('unknown')
    expect(result.commitsBehind).toBe(0)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('GitHub compare 返回 404'))
  })
})
