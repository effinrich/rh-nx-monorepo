# Project Overview

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [nx.json](file://nx.json)
- [package.json](file://package.json)
- [apps/portal/src/app/app.tsx](file://apps/portal/src/app/app.tsx)
- [apps/api-server/src/main.ts](file://apps/api-server/src/main.ts)
- [libs/shared/ui/src/lib/button/index.ts](file://libs/shared/ui/src/lib/button/index.ts)
- [libs/shared/ui/src/lib/theme/index.ts](file://libs/shared/ui/src/lib/theme/index.ts)
- [libs/portal/features/companies/src/lib/company-details/company-details.tsx](file://libs/portal/features/companies/src/lib/company-details/company-details.tsx)
- [libs/third-party-network/features/advisor-network/advisor-network.tsx](file://libs/third-party-network/features/advisor-network/advisor-network.tsx)
- [apps/company-api/project.json](file://apps/company-api/project.json)
- [apps/company-api/pom.xml](file://apps/company-api/pom.xml)
- [apps/portal/project.json](file://apps/portal/project.json)
- [apps/api-server/project.json](file://apps/api-server/project.json)
- [libs/portal/data-assets/project.json](file://libs/portal/data-assets/project.json)
- [libs/shared/ui/project.json](file://libs/shared/ui/project.json)
- [tools/forgekit-nx-storybook/README.md](file://tools/forgekit-nx-storybook/README.md)
- [contracts/company-api/v1/company-api.json](file://contracts/company-api/v1/company-api.json)
- [docs/platform-documentation-library/service-infrastructure-overview.md](file://docs/platform-documentation-library/service-infrastructure-overview.md)
- [docs/platform-documentation-library/telemetry-and-data-infrastructure-overview.md](file://docs/platform-documentation-library/telemetry-and-data-infrastructure-overview.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
Redesign Health is a healthcare-focused platform designed to connect companies, vendors, researchers, and stakeholders through a unified digital portal. The Nx monorepo serves as the foundational workspace that orchestrates frontend applications, backend services, and shared libraries. Its mission is to streamline collaboration, accelerate innovation, and provide a scalable foundation for health-tech ecosystems by offering a cohesive set of tools, design systems, and reusable components.

Key value propositions:
- Unified access to company profiles, vendor listings, IP marketplace, research hub, and community features
- Rapid iteration via Nx-powered build and test orchestration
- Consistent user experience through a modern design system (Chakra UI v3)
- Developer productivity with shared libraries, standardized tooling, and automated testing

Target audience:
- Healthcare companies and startups seeking visibility and connections
- Vendors and service providers targeting the health ecosystem
- Researchers and analysts exploring IP opportunities and market insights
- Stakeholders and advisors participating in the third-party network

**Section sources**
- [README.md:1-167](file://README.md#L1-L167)

## Project Structure
The repository follows an Nx monorepo architecture with clear separation of concerns across applications, libraries, tools, and documentation. The structure supports independent development, testing, and deployment of frontend portals, backend services, and shared components.

High-level layout:
- apps: Executable applications (frontend portals, API servers, Spring Boot services)
- libs: Reusable libraries (shared UI, portal-specific features, third-party network, company API types)
- tools: Nx plugins and developer tooling (Storybook MCP, generators)
- docs: Platform documentation and design system guides
- contracts: API contract definitions (OpenAPI)

```mermaid
graph TB
subgraph "Applications (apps)"
portal["Portal (React 19)<br/>Vite, React Router"]
api_server["Mock API Server<br/>Express + tsx"]
company_api["Spring Boot Company API"]
third_party_network["Third-Party Network Portal"]
end
subgraph "Libraries (libs)"
shared_ui["@redesignhealth/ui<br/>Chakra UI v3 components"]
shared_analytics["@redesignhealth/analytics"]
shared_hooks["@redesignhealth/hooks"]
shared_utils["@redesignhealth/utils"]
portal_features["@redesignhealth/portal/*<br/>features, data-assets, ui, utils"]
tpn_features["@redesignhealth/third-party-network/*"]
company_api_types["@redesignhealth/company-api-types"]
end
subgraph "Tooling (tools)"
forgekit_plugin["forgekit-nx-storybook<br/>Nx plugin"]
end
portal --> shared_ui
portal --> shared_analytics
portal --> shared_hooks
portal --> shared_utils
portal --> portal_features
portal --> api_server
portal --> company_api
third_party_network --> tpn_features
shared_ui --> shared_utils
forgekit_plugin --> shared_ui
```

**Diagram sources**
- [README.md:41-70](file://README.md#L41-L70)
- [nx.json:108-126](file://nx.json#L108-L126)
- [package.json:56-129](file://package.json#L56-L129)

**Section sources**
- [README.md:41-70](file://README.md#L41-L70)
- [nx.json:108-126](file://nx.json#L108-L126)
- [package.json:56-129](file://package.json#L56-L129)

## Core Components
This section outlines the primary building blocks of the platform and their responsibilities.

- Portal (React 19): The main user interface application built with Vite, routing via React Router, and powered by Chakra UI v3. It integrates analytics, performance insights, and a robust routing system.
- Mock API Server (Express + tsx): A lightweight Express server providing REST endpoints for companies, vendors, IP marketplace, research hub, user info, and consent management. It simulates backend interactions for development and testing.
- Shared UI (@redesignhealth/ui): A comprehensive Chakra UI v3 component library with design system tokens, theme configuration, and standardized components. It includes shims for backward compatibility during the v2→v3 migration.
- Portal Features (@redesignhealth/portal/*): Feature-sliced modules for companies, users, library, and other domain areas. They encapsulate data assets, UI components, utilities, and page-level logic.
- Third-Party Network (@redesignhealth/third-party-network/*): Dedicated features for advisor networks and related functionality.
- Company API Types (@redesignhealth/company-api-types): OpenAPI-generated TypeScript types for the Spring Boot Company API, enabling type-safe client integrations.
- forgekit-nx-storybook: An Nx plugin that auto-generates Storybook stories, interaction tests, Playwright component tests, and accessibility audits from component analysis.

Practical examples of platform capabilities:
- Company management: CRUD operations for companies, member management, and conflict resolution endpoints
- IP marketplace: Listings, filters, and contact request workflows
- Research hub: Research articles and expert notes ingestion and pagination
- Community platform: User profiles, roles, and consent management

**Section sources**
- [apps/portal/src/app/app.tsx:1-45](file://apps/portal/src/app/app.tsx#L1-L45)
- [apps/api-server/src/main.ts:66-480](file://apps/api-server/src/main.ts#L66-L480)
- [libs/shared/ui/src/lib/button/index.ts](file://libs/shared/ui/src/lib/button/index.ts)
- [libs/shared/ui/src/lib/theme/index.ts](file://libs/shared/ui/src/lib/theme/index.ts)
- [libs/portal/features/companies/src/lib/company-details/company-details.tsx](file://libs/portal/features/companies/src/lib/company-details/company-details.tsx)
- [tools/forgekit-nx-storybook/README.md](file://tools/forgekit-nx-storybook/README.md)

## Architecture Overview
The system architecture is layered and modular, emphasizing separation of concerns and scalability. The frontend portal communicates with backend services through well-defined APIs, while shared libraries provide consistent UI and utilities across applications.

```mermaid
graph TB
subgraph "Frontend Layer"
portal_app["Portal App<br/>React 19 + Vite"]
shared_ui_lib["@redesignhealth/ui<br/>Chakra UI v3"]
portal_features_lib["@redesignhealth/portal/*"]
end
subgraph "Backend Layer"
mock_api["Mock API Server<br/>Express + tsx"]
company_api_service["Company API<br/>Spring Boot"]
end
subgraph "Shared Layer"
shared_analytics["@redesignhealth/analytics"]
shared_hooks["@redesignhealth/hooks"]
shared_utils["@redesignhealth/utils"]
company_api_types["@redesignhealth/company-api-types"]
end
portal_app --> shared_ui_lib
portal_app --> portal_features_lib
portal_app --> shared_analytics
portal_app --> shared_hooks
portal_app --> shared_utils
portal_app --> mock_api
portal_app --> company_api_service
company_api_service --> company_api_types
```

**Diagram sources**
- [apps/portal/src/app/app.tsx:1-45](file://apps/portal/src/app/app.tsx#L1-L45)
- [apps/api-server/src/main.ts:66-480](file://apps/api-server/src/main.ts#L66-L480)
- [apps/company-api/project.json](file://apps/company-api/project.json)
- [libs/portal/data-assets/project.json](file://libs/portal/data-assets/project.json)
- [libs/shared/ui/project.json](file://libs/shared/ui/project.json)

## Detailed Component Analysis

### Portal Application
The Portal application initializes routing, analytics, and performance monitoring. It leverages React Router for navigation and Chakra UI for consistent UI rendering. The app manages page views through Helmet and integrates Vercel Speed Insights for performance metrics.

```mermaid
sequenceDiagram
participant Browser as "Browser"
participant App as "App (React 19)"
participant Router as "RouterProvider"
participant Analytics as "@redesignhealth/analytics"
participant SI as "Speed Insights"
Browser->>App : Mount application
App->>Router : Initialize router with fallback
App->>Analytics : Register page view listener
App->>SI : Initialize performance insights
Router-->>Browser : Render current route
Analytics-->>Browser : Track page view on title change
```

**Diagram sources**
- [apps/portal/src/app/app.tsx:26-42](file://apps/portal/src/app/app.tsx#L26-L42)

**Section sources**
- [apps/portal/src/app/app.tsx:1-45](file://apps/portal/src/app/app.tsx#L1-L45)

### Mock API Server Endpoints
The Express server exposes a comprehensive set of endpoints covering companies, vendors, IP marketplace, research hub, user info, and consent management. It normalizes user records, paginates lists, and handles various CRUD operations.

```mermaid
flowchart TD
Start(["Incoming Request"]) --> Route{"Route Match"}
Route --> |"/company"| Companies["Companies CRUD"]
Route --> |"/vendor"| Vendors["Vendors CRUD"]
Route --> |"/ip-marketplace"| IP["IP Marketplace"]
Route --> |"/research"| Research["Research Hub"]
Route --> |"/userinfo"| UserInfo["User Info / Auth"]
Route --> |"/me/consent"| Consent["Consent Management"]
Companies --> Normalize["Normalize User Records"]
Vendors --> Paginate["Paginate Results"]
IP --> Filters["Apply Filters"]
Research --> Empty["Return Empty List"]
UserInfo --> Roles["Roles & MemberOf"]
Consent --> Accept["Accept/Reject Terms"]
Normalize --> Respond["JSON Response"]
Paginate --> Respond
Filters --> Respond
Empty --> Respond
Roles --> Respond
Accept --> Respond
Respond --> End(["End"])
```

**Diagram sources**
- [apps/api-server/src/main.ts:66-480](file://apps/api-server/src/main.ts#L66-L480)

**Section sources**
- [apps/api-server/src/main.ts:66-480](file://apps/api-server/src/main.ts#L66-L480)

### Shared UI Library (Chakra UI v3)
The shared UI library provides a consistent design system across the platform. It includes components, theme tokens, and provider configurations. The migration to Chakra UI v3 involved updating component APIs and maintaining backward compatibility through shims.

```mermaid
classDiagram
class ThemeProvider {
+tokens
+colors
+spacing
+fonts
}
class Button {
+variant
+size
+colorScheme
+isLoading()
}
class Modal {
+isOpen
+onClose()
+header
+body
+footer
}
ThemeProvider --> Button : "provides tokens"
ThemeProvider --> Modal : "provides tokens"
```

**Diagram sources**
- [libs/shared/ui/src/lib/theme/index.ts](file://libs/shared/ui/src/lib/theme/index.ts)
- [libs/shared/ui/src/lib/button/index.ts](file://libs/shared/ui/src/lib/button/index.ts)

**Section sources**
- [libs/shared/ui/src/lib/theme/index.ts](file://libs/shared/ui/src/lib/theme/index.ts)
- [libs/shared/ui/src/lib/button/index.ts](file://libs/shared/ui/src/lib/button/index.ts)

### Portal Features (Companies)
The portal features module encapsulates company-related functionality, including company details and associated pages. Feature-sliced architecture promotes maintainability and testability.

```mermaid
flowchart TD
CompaniesFeature["Companies Feature"] --> Details["Company Details Page"]
Details --> DataAssets["@redesignhealth/portal/data-assets"]
Details --> UIComponents["@redesignhealth/portal/ui"]
Details --> Utils["@redesignhealth/portal/utils"]
DataAssets --> API["API Clients"]
UIComponents --> SharedUI["@redesignhealth/ui"]
Utils --> Hooks["@redesignhealth/hooks"]
```

**Diagram sources**
- [libs/portal/features/companies/src/lib/company-details/company-details.tsx](file://libs/portal/features/companies/src/lib/company-details/company-details.tsx)
- [libs/portal/data-assets/project.json](file://libs/portal/data-assets/project.json)

**Section sources**
- [libs/portal/features/companies/src/lib/company-details/company-details.tsx](file://libs/portal/features/companies/src/lib/company-details/company-details.tsx)

### Third-Party Network Features
The third-party network module provides advisor network features and related UI components, utilities, and data assets for stakeholder engagement.

```mermaid
graph LR
TPN_Features["@redesignhealth/third-party-network/features"] --> AdvisorNetwork["Advisor Network"]
AdvisorNetwork --> TPN_UI["@redesignhealth/third-party-network/ui"]
AdvisorNetwork --> TPN_Utils["@redesignhealth/third-party-network/utils"]
AdvisorNetwork --> TPN_Data["@redesignhealth/third-party-network/data-assets"]
```

**Diagram sources**
- [libs/third-party-network/features/advisor-network/advisor-network.tsx](file://libs/third-party-network/features/advisor-network/advisor-network.tsx)

**Section sources**
- [libs/third-party-network/features/advisor-network/advisor-network.tsx](file://libs/third-party-network/features/advisor-network/advisor-network.tsx)

### Spring Boot Company API
The Spring Boot service defines the Company API with architectural decision records, multi-module structure, and integration points. It is configured as an Nx project with Maven packaging and Docker support.

```mermaid
graph TB
CompanyAPI["Company API (Spring Boot)"] --> ADR["Architectural Decision Records"]
CompanyAPI --> MultiModule["Multi-Module Project"]
CompanyAPI --> JiraClient["JIRA REST Client"]
CompanyAPI --> Docker["Docker Configuration"]
CompanyAPI --> OpenSearch["OpenSearch"]
CompanyAPI --> Lombok["Lombok"]
```

**Diagram sources**
- [apps/company-api/project.json](file://apps/company-api/project.json)
- [apps/company-api/pom.xml](file://apps/company-api/pom.xml)

**Section sources**
- [apps/company-api/project.json](file://apps/company-api/project.json)
- [apps/company-api/pom.xml](file://apps/company-api/pom.xml)

## Dependency Analysis
The monorepo enforces clear boundaries between applications and libraries, with Nx orchestrating build, test, and lint targets. Shared libraries reduce duplication and ensure consistency across the platform.

```mermaid
graph TB
portal_proj["apps/portal"] --> shared_ui_proj["libs/shared/ui"]
portal_proj --> portal_data_assets_proj["libs/portal/data-assets"]
portal_proj --> shared_analytics_proj["@redesignhealth/analytics"]
portal_proj --> shared_hooks_proj["@redesignhealth/hooks"]
portal_proj --> shared_utils_proj["@redesignhealth/utils"]
api_server_proj["apps/api-server"] --> portal_proj
company_api_proj["apps/company-api"] --> company_api_types_proj["@redesignhealth/company-api-types"]
forgekit_plugin["tools/forgekit-nx-storybook"] --> shared_ui_proj
```

**Diagram sources**
- [nx.json:8-72](file://nx.json#L8-L72)
- [apps/portal/project.json](file://apps/portal/project.json)
- [apps/api-server/project.json](file://apps/api-server/project.json)
- [apps/company-api/project.json](file://apps/company-api/project.json)
- [libs/portal/data-assets/project.json](file://libs/portal/data-assets/project.json)
- [libs/shared/ui/project.json](file://libs/shared/ui/project.json)
- [tools/forgekit-nx-storybook/README.md](file://tools/forgekit-nx-storybook/README.md)

**Section sources**
- [nx.json:8-72](file://nx.json#L8-L72)
- [package.json:56-129](file://package.json#L56-L129)

## Performance Considerations
- Build orchestration: Nx target defaults and caching minimize rebuild times and optimize CI performance.
- Frontend performance: Vite provides fast development builds and optimized production bundles.
- Analytics and insights: Integration with Google Analytics 4 and Vercel Speed Insights enables performance monitoring and user behavior tracking.
- Testing strategy: Jest/Vitest for unit tests, Playwright for E2E, and Storybook for component testing ensures reliability and visual consistency.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- API server startup: Ensure the mock API server is running on the configured port and environment variables are set correctly.
- Portal development: Verify Vite dev server is reachable and CORS settings permit cross-origin requests.
- Shared UI migration: Confirm Chakra UI v3 components are used consistently and shims are applied where necessary.
- Nx tasks: Use affected commands to limit scope during development and leverage Nx graph to visualize dependencies.

**Section sources**
- [README.md:96-120](file://README.md#L96-L120)
- [apps/api-server/src/main.ts:18-30](file://apps/api-server/src/main.ts#L18-L30)

## Conclusion
The Redesign Health Nx monorepo delivers a scalable, developer-friendly platform for the healthcare ecosystem. By combining modern frontend technologies, a robust backend mock server, and a comprehensive shared design system, it accelerates feature delivery while maintaining consistency and quality. The architecture supports independent evolution of applications and libraries, enabling teams to collaborate efficiently and iterate rapidly.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Technology Stack
- Build System: Nx 22
- Frontend: React 19 + Vite
- UI Library: Chakra UI v3
- Language: TypeScript 5
- API Server: Express via tsx
- Unit Tests: Jest / Vitest
- E2E Tests: Playwright
- Linting: ESLint + Prettier

**Section sources**
- [README.md:28-40](file://README.md#L28-L40)

### API Contracts
- Company API: OpenAPI contract for type-safe client generation and integration.

**Section sources**
- [contracts/company-api/v1/company-api.json](file://contracts/company-api/v1/company-api.json)

### Infrastructure and Telemetry
- Service infrastructure overview and telemetry/data infrastructure documentation provide operational context for the platform.

**Section sources**
- [docs/platform-documentation-library/service-infrastructure-overview.md](file://docs/platform-documentation-library/service-infrastructure-overview.md)
- [docs/platform-documentation-library/telemetry-and-data-infrastructure-overview.md](file://docs/platform-documentation-library/telemetry-and-data-infrastructure-overview.md)