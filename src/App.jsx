import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import QuickPresets from './components/QuickPresets';
import ConfigurationForm from './components/ConfigurationForm';
import ResultsPanel from './components/ResultsPanel';
import SettingsModal from './components/SettingsModal';
import { generateProductDescription } from './services/geminiService';
import { Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState('image/jpeg');

  const [brandName, setBrandName] = useState('');
  const [tone, setTone] = useState('persuasive');
  const [audience, setAudience] = useState('general');
  const [highlights, setHighlights] = useState('');
  const [keywords, setKeywords] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('backend_api_url') || import.meta.env.VITE_BACKEND_API_URL || '';
  });

  const [forceMock, setForceMock] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    showToast('Gemini API key saved to browser session.');
  };

  const handleSaveBackendUrl = (url) => {
    setBackendUrl(url);
    localStorage.setItem('backend_api_url', url);
    showToast('Backend endpoint URL updated.');
  };

  const handleImageSelect = (file, dataUrl) => {
    setImageFile(file);
    setImagePreview(dataUrl);

    if (dataUrl && dataUrl.startsWith('data:')) {
      const mime = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
      const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
      setImageMimeType(mime);
      setImageBase64(base64);
    }
  };

  const handleImageClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleSelectPreset = (preset) => {
    setImagePreview(preset.imageUrl);
    setBrandName(preset.brandName);
    setTone(preset.tone);
    setAudience(preset.audience);
    setHighlights(preset.highlights);
    setKeywords(preset.keywords);
    setPipelineResult(preset.mockResult);

    fetch(preset.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          if (dataUrl && dataUrl.startsWith('data:')) {
            const mime = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
            const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
            setImageMimeType(mime);
            setImageBase64(base64);
            setImageFile(new File([blob], `${preset.id}.jpg`, { type: mime }));
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {});

    showToast(`Loaded preset: ${preset.name} (${preset.brandName})`);
  };

  const handleGenerate = async () => {
    if (!brandName.trim()) {
      showToast('Please enter a Brand Name.');
      return;
    }

    setIsLoading(true);
    setPipelineResult(null);
    setCurrentStage({
      stage: 1,
      label: "Stage 1: Primary Draft Generator",
      detail: "Synthesizing creative hooks and sales angles..."
    });

    try {
      const generated = await generateProductDescription({
        imageBase64,
        imageMimeType,
        imageFile,
        brandName: brandName.trim(),
        tone,
        audience,
        highlights,
        keywords,
        apiKey,
        backendUrl,
        forceMock,
        onStageChange: (stageInfo) => {
          setCurrentStage(stageInfo);
        }
      });

      setPipelineResult(generated);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b'],
      });
      showToast('Two-stage generation complete! Evaluated for anti-hallucination.');
    } catch (err) {
      console.error('Generation error:', err);
      showToast(`Error: ${err.message || 'Failed to generate copy'}`);
    } finally {
      setIsLoading(false);
      setCurrentStage(null);
    }
  };

  const handleUpdateFinalOutput = (updatedFinal) => {
    if (pipelineResult) {
      setPipelineResult({
        ...pipelineResult,
        finalOutput: updatedFinal,
      });
      showToast('Edits successfully saved to final output!');
    }
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to trigger generate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (brandName.trim() && !isLoading) {
          handleGenerate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [brandName, isLoading, imageBase64, tone, audience, highlights, keywords]);

  const canSubmit = Boolean(brandName.trim());

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeMode={forceMock ? 'demo' : apiKey ? 'gemini' : backendUrl ? 'backend' : 'demo'}
        apiKey={apiKey}
        backendUrl={backendUrl}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Hackathon Hero Banner with Anti-Hallucination Architecture Callout */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                In-Loop Evaluator Architecture
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Anti-Hallucination Grounding
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI Product Description Writer & Critic Loop
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Stage 1 drafts persuasive sales copy; an In-Loop LLM Evaluator audits claims against product photos to eliminate hallucinations before final delivery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Configure AI & API
            </button>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form & Upload (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-[#0E1320]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
              {/* Preset Shortcuts */}
              <QuickPresets
                onSelectPreset={handleSelectPreset}
                currentBrand={brandName}
              />

              {/* Photo Uploader */}
              <ImageUploader
                imageFile={imageFile}
                imagePreview={imagePreview}
                onImageSelect={handleImageSelect}
                onImageClear={handleImageClear}
              />

              {/* Configuration Form */}
              <ConfigurationForm
                brandName={brandName}
                setBrandName={setBrandName}
                tone={tone}
                setTone={setTone}
                audience={audience}
                setAudience={setAudience}
                highlights={highlights}
                setHighlights={setHighlights}
                keywords={keywords}
                setKeywords={setKeywords}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                canSubmit={canSubmit}
              />
            </div>
          </div>

          {/* Right Column: Results & Evaluator Panel (7 Cols) */}
          <div className="lg:col-span-7">
            <ResultsPanel
              pipelineResult={pipelineResult}
              onUpdateFinalOutput={handleUpdateFinalOutput}
              brandName={brandName}
              tone={tone}
              isLoading={isLoading}
              currentStage={currentStage}
              onRegenerate={handleGenerate}
            />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        backendUrl={backendUrl}
        onSaveBackendUrl={handleSaveBackendUrl}
        forceMock={forceMock}
        onToggleForceMock={setForceMock}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-indigo-500/40 text-slate-100 text-xs font-medium shadow-2xl shadow-black/80 flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A11] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CurioCET • TCS HackMatrix AI Studio Prototype</span>
          <span>In-Loop Anti-Hallucination Pipeline • Evaluator & Grounding Engine</span>
        </div>
      </footer>
    </div>
  );
}
