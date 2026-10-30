import { useRef, useState } from 'react';
import {
  AlertIcon,
  ImageIcon,
  SpinnerIcon,
  SparklesIcon,
  UploadIcon,
  XIcon,
} from './icons.jsx';

const MAX_BRAND_LENGTH = 80;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function InputPanel({
  file,
  previewUrl,
  brand,
  onFileSelect,
  onRemoveFile,
  onBrandChange,
  onSubmit,
  isGenerating,
  canGenerate,
  inputError,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const errorId = 'input-error';
  const brandId = 'brand-name';

  const openPicker = () => {
    if (!isGenerating) inputRef.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (isGenerating) return;
    const dropped = event.dataTransfer?.files?.[0];
    if (dropped) onFileSelect(dropped);
  };

  return (
    <section className="panel flex flex-col gap-6 p-6" aria-labelledby="input-panel-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="input-panel-title" className="text-xl font-semibold text-slate-100">
            Product input
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            One clear photo and your brand name. That&apos;s all we need.
          </p>
        </div>
        <span className="rounded-md border border-teal-500/40 bg-teal-400/10 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-teal-300">
          Step 1
        </span>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="product-image" className="text-sm font-medium text-slate-300">
            Product photo
          </label>
          <span className="font-mono text-[11px] text-slate-500">Required</span>
        </div>

        <input
          ref={inputRef}
          id="product-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) onFileSelect(selected);
            event.target.value = '';
          }}
          disabled={isGenerating}
        />

        {file && previewUrl ? (
          <div className="overflow-hidden rounded-lg border border-line bg-base">
            <div className="relative flex max-h-72 min-h-48 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(51,65,85,0.35),transparent_70%)] p-3">
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                className="max-h-64 w-auto rounded-md object-contain"
              />
              <button
                type="button"
                onClick={onRemoveFile}
                disabled={isGenerating}
                className="focus-ring absolute right-3 top-3 rounded-md border border-line bg-slate-900/80 p-1.5 text-slate-300 backdrop-blur transition-colors hover:border-rose-400/60 hover:text-rose-300 disabled:opacity-40"
                aria-label="Remove image"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
              <div className="flex min-w-0 items-center gap-2 text-sm text-slate-300">
                <ImageIcon className="h-4 w-4 shrink-0 text-teal-400" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 font-mono text-[11px] text-slate-500">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={openPicker}
                disabled={isGenerating}
                className="focus-ring shrink-0 rounded-md px-2 py-1 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200 disabled:opacity-40"
              >
                Replace
              </button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={isGenerating ? -1 : 0}
            aria-disabled={isGenerating}
            aria-label="Upload a product photo"
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPicker();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isGenerating) setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`focus-ring flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center transition-all ${
              isDragging
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-slate-700 bg-base/40 hover:border-indigo-500/60 hover:bg-indigo-500/5'
            } ${isGenerating ? 'pointer-events-none opacity-50' : ''}`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                  : 'border-line bg-surface text-slate-400'
              }`}
            >
              <UploadIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-200">
                {isDragging ? 'Drop it right here' : 'Drag & drop your product photo'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                or <span className="text-indigo-400 underline-offset-2 hover:underline">browse files</span>
              </p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-600">
              JPG · PNG · WEBP · max 10 MB
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor={brandId} className="text-sm font-medium text-slate-300">
            Brand name
          </label>
          <span className="font-mono text-[11px] text-slate-500">
            {brand.length}/{MAX_BRAND_LENGTH}
          </span>
        </div>
        <input
          id={brandId}
          type="text"
          value={brand}
          onChange={(event) => onBrandChange(event.target.value)}
          maxLength={MAX_BRAND_LENGTH}
          placeholder="e.g. Northwind Studio"
          disabled={isGenerating}
          autoComplete="organization"
          aria-invalid={Boolean(inputError && !brand.trim())}
          aria-describedby={inputError ? errorId : 'brand-hint'}
          className="focus-ring w-full rounded-md border border-line bg-base px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors hover:border-slate-600 focus:border-indigo-500 disabled:opacity-50"
        />
        <p id="brand-hint" className="mt-2 text-xs text-slate-500">
          Used in the copy so it sounds like your store. No other details are invented.
        </p>
      </div>

      {inputError ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          {inputError}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canGenerate}
        className="btn-primary w-full py-3"
      >
        {isGenerating ? (
          <>
            <SpinnerIcon className="h-4 w-4 animate-spin" />
            Writing your description…
          </>
        ) : (
          <>
            <SparklesIcon className="h-4 w-4" />
            Generate description
          </>
        )}
      </button>
    </section>
  );
}
