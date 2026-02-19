import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import type { FilePondFile, FilePondErrorDescription } from 'filepond';
import styled from 'styled-components';
import type { FileEntry, RejectedEntry } from '../../types/dropzone';
import { LIBRARIES } from '../../constants/libraries';
import { LibraryCard } from '../LibraryCard/LibraryCard';
import { FileFeedback } from '../FileFeedback/FileFeedback';

// Register plugins once (idempotent)
registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

const FilePondWrapper = styled.div`
  .filepond--root {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: 0;
  }

  .filepond--panel-root {
    background-color: ${({ theme }) => theme.colors.dropzoneBg};
    border: 2px dashed ${({ theme }) => theme.colors.dropzoneBorder};
    border-radius: ${({ theme }) => theme.radii.md};
    transition: border-color 0.2s, background-color 0.2s;
  }

  .filepond--drop-label {
    color: ${({ theme }) => theme.colors.textMuted};
    min-height: 100px;
  }

  .filepond--label-action {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration-color: ${({ theme }) => theme.colors.primary};
  }

  .filepond--item-panel {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  .filepond--file {
    color: ${({ theme }) => theme.colors.text};
  }

  .filepond--file-action-button {
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

export const FilePondPanel: React.FC = () => {
  const [pondFiles, setPondFiles] = useState<FilePondFile[]>([]);
  const [accepted, setAccepted] = useState<FileEntry[]>([]);
  const [rejected, setRejected] = useState<RejectedEntry[]>([]);

  function handleAddFile(error: FilePondErrorDescription | null, file: FilePondFile) {
    if (error) {
      setRejected(prev => [
        ...prev,
        {
          name: file.filename,
          size: file.fileSize,
          reason: error.body ?? error.type ?? 'Rejected',
        },
      ]);
    } else {
      setAccepted(prev => [
        ...prev,
        { name: file.filename, size: file.fileSize, type: file.fileType },
      ]);
    }
  }

  function handleClear() {
    setPondFiles([]);
    setAccepted([]);
    setRejected([]);
  }

  return (
    <LibraryCard meta={LIBRARIES.filepond}>
      <FilePondWrapper className="filepond-wrapper">
        <FilePond
          files={pondFiles.map(f => f.file as File)}
          onupdatefiles={setPondFiles}
          allowMultiple
          acceptedFileTypes={['text/csv', 'application/zip', 'application/x-zip-compressed']}
          maxFileSize="10MB"
          labelMaxFileSizeExceeded="File exceeds 10 MB limit"
          labelMaxFileSize="Max size is 10 MB"
          labelFileTypeNotAllowed="File type not allowed (only .csv and .zip)"
          fileValidateTypeLabelExpectedTypes="Expects .csv or .zip"
          onaddfile={handleAddFile}
          credits={false}
        />
      </FilePondWrapper>
      <FileFeedback
        accepted={accepted}
        rejected={rejected}
        onClear={handleClear}
      />
    </LibraryCard>
  );
};
