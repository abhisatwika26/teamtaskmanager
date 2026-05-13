import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Used for login
  
  // Reset Password States
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match!');
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { 
        email, 
        newPassword 
      });
      alert(res.data.msg);
      // Flip back to login mode and clear password fields
      setIsResetMode(false);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to reset password.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-center items-center text-white p-12">
        <div className="mb-8">
          <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </div>
        <h1 className="text-5xl font-bold mb-4">TeamSync</h1>
        <p className="text-xl text-blue-100 text-center max-w-md">Manage your projects, assign tasks, and track your team's progress effortlessly.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="lg:hidden text-center mb-8">
             <h1 className="text-3xl font-bold text-blue-600 mb-2">TeamSync</h1>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              {isResetMode ? 'Reset Password' : 'Sign In'}
            </h2>
            
            {!isResetMode ? (
              /* --- LOGIN FORM --- */
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <button type="button" onClick={() => setIsResetMode(true)} className="text-xs font-medium text-blue-600 hover:underline outline-none">Forgot Password?</button>
                  </div>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm">
                  Login
                </button>
              </form>
            ) : (
              /* --- RESET PASSWORD FORM --- */
              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Email Address</label>
                  <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your registered email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-slate-800 text-white font-medium py-2.5 rounded-lg hover:bg-slate-900 transition duration-200 shadow-sm">
                  Update Password
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setIsResetMode(false)} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">
                    &larr; Back to Login
                  </button>
                </div>
              </form>
            )}
            
            {!isResetMode && (
              <div className="mt-6 text-center text-sm text-slate-600">
                Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:underline">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}