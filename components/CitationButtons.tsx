"use client";
import { useState } from "react";

function copy(text: string) {
  if (!text) return;
  navigator.clipboard.writeText(text);
}

export default function CitationButtons({
  doi,
  pdf,
  bibtex
}: { doi?: string; pdf?: string; bibtex?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-3 flex flex-wrap gap-3 text-sm">
      {doi && (
        <a className="underline" href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer">
          DOI
        </a>
      )}
      {pdf && pdf !== "#" && (
        <a className="underline" href={pdf} target="_blank" rel="noreferrer">
          PDF
        </a>
      )}
      {bibtex && (
        <button
          className="underline"
          onClick={() => {
            copy(bibtex);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? "Copied BibTeX ✓" : "Copy BibTeX"}
        </button>
      )}
    </div>
  );
}
