import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cloud, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthView: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register({ name, email, password, department, title });
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(demoEmail, 'Password@123');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { name: 'Yogendra Pratap', role: 'ADMIN', email: 'yogendra@clouddocs.io', label: 'Lead Developer (Admin)' },
    { name: 'Priya Sharma', role: 'USER', email: 'priya.sharma@clouddocs.io', label: 'Project Lead (Editor)' },
    { name: 'Rahul Verma', role: 'USER', email: 'rahul.verma@clouddocs.io', label: 'Student / Developer' },
    { name: 'Dr. Ananya Patel', role: 'USER', email: 'ananya.patel@clouddocs.io', label: 'Research Supervisor' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#181A16] flex items-center justify-center p-4 sm:p-6 text-[#3A3A32] dark:text-[#EDEBE4]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#556855] to-[#6E826E] flex items-center justify-center text-white shadow-lg shadow-[#556855]/20 mb-3">
            <Cloud className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#3A3A32] dark:text-[#EDEBE4]">
            CloudDocs
          </h1>
          <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-1 max-w-xs">
            Enterprise Cloud Document Management & S3 Collaboration Platform
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#F3F1EA] dark:bg-[#2A2E27] p-1 rounded-2xl my-6 text-xs font-semibold">
          <button
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl transition ${
              !isRegister
                ? 'bg-[#FFFFFF] dark:bg-[#34392F] text-[#3A3A32] dark:text-[#EDEBE4] shadow-xs'
                : 'text-[#7B806F] dark:text-[#8E9484]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl transition ${
              isRegister
                ? 'bg-[#FFFFFF] dark:bg-[#34392F] text-[#3A3A32] dark:text-[#EDEBE4] shadow-xs'
                : 'text-[#7B806F] dark:text-[#8E9484]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] border border-[#F2D2C9] dark:border-[#522F29] text-[#B84A39] dark:text-[#E88C7D] text-xs leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C907F] dark:text-[#787D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mitchell"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Engineering"
                    className="w-full px-3 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Developer"
                    className="w-full px-3 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C907F] dark:text-[#787D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@clouddocs.io"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C907F] dark:text-[#787D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-[#556855] hover:bg-[#455545] active:scale-98 text-white font-bold rounded-xl shadow-md shadow-[#556855]/20 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Profiles */}
        <div className="mt-6 pt-5 border-t border-[#EBE7DC] dark:border-[#2F342B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C907F] dark:text-[#787D70]">
              Demo Fast Sign-In
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#B5825D]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc.email)}
                className="p-2 rounded-xl bg-[#F6F4EE] dark:bg-[#292D25] hover:bg-[#EEF3ED] dark:hover:bg-[#283226] border border-[#E5E1D5] dark:border-[#353A2F] text-left transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#3A3A32] dark:text-[#EDEBE4] truncate group-hover:text-[#556855] dark:group-hover:text-[#A7C2A4]">
                    {acc.name ? acc.name.split(' ')[0] : 'User'}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    acc.role === 'ADMIN' ? 'bg-[#FAF2EB] text-[#B5825D]' : 'bg-[#EEF3ED] text-[#445543]'
                  }`}>
                    {acc.role}
                  </span>
                </div>
                <p className="text-[10px] text-[#7B806F] dark:text-[#8E9484] truncate mt-0.5">{acc.label}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
