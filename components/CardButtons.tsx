import React, { Fragment, useCallback, useState } from 'react';
import { ButtonGroup, Button, Toast } from '@shopify/polaris';
import { ShareModal } from './ShareModal';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { FiDelete } from 'react-icons/fi';
// import { ImagesData } from './App';

type PropTypes = {
  imageSrc: string;
  id: string;
  title: string;
  imageObj?: {};
  addEntry?: (srcURL: string, id: string) => void;
  deleteEntry?: (id: string) => void;
};

const CardButtons = ({ id, title, imageSrc, addEntry, deleteEntry, imageObj }: PropTypes) => {
  const [toggleLike, setToggleLike] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toggleLiked = useCallback(() => setToggleLike((toggleLike) => !toggleLike), []);
  const likeIcon = toggleLike ? <FcLike /> : <FcLikePlaceholder />;
  const content = toggleLike ? 'Saved To Favorites' : 'Removed From Favorites';
  const toastMarkup = active ? <Toast content={content} onDismiss={toggleActive} duration={2500} /> : null;

  return (
    <Fragment>
      <ButtonGroup>
        <ShareModal imgSrc={imageSrc} imageObj={imageObj} title={title} />
        <Button
          icon={imageObj ? <FiDelete fillOpacity={0} color="red" /> : likeIcon}
          onClick={() => {
            if (addEntry) {
              if (toggleLike === false) {
                addEntry(imageSrc, id);
              }
              toggleLiked();
              toggleActive();
            }
            if (deleteEntry && imageObj) {
              deleteEntry(imageObj.uuid);
              toggleLiked();
              toggleActive();
            }
          }}
        />
      </ButtonGroup>
      {toastMarkup}
    </Fragment>
  );
};

export { CardButtons };
