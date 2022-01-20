import { Spinner } from '@shopify/polaris';
import React, { Fragment } from 'react';
import { SkeletonContent } from './index';

const LoadingContent = () => {
  return (
    <Fragment>
      <Spinner size="large" />
      <SkeletonContent />
    </Fragment>
  );
};

export { LoadingContent };
