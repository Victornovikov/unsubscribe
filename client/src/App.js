import Messages from "./components/Messages";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeMessagesAction } from "./reducers/messageReducer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App useEffect");
    dispatch(initializeMessagesAction());
  }, []);

  const messages = useSelector((state) => state.messages);

  return (
    <div>
      <h1>your messages</h1>
      <Messages messages={messages}/>
    </div>
  );
}

export default App;
