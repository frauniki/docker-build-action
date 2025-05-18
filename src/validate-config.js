const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { combinedSchema } = require('./schema');
const core = require('@actions/core');

/**
 * Validate configuration against schema
 * @param {Object} config - Configuration object to validate
 * @returns {Object} - Validation result with success flag and errors
 */
function validateConfig(config) {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  
  const validate = ajv.compile(combinedSchema);
  const valid = validate(config);
  
  if (!valid) {
    const errors = formatErrors(validate.errors);
    return {
      valid: false,
      errors
    };
  }
  
  return {
    valid: true,
    errors: []
  };
}

/**
 * Format validation errors to be more user-friendly
 * @param {Array} errors - Validation errors from Ajv
 * @returns {Array} - Formatted error messages
 */
function formatErrors(errors) {
  return errors.map(error => {
    const path = error.instancePath || '';
    const property = error.params.missingProperty || '';
    
    switch (error.keyword) {
      case 'required':
        return `Missing required property: ${property}`;
      case 'type':
        return `Invalid type at ${path}: expected ${error.params.type}`;
      case 'enum':
        return `Invalid value at ${path}: must be one of [${error.params.allowedValues.join(', ')}]`;
      case 'additionalProperties':
        return `Unknown property: ${error.params.additionalProperty}`;
      default:
        return `Validation error at ${path}: ${error.message}`;
    }
  });
}

/**
 * Validate configuration file and log errors
 * @param {Object} config - Configuration object to validate
 * @returns {boolean} - Whether validation passed
 */
function validateAndLogErrors(config) {
  const result = validateConfig(config);
  
  if (!result.valid) {
    core.error('Configuration validation failed:');
    result.errors.forEach(error => {
      core.error(`- ${error}`);
    });
    core.setFailed('Invalid configuration file');
    return false;
  }
  
  core.info('Configuration validation passed');
  return true;
}

module.exports = {
  validateConfig,
  validateAndLogErrors
};
