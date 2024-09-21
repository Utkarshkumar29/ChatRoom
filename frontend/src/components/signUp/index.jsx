import { useContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { signInWithGoogle } from "../../firebase/auth";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { GoogleAuthProvider } from 'firebase/auth';

const SignUp = () => {
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [isSignedIn, setIsSignedIn] = useState(false);
    const { user, setUser, token, setToken } = useContext(UserContext);

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
            const response=await axios.post('/api/user',data)
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
        const response = await axios.post('/api/user/google-auth', data);
    
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
    <><form className=" flex justify-center items-center text-red-400 w-full h-full flex-col" onSubmit={handleSubmit}>
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
  <button onClick={handleGoogleAuth}>
                Sign in with Google
            </button></>
  );
};

export default SignUp