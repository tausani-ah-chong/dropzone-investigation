import React from 'react';
import type { LibraryMeta } from '../../types/dropzone';
import { CardWrapper, Divider } from './LibraryCard.styles';
import { LibraryInfo } from './LibraryInfo';

interface Props {
  meta: LibraryMeta;
  children: React.ReactNode;
}

export const LibraryCard: React.FC<Props> = ({ meta, children }) => {
  return (
    <CardWrapper>
      <LibraryInfo meta={meta} />
      <Divider />
      {children}
    </CardWrapper>
  );
};
