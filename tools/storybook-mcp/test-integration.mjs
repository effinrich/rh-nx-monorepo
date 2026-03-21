import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WORKSPACE_ROOT = path.resolve(__dirname, '../..')
const componentPath = 'libs/portal/ui/src/lib/filter-box/text-block.tsx'
const fullPath = path.join(WORKSPACE_ROOT, componentPath)

// --- MCP Brain: analyze ---
const source = fs.readFileSync(fullPath, 'utf-8')
const usesRouter =
  source.includes('react-router') || source.includes('useNavigate')
const usesQuery =
  source.includes('@tanstack/react-query') || source.includes('useQuery')
const propMatch = source.match(
  /interface\s+\w*Props\s*(?:extends[^{]+)?\{([^}]+)\}/s
)
const propCount = propMatch
  ? propMatch[1].split('\n').filter(l => l.match(/^\s*\w+\??:/)).length
  : 0

console.log('=== MCP Analysis (brain) ===')
console.log(`Component path : ${componentPath}`)
console.log(`Props detected : ${propCount}`)
console.log(`Uses Router    : ${usesRouter}`)
console.log(`Uses Query     : ${usesQuery}`)

// --- Nx Generator: delegate (dry run) ---
// In a real workspace where @effinrich/forgekit-nx-storybook is installed, the command is:
//   npx nx g @effinrich/forgekit-nx-storybook:story ...
// Locally in this monorepo the plugin is at ./tools/forgekit-nx-storybook (same package, not yet published)
const pluginRef = fs.existsSync(
  path.join(WORKSPACE_ROOT, 'node_modules/@effinrich/forgekit-nx-storybook')
)
  ? '@effinrich/forgekit-nx-storybook'
  : './tools/forgekit-nx-storybook'

console.log('\n=== Nx Generator delegation (dry run) ===')
console.log(`Plugin resolved as: ${pluginRef}`)
const cmd = `npx nx g ${pluginRef}:story --componentPath="${componentPath}" --dryRun --no-interactive`
console.log(`Running: ${cmd}\n`)

try {
  const out = execSync(cmd, {
    cwd: WORKSPACE_ROOT,
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    timeout: 90_000,
    stdio: ['pipe', 'pipe', 'pipe']
  })
  console.log(out.toString().trim())
  console.log(
    '\n✅ Integration test PASSED — MCP analysis + Nx generator delegation works'
  )
} catch (e) {
  const stderr = e.stderr?.toString() ?? ''
  const stdout = e.stdout?.toString() ?? ''
  if (stdout) console.log('stdout:', stdout)
  if (stderr) console.log('stderr:', stderr)
  console.log('\n❌ Integration test FAILED')
  process.exit(1)
}
