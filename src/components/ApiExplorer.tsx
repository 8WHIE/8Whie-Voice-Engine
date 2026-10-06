/**
 * 8WHIE VoiceForge - REST API Explorer & Interactive Docs
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useState } from 'react';
import { Code2, Play, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

interface EndpointDoc {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  description: string;
  defaultPayload?: any;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    method: 'POST',
    path: '/api/tts/generate',
    description: 'Synthesize multilingual speech with acoustic and expressive controls',
    defaultPayload: {
      text: '8WHIE VoiceForge produces high quality speech for ₹1,499 per year.',
      voiceId: '8whie-aryan',
      language: 'en',
      speed: 1.0,
      pitch: 0.0,
      volume: 1.0,
      expressiveIntensity: 0.85,
      sampleRate: 24000,
      outputFormat: 'wav',
      applyTextNormalization: true,
    },
  },
  {
    method: 'POST',
    path: '/api/voices/design',
    description: 'Synthesize custom synthetic speaker from natural language description',
    defaultPayload: {
      prompt: 'Young adult female, warm conversational voice, medium pitch, Indian English accent, calm delivery.',
      sampleText: 'Welcome to 8WHIE VoiceForge.',
      targetLanguage: 'en',
    },
  },
  {
    method: 'POST',
    path: '/api/normalize',
    description: 'Inspect text normalization rules (currency ₹, numbers, brand 8WHIE)',
    defaultPayload: {
      text: '8WHIE costs ₹1,499 on https://8whie.org with 50% discount.',
      language: 'en',
    },
  },
  {
    method: 'GET',
    path: '/api/voices',
    description: 'List all available core and custom voice profiles',
  },
  {
    method: 'GET',
    path: '/api/health',
    description: 'System diagnostics, model adapter state, and supported languages',
  },
];

export const ApiExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(ENDPOINTS[0].defaultPayload, null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSnippetLang, setActiveSnippetLang] = useState<'curl' | 'python' | 'javascript'>('curl');

  const handleSelectEndpoint = (ep: EndpointDoc) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultPayload ? JSON.stringify(ep.defaultPayload, null, 2) : '');
    setResponseOutput('');
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setResponseOutput('Executing request...');

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(selectedEndpoint.path, options);
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseOutput(`Execution Error: ${err.message || err}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const generateCurl = () => {
    if (selectedEndpoint.method === 'GET') {
      return `curl -X GET "${window.location.origin}${selectedEndpoint.path}" \\
  -H "Accept: application/json"`;
    }
    return `curl -X POST "${window.location.origin}${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n\s*/g, '')}'`;
  };

  const generatePython = () => {
    return `import requests

url = "${window.location.origin}${selectedEndpoint.path}"
headers = {"Content-Type": "application/json"}
payload = ${requestBody || '{}'}

response = requests.${selectedEndpoint.method.toLowerCase()}(url, json=payload if payload else None, headers=headers)
print(response.json())
`;
  };

  const generateJs = () => {
    return `const response = await fetch('${window.location.origin}${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: { 'Content-Type': 'application/json' },
  ${selectedEndpoint.method !== 'GET' ? `body: JSON.stringify(${requestBody || '{}'})` : ''}
});
const data = await response.json();
console.log(data);`;
  };

  const currentSnippet =
    activeSnippetLang === 'curl'
      ? generateCurl()
      : activeSnippetLang === 'python'
      ? generatePython()
      : generateJs();

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>8WHIE REST API & Developer Explorer</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            OpenAPI v3 Ready
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Programmatically synthesize speech, stream audio chunks, design synthetic personas, and normalize text via REST endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Endpoint List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-300 mb-2 px-1">Endpoints:</div>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
            return (
              <div
                key={`${ep.method}-${ep.path}`}
                onClick={() => handleSelectEndpoint(ep)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      ep.method === 'POST'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                        : ep.method === 'GET'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : 'bg-red-950 text-red-300 border border-red-800/40'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-medium truncate">{ep.path}</span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{ep.description}</div>
              </div>
            );
          })}
        </div>

        {/* Right: Request & Response Inspector (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Endpoint Info & Execute */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-xs font-bold text-white">{selectedEndpoint.path}</span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Body Editor (if not GET) */}
            {selectedEndpoint.method !== 'GET' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">JSON Body Payload:</label>
                <textarea
                  rows={7}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Response Console */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400 font-mono">Response Output:</label>
                {responseOutput && (
                  <span className="text-[10px] text-emerald-400 font-mono">HTTP 200 OK</span>
                )}
              </div>
              <pre className="w-full max-h-64 overflow-y-auto rounded-lg bg-slate-950 border border-slate-800 p-3 text-[11px] font-mono text-slate-200 leading-relaxed">
                {responseOutput || '// Click "Send Request" to execute endpoint and view live response'}
              </pre>
            </div>
          </div>

          {/* Code Snippets Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">Client Code Snippet:</span>
              </div>

              <div className="flex items-center gap-1.5">
                {(['curl', 'python', 'javascript'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveSnippetLang(lang)}
                    className={`px-2 py-0.5 rounded text-[11px] uppercase font-mono font-medium transition-colors ${
                      activeSnippetLang === lang
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-950'
                    }`}
                  >
                    {lang}
                  </button>
                ))}

                <button
                  onClick={handleCopySnippet}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs ml-1"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {currentSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
