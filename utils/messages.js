const {google} = require('googleapis')
const { authorize } = require('./creds')
const base64 = require('js-base64').Base64

const client = async () => {
  const auth = await authorize()
  const gmail = google.gmail({version:'v1', auth})
  // console.log('gmail: ', gmail)
  return gmail
}

const getLinks = (body) => {
  const links = []
  const unsubscribeLinks = []
  const regex_url = /(http|https):\/\/[a-zA-Z0-9./?&=_%:-]*/g
  const regex_unsubscribe = /(unsubscribe)/g
  try {
    let m = body.match(regex_url)
    if (m) {
      m.forEach((link) => {
        const unsubscribeLink = link.match(regex_unsubscribe) ? true : false
        links.push({ link, unsubscribeLink })
        if (unsubscribeLink) unsubscribeLinks.push(link)
      })
    }
  } catch (error) {
    console.log('error: ', error)
  }
  return { links, unsubscribeLinks }
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
  const from = message.data.payload.headers.find(h => h.name === 'From').value
  const unsubscribeHeader = message.data.payload.headers.find(h => h.name === 'List-Unsubscribe')
  const body = getBody(message)
  const links = getLinks(body)
  return {messageId, from, subject, body, links, unsubscribeHeader}
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
  const decoded = base64.decode(bodyData.replace(/-/g, '+').replace(/_/g, '/'))
  console.log('decoded', decoded)
}

async function getMessageList() {
  const gmail = await client()
  const messageIds = await fetchMessages(gmail, 'me', 20, 'INBOX', '', 'id', '')
  const messageList = await messageIds.messages.reduce(async (acc, message) => {
    const parsedMessage = await parseMessageById(gmail, message.id)
    return [...await acc, parsedMessage]
  } ,[])
  // console.log('messageList', messageList)
  return messageList
}

async function main() {
  const messageList = await getMessageList()
  console.log('messageList', messageList)
}

// main() 

module.exports = { fetchMessages, parseMessageById, getBody, getMessageList }
  