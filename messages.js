const {google} = require('googleapis')
const {authenticate} = require('@google-cloud/local-auth')
const { authorize } = require('./utils/creds')

const client = async () => {
  const auth = await authorize()
  const gmail = google.gmail({version:'v1', auth})
  // console.log('gmail: ', gmail)
  return gmail
}

// Do the magic
async function listMessages(gmail, userId, maxResults, labelIds, q, fields, pageToken) {
  console.log('params', {
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
    userId: userId})
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

}

// Example response
// {
//   "messages": [],
//   "nextPageToken": "my_nextPageToken",
//   "resultSizeEstimate": 0
// }


client()
  .then((gmail) => {
    // console.log('gmail: ', gmail)
    listMessages(gmail, 'me', 10, 'INBOX', '', 'id', '')
    // listMessages(gmail, 'me', 10, 'INBOX')
      .catch(e => {
        console.error(e)
        throw e
      })
  }).catch(e => {
    console.error(e)
  })