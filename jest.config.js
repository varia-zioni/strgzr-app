module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?@react-native|react-native)"
  ],
  collectCoverage: true,
  "coverageThreshold": {
    "global": {
      "lines": 80
    }
  }
};
