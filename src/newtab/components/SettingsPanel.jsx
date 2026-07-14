import React, { useState, useRef } from 'react';
import { Settings, Image as ImageIcon, X, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';

export default function SettingsPanel({ isLight, onWallpaperChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Create an image object to read the file
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      // Create a canvas for compression
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions (cap at 1920px wide)
      const MAX_WIDTH = 1920;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the resized image to the canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Compress to JPEG (0.8 quality)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Save to chrome storage
      chrome.storage.local.set({ custom_wallpaper: compressedDataUrl }, () => {
        onWallpaperChange(compressedDataUrl);
        setIsProcessing(false);
      });

      // Cleanup
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const handleReset = () => {
    chrome.storage.local.remove(['custom_wallpaper'], () => {
      onWallpaperChange(null);
    });
  };

  return (
    <>
      {/* Floating Settings Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95 ${
          isLight ? 'bg-white/50 text-black/80 hover:bg-white/80' : 'bg-black/50 text-white/80 hover:bg-black/80'
        }`}
      >
        <Settings size={24} />
      </button>

      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className={`relative overflow-hidden p-6 flex flex-col gap-6 rounded-3xl border ${isLight ? 'bg-white/90 text-black border-black/10' : 'bg-[#1a1a1a]/90 text-white border-white/10'}`}>
                
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Settings size={22} className={isLight ? "text-blue-500" : "text-teal-400"} />
                    Dashboard Settings
                  </h2>
                  <button onClick={() => setIsOpen(false)} className={`p-1 rounded-full ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}>
                    <X size={20} />
                  </button>
                </div>

                {/* Wallpaper Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-lg">Custom Wallpaper</h3>
                    <p className={`text-sm ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                      Upload an image to replace the default animated background. It will be compressed locally to save space.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                        isLight ? 'bg-blue-50 hover:bg-blue-100 text-blue-600' : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-400'
                      }`}
                    >
                      <ImageIcon size={18} />
                      {isProcessing ? 'Processing...' : 'Upload Image'}
                    </button>

                    <button 
                      onClick={handleReset}
                      className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                        isLight ? 'bg-black/5 hover:bg-black/10 text-black/70' : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                      title="Reset to default background"
                    >
                      <RefreshCcw size={18} />
                    </button>
                  </div>
                </div>

              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
