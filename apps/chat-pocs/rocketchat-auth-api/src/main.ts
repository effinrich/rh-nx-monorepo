/* eslint-disable no-console */
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import cors from 'cors'
import express from 'express'
/**
 * TODO: Implement UserRefreshClient after we get the first bit working
 * See line 37
 */
import { OAuth2Client /*, UserRefreshClient */ } from 'google-auth-library'
import * as path from 'path'

// namespace console
// var console: Console

const app = express()

/**
 * When a specific, stricter CORS domain is required, use the following:
 * app.use(cors({ origin: 'http://localhost:4200', credentials: true }))
 */
app.use(cors()) // equivalent to '*' for CORS
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to helll!' })
})

const CLIENT_ID = process.env.ROCKETCHAT_POC_CLIENT_ID
const CLIENT_SECRET = process.env.ROCKETCHAT_POC_CLIENT_SECRET

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, 'postmessage')

app.post('/api/auth/google', async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code) // exchange code for tokens

  oAuth2Client.setCredentials(tokens) // May not be required
  // res.send({ userTokens: tokens }) // Try this if the JSON response throws
  res.json(tokens)
})

// app.post('/auth/google/refresh-token', async (req, res) => {
//   const user = new UserRefreshClient(
//     clientId,
//     clientSecret,
//     req.body.refreshToken
//   )
//   const { credentials } = await user.refreshAccessToken() // optain new tokens
//   res.json(credentials)
// })

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)
