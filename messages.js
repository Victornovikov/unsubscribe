const {google} = require('googleapis')
const {authenticate} = require('@google-cloud/local-auth')
const { authorize } = require('./utils/creds')
const base64 = require('js-base64').Base64

const client = async () => {
  const auth = await authorize()
  const gmail = google.gmail({version:'v1', auth})
  // console.log('gmail: ', gmail)
  return gmail
}

// Do the magic
async function listMessages(gmail, userId, maxResults, labelIds, q, fields, pageToken) {
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

async function main () {
  const gmail = await client()
  // const res = await listMessages(gmail, 'me', 10, ['INBOX'], 'from:me', 'id,threadId', '1')
  const messageIds = await listMessages(gmail, 'me', 10, 'INBOX', '', 'id', '')
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

main()
  