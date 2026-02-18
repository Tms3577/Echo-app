import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const EchoSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{tag: string, vibe: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
        
        // Property access to .text directly, no method call
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
  }, [query]);

  return (
    <div className="relative group">
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
          placeholder="Echo abstract moods (e.g., 'cyber silence')"
          className="w-full h-14 bg-[#050505] glass-card rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#00f2ff]/30 transition-all placeholder:text-zinc-700 tracking-tight"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-16 left-0 right-0 glass-card rounded-3xl overflow-hidden z-20 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
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
  );
};

export default EchoSearch;