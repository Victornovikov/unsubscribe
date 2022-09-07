import axios from 'axios'

// const baseUrl = '/api/messages'
const baseUrl = 'http://localhost:3001/api/messages'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  console.log('request', request)
  return request.data
}

export default { getAll }