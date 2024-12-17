import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  roots: ["<rootDir>/src/__tests__"],
  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;
