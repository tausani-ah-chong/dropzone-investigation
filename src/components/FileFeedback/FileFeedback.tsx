import React from 'react';
import type { FileEntry, RejectedEntry } from '../../types/dropzone';
import {
  FeedbackWrapper,
  FeedbackSection,
  SectionLabel,
  FileList,
  FileItem,
  FileName,
  FileSize,
  RejectionReason,
  EmptyState,
  ClearButton,
} from './FileFeedback.styles';

interface Props {
  accepted: FileEntry[];
  rejected: RejectedEntry[];
  onClear: () => void;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const FileFeedback: React.FC<Props> = ({ accepted, rejected, onClear }) => {
  const hasAny = accepted.length > 0 || rejected.length > 0;

  return (
    <FeedbackWrapper>
      {hasAny && (
        <ClearButton onClick={onClear} type="button">
          Clear
        </ClearButton>
      )}

      {accepted.length > 0 && (
        <FeedbackSection>
          <SectionLabel $variant="accepted">✓ Accepted ({accepted.length})</SectionLabel>
          <FileList>
            {accepted.map((f, i) => (
              <FileItem key={`${f.name}-${i}`} $variant="accepted">
                <FileName>{f.name}</FileName>
                <FileSize>{formatSize(f.size)}</FileSize>
              </FileItem>
            ))}
          </FileList>
        </FeedbackSection>
      )}

      {rejected.length > 0 && (
        <FeedbackSection>
          <SectionLabel $variant="rejected">✗ Rejected ({rejected.length})</SectionLabel>
          <FileList>
            {rejected.map((f, i) => (
              <FileItem key={`${f.name}-${i}`} $variant="rejected">
                <div style={{ flex: 1 }}>
                  <FileName>{f.name}</FileName>
                  <FileSize> · {formatSize(f.size)}</FileSize>
                  <RejectionReason>{f.reason}</RejectionReason>
                </div>
              </FileItem>
            ))}
          </FileList>
        </FeedbackSection>
      )}

      {!hasAny && (
        <EmptyState>Drop .csv or .zip files here (max 10 MB each)</EmptyState>
      )}
    </FeedbackWrapper>
  );
};
