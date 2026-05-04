import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Code2, Zap, Activity, Cpu, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth, UserButton } from '@clerk/react';

const LandingPage = ({ theme = 'light', toggleTheme }) => {
  const { userId } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const featureCards = [
    { title: "Live Execution Profiling", desc: "Profile hardware metrics dynamically with CodeCarbon to understand your code's real energy footprint.", icon: <Cpu className="w-6 h-6 text-accent" /> },
    { title: "Green Refactoring", desc: "Let AI optimize your code architecture to minimize carbon emissions and maximize efficiency.", icon: <Zap className="w-6 h-6 text-amber-400" /> },
    { title: "Intelligent Assistant", desc: "Chat with an AI specifically trained on green software practices and modern scalable architectures.", icon: <Code2 className="w-6 h-6 text-emerald-400" /> }
  ];

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300 ${isLight ? 'bg-gradient-to-br from-white via-green-50 to-emerald-100' : 'bg-[#0d1117]'}`}>
      <header className="glass-panel sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Leaf className={`w-8 h-8 ${isLight ? 'text-emerald-600' : 'text-accent'}`} />
          <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${isLight ? 'bg-gradient-to-r from-emerald-600 to-green-500' : 'bg-gradient-to-r from-accent to-emerald-300'}`}>
            EcoCode
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isLight 
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600' 
                : 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {userId ? (
            <>
              <Link to="/dashboard" className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md ${
                isLight 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              }`}>
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <Link to="/login" className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md ${
              isLight 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
            }`}>
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Background Decorative Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] blur-[120px] rounded-full pointer-events-none ${
          isLight ? 'bg-emerald-200/50' : 'bg-emerald-900/20'
        }`} />

        <motion.div 
          className="max-w-4xl w-full text-center mb-24 mt-12 relative z-10"
          initial="hidden" animate="visible" variants={containerVariants}
        >
          <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border shadow-lg ${
            isLight 
              ? 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-emerald-200' 
              : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-900/20'
          }`}>
            <Activity className="w-4 h-4" />
            Zero-Carbon Developer Platform
          </motion.div>
          
          <motion.h1 variants={itemVariants} className={`text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight ${
            isLight ? 'text-gray-800' : 'text-gray-200'
          }`}>
            Code <span className={`bg-clip-text text-transparent ${
              isLight ? 'bg-gradient-to-r from-emerald-600 to-green-500' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
            }`}>Greener.</span><br/>
            Build <span className={`bg-clip-text text-transparent ${
              isLight ? 'bg-gradient-to-r from-emerald-600 to-green-400' : 'bg-gradient-to-r from-accent to-emerald-300'
            }`}>Smarter.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className={`text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
            isLight ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Measure, optimize, and reduce the environmental impact of your software with AI-driven green refactoring and live hardware execution profiling.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-semibold transition-all shadow-xl shadow-emerald-900/50 flex items-center gap-2 transform hover:-translate-y-0.5">
              Start Optimizing <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}
        >
          {featureCards.map((card, idx) => (
            <motion.div 
              key={idx} variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass-panel p-8 rounded-2xl border transition-all shadow-2xl ${
                isLight 
                  ? 'bg-white border-emerald-200 hover:border-emerald-400' 
                  : 'bg-gradient-to-b from-gray-900/80 to-gray-900/30 border-gray-800 hover:border-emerald-500/30'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-inner ${
                isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-800 border-gray-700'
              }`}>
                {card.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${isLight ? 'text-gray-800' : 'text-gray-100'}`}>{card.title}</h3>
              <p className={`leading-relaxed text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
