import React,{useEffect, useState} from 'react';
import "./Chat.css";
import { useParams } from 'react-router-dom';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import {db} from "./firebase";

export default function Chat({userName}) {
  const {groupId} = useParams();
  const[groupName, setGroupName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setmessages] = useState([]);

  useEffect(()=>{
    if(groupId){
      const getGroup = onSnapshot(doc(db,"groups",groupId), (doc)=>{
        setGroupName(doc.data().name);
      });
      
      const q = query(collection(db, "groups", groupId, "messages"),orderBy("timestamp","asc"))
      const getMessage = onSnapshot(q, (snapshot)=>{
        let msgList = [];
        snapshot.docs.forEach((doc)=>{
          msgList.push({...doc.data()})
        })
        setmessages(msgList);
        console.log(messages);
      });
    }
  },[groupId]);

  const sendMessage = async(e) => {
    e.preventDefault();
    if(input ==""){
      return alert("Please enter your message");
    }{
    try{
      const sendData = await addDoc(collection(db, "groups", groupId, "messages"),{
        message: input,
        name: userName,
        timestamp: serverTimestamp(),
      })
    }
    catch{
      console.error("error",e);
    }
    setInput("");
  }
  };


  return (
    <div className='chat'>
      {/* ------------Chat Header----------- */}
      <div className="chatHeader">
      <img src="https://cdn-icons-png.flaticon.com/128/4140/4140040.png" alt="" />
      <div className="chatHeaderInfo">
        <h3>{groupName}</h3>
        {
          <p>
  Last seen at{" "}
  {messages.length > 0 &&
    new Date(
      messages[messages.length - 1].timestamp?.toDate()
    ).toUTCString()}
</p>
        /* <p>Last seen at {" "} 
          {new Date(messages[messages.length-1].timestamp?.toDate()).toUTCString()}
          </p> */}
      </div>
      <div className="chatHeaderRight">
        <button style={{border: 'none'}}><span className="material-symbols-outlined">search</span></button>
        <button style={{border: 'none'}}><span className="material-symbols-outlined">attach_file</span></button>
        <span className="material-symbols-outlined">more_vert</span>
      </div>
    </div>

    {/* ------------------ Chat Body ------------- */}
    <div className="chatBody">
      {messages.map((message)=> (
        <p className={`chatMessage ${message.name == userName && "chatReceiver"}`}>
        <span className="chatName">{message.name}</span>
         {message.message}
        <span className="timestamp">
          {new Date(message.timestamp?.toDate()).toUTCString()}
          </span>
      </p>
      ))}

      

    </div>

    {/* --------------- Chat Footer ----------- */}
    <div className="chatFooter">
      <span className="material-symbols-outlined">mood</span>
      <form onSubmit={(e)=>{sendMessage(e);}}>

        <input value={input} onChange={(e)=>{setInput(e.target.value)}} type="text" placeholder='Type a message'/>
        <button type='submit' style={{border:'none'}}><span className="material-symbols-outlined">send</span></button>
        <button  style={{border:'none'}}><span className="material-symbols-outlined">mic</span></button>
      </form>
    </div>
    </div>
  )
}
