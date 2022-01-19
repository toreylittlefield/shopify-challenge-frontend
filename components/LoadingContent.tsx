import { Spinner } from '@shopify/polaris';
import React, { Fragment } from 'react';
import SkeletonContent from './SkeletonContent';

const LoadingContent = () => {
  return (
    <Fragment>
      <Spinner size="large" />
      <SkeletonContent />
    </Fragment>
  );
};

export { LoadingContent };
