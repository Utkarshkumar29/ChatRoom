import axios from "axios";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { auth, provider, signInWithGoogle, signInWithPopup } from "../../firebase/auth";
import { toast } from "react-toastify";
import { GoogleAuthProvider } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser, token, setToken } = useContext(UserContext);

  const handleLogin = async () => {
    const data = { email, password };
    try {
      const response = await axios.post('https://chatroom-y7ou.onrender.com/api/user/login', data,{ withCredentials: true,});
      setUser(response.data.userDocs);
      localStorage.setItem('user',JSON.stringify(response.data.userDocs))
      localStorage.setItem('token',response.data.token)
      console.log(response.data.token,'power');
      if (response.status === 200) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
      // Handle error state or display error message
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user; // User information
      const username = user.displayName || "User";
      const email = user.email;
      const pic = user.photoURL;
  
      // Ensure the token retrieval is correct
      const token = await user.getIdToken(); 
  
      console.log('Token:', token); // Log the token for debugging
  
      const data = {
        username,
        email,
        pic,
        token
      };
  
      // Send data to backend for auth or signup
      const response = await axios.post('https://chatroom-y7ou.onrender.com/api/user/google-auth', data,{ withCredentials: true,});
  
      if (response.status === 200 || response.status === 201) {
        console.log("Response from backend:", response.data);
        setUser(response.data.userDocs);
        localStorage.setItem('user', JSON.stringify(response.data.userDocs));
        setToken(response.data.token); // This should be your backend's token
        setIsLoggedIn(true);
        toast.success(`Welcome ${username}`);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Google sign-in error: ", error);
      toast.error("Google Sign In failed. Please try again.");
    }
  };

 


  if (isLoggedIn) {
    return <Navigate to="/chatRoom" />;
  }

  return (
    <div className="flex justify-center items-center text-red-400 w-full h-full flex-col">
      <p>Login</p>
      <div className="flex items-center">
        <p>Email</p>
        <input
          type="text"
          placeholder="Enter your email"
          className="border-2 border-red"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex items-center">
        <p>Password</p>
        <input
          type="password"
          placeholder="Enter your password"
          className="border-2 border-red"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleGoogleAuth}>
        Sign in with Google
      </button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
