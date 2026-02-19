import React, { useEffect, useRef, useState } from 'react';
import type { UploadStatus } from '../../types/dropzone';
import {
  UploadSectionWrapper,
  UploadButton,
  ProgressTrack,
  ProgressFill,
  ProgressLabel,
  SuccessMessage,
} from './UploadSection.styles';

interface UploadSectionProps {
  acceptedCount: number;
  uploadDelayMs: number;
  status: UploadStatus;
  onStatusChange: (status: UploadStatus) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  acceptedCount,
  uploadDelayMs,
  status,
  onStatusChange,
}) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (status === 'idle') setProgress(0);
  }, [status]);

  function handleUpload() {
    if (status !== 'idle' || acceptedCount === 0) return;

    onStatusChange('uploading');
    setProgress(0);

    if (uploadDelayMs === 0) {
      setProgress(100);
      onStatusChange('success');
      timeoutRef.current = setTimeout(() => {
        onStatusChange('idle');
      }, 1500);
      return;
    }

    const tickMs = 50;
    const increment = (tickMs / uploadDelayMs) * 100;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          timeoutRef.current = setTimeout(() => {
            onStatusChange('success');
            timeoutRef.current = setTimeout(() => {
              onStatusChange('idle');
            }, 1500);
          }, 150);
          return 100;
        }
        return next;
      });
    }, tickMs);
  }

  if (acceptedCount === 0) return null;

  return (
    <UploadSectionWrapper>
      {status === 'idle' && (
        <UploadButton type="button" onClick={handleUpload}>
          Upload {acceptedCount} file{acceptedCount !== 1 ? 's' : ''}
        </UploadButton>
      )}

      {status === 'uploading' && (
        <>
          <ProgressLabel>Uploading…</ProgressLabel>
          <ProgressTrack
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Upload progress"
          >
            <ProgressFill $pct={Math.min(progress, 100)} />
          </ProgressTrack>
        </>
      )}

      {status === 'success' && (
        <SuccessMessage>✓ Upload complete</SuccessMessage>
      )}
    </UploadSectionWrapper>
  );
};
