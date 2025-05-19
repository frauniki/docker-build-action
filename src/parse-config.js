const fs = require("fs");
const yaml = require("js-yaml");
const core = require("@actions/core");
const { validateAndLogErrors } = require("./validate-config");

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

  const configContent = fs.readFileSync(configFile, "utf8");
  const config = yaml.load(configContent);

  if (!validateAndLogErrors(config)) {
    return null;
  }

  let builds = [];

  if (config.builds && Array.isArray(config.builds)) {
    core.setOutput("has_builds", "true");
    core.setOutput("build_count", config.builds.length.toString());

    builds = config.builds
      .map((build, index) => {
        const name = build.name || `build-${index}`;
        const context = build.context || ".";
        const dockerfile = build.dockerfile || "Dockerfile";
        const platforms = build.platforms || "linux/amd64";
        const image = build.image;
        const push = build.push !== undefined ? build.push.toString() : "false";
        const registry = build.registry || "ghcr.io";

        if (!image) {
          core.setFailed(`Image name not specified for build ${index}`);
          return null;
        }

        let tags = build.tags || {};

        if (Array.isArray(tags)) {
          core.info(`Build ${index} has ${tags.length} tag definitions`);
        }

        const buildObj = {
          name,
          context,
          dockerfile,
          platforms,
          image,
          push,
          registry,
          tags,
          flavor: build.flavor || {},
          labels: build.labels || {},
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
      })
      .filter((build) => build !== null);
  }

  core.setOutput("builds", JSON.stringify(builds));

  return builds;
}

module.exports = parseConfig;
