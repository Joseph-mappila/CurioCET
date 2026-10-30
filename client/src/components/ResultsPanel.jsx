import { useEffect, useRef, useState } from 'react';
import {
  AlertIcon,
  CheckIcon,
  CopyIcon,
  ImageIcon,
  RefreshIcon,
  SparklesIcon,
  XIcon,
} from './icons.jsx';

function buildCopyText(result) {
  const benefits = result.benefits.map((item) => `• ${item}`).join('\n');
  return `${result.title}\n\n${result.description}\n\nKey benefits\n${benefits}`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!copied) throw new Error('Copy failed');
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-base text-indigo-400">
        <SparklesIcon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-200">Your product story starts here</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
        Upload a photo, add your brand name, and generate a title, description, and benefit
        bullets in seconds.
      </p>
      <div className="mt-6 w-full max-w-sm space-y-2 text-left">
        {[
          'Only visible details make it into the copy',
          'Brand voice woven in naturally',
          'Ready to paste into any storefront',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-400/10 text-teal-400">
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex-1 px-1 py-2" aria-busy="true" aria-label="Generating description">
      <div className="space-y-3">
        <div className="skeleton h-7 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-10/12" />
        <div className="skeleton h-4 w-8/12" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-10/12" />
        <div className="skeleton h-4 w-9/12" />
      </div>
      <p className="mt-8 flex items-center gap-2 font-mono text-xs text-indigo-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
        </span>
        Reading the photo and drafting copy…
      </p>
    </div>
  );
}

function ErrorBanner({ error, onDismiss }) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-3 rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 animate-fade-up"
    >
      <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{error.title}</p>
        <p className="mt-0.5 text-rose-200/80">{error.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="focus-ring rounded p-0.5 text-rose-300/70 transition-colors hover:text-rose-100"
        aria-label="Dismiss error"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function ResultBody({ result, brand }) {
  return (
    <div className="animate-fade-up space-y-5">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-teal-500/40 bg-teal-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-teal-300">
            Grounded in photo
          </span>
          {brand ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              for {brand}
            </span>
          ) : null}
        </div>
        <h3 className="text-2xl font-semibold leading-8 text-slate-100">{result.title}</h3>
      </div>

      <div className="h-px bg-line/80" />

      <p className="whitespace-pre-line text-[15px] leading-7 text-slate-300">
        {result.description}
      </p>

      {result.benefits.length > 0 ? (
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Key benefits
          </h4>
          <ul className="mt-3 space-y-2.5">
            {result.benefits.map((benefit, index) => (
              <li key={`${benefit}-${index}`} className="flex items-start gap-2.5 text-sm leading-6 text-slate-300">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-400/10 text-teal-400 ring-1 ring-inset ring-teal-500/30">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function ResultsPanel({
  status,
  result,
  error,
  onDismissError,
  onRegenerate,
  canRegenerate,
  brand,
  isStale,
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const copyTimerRef = useRef(null);
  const isGenerating = status === 'generating';

  useEffect(
    () => () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!copyError) return undefined;
    const timer = setTimeout(() => setCopyError(''), 3000);
    return () => clearTimeout(timer);
  }, [copyError]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await copyText(buildCopyText(result));
      setCopied(true);
      setCopyError('');
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError('Could not access the clipboard. Select the text and copy manually.');
    }
  };

  return (
    <section className="panel flex min-h-[32rem] flex-col p-6" aria-labelledby="results-panel-title">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="results-panel-title" className="text-xl font-semibold text-slate-100">
            Generated copy
          </h2>
          <p className="mt-1 text-sm text-slate-400">Edit freely before publishing.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-line bg-base/60 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            Step 2
          </span>
          {result ? (
            <button
              type="button"
              onClick={handleCopy}
              className="btn-outline px-3 py-1.5 text-xs"
              aria-live="polite"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-teal-400" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>

      {copyError ? (
        <p role="alert" className="mb-3 text-xs text-rose-300">
          {copyError}
        </p>
      ) : null}

      {error ? <ErrorBanner error={error} onDismiss={onDismissError} /> : null}

      {isGenerating ? (
        <LoadingState />
      ) : result ? (
        <div className="flex flex-1 flex-col">
          {isStale ? (
            <p className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Inputs changed since this copy was generated. Regenerate to refresh it.
            </p>
          ) : null}
          <ResultBody result={result} brand={brand} />
          <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
              <ImageIcon className="h-3.5 w-3.5 text-slate-600" />
              No dimensions or materials invented
            </p>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={!canRegenerate}
              className="btn-outline px-3 py-2 text-xs"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              Regenerate
            </button>
          </div>
        </div>
      ) : status === 'error' ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <AlertIcon className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-slate-200">No copy yet</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Fix the issue above, then try generating again. Your image and brand name are still
            here.
          </p>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={!canRegenerate}
            className="btn-primary mt-6"
          >
            <RefreshIcon className="h-4 w-4" />
            Try again
          </button>
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
