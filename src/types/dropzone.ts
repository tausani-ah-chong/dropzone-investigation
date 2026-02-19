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
