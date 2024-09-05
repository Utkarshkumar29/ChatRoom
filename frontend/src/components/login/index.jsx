import axios from "axios";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { auth, provider, signInWithPopup } from "../../firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser, token, setToken } = useContext(UserContext);

  const handleLogin = async () => {
    const data = { email, password };
    try {
      const response = await axios.post('api/user/login', data);
      setUser(response.data.userDocs);
      localStorage.setItem('user',JSON.stringify(response.data.userDocs))
      setToken(response.data.token)
      console.log(response);
      if (response.status === 200) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
      // Handle error state or display error message
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User info:', user);

      setUser(user);
      setToken(result.token)
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error signing in:', error.message);
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
      <button onClick={handleSignIn}>
        Sign in with Google
      </button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
