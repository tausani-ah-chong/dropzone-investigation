import React, { useEffect, useMemo, useState } from 'react';
import Uppy from '@uppy/core';
import { UppyContextProvider, useDropzone, useUppyEvent } from '@uppy/react';
import styled, { css } from 'styled-components';
import type { FileEntry, RejectedEntry, UploadStatus } from '../../types/dropzone';
import { LIBRARIES } from '../../constants/libraries';
import { LibraryCard } from '../LibraryCard/LibraryCard';
import { FileFeedback } from '../FileFeedback/FileFeedback';
import { UploadSection } from '../UploadSection/UploadSection';

const MAX_SIZE = 10 * 1024 * 1024;

/* ── Styles ──────────────────────────────────────────────────────────── */

const DropArea = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.dropzoneBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dropzoneBg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  outline: none;
  position: relative;

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

const HiddenInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
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

/* ── Inner component (must be inside UppyContextProvider) ──────────── */

interface InnerProps {
  uppy: Uppy;
  setAccepted: React.Dispatch<React.SetStateAction<FileEntry[]>>;
  setRejected: React.Dispatch<React.SetStateAction<RejectedEntry[]>>;
}

const UppyDropzoneInner: React.FC<InnerProps> = ({ uppy, setAccepted, setRejected }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  // Track files added successfully (passed all restrictions)
  useUppyEvent(uppy, 'file-added', (file) => {
    setAccepted(prev => [
      ...prev,
      { name: file.name ?? 'unnamed', size: file.size ?? 0, type: file.type ?? '' },
    ]);
  });

  // Track files rejected by Uppy's restriction engine
  useUppyEvent(uppy, 'restriction-failed', (file, error) => {
    if (file) {
      setRejected(prev => [
        ...prev,
        { name: file.name ?? 'unnamed', size: file.size ?? 0, reason: error.message },
      ]);
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDrop: () => setIsDragActive(false),
  });

  const rootProps = getRootProps();
  const inputProps = getInputProps();

  return (
    <DropArea {...rootProps} $isDragActive={isDragActive} tabIndex={0}>
      <HiddenInput {...inputProps} />
      <DropIcon>{isDragActive ? '📂' : '📁'}</DropIcon>
      <DropText>
        {isDragActive ? 'Drop files here…' : 'Drag & drop or click to select'}
      </DropText>
      <DropHint>.csv or .zip · max 10 MB</DropHint>
    </DropArea>
  );
};

/* ── Panel ───────────────────────────────────────────────────────────── */

interface PanelProps {
  uploadDelayMs: number;
}

export const UppyPanel: React.FC<PanelProps> = ({ uploadDelayMs }) => {
  const [accepted, setAccepted] = useState<FileEntry[]>([]);
  const [rejected, setRejected] = useState<RejectedEntry[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');

  const uppy = useMemo(
    () =>
      new Uppy({
        autoProceed: false,
        restrictions: {
          allowedFileTypes: ['.csv', '.zip', 'text/csv', 'application/zip'],
          maxFileSize: MAX_SIZE,
        },
      }),
    [],
  );

  // Clean up uppy on unmount
  useEffect(() => () => { uppy.destroy(); }, [uppy]);

  function handleClear() {
    if (uploadStatus === 'uploading') return;
    setAccepted([]);
    setRejected([]);
    uppy.clear();
  }

  return (
    <LibraryCard meta={LIBRARIES.uppy}>
      <UppyContextProvider uppy={uppy}>
        <UppyDropzoneInner
          uppy={uppy}
          setAccepted={setAccepted}
          setRejected={setRejected}
        />
      </UppyContextProvider>
      <UploadSection
        acceptedCount={accepted.length}
        uploadDelayMs={uploadDelayMs}
        status={uploadStatus}
        onStatusChange={setUploadStatus}
      />
      <FileFeedback
        accepted={accepted}
        rejected={rejected}
        onClear={handleClear}
        isUploading={uploadStatus === 'uploading'}
      />
    </LibraryCard>
  );
};
