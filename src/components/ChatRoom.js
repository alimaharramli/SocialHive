import React, { useRef, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import {useCollectionData} from 'react-firebase-hooks/firestore'


import { formatRelative } from 'date-fns';

const formatDate = date => {
  let formattedDate = '';
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

const firestore = firebase.firestore();
const auth = firebase.auth()



export default function ChatRoom(){
    const messageRef = firestore.collection('messages');
    const query = messageRef.orderBy('createdAt');

    const [messages] = useCollectionData(query, {idField: 'id'}); // useCollectionData
    const [formValue, setFormValue] = useState('');

    const bottomRef = useRef();

    const sendMessage = async(e) => {
        e.preventDefault();
        const {uid, photoURL, displayName} = auth.currentUser;
    
        if(formValue.trim()!="" && formValue.trim()!=null){
            await messageRef.add({
                text: formValue.trim(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                displayName,
                uid,
                photoURL
            });
            setFormValue('');
        }
        bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
    return (
        <div className='message-form-container' style={{maxWidth: "900px" }}>
            <div className='messages-container' style={{marginBottom: "45px"}}>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            
                <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                <button className="btn btn-default" type="submit">Send</button>
            </form>
        </div>
        )
    
    
}
function ChatMessage(props){
    const {text, uid, createdAt, photoURL,displayName} = props.message;
    const isOwnMessage = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${isOwnMessage}`}>
            {createdAt?.seconds ? (
            <div className={'message-time'}>{formatDate(new Date(createdAt.seconds*1000))}</div>
            ) : null}
            <p>{text}</p>
            <div className={'message-sender'}>{displayName}</div>
        </div>
    )
}