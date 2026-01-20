import cors from 'cors';
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Type definitions
interface Company {
  id: string;
  [key: string]: unknown;
}

interface User {
  email: string;
  givenName?: string;
  familyName?: string;
  role?: { authority: string };
  memberOf?: Array<{ id: string; name?: string }>;
  [key: string]: unknown;
}

interface Vendor {
  apiId: string;
  [key: string]: unknown;
}

interface CEO {
  id: string;
  [key: string]: unknown;
}

interface IPListing {
  [key: string]: unknown;
}

interface Consent {
  [key: string]: unknown;
}

interface Database {
  companies?: Company[];
  users?: User[];
  vendors?: Vendor[];
  ceos?: CEO[];
  ipListings?: IPListing[];
  consents?: Consent[];
}

// Load data
let db: Database = {};

try {
  // Try loading from src/data location (dev mode)
  const devDbPath = path.join(__dirname, 'data', 'db.json');
  if (fs.existsSync(devDbPath)) {
      console.log(`Loading DB from ${devDbPath}`);
      db = JSON.parse(fs.readFileSync(devDbPath, 'utf-8')) as Database;
  } else {
      // Fallback to local (if moved) or empty
       console.warn('Could not find db.json, starting with empty data');
  }
} catch (e) {
  console.error('Error loading DB:', e);
}

// Helpers
const paginate = <T>(items: T[], page = 0, size = 20) => {
  const start = page * size;
  const end = start + size;
  return {
    content: items.slice(start, end),
    page: {
      size,
      totalElements: items.length,
      totalPages: Math.ceil(items.length / size),
      number: page
    },
    links: []
  };
};

// --- Endpoints ---

// Companies
app.get('/company', (req, res) => {
  const page = parseInt(req.query.page as string) || 0;
  const size = parseInt(req.query.size as string) || 20;
  const results = paginate(db.companies || [], page, size);
  res.json(results);
});

app.get('/company/:id', (req, res) => {
  const company = db.companies?.find((c: Company) => c.id === req.params.id);
  if (company) {
    res.json(company);
  } else {
    res.status(404).json({ message: 'Company not found' });
  }
});

app.post('/company', (req, res) => {
  const newCompany = { ...req.body, id: Math.random().toString(36).substring(7) };
  if (!db.companies) db.companies = [];
  db.companies.push(newCompany);
  res.json(newCompany);
});

app.put('/company/:id', (req, res) => {
  const idx = db.companies?.findIndex((c: Company) => c.id === req.params.id);
  if (idx !== undefined && idx > -1 && db.companies) {
    db.companies[idx] = { ...db.companies[idx], ...req.body };
    res.json(db.companies[idx]);
  } else {
    res.status(404).json({ message: 'Company not found' });
  }
});

// Company Members
app.get('/company/:id/members', (req, res) => {
    // In our mock, members might be stored on the company or we filter users
    // For now, let's return a dummy list or filter users if we linked them
    const members = db.users?.filter((u: User) => u.memberOf?.some((m: { id: string }) => m.id === req.params.id)) || [];
    // The API expects { content: UserDetailsSlimProps[] }
    res.json({ content: members });
});


// Vendors
app.get('/vendor', (req, res) => {
  const page = parseInt(req.query.page as string) || 0;
  const size = parseInt(req.query.size as string) || 20;
  // TODO: Add filtering logic if needed (req.query.search etc)
  const results = paginate(db.vendors || [], page, size);
  res.json(results);
});

app.get('/vendor/:id', (req, res) => {
  const vendor = db.vendors?.find((v: Vendor) => v.apiId === req.params.id);
  if (vendor) {
    res.json(vendor);
  } else {
    res.status(404).json({ message: 'Vendor not found' });
  }
});

// CEOs
app.get('/ceos', (req, res) => {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 20;
    const results = paginate(db.ceos || [], page, size);
    res.json(results);
});

app.get('/ceos/:id', (req, res) => {
    const ceo = db.ceos?.find((c: CEO) => c.id === req.params.id);
    if (ceo) {
        res.json(ceo);
    } else {
        res.status(404).json({ message: 'CEO not found' });
    }
});

// IP Marketplace
app.get('/ip-marketplace', (req, res) => {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 20;
    const results = paginate(db.ipListings || [], page, size);
    res.json(results);
});

// User Info / Auth
app.get('/userinfo', (req, res) => {
    // Return a default user or one based on a header if we wanted to be fancy
    // returning the first super admin or user
    const user = db.users?.[0];
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.get('/person/:email', (req, res) => {
    const user = db.users?.find((u: User) => u.email === req.params.email);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/me/role', (req, res) => {
     const user = db.users?.[0];
     if (user && user.role) {
         res.json({ [user.role.authority]: true }); // simplified role response
     } else {
         res.json({});
     }
});

// Terms / Consent
app.get('/consent', (req, res) => {
    // Return first consent doc
    const consent = db.consents?.[0];
    if (consent) {
        res.json(consent);
    } else {
        res.json({}); // or 404
    }
});

app.listen(port, () => {
  console.log(`API Server listening at http://localhost:${port}`);
});
