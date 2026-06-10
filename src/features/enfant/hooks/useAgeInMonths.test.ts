import { renderHook } from '@testing-library/react'
import { useAgeInMonths } from './useAgeInMonths'

describe('useAgeInMonths', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-06-15'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns 0 for a newborn born today', () => {
    const { result } = renderHook(() => useAgeInMonths(new Date('2024-06-15')))
    expect(result.current).toBe(0)
  })

  it('returns 17 for a child born 17 months ago', () => {
    // 2024-06 minus 2023-01 = 12 + 5 = 17 months
    const { result } = renderHook(() => useAgeInMonths(new Date('2023-01-15')))
    expect(result.current).toBe(17)
  })

  it('returns 0 for a future birth date, never negative', () => {
    const { result } = renderHook(() => useAgeInMonths(new Date('2024-07-15')))
    expect(result.current).toBe(0)
  })
})
