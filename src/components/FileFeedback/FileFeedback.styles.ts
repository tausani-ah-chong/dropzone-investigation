import styled from 'styled-components';

export const FeedbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const SectionLabel = styled.p<{ $variant: 'accepted' | 'rejected' }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme, $variant }) =>
    $variant === 'accepted' ? theme.colors.success : theme.colors.error};
`;

export const FileList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const FileItem = styled.li<{ $variant: 'accepted' | 'rejected' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 5px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $variant }) =>
    $variant === 'accepted' ? theme.colors.successBg : theme.colors.errorBg};
  border: 1px solid ${({ $variant }) =>
    $variant === 'accepted' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'};
`;

export const FileName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.text};
  word-break: break-all;
  flex: 1;
`;

export const FileSize = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textDim};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const RejectionReason = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
  display: block;
  margin-top: 2px;
`;

export const EmptyState = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textDim};
  font-style: italic;
`;

export const ClearButton = styled.button`
  align-self: flex-start;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textDim};
  background: none;
  border: none;
  padding: 2px 0;
  cursor: pointer;
  text-decoration: underline;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    text-decoration: none;
  }
`;
