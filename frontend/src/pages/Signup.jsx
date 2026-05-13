import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        name, email, password, role
      });
      alert('Account created successfully! Please log in.');
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-center items-center text-white p-12">
        <div className="mb-8">
          <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold mb-4">TeamSync</h1>
        <p className="text-xl text-blue-100 text-center max-w-md">Join your team today and start collaborating.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
           <div className="lg:hidden text-center mb-8">
             <h1 className="text-3xl font-bold text-blue-600 mb-2">TeamSync</h1>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                  placeholder="John Doe"
                  value={name} onChange={e => setName(e.target.value)} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                  placeholder="you@company.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                  placeholder="Create a strong password"
                  value={password} onChange={e => setPassword(e.target.value)} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={role} onChange={e => setRole(e.target.value)}
                >
                  <option value="Member">Team Member</option>
                  <option value="Admin">Project Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 mt-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm">
                Sign Up
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account? <Link to="/" className="text-blue-600 font-medium hover:underline">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}