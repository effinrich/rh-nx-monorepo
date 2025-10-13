var AWS = require('aws-sdk')

const CONFIG = {
  REGION: 'us-east-1',
  API_VERSION: '2012-11-05',
  QUEUE_URL:
    'https://sqs.us-east-1.amazonaws.com/082533342824/JiraWebhook0.fifo'
}

AWS.config.update({ region: CONFIG.REGION })
let sqs = new AWS.SQS({ apiVersion: CONFIG.API_VERSION })

exports.handler = async event => {
  console.log(JSON.stringify(event))
  let parsedEvent = {
    headers: event.headers,
    parsedBody: JSON.parse(event.body)
  }
  console.log(parsedEvent)
  const response = {
    statusCode: 200,
    body: JSON.stringify(parsedEvent)
  }
  let sendPromise = sqs
    .sendMessage(
      {
        MessageBody: JSON.stringify(parsedEvent.parsedBody),
        MessageGroupId: 'test-group',
        QueueUrl: CONFIG.QUEUE_URL
      },
      function (err, data) {
        if (err) {
          console.log(err)
        } else {
          console.log(data)
        }
      }
    )
    .promise()
  await sendPromise
  return response
}
