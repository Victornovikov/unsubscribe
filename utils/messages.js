const {google} = require('googleapis')
const { authorize } = require('./creds')
const base64 = require('js-base64').Base64

const client = async () => {
  const auth = await authorize()
  const gmail = google.gmail({version:'v1', auth})
  // console.log('gmail: ', gmail)
  return gmail
}

// Do the magic
async function fetchMessages(gmail, userId, maxResults, labelIds, q, fields, pageToken) {
  const res = await gmail.users.messages.list({
    // Include messages from `SPAM` and `TRASH` in the results.
    includeSpamTrash: true,
    // Only return messages with labels that match all of the specified label IDs.
    labelIds: labelIds,
    // Maximum number of messages to return. This field defaults to 100. The maximum allowed value for this field is 500.
    maxResults: maxResults,
    // Page token to retrieve a specific page of results in the list.
    pageToken: pageToken,
    // Only return messages matching the specified query. Supports the same query format as the Gmail search box. For example, `"from:someuser@example.com rfc822msgid: is:unread"`. Parameter cannot be used when accessing the api using the gmail.metadata scope.
    q: q,
    // The user's email address. The special value `me` can be used to indicate the authenticated user.
    userId: userId,
  })
  console.log('results', res.data)
  return res.data
}

function getBody (message) {
  try {
    const bodyData = message.data.payload.parts[0].body.data 
    const decoded = base64.decode(bodyData.replace(/-/g, '+').replace(/_/g, '/'))
    return decoded
  } catch (err) {
    console.log('err', err)
    return null
  }
}

async function parseMessageById(gmail, messageId) {
  const message = await gmail.users.messages.get({id: messageId, userId: 'me', format: 'full'})
  const subject = message.data.payload.headers.find(h => h.name === 'Subject').value
  const body = getBody(message)
  return {messageId, subject, body}
}



async function test () {
  const gmail = await client()
  // const res = await fetchMessages(gmail, 'me', 10, ['INBOX'], 'from:me', 'id,threadId', '1')
  const messageIds = await fetchMessages(gmail, 'me', 20, 'INBOX', '', 'id', '')
  const message = await gmail.users.messages.get({id: messageIds.messages[1].id, 
    metadataHeaders:['date'], userId: 'me', format: 'full'}) 
  // https://stackoverflow.com/questions/24811008/gmail-api-decoding-messages-in-javascript
  // https://stackoverflow.com/questions/37445865/where-to-find-body-of-email-depending-of-mimetype
  const bodyData = message.data.payload.parts[0].body.data 
  // const bodyData = message.payload.body.data
  const decoded = base64.decode(bodyData.replace(/-/g, '+').replace(/_/g, '/'))

  // console.log('message', JSON.stringify(message.data.payload.parts[0].body.data, null, 2))
  console.log('decoded', decoded)
}

async function getMessageList() {
  const gmail = await client()
  const messageIds = await fetchMessages(gmail, 'me', 20, 'INBOX', '', 'id', '')
  // let subject = await getSubject(gmail, messageIds.messages[0].id)
  // let body = await getBody(gmail, messageIds.messages[0].id)
  // messageIds.messages.map(async message => {
  //   const subject = await getSubject(gmail, message.id)
  //   const messageId = message.id
  //   const body = await getBody(gmail, message.id)
  //   // const body = await getBody(gmail, message.id)

  //   console.log('subject', subject)
  // })
  const messageList = messageIds.messages.reduce(async (acc, message) => {
    // const parsedMessage = {
    //   'id': message.id,
    //   // 'subject': message.data.payload.headers.find(h => h.name === 'Subject').value,
    //   'subject': await getSubject(gmail, message.id),
    //   'body': getBody(message)
    // }
    const parsedMessage = await parseMessageById(gmail, message.id)
    return [...await acc, parsedMessage]
  } ,[])
  console.log('messageList', JSON.stringify(messageList))
  return messageList
}

async function main() {
  const messageList = await getMessageList()
  console.log(messageList)
}

main() 

module.exports = { fetchMessages, parseMessageById, getBody, getMessageList }
  