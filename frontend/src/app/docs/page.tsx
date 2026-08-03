"use client";

import { useState } from 'react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('quickstart');

  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black flex flex-col md:flex-row overflow-hidden relative pt-20">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[120px] animate-blob mix-blend-screen pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-[#070A12]/80 backdrop-blur-xl border-r border-white/5 flex-shrink-0 md:h-[calc(100vh-80px)] flex flex-col relative z-20 sticky top-20">
        <div className="p-6 border-b border-white/5">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Developer Docs</div>
          <div className="text-xl font-bold text-white">AegisClaw v1.0</div>
        </div>
        <nav className="p-4 space-y-1 font-medium text-sm overflow-y-auto flex-1">
          <div className="text-xs font-bold text-gray-500 mb-3 px-3 uppercase tracking-wider">Getting Started</div>
          {['quickstart', 'helm', 'docker'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-[#006FCF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              {tab === 'quickstart' && 'Quickstart Guide'}
              {tab === 'helm' && 'Kubernetes Helm Chart'}
              {tab === 'docker' && 'Docker Compose'}
            </button>
          ))}

          <div className="text-xs font-bold text-gray-500 mt-6 mb-3 px-3 uppercase tracking-wider">Core Concepts</div>
          {['cedar'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-[#006FCF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              {tab === 'cedar' && 'Cedar Policy Syntax'}
            </button>
          ))}

          <div className="text-xs font-bold text-gray-500 mt-6 mb-3 px-3 uppercase tracking-wider">SDKs & Wrappers</div>
          {['python', 'typescript'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-[#006FCF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              {tab === 'python' && 'Python SDK'}
              {tab === 'typescript' && 'TypeScript SDK'}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-16 lg:px-32 overflow-y-auto relative z-10 h-[calc(100vh-80px)]">
        
        {activeTab === 'quickstart' && (
          <div className="max-w-4xl animate-fade-in-up pb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#006FCF]/10 border border-[#006FCF]/30 text-[#00F0FF] text-xs font-semibold mb-6 uppercase tracking-widest">
              Get Started
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Quickstart Guide</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
              Deploy the AegisClaw proxy core and start wrapping your agent tool calls in under 15 minutes.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#006FCF]/20 text-[#00F0FF] flex items-center justify-center mr-4 text-sm font-mono border border-[#006FCF]/30">1</span>
              Spin up the cluster
            </h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">AegisClaw runs entirely self-hosted in your VPC. Start the Docker Compose stack containing the FastAPI proxy, Redis velocity cache, Cedar sidecar, and CISO Dashboard.</p>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <span className="text-xs text-gray-500 font-sans font-bold">Terminal</span>
                <button className="text-xs text-gray-400 hover:text-white transition-colors">Copy</button>
              </div>
              <span className="text-gray-500"># Clone the enterprise repository</span><br/>
              <span className="text-pink-400">git</span> clone https://github.com/aegisclaw/core.git<br/>
              <span className="text-pink-400">cd</span> core<br/><br/>
              <span className="text-gray-500"># Start the sidecar services</span><br/>
              <span className="text-pink-400">docker-compose</span> up --build -d
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#006FCF]/20 text-[#00F0FF] flex items-center justify-center mr-4 text-sm font-mono border border-[#006FCF]/30">2</span>
              Wrap your Agent Execution
            </h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">You do not need to modify your LangChain, CrewAI, or LlamaIndex internal logic. Simply change the outbound HTTP client your tools use to route through <code className="text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/20">localhost:8000</code>.</p>
            
            <div className="grid grid-cols-1 gap-8 mb-12">
              {/* LangChain */}
              <div className="glass-card rounded-2xl font-mono text-sm overflow-hidden group relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[#00F0FF] font-bold text-xs">LangChain (Python)</span>
                  <button className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Copy</button>
                </div>
                <div className="p-6 overflow-x-auto text-gray-300">
                  <span className="text-pink-400">from</span> aegisclaw.langchain <span className="text-pink-400">import</span> wrap_agent<br/>
                  <span className="text-pink-400">from</span> langchain.agents <span className="text-pink-400">import</span> AgentExecutor<br/><br/>
                  <span className="text-gray-500"># Just wrap your existing executor</span><br/>
                  secure_executor = wrap_agent(<br/>
                  &nbsp;&nbsp;executor=AgentExecutor(...),<br/>
                  &nbsp;&nbsp;proxy_url=<span className="text-green-400">"http://localhost:8000"</span><br/>
                  )<br/><br/>
                  <span className="text-gray-500"># Execution is now protected by AegisClaw</span><br/>
                  secure_executor.invoke({'{'}<span className="text-green-400">"input"</span>: <span className="text-green-400">"Refund $4000"</span>{'}'})
                </div>
              </div>

              {/* LlamaIndex */}
              <div className="glass-card rounded-2xl font-mono text-sm overflow-hidden group relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                  <span className="text-purple-400 font-bold text-xs">LlamaIndex (Python)</span>
                  <button className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Copy</button>
                </div>
                <div className="p-6 overflow-x-auto text-gray-300">
                  <span className="text-pink-400">from</span> aegisclaw.llamaindex <span className="text-pink-400">import</span> wrap_query_engine<br/><br/>
                  <span className="text-gray-500"># Just wrap your query engine</span><br/>
                  secure_engine = wrap_query_engine(<br/>
                  &nbsp;&nbsp;engine=index.as_query_engine(),<br/>
                  &nbsp;&nbsp;proxy_url=<span className="text-green-400">"http://localhost:8000"</span><br/>
                  )<br/><br/>
                  response = secure_engine.query(<span className="text-green-400">"Refund $4000 to user ABCDE1234F"</span>)
                </div>
              </div>

              {/* CrewAI / Next.js */}
              <div className="glass-card rounded-2xl font-mono text-sm overflow-hidden group relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                  <span className="text-blue-400 font-bold text-xs">TypeScript SDK (CrewAI/Next.js)</span>
                  <button className="text-xs text-gray-400 hover:text-white transition-colors font-sans">Copy</button>
                </div>
                <div className="p-6 overflow-x-auto text-gray-300">
                  <span className="text-pink-400">import</span> {'{'} AegisClaw {'}'} <span className="text-pink-400">from</span> <span className="text-green-400">'@aegisclaw/sdk'</span>;<br/><br/>
                  <span className="text-blue-400">const</span> aegis = <span className="text-pink-400">new</span> AegisClaw({'{'}<br/>
                  &nbsp;&nbsp;endpoint: <span className="text-green-400">'http://localhost:8000'</span>,<br/>
                  &nbsp;&nbsp;role: <span className="text-green-400">'customer_servicing_bot'</span><br/>
                  {'}'});<br/><br/>
                  <span className="text-blue-400">const</span> res = <span className="text-purple-400 font-bold">await</span> aegis.fetch(<span className="text-green-400">'https://api.internal/refund'</span>, {'{'}<br/>
                  &nbsp;&nbsp;method: <span className="text-green-400">'POST'</span>,<br/>
                  &nbsp;&nbsp;body: JSON.stringify({'{'} amount: <span className="text-yellow-400">4000</span> {'}'}),<br/>
                  {'}'});
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#006FCF]/20 text-[#00F0FF] flex items-center justify-center mr-4 text-sm font-mono border border-[#006FCF]/30">3</span>
              Monitor the CISO Dashboard
            </h2>
            <p className="text-gray-400 mb-4 font-light leading-relaxed">Open <code className="text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/20">http://localhost:3000</code> to view the Live Traffic Feed, cryptographic Merkle Chain verification, and the Fleet Emergency Stop button.</p>
          </div>
        )}

        {/* Helm Chart */}
        {activeTab === 'helm' && (
          <div className="max-w-4xl animate-fade-in-up pb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-6 uppercase tracking-widest">
              Deployment
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Kubernetes Helm Chart</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
              Deploy the AegisClaw proxy core natively into your Kubernetes cluster using our official Helm chart.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">Installation</h2>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <span className="text-xs text-gray-500 font-sans font-bold">Terminal</span>
              </div>
              <span className="text-gray-500"># Add the AegisClaw Helm repository</span><br/>
              <span className="text-pink-400">helm</span> repo add aegisclaw https://charts.aegisclaw.io<br/>
              <span className="text-pink-400">helm</span> repo update<br/><br/>
              <span className="text-gray-500"># Install the release</span><br/>
              <span className="text-pink-400">helm</span> install aegis-proxy aegisclaw/core-proxy -f values.yaml
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Configuration (values.yaml)</h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">Override the default values to connect to your existing managed Redis and PostgreSQL instances.</p>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <span className="text-xs text-gray-500 font-sans font-bold">values.yaml</span>
              </div>
              <span className="text-purple-400">redis:</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">enabled:</span> <span className="text-orange-400">false</span> <span className="text-gray-500"># Use external Redis</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">url:</span> <span className="text-green-400">"rediss://auth@elasticache.us-east-1.amazonaws.com:6379/0"</span><br/><br/>
              <span className="text-purple-400">postgres:</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">enabled:</span> <span className="text-orange-400">false</span> <span className="text-gray-500"># Use external Aurora/RDS</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">url:</span> <span className="text-green-400">"postgresql://user:pass@aurora-cluster.us-east-1.rds.amazonaws.com:5432/aegis"</span><br/><br/>
              <span className="text-purple-400">proxy:</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">replicaCount:</span> <span className="text-orange-400">3</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">resources:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">limits:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">cpu:</span> <span className="text-green-400">"2000m"</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">memory:</span> <span className="text-green-400">"4Gi"</span><br/>
            </div>
          </div>
        )}

        {/* Docker Compose */}
        {activeTab === 'docker' && (
          <div className="max-w-4xl animate-fade-in-up pb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-semibold mb-6 uppercase tracking-widest">
              Deployment
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Docker Compose</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
              The fastest way to spin up the entire AegisClaw stack locally or on a single EC2 instance.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">Environment Variables</h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">Create a `.env` file in the root directory. This contains your external LLM API keys. AegisClaw handles all routing.</p>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <span className="text-white font-bold">OPENAI_API_KEY</span>=<span className="text-green-400">sk-proj-...</span><br/>
              <span className="text-white font-bold">ANTHROPIC_API_KEY</span>=<span className="text-green-400">sk-ant-...</span><br/>
              <span className="text-white font-bold">JWT_SECRET</span>=<span className="text-green-400">super_secure_random_string</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">docker-compose.yml Reference</h2>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <span className="text-purple-400">services:</span><br/>
              &nbsp;&nbsp;<span className="text-purple-400">proxy:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">image:</span> <span className="text-green-400">agisclaw-proxy:latest</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">ports:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-green-400">"8000:8000"</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">env_file:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-green-400">.env</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">depends_on:</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-green-400">redis</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-green-400">postgres</span><br/>
            </div>
          </div>
        )}

        {/* Cedar Policy Syntax */}
        {activeTab === 'cedar' && (
          <div className="max-w-4xl animate-fade-in-up pb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-6 uppercase tracking-widest">
              Core Concept
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Cedar Policy Syntax</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
              AegisClaw uses AWS Cedar, an open-source policy language, to enforce strict Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) on agent executions.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">The Core Triad</h2>
            <ul className="text-gray-400 mb-8 font-light leading-relaxed list-disc pl-6 space-y-2">
              <li><strong className="text-white">Principal:</strong> Who is taking the action? (e.g., `Role::"SupportAgent"`)</li>
              <li><strong className="text-white">Action:</strong> What are they trying to do? (e.g., `Action::"Read_Customer_Data"`)</li>
              <li><strong className="text-white">Resource:</strong> What is being acted upon? (e.g., `Endpoint::"/api/v1/customers/*"`)</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-6">Example: RBI Financial Guardrail</h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">This policy expressly forbids any agent from executing a "Write" action on Core Banking systems, fulfilling RBI eMRM zero-trust execution boundaries.</p>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <span className="text-blue-400 font-bold">forbid</span>(<br/>
              &nbsp;&nbsp;principal,<br/>
              &nbsp;&nbsp;action,<br/>
              &nbsp;&nbsp;resource == Resource::<span className="text-green-400">"CoreBanking_Write"</span><br/>
              );<br/><br/>
              <span className="text-gray-500">// Allow customer service bots to READ data ONLY if they are not flagged</span><br/>
              <span className="text-blue-400 font-bold">permit</span>(<br/>
              &nbsp;&nbsp;principal <span className="text-blue-400 font-bold">in</span> Role::<span className="text-green-400">"CustomerServiceAgent"</span>,<br/>
              &nbsp;&nbsp;action == Action::<span className="text-green-400">"Read_Account"</span>,<br/>
              &nbsp;&nbsp;resource<br/>
              ) <span className="text-blue-400 font-bold">when</span> {'{'} <br/>
              &nbsp;&nbsp;principal.risk_score {'<'} <span className="text-orange-400">75</span><br/>
              {'}'};
            </div>
          </div>
        )}

        {/* Python SDK */}
        {activeTab === 'python' && (
          <div className="max-w-4xl animate-fade-in-up pb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#006FCF]/10 border border-[#006FCF]/30 text-[#006FCF] text-xs font-semibold mb-6 uppercase tracking-widest">
              SDK
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Python SDK</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
              Native integration for Python applications. Perfect for wrapping standalone scripts or custom multi-agent orchestration loops.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">Installation</h2>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <span className="text-pink-400">pip</span> install aegisclaw
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Using the Client</h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">Instead of using `requests` directly, use the `AegisClawClient`. It automatically intercepts requests and routes them through the local proxy.</p>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <span className="text-pink-400">from</span> aegisclaw <span className="text-pink-400">import</span> AegisClawClient<br/><br/>
              client = AegisClawClient(<br/>
              &nbsp;&nbsp;proxy_url=<span className="text-green-400">"http://localhost:8000"</span>,<br/>
              &nbsp;&nbsp;agent_role=<span className="text-green-400">"FinancialAgent"</span>,<br/>
              &nbsp;&nbsp;token=<span className="text-green-400">"your-jwt-token"</span><br/>
              )<br/><br/>
              <span className="text-gray-500"># This request is now protected by Prompt Guard, Cedar Policies, and Presidio</span><br/>
              response = client.post(<br/>
              &nbsp;&nbsp;url=<span className="text-green-400">"https://api.internal/transactions/refund"</span>,<br/>
              &nbsp;&nbsp;json={'{'}<span className="text-green-400">"amount"</span>: <span className="text-orange-400">500</span>, <span className="text-green-400">"user_id"</span>: <span className="text-green-400">"123"</span>{'}'}<br/>
              )<br/><br/>
              <span className="text-pink-400">print</span>(response.json())
            </div>
          </div>
        )}

        {/* TypeScript SDK */}
        {activeTab === 'typescript' && (
          <div className="max-w-4xl animate-fade-in-up pb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 uppercase tracking-widest">
              SDK
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">TypeScript SDK</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
              Easily secure outbound tool calls in Next.js, Express, or Node.js multi-agent architectures.
            </p>

            <h2 className="text-2xl font-bold text-white mb-6">Installation</h2>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <span className="text-pink-400">npm</span> install @aegisclaw/sdk
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Usage</h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">Initialize the client and use the `fetch` method. It is a drop-in replacement for the native Node `fetch`.</p>
            <div className="glass-card rounded-2xl p-6 font-mono text-sm mb-12 overflow-x-auto relative group">
              <span className="text-pink-400">import</span> {'{'} AegisClaw {'}'} <span className="text-pink-400">from</span> <span className="text-green-400">'@aegisclaw/sdk'</span>;<br/><br/>
              <span className="text-blue-400">const</span> aegis = <span className="text-pink-400">new</span> AegisClaw({'{'}<br/>
              &nbsp;&nbsp;endpoint: <span className="text-green-400">'http://localhost:8000'</span>,<br/>
              &nbsp;&nbsp;role: <span className="text-green-400">'customer_servicing_bot'</span>,<br/>
              &nbsp;&nbsp;apiKey: process.env.AEGIS_TOKEN<br/>
              {'}'});<br/><br/>
              <span className="text-gray-500">// If this breaches a Cedar policy or trips a velocity cap, it throws an AegisError</span><br/>
              <span className="text-blue-400">const</span> res = <span className="text-purple-400 font-bold">await</span> aegis.fetch(<span className="text-green-400">'https://api.internal/refund'</span>, {'{'}<br/>
              &nbsp;&nbsp;method: <span className="text-green-400">'POST'</span>,<br/>
              &nbsp;&nbsp;body: JSON.stringify({'{'} amount: <span className="text-orange-400">4000</span> {'}'}),<br/>
              {'}'});<br/><br/>
              <span className="text-blue-400">const</span> data = <span className="text-purple-400 font-bold">await</span> res.json();
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
