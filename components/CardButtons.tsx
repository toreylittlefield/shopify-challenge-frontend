import React, { Fragment, SetStateAction, useCallback, useState } from 'react';
import { ButtonGroup, Button, Toast } from '@shopify/polaris';
import { ShareModal } from './ShareModal';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { FiDelete } from 'react-icons/fi';
import { UpdatedImgObj } from '../types/nasa-api-data';

type PropTypes = UpdatedImgObj & {
  srcURL: string;
  id: string;
  title: string;
  addEntry?: (imgObject: UpdatedImgObj) => void;
  deleteEntry?: (id: string) => void;
  buttonType?: 'Like' | 'Delete';
  liked: boolean;
  setArticles: (prev?: SetStateAction<any>) => void;
};

const CardButtons = ({
  id,
  title,
  srcURL,
  addEntry,
  deleteEntry,
  setArticles,
  buttonType = 'Like',
  liked,
  ...rest
}: PropTypes) => {
  const [toggleLike, setToggleLike] = useState(liked);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toggleLiked = useCallback(() => setToggleLike((toggleLike) => !toggleLike), []);
  const likeIcon = liked ? <FcLike /> : <FcLikePlaceholder />;
  const content = liked ? 'Saved To Favorites' : 'Removed From Favorites';
  const toastMarkup = active ? <Toast content={content} onDismiss={toggleActive} duration={1000} /> : null;
  const dataObjToAdd: UpdatedImgObj = { ...rest, id, title, srcURL } as UpdatedImgObj;

  const updateLike = (bool?: boolean) => {
    setArticles((prev: UpdatedImgObj[]) => {
      const mapCopy = prev.map((obj) => {
        if (obj.id === id) {
          obj.liked = bool !== undefined ? bool : !liked;
          return obj;
        }
        return obj;
      });
      return mapCopy;
    });
  };

  return (
    <Fragment>
      <ButtonGroup>
        <ShareModal media_type={rest.media_type} srcURL={srcURL} title={title} />
        <Button
          icon={buttonType === 'Like' ? likeIcon : <FiDelete fillOpacity={0} color="red" />}
          onClick={() => {
            if (addEntry) {
              if (toggleLike === false) {
                addEntry(dataObjToAdd);
              } else if (toggleLike && deleteEntry) {
                deleteEntry(id);
              }
              updateLike();
              toggleLiked();
              toggleActive();
            }
            if (deleteEntry && buttonType === 'Delete') {
              deleteEntry(id);
              updateLike(false);
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
