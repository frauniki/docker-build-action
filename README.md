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
          push: true
          config-file: docker-build.yaml
```

## Configuration

Create a `docker-build.yaml` file in the root of your repository with the following structure:

```yaml
# Docker build context (default: ".")
context: .

# Path to Dockerfile (default: "Dockerfile")
dockerfile: Dockerfile

# Platforms to build for (default: "linux/amd64")
platforms: linux/amd64,linux/arm64

# Image name (required)
image: ghcr.io/username/image-name

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
| `push` | Whether to push the Docker image to the registry | No | `false` |
| `registry` | Docker registry to push to | No | `ghcr.io` |

## Example Configuration

Here's a complete example of a `docker-build.yaml` file:

```yaml
context: .
dockerfile: Dockerfile
platforms: linux/amd64,linux/arm64
image: ghcr.io/username/image-name
tags:
  type: raw
  value: latest
  enable: true
flavor:
  latest: auto
  prefix: ''
  suffix: ''
labels:
  org.opencontainers.image.title: My Image
  org.opencontainers.image.description: My Docker Image
  org.opencontainers.image.vendor: My Company
```

## License

MIT
