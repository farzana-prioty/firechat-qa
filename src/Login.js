import React,{useState, useContext} from 'react';
import './login.css';
import{ auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoginContext } from './LoginContext';

export default function Login() {
  const {setUserLogin, setuserName}= useContext(LoginContext)
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const signIn = ()=>{
   signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setuserName( email.substring(0,[4]));
    setUserLogin(true)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

  };
  return (
    <div className='login'>
      <div className="form">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id='email'name= "email" placeholder="Enter your email here"
          value={email}
          onChange={(e)=>{setemail(e.target.value)}}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name='password' id='password' placeholder='Enter your password' value={password}
          onChange={(e)=>{setpassword(e.target.value)}} />
        </div>
       <button id='submit-btn' onClick={signIn}>
          Sign In
        </button>
      </div>
    </div>
  )
}

