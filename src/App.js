import React,{useState} from 'react';
import "./App.css"
import Sidebar from './Sidebar';
import Chat from './Chat';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./Register";
import Login from './Login';
import { LoginContext } from './LoginContext';

export default function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [userName, setuserName] = useState("");
  return (
    <BrowserRouter>
    <div className='app'>
      <LoginContext.Provider value={{setUserLogin,setuserName}}>
      {!userLogin?(
        <div className='register_login'>
          <Routes>
            <Route path='/' element={<Register/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
          </Routes>
        </div>

      ):(

      <div className="appBody" data-testid="chat-ui">
     <Sidebar userName ={userName}/>
     <Routes>
      <Route path="/" element={<Chat userName={userName}/>}> </Route>
      <Route path="/group/:groupId" element={<Chat userName = {userName}/>}> </Route>

     </Routes>
      </div>
)}
</LoginContext.Provider>
    </div>
    </BrowserRouter>
  );
}
