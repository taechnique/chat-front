import React,{useState} from 'react'
import SockJsClient from 'react-stomp'
import chatApi from './services/chatapi'
import './styles/styles.css'
import { 
  Container} from '@material-ui/core'

import Chat from './pages/Chat'
import Input from './pages/Input'
import Login from './pages/Login'
import $ from 'jquery'


function App(props) {
  const [messages , setMessages] = useState([])
  const [user, setUser] = useState(null)

  const onMessageReceived = (msg) => {
    console.log("New Message Received !!",msg)
    setMessages(messages.concat(msg))
    console.log($('.middle-ul').scrollHeight)
  }

  const handleLoginSubmit = (name) => {
    setUser({name: name, color: '#ffffff' })
  }

  const handleMessageSubmit = (msg) => {
    chatApi
      .sendMessage(user.name, msg)
      .then((res) => {
        console.log("sent",res)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  
  return (
    <Container maxWidth="sm">
      {user !== null ? (
        <div className="chat-container">
        <h1>KIMCHI CHAT {user.name}님</h1>
          <SockJsClient
            url={"http://localhost:8080/my-chat/"}
            topics={['/topic/group']}
            onConnect={console.log("conneted !")}
            onDisconnect={console.log("disconnected ! ")}
            onMessage={(msg) => onMessageReceived(msg)}
            debug={false}
            />
            <Chat messages={messages} currentUser={user}/>
            <Input handleOnSubmit={handleMessageSubmit} currentUser={user} />
        </div>
      ) : (
        <Login handleOnSubmit={handleLoginSubmit} />
      )}
    </Container>
  );
}

export default App;
