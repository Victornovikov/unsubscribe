import { createSlice } from "@reduxjs/toolkit"
import messageService from "../services/messages"

const messageSlice = createSlice({
  name: "messages",
  initialState: [],
  reducers: {
    initializeMessages(state, action) {
      return action.payload
    }
  }
})

export const { initializeMessages } = messageSlice.actions

export const initializeMessagesAction = () => {
  return async dispatch => {
    const messages = await messageService.getAll()
    console.log('messages', messages)
    dispatch(initializeMessages(messages))
  }
}

export default messageSlice.reducer 