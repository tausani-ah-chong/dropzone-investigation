import React from 'react';
import type { LibraryMeta } from '../../types/dropzone';
import {
  CardHeader,
  LibraryName,
  LibraryDescription,
  BadgeRow,
  MetaBadge,
  LinkRow,
  LinkAnchor,
} from './LibraryCard.styles';

interface Props {
  meta: LibraryMeta;
}

export const LibraryInfo: React.FC<Props> = ({ meta }) => {
  return (
    <CardHeader>
      <LibraryName>{meta.name}</LibraryName>
      <LibraryDescription>{meta.description}</LibraryDescription>

      <BadgeRow>
        <MetaBadge $variant="success">{meta.license}</MetaBadge>
        <MetaBadge $variant="primary">⭐ {meta.stars}</MetaBadge>
        <MetaBadge>↓ {meta.weeklyDownloads}/wk</MetaBadge>
        <MetaBadge>{meta.lastRelease}</MetaBadge>
        {meta.gzippedSize && <MetaBadge>gz {meta.gzippedSize}</MetaBadge>}
      </BadgeRow>

      <LinkRow>
        <LinkAnchor href={meta.githubUrl} target="_blank" rel="noopener noreferrer">
          ↗ GitHub
        </LinkAnchor>
        <LinkAnchor href={meta.npmUrl} target="_blank" rel="noopener noreferrer">
          ↗ npm
        </LinkAnchor>
      </LinkRow>
    </CardHeader>
  );
};
