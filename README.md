# Docker Build Action

GitHub Action to build Docker images based on a static `docker-build.yaml` configuration file.

## Features

- Automatically builds Docker images based on configuration in `docker-build.yaml`
- Supports all configuration options from [docker/metadata-action](https://github.com/docker/metadata-action)
- Uses [docker/build-push-action](https://github.com/docker/build-push-action) for building images
- Simple to use in your GitHub workflows

## Usage

Add the following to your GitHub workflow:

```yaml
name: Build Docker Image

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build Docker image
        uses: frauniki/docker-build-action@main
        with:
          config-file: docker-build.yaml
```

## Configuration

Create a `docker-build.yaml` file in the root of your repository. You can define multiple builds using the list format or use the legacy format for a single build.

### Multiple Builds (List Format)

```yaml
builds:
  - name: app                                # Name of the build (optional, default: "build-{index}")
    context: .                               # Docker build context (default: ".")
    dockerfile: Dockerfile                   # Path to Dockerfile (default: "Dockerfile")
    platforms: linux/amd64,linux/arm64       # Platforms to build for (default: "linux/amd64")
    image: ghcr.io/username/app              # Image name (required)
    push: true                               # Whether to push the image (default: false)
    registry: ghcr.io                        # Docker registry to push to (default: "ghcr.io")
    tags:                                    # Tags configuration (same format as docker/metadata-action)
      type: ref
      event: branch
    flavor:                                  # Flavor configuration (same format as docker/metadata-action)
      latest: auto
    labels:                                  # Labels configuration (same format as docker/metadata-action)
      org.opencontainers.image.title: App Image
      org.opencontainers.image.description: My App Docker Image
      
  - name: worker
    context: ./worker
    dockerfile: Dockerfile.worker
    platforms: linux/amd64
    image: ghcr.io/username/worker
    push: false
    registry: ghcr.io
    tags:
      type: raw
      value: latest
    flavor:
      latest: auto
    labels:
      org.opencontainers.image.title: Worker Image
      org.opencontainers.image.description: My Worker Docker Image
```

### Single Build (Legacy Format)

```yaml
# Docker build context (default: ".")
context: .

# Path to Dockerfile (default: "Dockerfile")
dockerfile: Dockerfile

# Platforms to build for (default: "linux/amd64")
platforms: linux/amd64,linux/arm64

# Image name (required)
image: ghcr.io/username/image-name

# Whether to push the image to the registry (default: "false")
push: true

# Docker registry to push to (default: "ghcr.io")
registry: ghcr.io

# Tags configuration (same format as docker/metadata-action)
tags:
  type: ref
  event: branch
  
# Flavor configuration (same format as docker/metadata-action)
flavor:
  latest: auto
  
# Labels configuration (same format as docker/metadata-action)
labels:
  org.opencontainers.image.title: My Image
  org.opencontainers.image.description: My Docker Image
```

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `config-file` | Path to the docker-build.yaml configuration file | No | `docker-build.yaml` |

## Example Configuration

Here's a complete example of a `docker-build.yaml` file:

```yaml
context: .
dockerfile: Dockerfile
platforms: linux/amd64,linux/arm64
image: ghcr.io/username/image-name
push: true
registry: ghcr.io
tags: type=raw,value=latest
flavor: latest=auto
labels:
  org.opencontainers.image.title: My Image
  org.opencontainers.image.description: My Docker Image
  org.opencontainers.image.vendor: My Company
```

## License

MIT
