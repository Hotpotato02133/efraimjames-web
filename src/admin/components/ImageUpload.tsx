import { useId, useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { uploadAsset } from '../../lib/adminApi';
import { cn } from '../../lib/utils';
import { useToast, errorMessage } from './Toast';

const MAX_MB = 8;

/**
 * Drop-zone + preview that uploads straight to Supabase Storage and hands the
 * public URL back through onChange. Used for project covers, custom-section
 * images and work-history logos.
 */
export const ImageUpload = ({
  value,
  onChange,
  folder,
  shape = 'wide',
  label = 'Image',
  hint,
  onUploadingChange,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: 'projects' | 'logos';
  /** `wide` for 16:10 covers, `square` for logos. */
  shape?: 'wide' | 'square';
  label?: string;
  hint?: string;
  onUploadingChange?: (uploading: boolean) => void;
}) => {
  const toast = useToast();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files can be uploaded.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image is too large.`, `Keep uploads under ${MAX_MB} MB so the site stays fast.`);
      return;
    }
    setUploading(true);
    onUploadingChange?.(true);
    try {
      onChange(await uploadAsset(file, folder));
      toast.success('Image uploaded.');
    } catch (e) {
      toast.error('Upload failed.', errorMessage(e));
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files?.[0]);
  };

  const isSquare = shape === 'square';

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {value && !uploading && (
          <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-600">
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative flex overflow-hidden rounded-xl border border-dashed transition-colors',
          dragging ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-300 bg-slate-50/60 hover:border-slate-400',
          isSquare ? 'h-28' : 'min-h-[7.5rem]'
        )}
      >
        {value ? (
          <div className={cn('flex w-full items-center gap-4 p-3', !isSquare && 'sm:gap-5')}>
            <img
              src={value}
              alt=""
              className={cn(
                'flex-shrink-0 border border-slate-200 bg-white object-cover',
                isSquare ? 'h-20 w-20 rounded-xl object-contain p-1.5' : 'h-24 w-40 rounded-lg'
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-400" title={value}>
                {value.replace(/^https?:\/\//, '')}
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                {uploading ? 'Uploading…' : 'Replace'}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center gap-1.5 px-4 py-6 text-center"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            ) : (
              <ImagePlus className="h-6 w-6 text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-700">{uploading ? 'Uploading…' : 'Drop an image or click to browse'}</span>
            <span className="text-xs text-slate-400">PNG, JPG or WebP up to {MAX_MB} MB</span>
          </button>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => upload(e.target.files?.[0])}
          disabled={uploading}
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
};
