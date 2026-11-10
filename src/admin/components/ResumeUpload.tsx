import { useId, useRef, useState, type DragEvent } from 'react';
import { ExternalLink, FileText, Loader2, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { uploadResumeAsset } from '../../lib/adminApi';
import { cn } from '../../lib/utils';
import { useToast, errorMessage } from './Toast';
import { Badge, Field, Input } from './ui';

const MAX_MB = 15;
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface ResumeUploadProps {
  value?: string;
  filename?: string;
  onChange: (url: string, filename: string) => void;
  onPersist?: (url: string, filename: string) => Promise<void>;
  onUploadingChange?: (uploading: boolean) => void;
}

export const ResumeUpload = ({
  value,
  filename,
  onChange,
  onPersist,
  onUploadingChange,
}: ResumeUploadProps) => {
  const toast = useToast();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const isValidResumeFile = (file: File) => {
    if (ACCEPTED_TYPES.includes(file.type)) return true;
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ext === 'pdf' || ext === 'doc' || ext === 'docx';
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;

    if (!isValidResumeFile(file)) {
      toast.error('Invalid file type.', 'Please upload a PDF or document (.pdf, .doc, .docx).');
      return;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error('File is too large.', `Keep resume files under ${MAX_MB} MB so visitors can download quickly.`);
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);

    try {
      const res = await uploadResumeAsset(file);
      const targetFilename = file.name || filename || 'CV-EFRAIM-JAMES-2026.pdf';
      onChange(res.url, targetFilename);
      if (onPersist) {
        await onPersist(res.url, targetFilename);
        toast.success('Resume uploaded & saved.', `"${targetFilename}" is now live on your website.`);
      } else {
        toast.success('Resume uploaded.', 'Click "Save hero" to publish the new resume to your website.');
      }
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

  const handleRemove = async () => {
    const defaultName = 'CV-EFRAIM-JAMES-2026.pdf';
    onChange('', defaultName);
    if (onPersist) {
      setUploading(true);
      onUploadingChange?.(true);
      try {
        await onPersist('', defaultName);
        toast.info('Custom resume removed & saved.', 'Reverted to default bundled resume.');
      } catch (e) {
        toast.error('Failed to remove resume.', errorMessage(e));
      } finally {
        setUploading(false);
        onUploadingChange?.(false);
      }
    } else {
      toast.info('Custom resume removed.', 'Reverted to default bundled resume. Click "Save hero" to apply.');
    }
  };

  const handleFilenameChange = (newFilename: string) => {
    onChange(value || '', newFilename);
  };

  const displayFilename = filename || (value ? value.split('/').pop()?.split('?')[0] : '') || 'CV-EFRAIM-JAMES-2026.pdf';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            Resume / CV Document
          </label>
          <p className="mt-0.5 text-xs text-slate-400">
            Upload your latest resume. When visitors click &quot;Download Resume&quot; on your Hero section, they will download this file.
          </p>
        </div>
        {value ? (
          <Badge tone="emerald">Custom active</Badge>
        ) : (
          <Badge tone="neutral">Default bundled resume</Badge>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        className="sr-only"
        onChange={(e) => upload(e.target.files?.[0])}
      />

      {value ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{displayFilename}</p>
                <p className="text-xs text-slate-500">Live resume stored in Supabase Storage</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                Preview file
              </a>
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-2.5 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Replace
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            'group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all',
            dragging
              ? 'border-emerald-500 bg-emerald-50/60'
              : 'border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/20'
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-semibold text-slate-700">Uploading resume...</p>
              <p className="text-xs text-slate-400">Storing to Supabase Storage</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-600 transition-transform group-hover:scale-110">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  <span className="text-emerald-600 group-hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400">PDF, DOC, DOCX up to {MAX_MB} MB</p>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Currently using default bundled file (<span className="font-mono text-slate-500">CV-EFRAIM-JAMES-2026.pdf</span>)
              </p>
            </div>
          )}
        </div>
      )}

      <Field
        label="Download file name"
        hint="The filename visitors will see when downloading your resume (e.g. CV-EFRAIM-JAMES-2026.pdf)."
      >
        <Input
          value={filename ?? ''}
          placeholder="CV-EFRAIM-JAMES-2026.pdf"
          onChange={(e) => handleFilenameChange(e.target.value)}
        />
      </Field>
    </div>
  );
};

