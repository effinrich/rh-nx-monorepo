import crypto from 'crypto'
import express, { Request } from 'express'
import got from 'got'
import escape from 'lodash.escape'

const app = express()

const port =
  typeof process.env.PORT !== 'undefined' && process.env.PORT !== null
    ? process.env.PORT
    : 3000

const CLIENT_ID = process.env.OAUTH_JWT_CLIENT_ID
const CLIENT_SECRET = process.env.OAUTH_JWT_CLIENT_SECRET

interface GoogleIDToken {
  id_token: string
}

const HOST = 'https://accounts.google.com/o/oauth2/v2'
const SCOPES = 'openid email profile'
const REDIRECT_URL_PATH = '/callback'

function getFullRedirectUrl(req: Request) {
  const requestHost = req.get('host') || ''
  if (requestHost.startsWith('localhost')) {
    return 'http://' + requestHost + REDIRECT_URL_PATH
  }
  return 'https://' + requestHost + REDIRECT_URL_PATH
}

let state = crypto.randomUUID()
app.get('/', (req, res) => {
  state = crypto.randomUUID()
  const fullRedirectUrl = getFullRedirectUrl(req)
  res.redirect(
    `${HOST}/auth?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${fullRedirectUrl}&state=${state}`
  )
})

app.get(REDIRECT_URL_PATH, async (req: Request, res) => {
  const redirectFullUrl = getFullRedirectUrl(req)
  if (req.query['state'] !== state) {
    res.send(escape(`State token mismatch for token ${req.query['state']}`))
    return
  }

  try {
    const data = await got
      .post(`https://oauth2.googleapis.com/token`, {
        form: {
          code: req.query['code'],
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: redirectFullUrl
        }
      })
      .json<GoogleIDToken>()

    res.send(escape(data.id_token))
  } catch (e) {
    res.send(e)
  }
})

app.get('/health', (_req, res) => {
  res.send({ status: 'UP' })
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
