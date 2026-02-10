'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ScreenshotsUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}

export function ScreenshotsUpload({
  value,
  onChange,
  label = 'Screenshots',
  max = 6,
}: ScreenshotsUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.data?.files) {
        const newUrls = data.data.files.map((f: { url: string }) => f.url);
        onChange([...value, ...newUrls].slice(0, max));
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {label} ({value.length}/{max})
        </label>
      )}

      <div className="grid grid-cols-3 gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700">
            <Image src={url} alt={`Screenshot ${index + 1}`} fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {value.length < max && (
          <div
            className="aspect-video border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-600 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="text-center text-zinc-500">
                <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">Add</span>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
