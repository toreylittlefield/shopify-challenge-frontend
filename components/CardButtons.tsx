import React, { useState } from 'react';
import { ButtonGroup, Button } from '@shopify/polaris';
import { ShareModal } from './ShareModal';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { FiDelete } from 'react-icons/fi';
// import { ImagesData } from './App';

type PropTypes = {
  imageSrc: string;
  id: string;
  imageObj?: {};
  addEntry?: (srcURL: string, id: string) => void;
  deleteEntry?: (id: string) => void;
};

const CardButtons = ({ imageSrc, addEntry, id, deleteEntry, imageObj }: PropTypes) => {
  const [toggleLike, setToggleLike] = useState(false);

  const likeIcon = toggleLike ? <FcLike /> : <FcLikePlaceholder />;
  return (
    <ButtonGroup>
      <ShareModal imgSrc={imageSrc} imageObj={imageObj} />
      <Button
        icon={imageObj ? <FiDelete fillOpacity={0} color="red" /> : likeIcon}
        onClick={() => {
          if (addEntry) {
            if (toggleLike === false) {
              addEntry(imageSrc, id);
            }
            setToggleLike(!toggleLike);
          }
          if (deleteEntry && imageObj) {
            deleteEntry(imageObj.uuid);
            setToggleLike(false);
          }
        }}
      />
    </ButtonGroup>
  );
};

export { CardButtons };
