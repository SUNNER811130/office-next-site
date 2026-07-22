import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/database/integration/**/*.contract.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  maxWorkers: 1
};

export default createJestConfig(config);
