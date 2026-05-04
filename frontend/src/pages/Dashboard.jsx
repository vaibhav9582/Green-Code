import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, Code2, Bot, Send, Activity, Leaf, Cpu, Sun, Moon } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { UserButton } from '@clerk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Dashboard({ theme = 'light', toggleTheme }) {
  const [code, setCode] = useState('# Try typing some Python code here\nimport time\nprint("Hello Green World")\ntime.sleep(0.5)');
  const [language, setLanguage] = useState('python');
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isExecutingOptimized, setIsExecutingOptimized] = useState(false);
  const [optimizedExecutionResult, setOptimizedExecutionResult] = useState(null);
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the EcoCode Assistant. Send me a question about green software or your code optimization.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const isLight = theme === 'light';

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
    setOptimizedExecutionResult(null);
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

  const handleExecuteOptimized = async () => {
    setIsExecutingOptimized(true);
    setOptimizedExecutionResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/execute`, { code: optimizedCode, language });
      setOptimizedExecutionResult(res.data);
    } catch (err) {
      console.error(err);
      setOptimizedExecutionResult({ error: "Execution failed (Server Error)", success: false });
    } finally {
      setIsExecutingOptimized(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatting(true);
    
    try {
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
    <div className={`min-h-screen lg:h-screen flex flex-col transition-colors duration-300 ${isLight ? 'bg-gradient-to-br from-white via-green-50 to-emerald-100' : 'bg-[#0d1117]'}`}>
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Leaf className={`w-8 h-8 ${isLight ? 'text-emerald-600' : 'text-accent'}`} />
          <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${isLight ? 'bg-gradient-to-r from-emerald-600 to-green-500' : 'bg-gradient-to-r from-accent to-emerald-300'}`}>
            EcoCode
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-sm font-medium hidden sm:block ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Zero-Carbon Developer Platform
          </div>
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
          <div className={`glass-panel rounded-xl overflow-hidden shadow-2xl flex-1 flex flex-col ${isLight ? 'shadow-green-900/10' : 'shadow-green-900/10'}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-900/50 border-gray-800'}`}>
              <div className={`flex items-center gap-2 text-sm ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                <Code2 className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-accent'}`} />
                <span>Source Code</span>
              </div>
              <select 
                title="Select Language"
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                className={`text-sm border rounded-md px-2 py-1 outline-none transition-colors ${
                  isLight 
                    ? 'bg-white text-gray-700 border-emerald-200 hover:border-emerald-400' 
                    : 'bg-gray-800 text-gray-200 border-gray-700 hover:border-accent'
                }`}>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            
            <div className="flex-1 relative overflow-auto group">
              <textarea
                className={`absolute inset-0 w-full h-full resize-none focus:outline-none font-mono p-4 bg-transparent z-10 text-transparent caret-white ${
                  isLight ? 'caret-emerald-600' : 'caret-accent'
                }`}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Paste or type your code here..."
                spellCheck="false"
                style={{ 
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  backgroundColor: 'transparent'
                }}
              />
              <div className="absolute inset-0 pointer-events-none cyber-scroll overflow-auto">
                {code ? (
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ 
                      margin: 0, 
                      padding: '1rem', 
                      background: isLight ? '#ffffff' : 'transparent',
                      minHeight: '100%'
                    }}
                    wrapLines={true}
                  >
                    {code}
                  </SyntaxHighlighter>
                ) : (
                  <div className={`p-4 font-mono text-sm ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
                    Paste your code here...
                  </div>
                )}
              </div>
            </div>
            
            <div className={`p-4 border-t flex items-center justify-end gap-3 ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-900/50 border-gray-800'
            }`}>
              <button 
                onClick={handleExecute}
                disabled={isExecuting || !code.trim()}
                className={`group relative px-4 py-2 border rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                  isLight 
                    ? 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-gray-700 hover:border-emerald-500' 
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300 hover:border-accent/50'
                }`}
              >
                {isExecuting ? <Activity className={`w-4 h-4 animate-spin ${isLight ? 'text-emerald-600' : 'text-accent'}`} /> : <Terminal className={`w-4 h-4 transition-colors ${isLight ? 'text-gray-500 group-hover:text-emerald-600' : 'text-gray-400 group-hover:text-accent'}`} />}
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
            className={`glass-panel rounded-xl p-5 shadow-xl border relative overflow-hidden ${
              isLight ? 'border-emerald-200 bg-white' : 'border-gray-800'
            }`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 ${isLight ? 'text-emerald-600' : ''}`}>
              <Cpu className="w-32 h-32" />
            </div>
            
            <h3 className={`text-sm font-medium mb-4 flex items-center gap-2 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              <Activity className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-accent'}`} />
              Dynamic Execution Metrics (CodeCarbon)
            </h3>
            
            {!executionResult && !isExecuting && (
              <div className={`text-sm py-4 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Click "Live Execute Python" to profile hardware metrics.</div>
            )}
            
            {isExecuting && (
              <div className={`text-sm animate-pulse py-4 ${isLight ? 'text-emerald-600' : 'text-accent'}`}>Profiling execution...</div>
            )}
            
            {executionResult && (
              <div className="space-y-4 relative z-10">
                <div className="flex gap-4">
                  <div className={`rounded-lg p-3 flex-1 border ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-800/50 border-gray-700/50'}`}>
                    <div className={`text-xs mb-1 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>Status</div>
                    <div className={executionResult.success ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : 'text-red-400 text-xs'}>
                      {executionResult.success ? "Success" : executionResult.error || "Failed"}
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 flex-1 border ${isLight ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-800/50 border-accent/20'}`}>
                    <div className={`text-xs mb-1 ${isLight ? 'text-emerald-600/70' : 'text-green-400/70'}`}>Estimated Emissions</div>
                    <div className={`text-xl font-bold ${isLight ? 'text-emerald-600' : 'text-accent'}`}>
                      {executionResult.metrics?.emissions_gCO2eq?.toFixed(8) || "0.00"} <span className="text-xs font-normal">gCO₂e</span>
                    </div>
                  </div>
                </div>
                
                {executionResult.stdout && (
                  <div className={`p-2 rounded border ${isLight ? 'bg-gray-50 border-emerald-200' : 'bg-black/50 border-gray-800'}`}>
                    <div className={`text-xs mb-1 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>STDOUT</div>
                    <pre className={`text-xs whitespace-pre-wrap font-mono ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>{executionResult.stdout}</pre>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Emissions Comparison Card */}
          {executionResult && optimizedExecutionResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel rounded-xl p-4 shadow-xl border ${isLight ? 'border-emerald-200 bg-white' : 'border-gray-800'}`}
            >
              <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                <Leaf className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-accent'}`} />
                Carbon Emissions Comparison
              </h3>
              
              <div className="space-y-3">
                {/* Original Code Emissions */}
                <div className={`p-3 rounded-lg border ${isLight ? 'bg-red-50 border-red-200' : 'bg-red-900/20 border-red-800/50'}`}>
                  <div className={`text-xs font-medium mb-1 ${isLight ? 'text-red-600' : 'text-red-400'}`}>Original Code</div>
                  <div className={`text-lg font-bold ${isLight ? 'text-red-700' : 'text-red-300'}`}>
                    {executionResult.metrics?.emissions_gCO2eq?.toFixed(8)} gCO₂e
                  </div>
                </div>
                
                {/* Optimized Code Emissions */}
                <div className={`p-3 rounded-lg border ${isLight ? 'bg-green-50 border-green-200' : 'bg-green-900/20 border-green-800/50'}`}>
                  <div className={`text-xs font-medium mb-1 ${isLight ? 'text-green-600' : 'text-green-400'}`}>Optimized Code</div>
                  <div className={`text-lg font-bold ${isLight ? 'text-green-700' : 'text-green-300'}`}>
                    {optimizedExecutionResult.metrics?.emissions_gCO2eq?.toFixed(8)} gCO₂e
                  </div>
                </div>
                
                {/* Savings */}
                <div className={`p-3 rounded-lg border ${isLight ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-900/30 border-emerald-800/50'}`}>
                  <div className={`text-xs font-medium mb-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Carbon Reduction</div>
                  <div className={`flex items-end gap-2`}>
                    <div className={`text-2xl font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                      {(executionResult.metrics?.emissions_gCO2eq - optimizedExecutionResult.metrics?.emissions_gCO2eq).toFixed(8)}
                    </div>
                    <div className={`text-sm font-semibold mb-1 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                      ({Math.round(((executionResult.metrics?.emissions_gCO2eq - optimizedExecutionResult.metrics?.emissions_gCO2eq) / executionResult.metrics?.emissions_gCO2eq) * 100)}% improvement)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Refactored Code Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex-1 glass-panel rounded-xl overflow-hidden flex flex-col border ${isLight ? 'border-emerald-200' : 'border-gray-800'}`}
          >
            <div className={`px-4 py-3 border-b flex items-center justify-between ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-900/50 border-gray-800'}`}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Optimized "Green" Code</span>
              </div>
              {optimizedCode && (
                <button
                  onClick={handleExecuteOptimized}
                  disabled={isExecutingOptimized}
                  className={`text-xs px-3 py-1 rounded border transition-all flex items-center gap-1 ${
                    isLight
                      ? 'bg-green-100 hover:bg-green-200 border-green-300 text-gray-700 hover:border-green-500'
                      : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300 hover:border-green-400'
                  } disabled:opacity-50`}
                >
                  {isExecutingOptimized ? <Activity className="w-3 h-3 animate-spin" /> : <Terminal className="w-3 h-3" />}
                  {isExecutingOptimized ? "Running..." : "Test Optimized"}
                </button>
              )}
            </div>
            <div className={`flex-1 cyber-scroll overflow-auto ${isLight ? 'bg-white' : 'bg-[#0d1117]'}`}>
              {isOptimizing ? (
                <div className={`h-full flex items-center justify-center text-sm animate-pulse ${isLight ? 'text-emerald-500/50' : 'text-accent/50'}`}>
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
                <div className={`h-full flex items-center justify-center p-6 text-center text-sm ${isLight ? 'text-gray-500' : 'text-gray-600'}`}>
                  Click 'Refactor to Green Code' to generate an optimized, energy-efficient version.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Chatbot */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-[600px] lg:h-full min-h-0">
          <div className={`glass-panel rounded-xl h-full flex flex-col shadow-2xl border ${isLight ? 'border-emerald-200' : 'border-gray-800'}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-900/80 border-gray-800'}`}>
              <Bot className={`w-5 h-5 ${isLight ? 'text-emerald-600' : 'text-accent'}`} />
              <span className={`font-medium text-sm ${isLight ? 'text-gray-700' : ''}`}>Eco AI Assistant</span>
            </div>
            
            <div className="flex-1 p-4 cyber-scroll overflow-y-auto flex flex-col gap-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? isLight 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-tr-sm' 
                        : 'bg-accent/20 text-accent-light border border-accent/30 rounded-tr-sm'
                      : isLight
                        ? 'bg-gray-100 text-gray-700 border border-gray-200 rounded-tl-sm'
                        : 'bg-gray-800 text-gray-300 border border-gray-700/50 rounded-tl-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({node, ...props}) => <p className={`mb-3 last:mb-0 ${isLight ? 'text-gray-700' : ''}`} {...props} />,
                          h1: ({node, ...props}) => <h1 className={`text-lg font-bold mb-2 mt-4 ${isLight ? 'text-gray-800' : 'text-white'}`} {...props} />,
                          h2: ({node, ...props}) => <h2 className={`text-base font-bold mb-2 mt-3 ${isLight ? 'text-gray-800' : 'text-white'}`} {...props} />,
                          h3: ({node, ...props}) => <h3 className={`text-sm font-bold mb-2 mt-3 ${isLight ? 'text-gray-800' : 'text-white'}`} {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                          a: ({node, ...props}) => <a className={isLight ? 'text-emerald-600 hover:underline' : 'text-accent hover:underline'} {...props} />,
                          strong: ({node, ...props}) => <strong className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`} {...props} />,
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                {...props}
                                children={String(children).replace(/\n$/, '')}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ margin: '0.75rem 0', borderRadius: '0.5rem', fontSize: '0.8rem', background: isLight ? '#f9fafb' : '#0d1117', border: isLight ? '1px solid #e5e7eb' : '1px solid #374151' }}
                              />
                            ) : (
                              <code {...props} className={`px-1.5 py-0.5 rounded font-mono text-xs border ${
                                isLight 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-gray-900 text-accent border border-gray-700'
                              }`}>
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
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm border rounded-tl-sm animate-pulse ${
                    isLight 
                      ? 'bg-gray-100 text-gray-500 border-gray-200' 
                      : 'bg-gray-800 text-gray-500 border border-gray-700/50'
                  }`}>
                    Typing...
                  </div>
                </div>
              )}
            </div>
            
            <div className={`p-3 border-t ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-900/50 border-gray-800'}`}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about efficiency..."
                  className={`w-full border rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none transition-colors ${
                    isLight 
                      ? 'bg-white text-gray-700 border-emerald-200 focus:border-emerald-400' 
                      : 'bg-gray-950 text-gray-200 border-gray-700 focus:border-accent/50'
                  }`}
                />
                <button 
                  onClick={handleChat}
                  disabled={isChatting || !chatInput.trim()}
                  className={`absolute right-2 p-1.5 rounded-full hover:disabled:transition-colors ${
                    isChatting || !chatInput.trim()
                      ? 'bg-gray-400 text-gray-600'
                      : isLight
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-accent text-gray-950 hover:bg-emerald-400'
                  }`}
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
