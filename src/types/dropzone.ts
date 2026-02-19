export interface FileEntry {
  name: string;
  size: number;
  type: string;
}

export interface RejectedEntry {
  name: string;
  size: number;
  reason: string;
}

export interface LibraryMeta {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  npmUrl: string;
  weeklyDownloads: string;
  stars: string;
  license: string;
  lastRelease: string;
  gzippedSize?: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success';

export interface DelayOption {
  label: string;
  value: number;
}

export const DELAY_OPTIONS: DelayOption[] = [
  { label: 'Instant', value: 0 },
  { label: '2s',      value: 2000 },
  { label: '5s',      value: 5000 },
  { label: '10s',     value: 10000 },
];
