export const validConfig = {
  serverUrl: 'http://localhost:7880',
  apiKey: 'API_KEY_TEST',
  apiSecret: 'SECRET_TEST_KEY',
};

export const validConfigWithWs = {
  serverUrl: 'ws://localhost:7880',
  apiKey: 'API_KEY_TEST',
  apiSecret: 'SECRET_TEST_KEY',
};

export const validConfigWithWss = {
  serverUrl: 'wss://livekit.example.com',
  apiKey: 'API_KEY_PROD',
  apiSecret: 'SECRET_PROD_KEY',
};

export const invalidConfigMissingUrl = {
  serverUrl: '',
  apiKey: 'API_KEY_TEST',
  apiSecret: 'SECRET_TEST_KEY',
};

export const invalidConfigMissingKey = {
  serverUrl: 'http://localhost:7880',
  apiKey: '',
  apiSecret: 'SECRET_TEST_KEY',
};

export const invalidConfigMissingSecret = {
  serverUrl: 'http://localhost:7880',
  apiKey: 'API_KEY_TEST',
  apiSecret: '',
};

export const partialConfig = {
  serverUrl: 'http://localhost:7880',
  apiKey: 'API_KEY_TEST',
};

export const configWithInvalidUrl = {
  serverUrl: 'not-a-valid-url',
  apiKey: 'API_KEY_TEST',
  apiSecret: 'SECRET_TEST_KEY',
};

export const configFixtures = {
  validConfig,
  validConfigWithWs,
  validConfigWithWss,
  invalidConfigMissingUrl,
  invalidConfigMissingKey,
  invalidConfigMissingSecret,
  partialConfig,
  configWithInvalidUrl,
};
