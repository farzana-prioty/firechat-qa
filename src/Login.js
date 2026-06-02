import React,{useState, useContext} from 'react';
import './login.css';
import{ auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoginContext } from './LoginContext';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const {setUserLogin, setuserName}= useContext(LoginContext)
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signIn = ()=>{
   signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setuserName(email.split('@')[0]);
    setUserLogin(true)
    // ...
  })
  .catch((error) => {
    setError("Invalid email or password. Please try again.");
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
  <div className="password-wrapper">
    <input 
      type={showPassword ? "text" : "password"} 
      name='password' 
      id='password' 
      placeholder='Enter your password' 
      value={password}
      onChange={(e)=>{setpassword(e.target.value)}}
    />
    <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</span>
  </div>
</div>
       {error && <p className="error-msg">{error}</p>} 
        <button id='submit-btn' onClick={signIn}>
          Sign In
        </button>
      </div>
    </div>
  )
}

