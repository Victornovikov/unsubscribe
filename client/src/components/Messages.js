const Messages = ({ messages }) => {
  return (
    <div>
      <ul>
        {messages.map(message => <li key={message.messageId}>{message.subject}</li>)}
      </ul>
    </div>
  )
}

export default Messages