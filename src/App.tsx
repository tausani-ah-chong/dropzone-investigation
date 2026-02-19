import React from 'react';
import { PageWrapper, PageTitle, PageSubtitle, Grid } from './styles/grid';
import { ReactDropzonePanel } from './components/panels/ReactDropzonePanel';
import { UppyPanel } from './components/panels/UppyPanel';
import { FilePondPanel } from './components/panels/FilePondPanel';
import { ReactUploadyPanel } from './components/panels/ReactUploadyPanel';

const App: React.FC = () => {
  return (
    <PageWrapper>
      <PageTitle>Dropzone Library Comparison</PageTitle>
      <PageSubtitle>
        Comparing the top 4 MIT-licensed React file drop libraries — drop .csv or .zip files (max 10 MB) in each panel
      </PageSubtitle>
      <Grid>
        <ReactDropzonePanel />
        <UppyPanel />
        <FilePondPanel />
        <ReactUploadyPanel />
      </Grid>
    </PageWrapper>
  );
};

export default App;
