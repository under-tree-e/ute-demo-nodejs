# syntax=docker/dockerfile:1
FROM node:22-alpine

ARG VERSION=dev
ARG VCS_REF=unknown

LABEL org.opencontainers.image.title="UTE Demo Node.js" \
      org.opencontainers.image.description="Demo Node.js service used to validate the UTE release path" \
      org.opencontainers.image.source="https://github.com/under-tree-e/ute-demo-nodejs" \
      org.opencontainers.image.version="$VERSION" \
      org.opencontainers.image.revision="$VCS_REF"

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Keep production dependencies in a cacheable layer and respect package-lock.json.
COPY --chown=node:node src/package.json src/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --chown=node:node src/ ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const http=require('http');const req=http.get('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz',res=>process.exit(res.statusCode===200?0:1));req.on('error',()=>process.exit(1));req.setTimeout(4000,()=>{req.destroy();process.exit(1)})"

CMD ["npm", "start"]
