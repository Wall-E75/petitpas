import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

// next/jest lit automatiquement tsconfig.json et résout les alias @/*
const config: Config = {
  testEnvironment: 'jsdom',
}

export default createJestConfig(config)
