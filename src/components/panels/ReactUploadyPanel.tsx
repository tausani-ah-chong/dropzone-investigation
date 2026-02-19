import React, { useRef, useState } from 'react';
import Uploady from '@rpldy/uploady';
import UploadDropZone from '@rpldy/upload-drop-zone';
import type { DropHandlerMethod } from '@rpldy/upload-drop-zone';
import styled, { css } from 'styled-components';
import type { FileEntry, RejectedEntry, UploadStatus } from '../../types/dropzone';
import { LIBRARIES } from '../../constants/libraries';
import { LibraryCard } from '../LibraryCard/LibraryCard';
import { FileFeedback } from '../FileFeedback/FileFeedback';
import { UploadSection } from '../UploadSection/UploadSection';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['text/csv', 'application/zip', 'application/x-zip-compressed'];
const ALLOWED_EXTS = ['.csv', '.zip'];

/* ── Styles ──────────────────────────────────────────────────────────── */

const DropZoneWrapper = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.dropzoneBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dropzoneBg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  outline: none;

  ${({ $isDragActive, theme }) =>
    $isDragActive &&
    css`
      border-color: ${theme.colors.dropzoneActive};
      background: ${theme.colors.dropzoneActiveBg};
      box-shadow: ${theme.shadows.glow};
    `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const DropIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  pointer-events: none;
`;

const DropText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  pointer-events: none;
`;

const DropHint = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textDim};
  pointer-events: none;
`;

/* ── Helpers ─────────────────────────────────────────────────────────── */

function isAllowedFile(file: File): boolean {
  const ext = ('.' + file.name.split('.').pop()?.toLowerCase()) as string;
  return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTS.includes(ext);
}

function getRejectionReason(file: File): string {
  if (file.size > MAX_SIZE) return 'File exceeds 10 MB limit';
  return 'File type not allowed (only .csv and .zip)';
}

/* ── Panel ───────────────────────────────────────────────────────────── */

interface PanelProps {
  uploadDelayMs: number;
}

export const ReactUploadyPanel: React.FC<PanelProps> = ({ uploadDelayMs }) => {
  const [accepted, setAccepted] = useState<FileEntry[]>([]);
  const [rejected, setRejected] = useState<RejectedEntry[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const dragCountRef = useRef(0);

  const fileFilter = (file: File | string): boolean => {
    if (typeof file === 'string') return false;
    return isAllowedFile(file) && file.size <= MAX_SIZE;
  };

  // dropHandler lets us see ALL dropped files (including rejected ones).
  // We compare against the fileFilter to determine what gets rejected.
  const dropHandler: DropHandlerMethod = async (e, getFiles) => {
    setIsDragActive(false);
    dragCountRef.current = 0;

    const rawFiles = e.dataTransfer?.files
      ? Array.from(e.dataTransfer.files)
      : await getFiles();

    const acc: File[] = [];
    const rej: File[] = [];

    rawFiles.forEach(f => {
      if (isAllowedFile(f) && f.size <= MAX_SIZE) {
        acc.push(f);
      } else {
        rej.push(f);
      }
    });

    if (acc.length > 0) {
      setAccepted(prev => [
        ...prev,
        ...acc.map(f => ({ name: f.name, size: f.size, type: f.type })),
      ]);
    }

    if (rej.length > 0) {
      setRejected(prev => [
        ...prev,
        ...rej.map(f => ({ name: f.name, size: f.size, reason: getRejectionReason(f) })),
      ]);
    }

    return acc;
  };

  // Use extraProps to get drag enter/leave events from UploadDropZone's root div
  const extraProps = {
    onDragEnter: (_e: DragEvent) => {
      dragCountRef.current++;
      setIsDragActive(true);
    },
    onDragLeave: (_e: DragEvent) => {
      dragCountRef.current = Math.max(0, dragCountRef.current - 1);
      if (dragCountRef.current === 0) setIsDragActive(false);
    },
  };

  return (
    <LibraryCard meta={LIBRARIES.reactUploady}>
      <Uploady
        destination={{ url: 'https://httpbin.org/post' }}
        autoUpload={false}
        fileFilter={fileFilter}
      >
        <UploadDropZone dropHandler={dropHandler} extraProps={extraProps}>
          <DropZoneWrapper $isDragActive={isDragActive}>
            <DropIcon>{isDragActive ? '📂' : '📁'}</DropIcon>
            <DropText>
              {isDragActive ? 'Drop files here…' : 'Drag & drop to upload'}
            </DropText>
            <DropHint>.csv or .zip · max 10 MB</DropHint>
          </DropZoneWrapper>
        </UploadDropZone>
      </Uploady>
      <UploadSection
        acceptedCount={accepted.length}
        uploadDelayMs={uploadDelayMs}
        status={uploadStatus}
        onStatusChange={setUploadStatus}
      />
      <FileFeedback
        accepted={accepted}
        rejected={rejected}
        onClear={() => { setAccepted([]); setRejected([]); }}
        isUploading={uploadStatus === 'uploading'}
      />
    </LibraryCard>
  );
};
