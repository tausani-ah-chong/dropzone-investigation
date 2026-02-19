import styled from 'styled-components';

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const LibraryName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const LibraryDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

export const MetaBadge = styled.span<{ $variant?: 'default' | 'success' | 'primary' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};
  background: ${({ theme, $variant }) =>
    $variant === 'success' ? theme.colors.successBg :
    $variant === 'primary' ? 'rgba(108,142,242,0.15)' :
    theme.colors.badge};
  color: ${({ theme, $variant }) =>
    $variant === 'success' ? theme.colors.success :
    $variant === 'primary' ? theme.colors.primary :
    theme.colors.textMuted};
  border: 1px solid ${({ theme, $variant }) =>
    $variant === 'success' ? 'rgba(74,222,128,0.3)' :
    $variant === 'primary' ? 'rgba(108,142,242,0.3)' :
    theme.colors.badgeBorder};
`;

export const LinkRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const LinkAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary} !important;
  background: rgba(108,142,242,0.08);
  border: 1px solid rgba(108,142,242,0.2);
  transition: background 0.15s, border-color 0.15s;
  text-decoration: none !important;

  &:hover {
    background: rgba(108,142,242,0.18);
    border-color: rgba(108,142,242,0.4);
    text-decoration: none !important;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`;
