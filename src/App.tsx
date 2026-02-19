import React, { useState } from 'react';
import { PageWrapper, PageTitle, PageSubtitle, Grid, DelayRow, DelayLabel, DelayPill } from './styles/grid';
import { ReactDropzonePanel } from './components/panels/ReactDropzonePanel';
import { UppyPanel } from './components/panels/UppyPanel';
import { FilePondPanel } from './components/panels/FilePondPanel';
import { ReactUploadyPanel } from './components/panels/ReactUploadyPanel';
import { CustomDropzonePanel } from './components/panels/CustomDropzonePanel';
import { DELAY_OPTIONS } from './types/dropzone';

const App: React.FC = () => {
  const [delayMs, setDelayMs] = useState<number>(2000);

  return (
    <PageWrapper>
      <PageTitle>Dropzone Library Comparison</PageTitle>
      <PageSubtitle>
        Comparing the top 4 MIT-licensed React file drop libraries plus a custom in-house hook — drop .csv or .zip files (max 10 MB) in each panel
      </PageSubtitle>

      <DelayRow>
        <DelayLabel>Upload delay:</DelayLabel>
        {DELAY_OPTIONS.map(opt => (
          <DelayPill
            key={opt.value}
            $active={delayMs === opt.value}
            aria-pressed={delayMs === opt.value}
            onClick={() => setDelayMs(opt.value)}
            type="button"
          >
            {opt.label}
          </DelayPill>
        ))}
      </DelayRow>

      <Grid>
        <ReactDropzonePanel uploadDelayMs={delayMs} />
        <UppyPanel uploadDelayMs={delayMs} />
        <FilePondPanel uploadDelayMs={delayMs} />
        <ReactUploadyPanel uploadDelayMs={delayMs} />
        <CustomDropzonePanel uploadDelayMs={delayMs} />
      </Grid>
    </PageWrapper>
  );
};

export default App;
