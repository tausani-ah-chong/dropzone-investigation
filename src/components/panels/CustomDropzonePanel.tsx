import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDropzone } from '../../hooks/useDropzone';
import type { RejectedFile } from '../../hooks/useDropzone';
import type { FileEntry, RejectedEntry, UploadStatus } from '../../types/dropzone';
import { LIBRARIES } from '../../constants/libraries';
import { LibraryCard } from '../LibraryCard/LibraryCard';
import { FileFeedback } from '../FileFeedback/FileFeedback';
import { UploadSection } from '../UploadSection/UploadSection';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const DropArea = styled.div<{ $isDragActive: boolean; $isDragReject: boolean }>`
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

  ${({ $isDragReject, theme }) =>
    $isDragReject &&
    css`
      border-color: ${theme.colors.error};
      background: ${theme.colors.errorBg};
    `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DropIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DropText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const DropHint = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textDim};
`;

interface PanelProps {
  uploadDelayMs: number;
}

export const CustomDropzonePanel: React.FC<PanelProps> = ({ uploadDelayMs }) => {
  const [accepted, setAccepted] = useState<FileEntry[]>([]);
  const [rejected, setRejected] = useState<RejectedEntry[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: RejectedFile[]) => {
    setAccepted(prev => [
      ...prev,
      ...acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
    ]);
    setRejected(prev => [
      ...prev,
      ...rejectedFiles.map(({ file, errors }) => ({
        name: file.name,
        size: file.size,
        reason: errors[0]?.message ?? 'Unknown error',
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, inputRef, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize: MAX_SIZE,
  });

  return (
    <LibraryCard meta={LIBRARIES.custom}>
      <DropArea
        {...getRootProps()}
        $isDragActive={isDragActive}
        $isDragReject={isDragReject}
      >
        <input ref={inputRef} {...getInputProps()} />
        <DropIcon>{isDragActive ? '📂' : '📁'}</DropIcon>
        <DropText>
          {isDragActive ? 'Drop files here…' : 'Drag & drop or click to select'}
        </DropText>
        <DropHint>.csv or .zip · max 10 MB</DropHint>
      </DropArea>
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
