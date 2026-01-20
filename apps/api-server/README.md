# API Server for Portal

This is a replacement mock API server for the portal application.

## What Was Done

### 1. API Server Created (`apps/api-server/`)
- Express server with CORS support
- Serves mock data from `src/data/db.json`
- Implements all major endpoints the portal needs

### 2. Mock Data Generated (`src/data/db.json`)
- 100 Companies
- 100 Vendors
- 50 CEOs
- 100 IP Marketplace listings
- 51 Users (including a Super Admin)
- Consent records

### 3. Endpoints Implemented
| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/company` | GET, POST | List/create companies |
| `/company/:id` | GET, PUT | Get/update company |
| `/company/:id/members` | GET | Get company members |
| `/company/:id/conflicts` | PUT | Update conflicts |
| `/vendor` | GET, POST | List/create vendors |
| `/vendor/:id` | GET, PUT | Get/update vendor |
| `/vendor/category` | GET | Get vendor categories |
| `/ceos` | GET, POST | List/create CEOs |
| `/ceos/:id` | GET, PUT | Get/update CEO |
| `/ceos/filters` | GET | Get CEO filter options |
| `/ip-marketplace` | GET, POST | List/create IP listings |
| `/ip-marketplace/:id` | GET | Get IP listing |
| `/ip-marketplace/filters` | GET | Get IP filter options |
| `/userinfo` | GET | Get current user |
| `/person` | GET | List users |
| `/person/:email` | GET, PUT, DELETE | User CRUD |
| `/me/role` | GET | Get user role |
| `/consent` | GET, PUT | Consent management |
| `/research` | GET, POST | Research hub |
| `/expert-note` | GET, POST | Expert notes |
| `/asset` | POST | Asset upload |
| `/library-doc` | GET, POST | Library documents |

### 4. Configuration
- Portal `.env` file: `VITE_COMPANY_API_HOSTNAME=http://localhost:8080`

## How to Run

### Start API Server
```bash
npm run start:api
# OR
npx tsx apps/api-server/src/main.ts
```

### Start Portal
```bash
npm run start:portal
# OR
npx nx serve portal
```

## Known Issues to Fix

### 1. Chakra UI v3 Incompatibility
The project was migrated to Chakra UI v3, but some components/libraries are not compatible:

- **chakra-react-select**: Updated to v5.0.0 but may still have issues
- **Custom shared-ui components**: Some were importing from old Chakra packages like:
  - `@chakra-ui/icon`
  - `@chakra-ui/system`
  - `@chakra-ui/layout`

  These packages don't exist in Chakra v3 (everything is in `@chakra-ui/react`).

### 2. Fixed Files
- `libs/shared/ui/src/lib/stack/stack.tsx` - Removed duplicate HStack/VStack exports
- `libs/shared/ui/src/lib/tabs/tabs.tsx` - Added TabPanels backward compatibility
- `libs/shared/ui/src/lib/close-button/close-button.tsx` - Updated to use @chakra-ui/react
- `libs/shared/ui/src/lib/hooks/use-disclosure/use-disclosure.ts` - Updated to re-export from @chakra-ui/react
- `libs/shared/ui/src/lib/rh-provider/color-mode.tsx` - Removed duplicate colorPalette attributes
- `libs/portal/ui/tsconfig.spec.json` - Added `"noEmit": false` to fix composite build error

### 3. Environment Issues
- `NODE_ENV=production` was preventing devDependencies from installing
- Fixed with: `npm install --include=dev --legacy-peer-deps`

## Regenerating Data

To regenerate mock data with different content:
```bash
node apps/api-server/src/data/generate.js
```

## Next Steps

1. Run portal and check browser console for remaining import errors
2. Fix any additional Chakra v3 compatibility issues in shared-ui
3. Test all portal pages to ensure API calls work correctly
