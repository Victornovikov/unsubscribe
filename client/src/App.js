import Messages from "./components/Messages";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeMessagesAction } from "./reducers/messageReducer";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import ResponsiveAppBar from "./components/Menu"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App useEffect");
    dispatch(initializeMessagesAction());
  }, []);

  const messages = useSelector((state) => state.messages);

  return (
    <Container maxWidth="lg">
      <div>
        <ResponsiveAppBar />
        <h1>your messages</h1>
        <Messages messages={messages}/>
      </div>
    </Container>
  );
}

export default App;
