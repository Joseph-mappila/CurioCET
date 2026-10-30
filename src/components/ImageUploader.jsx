import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, X, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ImageUploader({ imageFile, imagePreview, onImageSelect, onImageClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Global paste handler for quick copy-pasting images
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, or HEIC).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Camera integration
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Could not access camera. Please check camera permissions or upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      onImageSelect(file, dataUrl);
      stopCamera();
    }, 'image/jpeg');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>Product Photo</span>
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-normal">
            Required for Vision AI
          </span>
        </label>
        {!imagePreview && !isCameraActive && (
          <button
            type="button"
            onClick={startCamera}
            className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Use Webcam</span>
          </button>
        )}
      </div>

      {/* Camera Live View */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 bg-slate-900 shadow-xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
            onLoadedMetadata={() => videoRef.current?.play()}
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Box or Preview */}
      {!isCameraActive && (
        <>
          {imagePreview ? (
            <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/60 p-2">
              <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 justify-between">
                  <span className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Multimodal Vision Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur-sm transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Replace
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={onImageClear}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-red-500/80 border border-slate-700 shadow-lg transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                  : 'border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/60'
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Drag & drop your product photo here
              </p>
              <p className="text-xs text-slate-400 mb-3">
                or click to browse files, or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">Ctrl+V</kbd> to paste
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 text-[11px] text-slate-400 border border-slate-700/50">
                Supports PNG, JPG, WEBP • Auto-compressed for Gemini Vision
              </span>
            </div>
          )}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
