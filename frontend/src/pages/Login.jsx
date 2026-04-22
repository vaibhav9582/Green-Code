import React from 'react';
import { SignIn } from '@clerk/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-4 text-gray-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-accent transition-colors text-sm font-medium z-10">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="z-10"
      >
        <SignIn 
          routing="path" 
          path="/login" 
          signUpUrl="/register" 
          forceRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#10b981',
            }
          }}
        />
      </motion.div>
    </div>
  );
};

export default Login;
