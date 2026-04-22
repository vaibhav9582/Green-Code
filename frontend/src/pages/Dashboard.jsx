import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, Code2, Bot, Send, Activity, Leaf, Cpu } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { UserButton } from '@clerk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Dashboard() {
  const [code, setCode] = useState('# Try typing some Python code here\nimport time\nprint("Hello Green World")\ntime.sleep(0.5)');
  const [language, setLanguage] = useState('python');
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState('');
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the EcoCode Assistant. Send me a question about green software or your code optimization.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/execute`, { code, language });
      setExecutionResult(res.data);
    } catch (err) {
      console.error(err);
      setExecutionResult({ error: "Execution failed (Server Error)", success: false });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizedCode('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/optimize`, { code, language });
      setOptimizedCode(res.data.optimizedCode);
    } catch (err) {
      console.error(err);
      setOptimizedCode("# Optimization failed. Check backend (Mistral API key may be invalid).");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatting(true);
    
    try {
      // Create context: append optimized code if exists
      const contextPrompt = optimizedCode ? `\n\nContext (Optimized Code):\n${optimizedCode}` : '';
      
      const res = await axios.post(`${API_BASE_URL}/api/chat`, { 
        messages: [{ role: 'user', content: chatInput + contextPrompt }] 
      });
      
      setChatMessages([...newMessages, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      console.error(err);
      setChatMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't process that right now." }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#0d1117] text-gray-200">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Leaf className="text-accent w-8 h-8" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
            EcoCode
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400 font-medium hidden sm:block">
            Zero-Carbon Developer Platform
          </div>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9"
              }
            }}
          />
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Editor & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[600px] lg:h-full min-h-0">
          <div className="glass-panel rounded-xl overflow-hidden shadow-2xl shadow-green-900/10 flex-1 flex flex-col">
            <div className="bg-gray-900/50 flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Code2 className="w-4 h-4 text-accent" />
                <span>Source Code</span>
              </div>
              <select 
                title="Select Language"
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                className="bg-gray-800 text-sm text-gray-200 border border-gray-700 rounded-md px-2 py-1 outline-none hover:border-accent transition-colors">
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            
            <textarea
              className="w-full flex-1 cyber-scroll bg-[#0d1117] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Paste your code here..."
              spellCheck="false"
            />
            
            <div className="bg-gray-900/50 p-4 border-t border-gray-800 flex items-center justify-end gap-3">
              <button 
                onClick={handleExecute}
                disabled={isExecuting || !code.trim()}
                className="group relative px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-accent/50 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExecuting ? <Activity className="w-4 h-4 animate-spin text-accent" /> : <Terminal className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />}
                {isExecuting ? "Running..." : "Live Execute Code"}
              </button>
              
              <button 
                onClick={handleOptimize}
                disabled={isOptimizing || !code.trim()}
                className="group relative px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 rounded-lg text-sm font-medium text-white shadow-lg shadow-emerald-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isOptimizing ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isOptimizing ? "Optimizing..." : "Refactor to Green Code"}
              </button>
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Analytics & Optimization */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-[600px] lg:h-full min-h-0">
          
          {/* Carbon Analytics Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-5 shadow-xl border border-gray-800 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu className="w-32 h-32" />
            </div>
            
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Dynamic Execution Metrics (CodeCarbon)
            </h3>
            
            {!executionResult && !isExecuting && (
              <div className="text-gray-500 text-sm py-4">Click "Live Execute Python" to profile hardware metrics.</div>
            )}
            
            {isExecuting && (
              <div className="text-accent text-sm animate-pulse py-4">Profiling execution...</div>
            )}
            
            {executionResult && (
              <div className="space-y-4 relative z-10">
                <div className="flex gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 flex-1 border border-gray-700/50">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className={executionResult.success ? "text-emerald-400" : "text-red-400 text-xs"}>
                      {executionResult.success ? "Success" : executionResult.error || "Failed"}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 flex-1 border border-accent/20">
                    <div className="text-xs text-green-400/70 mb-1">Estimated Emissions</div>
                    <div className="text-xl font-bold text-accent">
                      {executionResult.metrics?.emissions_gCO2eq?.toFixed(8) || "0.00"} <span className="text-xs font-normal">gCO₂e</span>
                    </div>
                  </div>
                </div>
                
                {executionResult.stdout && (
                  <div className="bg-black/50 p-2 rounded border border-gray-800">
                    <div className="text-xs text-gray-500 mb-1">STDOUT</div>
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">{executionResult.stdout}</pre>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Refactored Code Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col border border-gray-800"
          >
            <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-gray-300">Optimized "Green" Code</span>
            </div>
            <div className="flex-1 cyber-scroll overflow-auto bg-[#0d1117]">
              {isOptimizing ? (
                <div className="h-full flex items-center justify-center text-accent/50 text-sm animate-pulse">
                  Analyzing architecture & applying green patterns...
                </div>
              ) : optimizedCode ? (
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                  wrapLines={true}
                >
                  {optimizedCode}
                </SyntaxHighlighter>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-center text-gray-600 text-sm">
                  Click 'Refactor to Green Code' to generate an optimized, energy-efficient version.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Chatbot */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-[600px] lg:h-full min-h-0">
          <div className="glass-panel rounded-xl h-full flex flex-col shadow-2xl border border-gray-800">
            <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-800 flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent" />
              <span className="font-medium text-sm">Eco AI Assistant</span>
            </div>
            
            <div className="flex-1 p-4 cyber-scroll overflow-y-auto flex flex-col gap-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent/20 text-accent-light border border-accent/30 rounded-tr-sm' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700/50 rounded-tl-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-4 text-white" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-3 text-white" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2 mt-3 text-white" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                          a: ({node, ...props}) => <a className="text-accent hover:underline" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                {...props}
                                children={String(children).replace(/\n$/, '')}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ margin: '0.75rem 0', borderRadius: '0.5rem', fontSize: '0.8rem', background: '#0d1117', border: '1px solid #374151' }}
                              />
                            ) : (
                              <code {...props} className="bg-gray-900 px-1.5 py-0.5 rounded text-accent font-mono text-xs border border-gray-700">
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm bg-gray-800 text-gray-500 border border-gray-700/50 rounded-tl-sm animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-gray-900/50 border-t border-gray-800">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about efficiency..."
                  className="w-full bg-gray-950 border border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors"
                />
                <button 
                  onClick={handleChat}
                  disabled={isChatting || !chatInput.trim()}
                  className="absolute right-2 p-1.5 rounded-full bg-accent text-gray-950 hover:bg-emerald-400 disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
