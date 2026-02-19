import styled from 'styled-components';

export const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  font-weight: 700;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, #6c8ef2 0%, #a78bfa 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PageSubtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
