console.log("🐲🐲🐲🐲 jest.config.js");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
};
