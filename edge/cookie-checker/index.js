module.exports = {
  generateAsyncHandler: function (cognitoAtEdge, awsJwtVerify, CONFIG) {
    const authenticator = new cognitoAtEdge.Authenticator({
      // Replace these parameter values with those of your own environment
      region: CONFIG.REGION,
      userPoolId: CONFIG.USER_POOL_ID,
      userPoolAppId: CONFIG.CLIENT_ID,
      userPoolDomain: CONFIG.DOMAIN,
      logLevel: 'debug'
    })

    const verifier = awsJwtVerify.CognitoJwtVerifier.create({
      userPoolId: CONFIG.USER_POOL_ID,
      clientId: CONFIG.CLIENT_ID, // rh-searchlight-web-client,
      tokenUse: 'id'
    })

    return async (event, context, callback) => {
      const authResult = await authenticator.handle(event)
      const authResultIsResponse = 'status' in authResult
      if (authResultIsResponse) {
        console.log('returning authResult directly to client!')
        return authResult
      }
      const cookieHeader = authResult.headers.cookie
      // TODO: Try not to invoke this way, pull out logic needed
      const jwtToken = authenticator._getIdTokenFromCookie(cookieHeader)
      const user = await verifier.verify(jwtToken)
      console.log(user)
      const email = user.email
      const emailParts = email.split('@')
      const emailDomain = emailParts[1]
      if (
        CONFIG.CHECK_EMAIL_DOMAIN &&
        emailDomain != CONFIG.CHECK_EMAIL_DOMAIN
      ) {
        console.log('Unauthorized - email domain - ' + email)
        const response401 = {
          status: '401',
          statusDescription: 'Unauthorized - email domain'
        }
        callback(null, response401)
        return false
      }
      console.log('Passed - email domain - ' + email)
      const groups = user['cognito:groups']
      if (
        CONFIG.CHECK_COGNITO_GROUP &&
        !groups.includes(CONFIG.CHECK_COGNITO_GROUP)
      ) {
        console.log('Unauthorized - cognito groups - ' + email)
        const response401 = {
          status: '401',
          statusDescription: 'Unauthorized - cognito groups'
        }
        callback(null, response401)
        return false
      }
      console.log('Passed - cognito groups - ' + groups)

      console.log('Allowed - ' + email)
      callback(null, authResult)
    }
  }
}
