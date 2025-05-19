const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

/**
 * Process multiple Docker builds
 * @param {Array} builds - Array of build configurations
 * @returns {Promise<Object>} - Result of the build process
 */
async function processBuilds(builds) {
  const buildCount = builds.length;

  console.log(`Processing ${buildCount} builds...`);

  for (let i = 0; i < buildCount; i++) {
    const build = builds[i];
    console.log(`Building ${build.name} (${i + 1}/${buildCount})`);

    let metadataArgs = ['--name', build.name, '--images', build.image];

    if (build.tags) {
      const tags = build.tags;
      if (typeof tags === 'string') {
        metadataArgs.push('--tags', tags);
      } else if (Array.isArray(tags)) {
        console.log(`Processing ${tags.length} tag definitions for ${build.name}`);
        tags.forEach((tag) => {
          if (tag && typeof tag === 'object') {
            for (const [key, value] of Object.entries(tag)) {
              metadataArgs.push('--tag', `${key}=${value}`);
            }
          }
        });
      } else if (typeof tags === 'object') {
        for (const [key, value] of Object.entries(tags)) {
          metadataArgs.push('--tag', `${key}=${value}`);
        }
      }
    }

    if (build.flavor) {
      const flavor = build.flavor;
      if (typeof flavor === 'string') {
        metadataArgs.push('--flavor', flavor);
      } else if (typeof flavor === 'object') {
        for (const [key, value] of Object.entries(flavor)) {
          metadataArgs.push('--flavor', `${key}=${value}`);
        }
      }
    }

    if (build.labels && typeof build.labels === 'object') {
      for (const [key, value] of Object.entries(build.labels)) {
        metadataArgs.push('--label', `${key}=${value}`);
      }
    }

    console.log(`Generating metadata for build ${build.name}...`);

    try {
      const metadataFile = `/tmp/metadata_${i}.json`;

      fs.writeFileSync(
        metadataFile,
        JSON.stringify({
          tags: [],
          labels: {},
        })
      );

      console.log(`Building Docker image for ${build.name}...`);

      const pushOrLoad = build.push === 'true' ? '--push' : '--load';

      await exec.exec('docker', [
        'buildx',
        'build',
        '--platform',
        build.platforms,
        '--tag',
        `${build.image}:latest`,
        '--file',
        `${build.context}/${build.dockerfile}`,
        pushOrLoad,
        build.context,
      ]);

      console.log(`Build ${build.name} completed successfully`);
    } catch (error) {
      core.setFailed(`Failed to build ${build.name}: ${error.message}`);
      throw error;
    }
  }

  console.log('All builds completed successfully');
  return { success: true };
}

module.exports = processBuilds;
