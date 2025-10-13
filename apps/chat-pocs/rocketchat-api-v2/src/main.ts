/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import { OAuth2Client, UserRefreshClient } from 'google-auth-library'

const app = express()

app.use(cors())
app.use(express.json())

const CLIENT_ID = process.env.ROCKETCHAT_POC_CLIENT_ID
const CLIENT_SECRET = process.env.ROCKETCHAT_POC_CLIENT_SECRET

// initialize oathclient
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, 'postmessage')

// get token from code given from frontend
app.post('/api/auth/google', async (req, res) => {
  console.log('got request!')
  console.log(req.body.code)
  const { tokens } = await oAuth2Client.getToken(req.body.code) // exchange code for token
  res.json(tokens)
})

app.post('/api/auth/google/refresh-token', async (req, res) => {
  const user = new UserRefreshClient(
    CLIENT_ID,
    CLIENT_SECRET,
    req.body.refreshToken
  )
  const { credentials } = await user.refreshAccessToken() // optain new tokens
  console.log(credentials)
  res.json(credentials)
})

const port = process.env.PORT || 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)
