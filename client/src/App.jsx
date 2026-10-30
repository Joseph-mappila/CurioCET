import { useCallback, useEffect, useRef, useState } from 'react';
import InputPanel from './components/InputPanel.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import { SparklesIcon } from './components/icons.jsx';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const REQUEST_TIMEOUT_MS = 90_000;

function validateImage(file) {
  if (!file) return 'Choose a product photo to get started.';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Unsupported file type. Please upload a JPG, PNG, or WEBP image.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'That image is too large. Please use a file under 10 MB.';
  }
  return '';
}

function fileKey(file) {
  return file ? `${file.name}:${file.size}:${file.lastModified}` : '';
}

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState('empty');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState('');
  const previewUrlRef = useRef('');
  const abortRef = useRef(null);

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (abortRef.current) abortRef.current.abort();
    },
    [],
  );

  const handleFileSelect = useCallback(
    (nextFile) => {
      const message = validateImage(nextFile);
      if (message) {
        setInputError(message);
        return;
      }
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(nextFile);
      setPreviewUrl(url);
      setFile(nextFile);
      setInputError('');
      setError(null);
      setStatus((prev) => (prev === 'error' ? 'empty' : prev));
    },
    [],
  );

  const handleRemoveFile = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    setPreviewUrl('');
    setFile(null);
    setInputError('');
    setStatus((prev) => (prev === 'error' ? 'empty' : prev));
  }, []);

  const handleBrandChange = useCallback((value) => {
    setBrand(value);
    setInputError('');
    setError(null);
    setStatus((prev) => (prev === 'error' ? 'empty' : prev));
  }, []);

  const generate = useCallback(async () => {
    if (status === 'generating') return;

    const imageError = validateImage(file);
    const brandError = brand.trim() ? '' : 'Add your brand name so the copy sounds like you.';

    if (imageError || brandError) {
      setInputError(imageError || brandError);
      setError(null);
      setStatus(result ? 'success' : 'empty');
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS);

    setStatus('generating');
    setError(null);
    setInputError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('brand', brand.trim());

      const response = await fetch('/api/generate-description', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = Array.isArray(payload?.detail)
          ? payload.detail.map((item) => item?.msg).filter(Boolean).join(' ')
          : payload?.detail;
        throw new Error(
          detail ||
            (response.status === 413
              ? 'The image is too large for the server.'
              : 'The description service returned an unexpected response.'),
        );
      }

      if (!payload?.title || !payload?.description || !Array.isArray(payload?.benefits)) {
        throw new Error('The description came back incomplete. Please try again.');
      }

      setResult({
        title: payload.title,
        description: payload.description,
        benefits: payload.benefits
          .filter((item) => typeof item === 'string' && item.trim())
          .map((item) => item.trim()),
        brand: brand.trim(),
        imageKey: fileKey(file),
      });
      setStatus('success');
    } catch (err) {
      const timedOut =
        controller.signal.aborted && controller.signal.reason === 'timeout';
      const abortedByUser = controller.signal.aborted && !timedOut;
      if (abortedByUser) return;

      const networkError = !timedOut && err instanceof TypeError;
      const message = timedOut
        ? 'The request took too long. Check your connection and try again.'
        : networkError
          ? 'Could not reach the description service. Is the backend running?'
          : err?.message || 'Something went wrong while generating your copy.';

      setError({ title: timedOut ? 'Request timed out' : 'Generation failed', message });
      setStatus(result ? 'success' : 'error');
    } finally {
      clearTimeout(timeout);
    }
  }, [brand, file, result, status]);

  const canGenerate = Boolean(file && brand.trim()) && status !== 'generating';
  const isStale =
    Boolean(result) &&
    (result.brand !== brand.trim() || result.imageKey !== fileKey(file));

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-400">
                CurioCET
              </p>
              <h1 className="text-lg font-semibold text-slate-100">AI Product Description Writer</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-line bg-surface/60 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            <span className="font-mono text-xs text-slate-400">Gemini 2.5 Flash</span>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <InputPanel
            file={file}
            previewUrl={previewUrl}
            brand={brand}
            onFileSelect={handleFileSelect}
            onRemoveFile={handleRemoveFile}
            onBrandChange={handleBrandChange}
            onSubmit={generate}
            isGenerating={status === 'generating'}
            canGenerate={canGenerate}
            inputError={inputError}
          />
          <ResultsPanel
            status={status}
            result={result}
            error={error}
            onDismissError={() => setError(null)}
            onRegenerate={generate}
            canRegenerate={canGenerate}
            brand={result?.brand ?? brand.trim()}
            isStale={isStale}
          />
        </main>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-line/70 pt-4 text-xs text-slate-500 sm:flex-row">
          <p>
            Descriptions are grounded in the uploaded photo and brand name — no invented specs.
          </p>
          <p className="font-mono">JPG · PNG · WEBP — up to 10 MB</p>
        </footer>
      </div>
    </div>
  );
}
