import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Eye, EyeOff, GraduationCap, Users, ShieldCheck,
  User, Mail, Lock, IdCard, ArrowRight, Key, Briefcase, Award,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import type { Role } from '../../types';

const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  
  // Role-specific custom inputs
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [department, setDepartment] = useState('');
  
  // Security verification for staff roles
  const [accessCode, setAccessCode] = useState('');

  // Password fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const roles: { id: Role; label: string; desc: string; icon: any }[] = [
    { id: 'STUDENT', label: 'Student', desc: 'Access courses & classes', icon: GraduationCap },
    { id: 'TRAINER', label: 'Trainer', desc: 'Manage classes & grades', icon: Users },
    { id: 'COORDINATOR', label: 'Coordinator', desc: 'System & batch admin', icon: ShieldCheck },
  ];

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setAccessCode(''); // Reset access code on role switch
    setIdNumber(''); // Reset ID on role switch to enforce new length rules
  };

  const isPasswordLengthValid = password.length >= 6;
  const isPasswordMatching = password !== '' && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !idNumber || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Enforce ID length rules: 6 digits for STUDENT, 4 digits for TRAINER/COORDINATOR
    const targetLength = role === 'STUDENT' ? 6 : 4;
    if (idNumber.length !== targetLength || !/^\d+$/.test(idNumber)) {
      toast.error(`${role === 'STUDENT' ? 'Student ID must be exactly 6 numeric digits' : 'ID must be exactly 4 numeric digits'}`);
      return;
    }

    if (!isPasswordLengthValid) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!isPasswordMatching) {
      toast.error('Passwords do not match');
      return;
    }

    // Role-specific access verification guard
    if (role === 'TRAINER' && accessCode.trim() !== 'TECHV-TRAINER-2026') {
      toast.error('Invalid Trainer Access Code. Hint: TECHV-TRAINER-2026');
      return;
    }
    if (role === 'COORDINATOR' && accessCode.trim() !== 'TECHV-COORD-2026') {
      toast.error('Invalid Coordinator Access Code. Hint: TECHV-COORD-2026');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        fullName,
        email,
        role,
        idNumber,
        qualification: role === 'STUDENT' ? qualification : undefined,
        specialization: role === 'TRAINER' ? specialization : undefined,
        department: role === 'COORDINATOR' ? department : undefined,
      });
      toast.success(`Account created successfully! Welcome, ${fullName}!`);
      
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        navigate(`/${user.role.toLowerCase()}/dashboard`, { replace: true });
      } else {
        navigate(`/${role.toLowerCase()}/dashboard`, { replace: true });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-primary-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl mb-4 transform transition hover:scale-105 duration-300">
            <BookOpen className="text-primary-300" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Create your account</h1>
          <p className="text-primary-200 mt-2 text-sm sm:text-base">Join TechV Learning Enterprise Portal</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50/80 text-primary-900 shadow-md ring-2 ring-primary-500/20 scale-[1.02]'
                          : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`mb-1.5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} size={22} />
                      <span className="text-xs sm:text-sm font-bold">{r.label}</span>
                      <span className="text-[10px] text-gray-500 hidden sm:block mt-0.5">{r.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2"></div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.morgan@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* ID Number */}
              <div>
                <label htmlFor="idNumber" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  {role === 'STUDENT' ? 'Student ID (6 Digits)' : role === 'TRAINER' ? 'Employee ID (4 Digits)' : 'Coordinator ID (4 Digits)'} <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <IdCard size={18} />
                  </div>
                  <input
                    id="idNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={role === 'STUDENT' ? 6 : 4}
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={role === 'STUDENT' ? '102938' : '9082'}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-gray-400 font-mono"
                    required
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {role === 'STUDENT' ? `Must be 6 numeric digits (${idNumber.length}/6)` : `Must be 4 numeric digits (${idNumber.length}/4)`}
                </span>
              </div>

              {/* Role-Specific Custom Field */}
              <div>
                <label htmlFor="roleMetadata" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  {role === 'STUDENT' ? 'Qualification / Degree' : role === 'TRAINER' ? 'Primary Specialization' : 'Department'}
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    {role === 'STUDENT' ? <Award size={18} /> : <Briefcase size={18} />}
                  </div>
                  <input
                    id="roleMetadata"
                    type="text"
                    value={role === 'STUDENT' ? qualification : role === 'TRAINER' ? specialization : department}
                    onChange={(e) => {
                      if (role === 'STUDENT') setQualification(e.target.value);
                      else if (role === 'TRAINER') setSpecialization(e.target.value);
                      else setDepartment(e.target.value);
                    }}
                    placeholder={role === 'STUDENT' ? 'B.Tech Computer Science' : role === 'TRAINER' ? 'Full Stack Java & React' : 'Academic Admin'}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Conditional Access Verification Guard for Staff Roles */}
              {role !== 'STUDENT' && (
                <div className="sm:col-span-2 bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Enterprise Access Verification Required
                      </h4>
                      <p className="text-xs text-amber-700 mt-0.5">
                        To register as a {role.toLowerCase()}, please input your official organizational verification token.
                      </p>
                    </div>
                  </div>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500">
                      <Key size={18} />
                    </div>
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder={role === 'TRAINER' ? 'Enter code: TECHV-TRAINER-2026' : 'Enter code: TECHV-COORD-2026'}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-amber-400 font-mono"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Live Password Strength & Match Indicators */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 px-1">
              <div className={`flex items-center gap-1.5 transition-colors ${isPasswordLengthValid ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                <CheckCircle2 size={15} />
                <span>At least 6 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 transition-colors ${isPasswordMatching ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                <CheckCircle2 size={15} />
                <span>Passwords match</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>{isLoading ? 'Creating Account...' : `Register as ${role.charAt(0) + role.slice(1).toLowerCase()}`}</span>
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-primary-300/60 mt-6">
          TechV Enterprise LMS • Frontend Security Enabled
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
