import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) throw error;
      
      if (isSignUp) {
        toast.success('Registration successful! Please log in.');
        setIsSignUp(false);
      } else {
        toast.success('Login successful!');
        navigate('/claim-prize');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-8">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition duration-300"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-yellow-500 hover:text-yellow-400"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;