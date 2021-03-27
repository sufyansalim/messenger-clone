import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import React,{ useState, useEffect } from 'react';
import './App.css';
import Message from './Message';
import db from "./firebase";
import firebase from "firebase";
import FlipMove from 'react-flip-move';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';


function App(props) {
  const [input,setInput] = useState('');
  const [messages,setMessages] = useState([]);
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    db.collection('messages').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setMessages(snapshot.docs.map(doc => ({id: doc.id, message: doc.data()})))
    })
  },[]);

  useEffect(() => {
    setUsername(prompt('Please enter your name'));
  },[]);
  
  const sendMessage = event => {
    event.preventDefault();

    db.collection('messages').add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    setMessages([...messages,{username: username, message: input}]);
    setInput('')
  }

  return (
    <div className="App">
      <img src="https://facebookbrand.com/wp-content/uploads/2020/10/Logo_Messenger_NewBlurple-399x399-1.png?w=100&h=100"/>
      <h1>Hello People 🚀</h1>
      <h2>Welcome {username}</h2>

      <form className="app__form">
      <FormControl className="app__formControl">
        <InputLabel >Enter a message...</InputLabel>
        <Input className="app__input" value={input} onChange={event => setInput(event.target.value)}/>

        <IconButton
        className="app__iconButton"
        variant="contained" type="submit" onClick={sendMessage}>
        <SendIcon/>
      </IconButton>

     </FormControl>
      </form>

      <FlipMove>
        {messages.map(({id,message}) => (
          <Message key={id} username={username} message={message}/>
        ))}
      </FlipMove>

    </div>
  );
}

export default App;
