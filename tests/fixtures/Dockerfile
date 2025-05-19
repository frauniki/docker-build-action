FROM alpine:latest

LABEL org.opencontainers.image.title="Test Image"
LABEL org.opencontainers.image.description="Test Docker Image for E2E testing"

RUN apk add --no-cache curl

WORKDIR /app

COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
