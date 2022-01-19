import React, { Fragment, useCallback, useState } from 'react';
import { ButtonGroup, Button, Toast } from '@shopify/polaris';
import { ShareModal } from './ShareModal';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { FiDelete } from 'react-icons/fi';
import { NasaImageObj, UpdatedImgObj } from '../types/nasa-api-data';
// import { ImagesData } from './App';

type PropTypes = {
  srcURL: string;
  id: string;
  title: string;
  addEntry?: (imgObject: NasaImageObj) => void;
  deleteEntry?: (id: string) => void;
  buttonType?: 'Like' | 'Delete';
};

const CardButtons = ({ id, title, srcURL, addEntry, deleteEntry, buttonType = 'Like', ...rest }: PropTypes) => {
  const [toggleLike, setToggleLike] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toggleLiked = useCallback(() => setToggleLike((toggleLike) => !toggleLike), []);
  const likeIcon = toggleLike ? <FcLike /> : <FcLikePlaceholder />;
  const content = toggleLike ? 'Saved To Favorites' : 'Removed From Favorites';
  const toastMarkup = active ? <Toast content={content} onDismiss={toggleActive} duration={2500} /> : null;
  const dataObjToAdd: UpdatedImgObj = { ...rest, id, title, srcURL } as UpdatedImgObj;

  return (
    <Fragment>
      <ButtonGroup>
        <ShareModal srcURL={srcURL} title={title} />
        <Button
          icon={buttonType ? likeIcon : <FiDelete fillOpacity={0} color="red" />}
          onClick={() => {
            if (addEntry) {
              if (toggleLike === false) {
                addEntry(dataObjToAdd);
              } else if (toggleLike && deleteEntry) {
                deleteEntry(id);
              }
              toggleLiked();
              toggleActive();
            }
            // if (deleteEntry && imageObj) {
            //   deleteEntry(imageObj.uuid);
            //   toggleLiked();
            //   toggleActive();
            // }
          }}
        />
      </ButtonGroup>
      {toastMarkup}
    </Fragment>
  );
};

export { CardButtons };
