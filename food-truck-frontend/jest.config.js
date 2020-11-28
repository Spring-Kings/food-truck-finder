module.exports = {
    testRegex: "/__tests__/.*(test|spec)\\.[jt]sx?$",
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    transformIgnorePatterns: [
        "node_modules/(?!(lodash-es|@bessemer)/)"
    ],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    }
};