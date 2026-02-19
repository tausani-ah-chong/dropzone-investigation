import { useCallback, useRef, useState } from 'react';
import type React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DropzoneError {
  code: 'file-too-large' | 'file-invalid-type';
  message: string;
}

export interface RejectedFile {
  file: File;
  errors: DropzoneError[];
}

export interface UseDropzoneOptions {
  /** Map of MIME types to accepted extensions, e.g. `{ 'text/csv': ['.csv'] }` */
  accept?: Record<string, string[]>;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Allow multiple files (default: true) */
  multiple?: boolean;
  /** Called after each drop or file-pick with the split accepted/rejected lists */
  onDrop?: (accepted: File[], rejected: RejectedFile[]) => void;
}

export interface UseDropzoneReturn {
  getRootProps: () => React.HTMLAttributes<HTMLElement>;
  /** Spread onto <input>. Attach `inputRef` to the same element via `ref={inputRef}`. */
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  /** Ref to attach to the hidden <input> element: `<input ref={inputRef} {...getInputProps()} />` */
  inputRef: React.RefObject<HTMLInputElement>;
  isDragActive: boolean;
  isDragReject: boolean;
  /** Programmatically open the file picker */
  open: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build the `accept` attribute string for <input type="file"> */
function buildAcceptString(accept: Record<string, string[]>): string {
  const parts: string[] = [];
  for (const [mime, exts] of Object.entries(accept)) {
    parts.push(mime, ...exts);
  }
  return [...new Set(parts)].join(',');
}

/** Check whether a MIME type matches the accept map (used during drag preview) */
function isMimeAccepted(mime: string, accept: Record<string, string[]>): boolean {
  // Empty or generic MIME means the browser can't tell the type yet — don't reject early
  if (mime === '' || mime === 'application/octet-stream') return true;
  return Object.keys(accept).some(
    key => key === mime || (key.endsWith('/*') && mime.startsWith(key.slice(0, -1))),
  );
}

/** Full per-file validation — called on actual drop or input change */
function validateFile(
  file: File,
  accept: Record<string, string[]> | undefined,
  maxSize: number | undefined,
): DropzoneError[] {
  const errors: DropzoneError[] = [];

  if (accept) {
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
    const mimeOk = Object.keys(accept).some(
      key => key === file.type || (key.endsWith('/*') && file.type.startsWith(key.slice(0, -1))),
    );
    const extOk = Object.values(accept).flat().includes(ext);
    if (!mimeOk && !extOk) {
      errors.push({
        code: 'file-invalid-type',
        message: 'File type not allowed (only .csv and .zip)',
      });
    }
  }

  if (maxSize !== undefined && file.size > maxSize) {
    errors.push({ code: 'file-too-large', message: 'File exceeds 10 MB limit' });
  }

  return errors;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useDropzone(options: UseDropzoneOptions = {}): UseDropzoneReturn {
  const { accept, maxSize, multiple = true, onDrop } = options;

  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  // ── open ──────────────────────────────────────────────────────────────

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // ── file processing ───────────────────────────────────────────────────

  const processFiles = useCallback(
    (files: File[]) => {
      const accepted: File[] = [];
      const rejected: RejectedFile[] = [];
      const toProcess = multiple ? files : files.slice(0, 1);

      toProcess.forEach(file => {
        const errors = validateFile(file, accept, maxSize);
        if (errors.length === 0) {
          accepted.push(file);
        } else {
          rejected.push({ file, errors });
        }
      });

      onDrop?.(accepted, rejected);
    },
    [accept, maxSize, multiple, onDrop],
  );

  // ── drag detection helper ─────────────────────────────────────────────

  const checkDragReject = useCallback(
    (items: DataTransferItemList): boolean => {
      if (!accept) return false;
      return Array.from(items).some(
        item => item.kind === 'file' && !isMimeAccepted(item.type, accept),
      );
    },
    [accept],
  );

  // ── drag events ───────────────────────────────────────────────────────

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current++;
      if (dragCounterRef.current === 1) {
        setIsDragActive(true);
        setIsDragReject(checkDragReject(e.dataTransfer.items));
      }
    },
    [checkDragReject],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
      setIsDragReject(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragActive(false);
      setIsDragReject(false);
      processFiles(Array.from(e.dataTransfer.files));
    },
    [processFiles],
  );

  // ── click / keyboard ──────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    open();
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        open();
      }
    },
    [open],
  );

  // ── input change ──────────────────────────────────────────────────────

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(Array.from(e.target.files ?? []));
      // Reset so the same file can be re-picked
      e.target.value = '';
    },
    [processFiles],
  );

  // ── prop getters ──────────────────────────────────────────────────────

  const getRootProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> => ({
      role: 'button',
      tabIndex: 0,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    }),
    [handleClick, handleKeyDown, handleDragEnter, handleDragOver, handleDragLeave, handleDrop],
  );

  const getInputProps = useCallback(
    (): React.InputHTMLAttributes<HTMLInputElement> => ({
      type: 'file',
      accept: accept ? buildAcceptString(accept) : undefined,
      multiple,
      style: { display: 'none' },
      onChange: handleInputChange,
      // Stop propagation so the root onClick doesn't open the picker a second time
      onClick: (e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation(),
    }),
    [accept, multiple, handleInputChange],
  );

  return { getRootProps, getInputProps, inputRef, isDragActive, isDragReject, open };
}
