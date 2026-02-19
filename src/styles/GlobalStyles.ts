import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.sans};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* FilePond overrides — scoped via .filepond-wrapper in FilePondPanel */
  .filepond-wrapper .filepond--root {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  .filepond-wrapper .filepond--panel-root {
    background-color: ${({ theme }) => theme.colors.dropzoneBg};
    border: 2px dashed ${({ theme }) => theme.colors.dropzoneBorder};
    border-radius: ${({ theme }) => theme.radii.md};
  }

  .filepond-wrapper .filepond--drop-label {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .filepond-wrapper .filepond--label-action {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration-color: ${({ theme }) => theme.colors.primary};
  }

  .filepond-wrapper .filepond--item-panel {
    background: ${({ theme }) => theme.colors.surface};
  }

  .filepond-wrapper .filepond--file-action-button {
    background: ${({ theme }) => theme.colors.primary};
  }
`;
