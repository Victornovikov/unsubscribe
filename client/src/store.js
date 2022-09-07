import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import messageReducer from "./reducers/messageReducer"
// import notificationReducer from "./notificationReducer"
// import filterReducer from "./filterReducer"

const reducer = combineReducers({
  messages: messageReducer
  // notification: notificationReducer,
  // filter: filterReducer
})


export const store = configureStore({reducer})

export default store;