# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [nx.json](file://nx.json)
- [.devcontainer/devcontainer.json](file://.devcontainer/devcontainer.json)
- [.devcontainer/Dockerfile](file://.devcontainer/Dockerfile)
- [apps/portal/.env.local.example](file://apps/portal/.env.local.example)
- [apps/portal/project.json](file://apps/portal/project.json)
- [apps/api-server/project.json](file://apps/api-server/project.json)
- [apps/portal/vite.config.ts](file://apps/portal/vite.config.ts)
- [apps/portal/proxy.conf.json](file://apps/portal/proxy.conf.json)
- [tsconfig.base.json](file://tsconfig.base.json)
- [.eslintrc.json](file://.eslintrc.json)
- [.prettierrc](file://.prettierrc)
</cite>

## Update Summary
**Changes Made**
- Added comprehensive project setup instructions with step-by-step installation guide
- Enhanced environment variable configuration section with practical examples
- Expanded development workflow documentation including first-time contributor guidance
- Improved troubleshooting section with common setup issues and solutions
- Added verification steps to ensure proper environment setup
- Updated VS Code integration guidance with Nx Console extension setup

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Development Environment Setup](#development-environment-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running Applications](#running-applications)
7. [Essential Commands](#essential-commands)
8. [Development Workflow](#development-workflow)
9. [Troubleshooting](#troubleshooting)
10. [Verification](#verification)
11. [First-Time Contributor Guidance](#first-time-contributor-guidance)

## Introduction
Welcome to the Redesign Health Nx monorepo! This comprehensive getting started guide will help you set up your development environment, understand the project structure, and begin contributing effectively. The monorepo contains a full-stack React 19 + Vite frontend (Portal), an Express mock API server, shared design system libraries, and supporting tools for a modern development experience.

The project follows Nx workspace conventions with TypeScript 5, Chakra UI v3, and a robust development toolchain including Jest/Vitest for testing, ESLint/Prettier for code quality, and Storybook for component development.

## Prerequisites
Before you begin, ensure your system meets the following requirements:

### Node.js and npm
- **Node.js**: Version 24.11.1 (as specified in engines)
- **npm**: Version 11.6.2 (as specified in engines)
- Verify with: `node --version` and `npm --version`

### Development Tools
- **Git**: For repository management
- **Docker**: Required for devcontainer setup (optional but recommended)
- **VS Code**: With recommended extensions for optimal development experience

### Optional but Recommended
- **Docker Desktop**: For containerized development environment
- **Rancher Desktop**: Alternative container runtime option
- **Nx Console Extension**: For enhanced VS Code integration

**Section sources**
- [package.json:266-269](file://package.json#L266-L269)
- [README.md:140-159](file://README.md#L140-L159)

## Installation
Follow these step-by-step instructions to set up the development environment:

### 1. Clone the Repository
```bash
git clone https://github.com/RedesignHealth/rh-nx-monorepo.git
cd rh-nx-monorepo
```

### 2. Install Dependencies
```bash
npm install
```
This command installs all dependencies for the entire monorepo workspace.

### 3. Verify Installation
Check that all packages are properly installed:
```bash
npm run check-types:all
```

**Section sources**
- [README.md:76-80](file://README.md#L76-L80)
- [package.json:16-28](file://package.json#L16-L28)

## Development Environment Setup
Choose one of the following approaches for setting up your development environment:

### Option A: Local Development (Recommended)
Install all dependencies locally using npm:

```bash
npm install
```

### Option B: Devcontainer Setup (Highly Recommended)
For a fully reproducible environment:

#### Prerequisites
1. **VS Code** with Remote - Containers extension
2. **Rancher Desktop** or another container runtime (dockerd)
3. Minimum system requirements: 16 GB RAM, 4 CPUs

#### Steps
1. In VS Code, use "Dev Container: Clone Repository in Container Volume"
2. Enter the repository's HTTPS URL
3. The devcontainer builds from `.devcontainer/Dockerfile` and `.devcontainer/devcontainer.json`
4. Features include Java 17, Maven, Python, AWS CLI, Docker, and Nx NPM
5. VS Code settings enable ESLint, Prettier, and workspace TypeScript

**Section sources**
- [README.md:140-159](file://README.md#L140-L159)
- [.devcontainer/devcontainer.json:1-145](file://.devcontainer/devcontainer.json#L1-L145)
- [.devcontainer/Dockerfile:1-6](file://.devcontainer/Dockerfile#L1-L6)

## Environment Configuration
Configure environment variables for different scenarios:

### Local Development Setup
1. Create `.env.local` file from the example:
```bash
cp apps/portal/.env.local.example apps/portal/.env.local
```

2. Edit `apps/portal/.env.local`:
```ini
VITE_COMPANY_API_HOSTNAME=http://localhost:8080
VITE_EXPERT_NETWORK_HOSTNAME=https://third-party-network.dev.redesignhealth.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_PORTAL_LIBRARY_ID=MnDeoylC
VITE_PORTAL_DEVELOPER_LIBRARY_ID=TkGC8nvM
VITE_PORTAL_DEVELOPER_LIBRARY_INFRA_LINK=/dev-library/vIh2x3gA/module/65dPfGx1
VITE_PORTAL_ENV=local
```

### Environment Variables Explained
- `VITE_COMPANY_API_HOSTNAME`: Points to your local API server
- `VITE_EXPERT_NETWORK_HOSTNAME`: Third-party network API endpoint
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID for authentication
- `VITE_PORTAL_LIBRARY_ID`: Main documentation library ID
- `VITE_PORTAL_DEVELOPER_LIBRARY_ID`: Developer documentation library ID
- `VITE_PORTAL_DEVELOPER_LIBRARY_INFRA_LINK`: Infrastructure documentation link
- `VITE_PORTAL_ENV`: Current environment (local, dev, staging, prod)

**Section sources**
- [apps/portal/.env.local.example:1-8](file://apps/portal/.env.local.example#L1-L8)
- [apps/portal/proxy.conf.json:1-7](file://apps/portal/proxy.conf.json#L1-L7)

## Running Applications
Start the development servers for both the API and Portal applications:

### Method 1: Individual Commands
```bash
# Terminal 1 - Start API server
npm run start:api

# Terminal 2 - Start Portal
npm run start:portal
```

### Method 2: Nx Commands
```bash
# Start API server
nx run api-server:serve

# Start Portal
nx run portal:serve
```

### Expected Behavior
- **API Server**: Runs on `http://localhost:8080`
- **Portal**: Runs on `http://localhost:4200`
- **Proxy**: `/api` requests are forwarded to the API server

**Section sources**
- [README.md:82-94](file://README.md#L82-L94)
- [apps/portal/vite.config.ts:18](file://apps/portal/vite.config.ts#L18)
- [apps/portal/proxy.conf.json:1-7](file://apps/portal/proxy.conf.json#L1-L7)

## Essential Commands
Master these essential commands for daily development:

### Build Commands
```bash
# Build Portal application
nx build portal

# Build API server
nx run api-server:build

# Build all projects
nx build
```

### Development Commands
```bash
# Start development servers
npm run start:api
npm run start:portal

# Serve Portal with Nx
nx run portal:serve

# Serve API server with Nx
nx run api-server:serve
```

### Testing Commands
```bash
# Run all tests
nx run-many -t test

# Run Portal tests
nx test portal

# Run API server tests
nx test api-server

# Run tests in watch mode
nx test portal --watch
```

### Linting and Formatting
```bash
# Lint all projects
nx run-many -t lint

# Format code
nx format --write

# Check TypeScript types
nx run-many -t check-types
```

### Documentation and Storybook
```bash
# Run Storybook
npm run storybook

# Build Storybook
nx run shared-ui:build-storybook
```

**Section sources**
- [README.md:107-119](file://README.md#L107-L119)
- [package.json:5-51](file://package.json#L5-L51)

## Development Workflow
Follow this structured approach for effective development:

### Daily Development Cycle
1. **Start Servers**: `npm run start:api` and `npm run start:portal`
2. **Make Changes**: Edit code in VS Code
3. **Test Changes**: Run relevant tests
4. **Commit Changes**: Use conventional commit messages
5. **Push Changes**: Submit pull requests for review

### Working with Libraries
The monorepo uses a library-first approach:
- Shared UI components in `libs/shared/ui/`
- Portal-specific components in `libs/portal/`
- Third-party network components in `libs/third-party-network/`

### Import Aliases
Use the following import patterns:
```typescript
import { Button } from '@redesignhealth/ui';
import { CompanyCard } from '@redesignhealth/portal/features/companies';
import { AdvisorCard } from '@redesignhealth/third-party-network/features/advisors';
```

**Section sources**
- [tsconfig.base.json:20-91](file://tsconfig.base.json#L20-L91)

## Troubleshooting
Common issues and their solutions:

### Node.js Version Issues
**Problem**: Node.js version mismatch
**Solution**: 
```bash
# Check current version
node --version

# Use nvm to switch versions
nvm install 24.11.1
nvm use 24.11.1
```

### Port Conflicts
**Problem**: Ports 4200 or 8080 already in use
**Solution**:
```bash
# Change Portal port in vite.config.ts
# Change API server port in package.json scripts
```

### Proxy Issues
**Problem**: API requests not reaching the server
**Solution**:
```bash
# Verify proxy configuration
cat apps/portal/proxy.conf.json
# Ensure VITE_COMPANY_API_HOSTNAME points to correct URL
```

### Environment Variables Missing
**Problem**: Application fails to load
**Solution**:
```bash
# Create .env.local file
cp apps/portal/.env.local.example apps/portal/.env.local
# Fill in required values
```

### VS Code TypeScript Issues
**Problem**: TypeScript version conflicts
**Solution**:
```bash
# In VS Code: Ctrl+Shift+P
# Select "TypeScript: Select TypeScript Version"
# Choose "Use Workspace Version"
```

**Section sources**
- [package.json:266-269](file://package.json#L266-L269)
- [apps/portal/proxy.conf.json:1-7](file://apps/portal/proxy.conf.json#L1-L7)
- [apps/portal/.env.local.example:1-8](file://apps/portal/.env.local.example#L1-L8)

## Verification
Ensure your setup is working correctly:

### API Server Verification
1. Start the API server: `npm run start:api`
2. Test the endpoint: `curl http://localhost:8080/`
3. Expected response: API server should return available endpoints

### Portal Verification
1. Start the Portal: `npm run start:portal`
2. Open browser: `http://localhost:4200`
3. Test API connectivity: Browser should be able to access `/api` endpoints

### Development Tools Verification
1. **Linting**: `nx run-many -t lint`
2. **Testing**: `nx run-many -t test`
3. **Type Checking**: `nx run-many -t check-types`
4. **Dependency Graph**: `nx graph`

### Devcontainer Verification
If using devcontainer:
1. Container builds successfully
2. VS Code extensions are loaded
3. TypeScript version matches workspace
4. All development tools are available

**Section sources**
- [README.md:76-119](file://README.md#L76-L119)
- [apps/portal/vite.config.ts:18](file://apps/portal/vite.config.ts#L18)
- [apps/portal/proxy.conf.json:1-7](file://apps/portal/proxy.conf.json#L1-L7)

## First-Time Contributor Guidance
New contributors should follow these steps:

### Initial Setup Checklist
1. ✅ Fork the repository
2. ✅ Clone your fork locally
3. ✅ Install dependencies (`npm install`)
4. ✅ Start development servers
5. ✅ Verify all systems are working

### Development Best Practices
1. **Branch Strategy**: Create feature branches from `main`
2. **Commit Messages**: Use conventional commits
3. **Code Quality**: Run linting and tests before committing
4. **Documentation**: Update docs for significant changes

### Code Review Process
1. Push changes to your fork
2. Create Pull Request to `main`
3. Address reviewer feedback
4. Squash and merge when approved

### Learning Resources
- **Nx Documentation**: https://nx.dev
- **Chakra UI v3**: https://www.chakra-ui.com
- **React 19**: https://react.dev
- **Vite**: https://vitejs.dev

### Getting Help
- Check existing issues for similar problems
- Ask questions in the development Slack channel
- Review recent commits for patterns

**Section sources**
- [README.md:161-167](file://README.md#L161-L167)