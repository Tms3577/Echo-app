import React, { useState, useEffect } from 'react';

interface UploadViewProps {
  onUploadComplete: (caption: string, media: string) => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onUploadComplete }) => {
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('READY FOR INPUT');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setStatusText('SIGNAL DETECTED');
    }
  };

  const handleUpload = () => {
    if (!preview) return;
    setIsUploading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setStatusText('ECHO RELEASED');
        setTimeout(() => onUploadComplete(caption, preview), 800);
      } else if (currentProgress > 70) {
        setStatusText('SYNDICATE HANDSHAKE');
      } else if (currentProgress > 30) {
        setStatusText('CALIBRATING RESONANCE');
      } else {
        setStatusText('ENCRYPTING PAYLOAD');
      }
      setProgress(currentProgress);
    }, 250);
  };

  return (
    <div className="max-w-2xl mx-auto pt-6 pb-24 px-4 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-3xl font-black tracking-tighter text-white">New Echo</h2>
          <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">{statusText}</span>
        </div>
        
        <div className="aspect-[4/5] w-full glass-card rounded-[2.5rem] border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700 hover:border-[#00f2ff]/30">
          {preview ? (
            <>
              <img src={preview} alt="Preview" className={`w-full h-full object-cover transition-all duration-1000 ${isUploading ? 'scale-110 grayscale blur-sm' : ''}`} />
              {!isUploading && (
                <button 
                  onClick={() => setPreview(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-black/60 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-black transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-10 backdrop-blur-sm">
                   <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-[#00f2ff] shadow-[0_0_15px_#00f2ff] transition-all duration-300" 
                        style={{ width: `${progress}%` }} 
                      />
                   </div>
                   <p className="mt-4 text-[10px] font-black text-[#00f2ff] tracking-[0.4em] uppercase">{Math.round(progress)}% TRANSMITTED</p>
                </div>
              )}
            </>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-6 p-10 text-center group w-full h-full justify-center">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 group-hover:border-[#00f2ff]/50 group-hover:bg-[#00f2ff]/5 transition-all duration-700 shadow-inner">
                <svg className="w-10 h-10 text-zinc-600 group-hover:text-[#00f2ff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-300 font-black uppercase tracking-[0.3em] text-[10px]">Initialize Transmission</p>
                <p className="text-zinc-700 text-[9px] uppercase tracking-widest font-bold">Supported Formats: RAW, HEIF, PNG</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>

        <div className="space-y-6">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isUploading}
            placeholder="Document the resonance..."
            className="w-full bg-white/5 glass-card rounded-3xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f2ff]/30 transition-all min-h-[140px] placeholder:text-zinc-800 resize-none font-medium leading-relaxed"
          />
          
          <button
            onClick={handleUpload}
            disabled={!preview || isUploading}
            className={`w-full h-16 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase transition-all shadow-2xl flex items-center justify-center gap-4 group ${
              preview && !isUploading 
              ? 'bg-[#00f2ff] text-black shadow-[0_0_25px_rgba(0,242,255,0.4)] hover:shadow-[0_0_40px_rgba(0,242,255,0.6)]' 
              : 'bg-zinc-900 text-zinc-700'
            }`}
          >
            {isUploading ? (
              <span className="animate-pulse">DECRYPTING SYNDICATE CHANNEL...</span>
            ) : (
              <>
                RELEASE INTO THE VOID
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadView;