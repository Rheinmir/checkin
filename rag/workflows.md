# WORKFLOWS

Purpose: Explain "How to run/build/deploy it".

## Development
- [x] Run locally: `npm run dev` (Vite)
- [x] Linting: `npm run lint`

## Building
- [x] Build command: `npm run build` (Runs `tsc -b` and `vite build`)
- [x] Output: `dist/` directory
- [x] Docker Build: `docker build -t <image_name> .`

## Deployment
- [x] CI/CD: Jenkins Pipeline (`Jenkinsfile`)
  - **Pull Source**: git status
  - **Login**: Docker login to GHCR
  - **Build & Push**: Builds image, tags with commit hash & latest, pushes to GHCR
  - **Deploy**: Pulls image, stops old container, runs new container on port 3000
  - **Cleanup**: Prunes old images

## Testing
- [ ] Unit Tests: Not configured
- [x] Linting: ESLint configured

