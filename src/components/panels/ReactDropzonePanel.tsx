import React, { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import styled, { css } from 'styled-components';
import type { FileEntry, RejectedEntry } from '../../types/dropzone';
import { LIBRARIES } from '../../constants/libraries';
import { LibraryCard } from '../LibraryCard/LibraryCard';
import { FileFeedback } from '../FileFeedback/FileFeedback';

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

function mapRejectionReason(code: string): string {
  switch (code) {
    case 'file-too-large': return 'File exceeds 10 MB limit';
    case 'file-invalid-type': return 'File type not allowed (only .csv and .zip)';
    case 'too-many-files': return 'Too many files';
    default: return code;
  }
}

export const ReactDropzonePanel: React.FC = () => {
  const [accepted, setAccepted] = useState<FileEntry[]>([]);
  const [rejected, setRejected] = useState<RejectedEntry[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      setAccepted(prev => [
        ...prev,
        ...acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
      ]);
      setRejected(prev => [
        ...prev,
        ...rejections.map(({ file, errors }) => ({
          name: file.name,
          size: file.size,
          reason: mapRejectionReason(errors[0]?.code ?? 'unknown'),
        })),
      ]);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize: MAX_SIZE,
  });

  return (
    <LibraryCard meta={LIBRARIES.reactDropzone}>
      <DropArea
        {...getRootProps()}
        $isDragActive={isDragActive}
        $isDragReject={isDragReject}
      >
        <input {...getInputProps()} />
        <DropIcon>{isDragActive ? '📂' : '📁'}</DropIcon>
        <DropText>
          {isDragActive ? 'Drop files here…' : 'Drag & drop or click to select'}
        </DropText>
        <DropHint>.csv or .zip · max 10 MB</DropHint>
      </DropArea>
      <FileFeedback
        accepted={accepted}
        rejected={rejected}
        onClear={() => { setAccepted([]); setRejected([]); }}
      />
    </LibraryCard>
  );
};
