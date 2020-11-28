module.exports = {
    testRegex: "/__tests?__/.*(test|spec)\\.[jt]sx?$",
    
    // Learned from: https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
    testEnvironment: "node",
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    transformIgnorePatterns: [
        "node_modules/(?!(lodash-es|@bessemer)/)"
    ],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    }
};