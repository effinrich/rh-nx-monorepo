import cors from 'cors'
import express from 'express'
import * as fs from 'fs'
import * as path from 'path'

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

// Load data
const dbPath = path.join(__dirname, 'assets', 'db.json')
// In development with nx serve, assets are copied to dist, but we might be running from source
// Let's try to find the db.json relative to the execution or source
let db: unknown = {}

try {
  // Try loading from src/data location (dev mode)
  const devDbPath = path.join(__dirname, 'data', 'db.json')
  if (fs.existsSync(devDbPath)) {
    console.log(`Loading DB from ${devDbPath}`)
    db = JSON.parse(fs.readFileSync(devDbPath, 'utf-8'))
  } else {
    // Fallback to local (if moved) or empty
    console.warn('Could not find db.json, starting with empty data')
  }
} catch (e) {
  console.error('Error loading DB:', e)
}

// Helpers

/**
 * Normalize a user record from the DB to match what the portal expects.
 * The portal expects `roles` (array) and `memberOf` (array with {id, name}).
 * The generated data has `role` (singular object).
 */
const normalizeUser = (user: any) => {
  const roles = user.roles
    ? user.roles
    : user.role
      ? [user.role]
      : []
  const memberOf = (user.memberOf || []).map((m: any) =>
    typeof m === 'string' ? { id: m, name: m } : m
  )
  return { ...user, roles, memberOf }
}

const paginate = (items: unknown[], page = 0, size = 20) => {
  const start = page * size
  const end = start + size
  return {
    content: items.slice(start, end),
    page: {
      size,
      totalElements: items.length,
      totalPages: Math.ceil(items.length / size),
      number: page
    },
    links: []
  }
}

// --- Endpoints ---

// Companies
app.get('/company', (req, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 20
  const results = paginate(db.companies || [], page, size)
  res.json(results)
})

app.get('/company/:id', (req, res: express.Response) => {
  const company = db.companies?.find((c: any) => c.id === req.params.id)
  if (company) {
    res.json(company)
  } else {
    res.status(404).json({ message: 'Company not found' })
  }
})

app.post('/company', (req, res) => {
  const newCompany = {
    ...req.body,
    id: Math.random().toString(36).substring(7)
  }
  if (!db.companies) db.companies = []
  db.companies.push(newCompany)
  res.json(newCompany)
})

app.put('/company/:id', (req, res) => {
  const idx = db.companies?.findIndex((c: any) => c.id === req.params.id)
  if (idx > -1) {
    db.companies[idx] = { ...db.companies[idx], ...req.body }
    res.json(db.companies[idx])
  } else {
    res.status(404).json({ message: 'Company not found' })
  }
})

// Company Members
app.get('/company/:id/members', (req, res) => {
  // In our mock, members might be stored on the company or we filter users
  // For now, let's return a dummy list or filter users if we linked them
  const members =
    db.users?.filter((u: any) =>
      u.memberOf?.some((m: any) => m.id === req.params.id)
    ) || []
  // The API expects { content: UserDetailsSlimProps[] }
  res.json({ content: members })
})

// Vendors
app.get('/vendor', (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 20
  // TODO: Add filtering logic if needed (req.query.search etc)
  const results = paginate(db.vendors || [], page, size)
  res.json(results)
})

app.get('/vendor/:id', (req, res) => {
  const vendor = db.vendors?.find((v: any) => v.apiId === req.params.id)
  if (vendor) {
    res.json(vendor)
  } else {
    res.status(404).json({ message: 'Vendor not found' })
  }
})

// CEOs
app.get('/ceos', (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 20
  const results = paginate(db.ceos || [], page, size)
  res.json(results)
})

app.get('/ceos/:id', (req, res) => {
  const ceo = db.ceos?.find((c: any) => c.id === req.params.id)
  if (ceo) {
    res.json(ceo)
  } else {
    res.status(404).json({ message: 'CEO not found' })
  }
})

// IP Marketplace
app.get('/ip-marketplace', (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 20
  const results = paginate(db.ipListings || [], page, size)
  res.json(results)
})

// User Info / Auth
app.get('/userinfo', (req, res) => {
  const user = db.users?.[0]
  if (user) {
    // Normalize: portal expects `roles` (array) and `memberOf` (array with {id, name})
    res.json(normalizeUser(user))
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

app.get('/person/:email', (req, res) => {
  const user = db.users?.find((u: any) => u.email === req.params.email)
  if (user) {
    res.json(normalizeUser(user))
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

app.get('/me/role', (req, res) => {
  const user = db.users?.[0]
  if (user && user.role) {
    res.json({ [user.role.authority]: true }) // simplified role response
  } else {
    res.json({})
  }
})

// Terms / Consent

// Per-user consent endpoint: GET /me/consent/:consentType
// Portal calls this to check if the user has accepted terms
app.get('/me/consent/:consentType', (req, res) => {
  const { consentType } = req.params
  const consent = db.consents?.find((c: any) => c.type?.value === consentType)
  if (consent) {
    res.json(consent)
  } else {
    // Return a pre-accepted consent that matches the expected etags, so the
    // portal skips the terms modal in the dev environment.
    const etags: Record<string, string> = {
      TERMS_OF_SERVICE: 'f7170faf8d48561a00ea36adc22efc76',
      BUYER_TERMS_OF_SERVICE: '1',
      SELLER_TERMS_OF_SERVICE: '1',
    }
    res.json({
      type: { displayName: 'Terms of service', value: consentType },
      version: etags[consentType] ?? 'accepted',
      accepted: new Date().toISOString(),
      links: []
    })
  }
})

app.put('/me/consent/:consentType', (req, res) => {
  const { consentType } = req.params
  const consent = {
    type: { value: consentType, displayName: 'Terms of service' },
    ...req.body,
    accepted: new Date().toISOString()
  }
  if (!db.consents) db.consents = []
  const idx = db.consents.findIndex((c: any) => c.type?.value === consentType)
  if (idx >= 0) {
    db.consents[idx] = consent
  } else {
    db.consents.push(consent)
  }
  res.json(consent)
})

app.get('/consent', (req, res) => {
  const consent = db.consents?.[0]
  if (consent) {
    res.json(consent)
  } else {
    res.json({})
  }
})

app.put('/consent', (req, res) => {
  const consent = { ...req.body, accepted: new Date().toISOString() }
  if (!db.consents) db.consents = []
  db.consents[0] = consent
  res.json(consent)
})

// CEO Filters
app.get('/ceos/filters', (req, res) => {
  res.json({
    links: [],
    content: [
      {
        key: 'healthcareSector',
        options: [
          { keyword: 'Biopharma & Device', count: 10 },
          { keyword: 'Care Enablement', count: 5 }
        ]
      },
      {
        key: 'businessType',
        options: [
          { keyword: 'B2B', count: 20 },
          { keyword: 'D2C', count: 10 }
        ]
      }
    ]
  })
})

// CEO update
app.put('/ceos/:id', (req, res) => {
  const idx = db.ceos?.findIndex((c: any) => c.id === req.params.id)
  if (idx > -1) {
    db.ceos[idx] = { ...db.ceos[idx], ...req.body }
    res.json(db.ceos[idx])
  } else {
    res.status(404).json({ message: 'CEO not found' })
  }
})

app.post('/ceos', (req, res) => {
  const newCeo = { ...req.body, id: Math.random().toString(36).substring(7) }
  if (!db.ceos) db.ceos = []
  db.ceos.push(newCeo)
  res.json(newCeo)
})

// IP Marketplace filters and details
app.get('/ip-marketplace/filters', (req, res) => {
  res.json({
    links: [],
    content: [
      {
        key: 'technologyType',
        options: [{ keyword: 'MEDICAL_DEVICES', count: 50, displayName: 'Medical Devices' }]
      },
      {
        key: 'organizationType',
        options: [
          { keyword: 'ACADEMIC_MEDICAL_CENTER', count: 20, displayName: 'Academic Medical Center' }
        ]
      }
    ]
  })
})

app.get('/ip-marketplace/:id', (req, res) => {
  const listing = db.ipListings?.find((l: any) => l.id === req.params.id)
  if (listing) {
    res.json(listing)
  } else {
    res.status(404).json({ message: 'IP listing not found' })
  }
})

app.post('/ip-marketplace', (req, res) => {
  const newListing = { ...req.body, id: Math.random().toString(36).substring(7) }
  if (!db.ipListings) db.ipListings = []
  db.ipListings.push(newListing)
  res.json(newListing)
})

// Vendor categories
app.get('/vendor/category', (req, res) => {
  res.json([
    {
      apiId: '1KlMnh9a',
      name: 'Infrastructure',
      subcategories: [{ apiId: 'Zn17uxiy', name: 'Admin Tools' }]
    },
    {
      apiId: '2AbCde34',
      name: 'IT Ops',
      subcategories: [{ apiId: 'Xy12abcd', name: 'Hardware' }]
    }
  ])
})

app.post('/vendor', (req, res) => {
  const newVendor = { ...req.body, apiId: Math.random().toString(36).substring(7) }
  if (!db.vendors) db.vendors = []
  db.vendors.push(newVendor)
  res.json(newVendor)
})

app.put('/vendor/:id', (req, res) => {
  const idx = db.vendors?.findIndex((v: any) => v.apiId === req.params.id)
  if (idx > -1) {
    db.vendors[idx] = { ...db.vendors[idx], ...req.body }
    res.json(db.vendors[idx])
  } else {
    res.status(404).json({ message: 'Vendor not found' })
  }
})

// Company vendor relationships
app.get('/company/:companyId/vendor', (req, res) => {
  res.json({ content: [] })
})

app.post('/company/:companyId/vendor', (req, res) => {
  res.json({ ...req.body, id: Math.random().toString(36).substring(7) })
})

app.put('/company/:companyId/vendor/:vendorId', (req, res) => {
  res.json(req.body)
})

// Company conflicts
app.put('/company/:id/conflicts', (req, res) => {
  res.json({ conflicts: req.body.conflicts || [] })
})

// Person/Users endpoints
app.get('/person', (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 20
  const results = paginate(db.users || [], page, size)
  res.json(results)
})

app.put('/person/:email', (req, res) => {
  const idx = db.users?.findIndex((u: any) => u.email === req.params.email)
  if (idx > -1) {
    db.users[idx] = { ...db.users[idx], ...req.body }
    res.json(db.users[idx])
  } else {
    // Create new user
    const newUser = { ...req.body, email: req.params.email }
    if (!db.users) db.users = []
    db.users.push(newUser)
    res.json(newUser)
  }
})

app.delete('/person/:email', (req, res) => {
  const idx = db.users?.findIndex((u: any) => u.email === req.params.email)
  if (idx > -1) {
    db.users.splice(idx, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

// Company member management
app.put('/company/:companyId/member/:email', (req, res) => {
  res.json({ success: true })
})

app.delete('/company/:companyId/member/:email', (req, res) => {
  res.json({ success: true })
})

// Infra request
app.get('/infra-request/:companyId', (req, res) => {
  res.status(404).json({ message: 'No infra request found' })
})

// Research hub endpoints
app.get('/research', (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 20
  res.json({
    content: [],
    page: { size, totalElements: 0, totalPages: 0, number: page },
    links: []
  })
})

app.post('/research', (req, res) => {
  res.json({ ...req.body, id: Math.random().toString(36).substring(7) })
})

app.get('/expert-note', (req, res) => {
  res.json({
    content: [],
    page: { size: 20, totalElements: 0, totalPages: 0, number: 0 },
    links: []
  })
})

app.post('/expert-note', (req, res) => {
  res.json({ ...req.body, id: Math.random().toString(36).substring(7) })
})

// Asset upload
app.post('/asset', (req, res) => {
  res.json({ content: [{ id: Math.random().toString(36).substring(7), ...req.body }] })
})

// Library/Solution docs
app.get('/library-doc/:id', (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Sample Document',
    content: 'Sample content',
    created: new Date().toISOString()
  })
})

app.post('/library-doc', (req, res) => {
  res.json({ ...req.body, id: Math.random().toString(36).substring(7) })
})

// IP Marketplace contact request
app.put('/ip-marketplace/:id/request-contact', (req, res) => {
  res.json({ date: new Date().toISOString() })
})

// Catch-all for unimplemented endpoints - return empty/success
app.all('*', (req, res) => {
  console.log(`Unhandled ${req.method} ${req.path}`)
  if (req.method === 'GET') {
    res.json({ content: [], page: { size: 20, totalElements: 0, totalPages: 0, number: 0 }, links: [] })
  } else {
    res.json({ success: true })
  }
})

app.listen(port, () => {
  console.log(`API Server listening at http://localhost:${port}`)
})
