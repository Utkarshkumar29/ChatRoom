import { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (password !== confirmPassword) {
            console.log('eerr')
            toast.error("Passwords do not match");
            return;
        }
        try {
            const data={
                username,
                email,
                password
            } 
            const response=await axios.post('api/user',data)
            if(response.status==200){
                toast("Sign Up successfully")
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <form className=" flex justify-center items-center text-red-400 w-full h-full flex-col" onSubmit={handleSubmit}>
      <p>Sign Up</p>
      <div className=" flex items-center">
        <p>Username</p>
        <input
          type="text"
          placeholder="Enter your email"
          className="border-2 border-red"
          value={username}
          onChange={(e)=>{setUsername(e.target.value)}}
        />
      </div>
      <div className=" flex items-center">
        <p>Email</p>
        <input
          type="text"
          placeholder="Enter your email"
          className="border-2 border-red"
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
        />
      </div>
      <div className=" flex items-center">
        <p>Password</p>
        <input
          type="password"
          placeholder="Enter your email"
          className="border-2 border-red"
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
        />
      </div>
      <div className=" flex items-center">
        <p>confirm Password</p>
        <input
          type="password"
          placeholder="Enter your email"
          className="border-2 border-red"
          value={confirmPassword}
          onChange={(e)=>{setConfirmPassword(e.target.value)}}
        />
      </div>
      <button>SignUp</button>
    </form>
  );
};

export default SignUp