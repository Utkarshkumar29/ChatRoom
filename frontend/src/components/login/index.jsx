import axios from "axios";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import {
  auth,
  provider,
  signInWithGoogle,
  signInWithPopup,
} from "../../firebase/auth";
import { toast } from "react-toastify";
import { GoogleAuthProvider } from "firebase/auth";
import GoogleIcon from "../../assets/icons/GoogleIcon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser, token, setToken } = useContext(UserContext);

  const handleLogin = async () => {
    const data = { email, password };
    try {
      const response = await axios.post(
        "https://chatroom-y7ou.onrender.com/api/user/login",
        data,
        { withCredentials: true }
      );
      setUser(response.data.userDocs);
      localStorage.setItem("user", JSON.stringify(response.data.userDocs));
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token, "power");
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

      console.log("Token:", token); // Log the token for debugging

      const data = {
        username,
        email,
        pic,
        token,
      };

      // Send data to backend for auth or signup
      const response = await axios.post(
        "https://chatroom-y7ou.onrender.com/api/user/google-auth",
        data,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Response from backend:", response.data);
        setUser(response.data.userDocs);
        localStorage.setItem("user", JSON.stringify(response.data.userDocs));
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
    <div className="flex justify-center items-center w-full h-full flex-col gap-[24px] pt-[40px] pr-[48px] pb-[24px] pl-[48px] ">
      <p className=" text-[28px] font-semibold text-[#16171C] ">
        Welcome Back !
      </p>
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

      <div className=" flex flex-col gap-[8px] w-full ">
        <p className=" font-medium text-base ">
          Email <sapn className={` text-[#A3A3A5] `}>*</sapn>
        </p>
        <input
          type="text"
          placeholder="Enter your email"
          className=" bg-[#F2F3F5] border border-[#D7D7D8] py-[12px] px-[24px] rounded-xl "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className=" flex flex-col gap-[8px] w-full ">
        <p className=" font-medium text-base ">
          Password <span className={` text-[#A3A3A5] `}>*</span>
        </p>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=" bg-[#F2F3F5] border border-[#D7D7D8] py-[12px] px-[24px] rounded-xl "
        />
      </div>

      <button
        onClick={handleLogin}
        className=" bg-[#1660CD] text-white font-medium w-full p-[12px] rounded-2xl "
      >
        Login
      </button>
    </div>
  );
};

export default Login;
