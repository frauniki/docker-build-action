const fs = require('fs');
const yaml = require('js-yaml');
const core = require('@actions/core');

/**
 * Parse the docker-build.yaml configuration file
 * @param {string} configFile - Path to the configuration file
 * @returns {Object} - Parsed configuration
 */
function parseConfig(configFile) {
  if (!fs.existsSync(configFile)) {
    core.setFailed(`Configuration file ${configFile} not found`);
    return null;
  }
  
  const configContent = fs.readFileSync(configFile, 'utf8');
  const config = yaml.load(configContent);
  
  let builds = [];
  
  if (config.builds && Array.isArray(config.builds)) {
    core.setOutput('has_builds', 'true');
    core.setOutput('build_count', config.builds.length.toString());
    
    builds = config.builds.map((build, index) => {
      const name = build.name || `build-${index}`;
      const context = build.context || '.';
      const dockerfile = build.dockerfile || 'Dockerfile';
      const platforms = build.platforms || 'linux/amd64';
      const image = build.image;
      const push = (build.push !== undefined) ? build.push.toString() : 'false';
      const registry = build.registry || 'ghcr.io';
      
      if (!image) {
        core.setFailed(`Image name not specified for build ${index}`);
        return null;
      }
      
      const buildObj = {
        name,
        context,
        dockerfile,
        platforms,
        image,
        push,
        registry,
        tags: build.tags || {},
        flavor: build.flavor || {},
        labels: build.labels || {}
      };
      
      core.setOutput(`build_${index}_name`, name);
      core.setOutput(`build_${index}_context`, context);
      core.setOutput(`build_${index}_dockerfile`, dockerfile);
      core.setOutput(`build_${index}_platforms`, platforms);
      core.setOutput(`build_${index}_image`, image);
      core.setOutput(`build_${index}_push`, push);
      core.setOutput(`build_${index}_registry`, registry);
      
      if (build.tags) {
        core.setOutput(`build_${index}_tags`, JSON.stringify(build.tags));
      }
      
      if (build.flavor) {
        core.setOutput(`build_${index}_flavor`, JSON.stringify(build.flavor));
      }
      
      if (build.labels) {
        core.setOutput(`build_${index}_labels`, JSON.stringify(build.labels));
      }
      
      return buildObj;
    }).filter(build => build !== null);
  } else {
    core.setOutput('has_builds', 'false');
    core.setOutput('build_count', '1');
    
    const context = config.context || '.';
    const dockerfile = config.dockerfile || 'Dockerfile';
    const platforms = config.platforms || 'linux/amd64';
    const image = config.image;
    const push = (config.push !== undefined) ? config.push.toString() : 'false';
    const registry = config.registry || 'ghcr.io';
    
    if (!image) {
      core.setFailed('Image name not specified in configuration file');
      return null;
    }
    
    const buildObj = {
      name: 'default',
      context,
      dockerfile,
      platforms,
      image,
      push,
      registry,
      tags: config.tags || {},
      flavor: config.flavor || {},
      labels: config.labels || {}
    };
    
    builds.push(buildObj);
    
    core.setOutput('build_0_name', 'default');
    core.setOutput('build_0_context', context);
    core.setOutput('build_0_dockerfile', dockerfile);
    core.setOutput('build_0_platforms', platforms);
    core.setOutput('build_0_image', image);
    core.setOutput('build_0_push', push);
    core.setOutput('build_0_registry', registry);
    
    core.setOutput('context', context);
    core.setOutput('dockerfile', dockerfile);
    core.setOutput('platforms', platforms);
    core.setOutput('image', image);
    core.setOutput('push', push);
    core.setOutput('registry', registry);
    
    if (config.tags) {
      core.setOutput('build_0_tags', JSON.stringify(config.tags));
      core.setOutput('tags', JSON.stringify(config.tags));
    }
    
    if (config.flavor) {
      core.setOutput('build_0_flavor', JSON.stringify(config.flavor));
      core.setOutput('flavor', JSON.stringify(config.flavor));
    }
    
    if (config.labels) {
      core.setOutput('build_0_labels', JSON.stringify(config.labels));
      core.setOutput('labels', JSON.stringify(config.labels));
    }
  }
  
  core.setOutput('builds', JSON.stringify(builds));
  
  return builds;
}

module.exports = parseConfig;
