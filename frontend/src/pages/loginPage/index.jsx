import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { toast } from 'react-toastify';
import { signInWithGoogle } from '../../firebase/auth';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading,setIsLoading]=useState(false)
  const { user, setUser, token, setToken } = useContext(UserContext);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      email: formData.email,
      password: formData.password,
    }
    setIsLoading(true)
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
    }finally{
      setIsLoading(false)
    }
  };

  const handleGoogleSignIn = async () => {
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
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Welcome Back!
            </h1>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Right Panel - Blue Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800 rounded-full opacity-20 transform -translate-x-20 translate-y-20"></div>
        
        <div className="relative z-10 text-center text-white max-w-md">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hello, Subscriber!
          </h2>
          <p className="text-lg md:text-xl mb-4 text-blue-100">
            Register with your personal details
          </p>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            to use all of site features.
          </p>
          <button
            onClick={() => navigate('/signUp')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;