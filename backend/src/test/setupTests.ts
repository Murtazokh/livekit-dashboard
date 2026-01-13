import { beforeEach } from 'vitest';

// Reset environment before each test
beforeEach(() => {
  // Reset process.env for testing
  process.env.NODE_ENV = 'test';
});
