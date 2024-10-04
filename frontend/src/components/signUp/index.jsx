import { useContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { signInWithGoogle } from "../../firebase/auth";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { GoogleAuthProvider } from 'firebase/auth';
import GoogleIcon from "../../assets/icons/GoogleIcon";

const SignUp = () => {
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [isSignedIn, setIsSignedIn] = useState(false);
    const { user, setUser, token, setToken } = useContext(UserContext);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        {/*if (password !== confirmPassword) {
            console.log('eerr')
            toast.error("Passwords do not match");
            return;
        }*/}
        try {
            const data={
                username,
                email,
                password
            } 
            const response=await axios.post('/api/user',data,{ withCredentials: true,})
            if(response.status==200){
                toast("Sign Up successfully")
                setIsSignedIn(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleGoogleAuth = async () => {
      console.log("Google Sign In running....")
      try {
        const userCredential = await signInWithGoogle();
        console.log("Google Sign In running....",userCredential)
        const user = userCredential.user; // User information
        
        const username = user.displayName || "User";
        console.log("Google Sign In running....",username)
        const email = user.email;
        console.log("Google Sign In running....",email)
        const pic = user.photoURL;
        console.log("Google Sign In running....",pic)
    
        // Ensure the token retrieval is correct
        const token = await user.getIdToken(); 
    
        console.log('Tokens:', userCredential); // Log the token for debugging
    
        const data = {
          username,
          email,
          pic,
          token
        };
    
        console.log('Token:', data); // Log the token for debugging
        // Send data to backend for auth or signup
        const response = await axios.post('/api/user/google-auth', data,{ withCredentials: true,});
    
        if (response.status === 200 || response.status === 201) {
          console.log("Response from backend:", response.data);
          setUser(response.data.userDocs);
          localStorage.setItem('user', JSON.stringify(response.data.userDocs));
          setToken(response.data.token); // This should be your backend's token
          setIsSignedIn(true);
          toast.success(`Welcome ${username}`);
        } else {
          toast.error("Unexpected response from server.");
        }
      } catch (error) {
        console.error("Google sign-in error: ", error);
        toast.error("Google Sign In failed. Please try again.");
      }
    };
  
  if (isSignedIn) {
    return <Navigate to="/chatRoom" />;
  }

  return (
    <><div className=" flex justify-center items-center w-full h-full flex-col gap-[24px] pt-[40px] pr-[48px] pb-[24px] pl-[48px] ">
    <p className=" text-[28px] font-semibold text-[#16171C] ">Sign Up</p>
    <button
        onClick={handleGoogleAuth}
        className="w-full justify-center p-[10px] border border-[#1D213040] rounded-2xl flex gap-[10px] items-center text-[14px] leading-[21px] text-[#16171C] font-medium "
      >
        <GoogleIcon />
        Sign in with Google
      </button>
            <h1
                  className=" text-[#A3A3A5]  w-full text-center overflow-hidden before:h-[1px] after:h-[1px] after:bg-[#1D213040]
              after:inline-block after:relative after:align-middle after:w-[35%] 
              before:bg-[#1D213040] before:inline-block before:relative before:align-middle 
              before:w-[35%] md:before:w-[32%] md:after:w-[32%] lg:before:w-[32%] xl:before:w-[41%] lg:after:w-[32%] xl:after:w-[41%] before:right-2 after:left-2 text-sm "
                >
                  <span className=" px-[10px] ">Or</span>
              </h1>
    <div className=" flex flex-col gap-[8px] w-full">
      <p>Username</p>
      <input
        type="text"
        placeholder="Enter your email"
        className=" bg-[#F2F3F5] border border-[#D7D7D8] py-[12px] px-[24px] rounded-xl "
        value={username}
        onChange={(e)=>{setUsername(e.target.value)}}
      />
    </div>
    <div className=" flex flex-col gap-[8px] w-full ">
      <p>Email</p>
      <input
        type="text"
        placeholder="Enter your email"
        className=" bg-[#F2F3F5] border border-[#D7D7D8] py-[12px] px-[24px] rounded-xl "
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
      />
    </div>
    <div className=" flex flex-col gap-[8px] w-full ">
      <p>Password</p>
      <input
        type="password"
        placeholder="Enter your email"
        className=" bg-[#F2F3F5] border border-[#D7D7D8] py-[12px] px-[24px] rounded-xl "
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}
      />
    </div>
    {/*<div className="flex flex-col gap-[8px] w-full ">
      <p>Confirm Password</p>
      <input
        type="password"
        placeholder="Enter your email"
        className=" bg-[#F2F3F5] border border-[#D7D7D8] py-[12px] px-[24px] rounded-xl "
        value={confirmPassword}
        onChange={(e)=>{setConfirmPassword(e.target.value)}}
      />
    </div>*/}
    <button onClick={handleSubmit} className=" bg-[#1660CD] text-white font-medium w-full p-[12px] rounded-2xl ">SignUp</button>
  </div>
  </>
  );
};

export default SignUp