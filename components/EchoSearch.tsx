
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { User } from '../types';

interface EchoSearchProps {
  users?: User[];
  onUserSelect?: (user: User) => void;
}

const EchoSearch: React.FC<EchoSearchProps> = ({ users = [], onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{tag: string, vibe: string}[]>([]);
  const [userResults, setUserResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setUserResults([]);
      return;
    }

    // Local User Search
    const lowerQuery = query.toLowerCase().replace('@', '');
    const foundUsers = users.filter(u => 
      u.username.toLowerCase().includes(lowerQuery) || 
      u.displayName.toLowerCase().includes(lowerQuery)
    );
    setUserResults(foundUsers);

    // AI Vibe Search (Debounced)
    const timer = setTimeout(async () => {
      // Only search AI if the query is abstract or not finding many users
      if (foundUsers.length > 0 && query.startsWith('@')) return; 

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Act as a vibe-curator for a high-tech obsidian-minimalist social app. Interpret this search query: "${query}". Return 5 futuristic hashtags and a 2-word 'vibe' description for each. Query could be abstract like 'cold neon' or 'lost in the grid'.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                results: {
                  type: Type.ARRAY,
                  items: { 
                    type: Type.OBJECT,
                    properties: {
                      tag: { type: Type.STRING },
                      vibe: { type: Type.STRING }
                    },
                    required: ["tag", "vibe"]
                  }
                }
              },
              required: ["results"]
            }
          }
        });
        
        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const data = JSON.parse(jsonStr);
          setSuggestions(data.results || []);
        }
      } catch (err) {
        console.error("Vibe Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [query, users]);

  return (
    <div className="relative group z-50">
      <div className="relative flex items-center">
        <div className={`absolute left-4 transition-colors duration-500 ${loading ? 'text-[#00f2ff]' : 'text-zinc-600'}`}>
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-[#00f2ff] rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Lookup nodes or abstract moods..."
          className="w-full h-14 bg-[#050505] glass-card rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#00f2ff]/30 transition-all placeholder:text-zinc-700 tracking-tight"
        />
      </div>

      {(suggestions.length > 0 || userResults.length > 0) && (
        <div className="absolute top-16 left-0 right-0 glass-card rounded-3xl overflow-hidden z-20 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 max-h-[60vh] overflow-y-auto no-scrollbar bg-[#050505]/90 backdrop-blur-xl">
          
          {/* User Results */}
          {userResults.length > 0 && (
            <div>
              <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <p className="text-[10px] text-[#00f2ff] font-black uppercase tracking-[0.3em] px-2">Nodes Identified</p>
                <span className="text-[8px] text-zinc-600 font-mono">SCAN_COMPLETE</span>
              </div>
              {userResults.map((user) => (
                <button 
                  key={user.id}
                  className="w-full text-left px-5 py-4 hover:bg-[#00f2ff]/5 transition-all border-b border-white/5 last:border-0 group flex items-center justify-between relative overflow-hidden"
                  onClick={() => {
                    if (onUserSelect) onUserSelect(user);
                    setQuery('');
                  }}
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#00f2ff] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={user.avatar} alt="" className="w-10 h-10 rounded-xl border border-white/10 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00f2ff] rounded-full border-2 border-[#050505] shadow-[0_0_8px_#00f2ff]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white group-hover:text-[#00f2ff] transition-colors">{user.displayName}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 font-mono">LVL_{Math.floor(Math.random() * 99)}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">@{user.username}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-[#00f2ff]' : 'bg-zinc-800'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <span className="text-[8px] text-zinc-700 font-mono uppercase">Signal_Strong</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Vibe Results */}
          {suggestions.length > 0 && (
            <div>
              <div className="p-3 border-b border-white/5 bg-white/5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] px-2">Resonance Detected</p>
              </div>
              {suggestions.map((res, idx) => (
                <button 
                  key={idx}
                  className="w-full text-left px-5 py-4 hover:bg-white/10 transition-all border-b border-white/5 last:border-0 group flex items-center justify-between"
                  onClick={() => setQuery(res.tag)}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white group-hover:text-[#00f2ff] transition-colors">#{res.tag}</span>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{res.vibe}</span>
                  </div>
                  <svg className="w-4 h-4 text-zinc-800 group-hover:text-[#00f2ff] transform translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EchoSearch;
