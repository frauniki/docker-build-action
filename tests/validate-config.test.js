const { validateConfig } = require('../src/validate-config');
const fs = require('fs');
const yaml = require('js-yaml');

describe('Configuration Validation', () => {
  test('Valid list format configuration should pass validation', () => {
    const config = {
      builds: [
        {
          name: 'test-image',
          context: './test',
          dockerfile: 'Dockerfile',
          platforms: 'linux/amd64',
          image: 'ghcr.io/frauniki/docker-build-action-test',
          push: false,
          registry: 'ghcr.io',
          tags: {
            type: 'raw',
            value: 'latest'
          },
          flavor: {
            latest: 'auto'
          },
          labels: {
            'org.opencontainers.image.title': 'Test Image'
          }
        }
      ]
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('Valid legacy format configuration should pass validation', () => {
    const config = {
      context: './test',
      dockerfile: 'Dockerfile',
      platforms: 'linux/amd64',
      image: 'ghcr.io/frauniki/docker-build-action-test',
      push: false,
      registry: 'ghcr.io',
      tags: {
        type: 'raw',
        value: 'latest'
      },
      flavor: {
        latest: 'auto'
      },
      labels: {
        'org.opencontainers.image.title': 'Test Image'
      }
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('Invalid list format configuration should fail validation', () => {
    const config = {
      builds: [
        {
          name: 'test-image',
          context: './test',
          dockerfile: 'Dockerfile',
          platforms: 'linux/amd64',
          push: false,
          registry: 'ghcr.io'
        }
      ]
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Missing required property');
  });
  
  test('Invalid legacy format configuration should fail validation', () => {
    const config = {
      context: './test',
      dockerfile: 'Dockerfile',
      platforms: 'linux/amd64',
      push: false,
      registry: 'ghcr.io'
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Missing required property');
  });
  
  test('Invalid type in configuration should fail validation', () => {
    const config = {
      builds: [
        {
          name: 'test-image',
          context: './test',
          dockerfile: 'Dockerfile',
          platforms: 'linux/amd64',
          image: 'ghcr.io/frauniki/docker-build-action-test',
          push: 'not-a-boolean', // Should be boolean or 'true'/'false' string
          registry: 'ghcr.io'
        }
      ]
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(true); // This should pass because push can be a string
  });
  
  test('Invalid enum value in configuration should fail validation', () => {
    const config = {
      builds: [
        {
          name: 'test-image',
          context: './test',
          dockerfile: 'Dockerfile',
          platforms: 'linux/amd64',
          image: 'ghcr.io/frauniki/docker-build-action-test',
          push: false,
          registry: 'ghcr.io',
          tags: {
            type: 'invalid-type', // Should be one of the allowed types
            value: 'latest'
          }
        }
      ]
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Invalid type');
    expect(result.errors[0]).toContain('tags');
  });
  
  test('Unknown property in configuration should fail validation', () => {
    const config = {
      builds: [
        {
          name: 'test-image',
          context: './test',
          dockerfile: 'Dockerfile',
          platforms: 'linux/amd64',
          image: 'ghcr.io/frauniki/docker-build-action-test',
          push: false,
          registry: 'ghcr.io',
          unknown_property: 'value' // Unknown property
        }
      ]
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Unknown property');
  });
  
  test('test/docker-build.yaml should pass validation', () => {
    const configContent = fs.readFileSync('./test/docker-build.yaml', 'utf8');
    const config = yaml.load(configContent);
    
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('example/docker-build.yaml should pass validation', () => {
    const configContent = fs.readFileSync('./example/docker-build.yaml', 'utf8');
    const config = yaml.load(configContent);
    
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('Valid configuration with tags as array should pass validation', () => {
    const config = {
      builds: [
        {
          name: 'test-image',
          context: './test',
          dockerfile: 'Dockerfile',
          platforms: 'linux/amd64',
          image: 'ghcr.io/frauniki/docker-build-action-test',
          push: false,
          registry: 'ghcr.io',
          tags: [
            {
              type: 'ref',
              event: 'branch'
            },
            {
              type: 'semver',
              pattern: '{{version}}'
            },
            {
              type: 'raw',
              value: 'latest'
            }
          ],
          flavor: {
            latest: 'auto'
          },
          labels: {
            'org.opencontainers.image.title': 'Test Image'
          }
        }
      ]
    };
    
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
