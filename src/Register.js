import React,{useState, useContext} from 'react';
import './login.css';
import{ auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { LoginContext } from './LoginContext';
import { Link } from 'react-router-dom';

export default function Register() {
  const {setUserLogin,setuserName}= useContext(LoginContext)
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const signUp = ()=>{
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
   setuserName( email.substring(0,[4]));
    setUserLogin(true);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  }
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
       <button id='submit-btn' onClick={signUp}>
          Sign Up
        </button>
        <p>Already have an account?</p>
        <Link to={"/login"}>
        <span>Sign In</span>
        </Link>
      </div>
    </div>
  )
}

