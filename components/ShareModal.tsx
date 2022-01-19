import { Button, ButtonGroup, Modal, Stack } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { GrLinkedin, GrFacebook, GrMail, GrTwitter, GrShareOption } from 'react-icons/gr';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { nextImageURL } from '../utils';
// import { ImagesData } from './App';

type ImgProp = {
  imgSrc: string;
  title: string;
};

type PropTypes = ImgProp & {
  imageObj?: {};
};

const handleClick = (url: string) => {
  window.open(url, 'DescriptiveWindowName', 'left=100,top=100,width=320,height=320');
};

const LinkedInShareButton = ({ imgSrc, title }: ImgProp) => {
  const linkeninURL = () => {
    const url = new URL('http://www.linkedin.com/sharing/share-offsite?');
    url.searchParams.append('url', encodeURI(imgSrc));
    url.searchParams.append('title', title || '');
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(linkeninURL())} icon={<GrLinkedin />} external url={linkeninURL()}>
      LinkedIn
    </Button>
  );
};

const FacebookShareButton = ({ imgSrc, title }: ImgProp) => {
  const facebookURL = () => {
    const url = new URL('https://www.facebook.com/sharer/sharer.php?');
    url.searchParams.append('u', imgSrc);
    url.searchParams.append('t', title);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(facebookURL())} icon={<GrFacebook />} external url={facebookURL()}>
      Facebook
    </Button>
  );
};

const MailToShareButton = ({ imgSrc, title }: ImgProp) => {
  // email
  const mailToURL = () => {
    const url = new URL('mailto:');
    url.searchParams.append('subject', `Beautiful NASA Photo of: ${title}`);
    url.searchParams.append('body', `Sharing this lovely NASA photo of a ${title} with you from ${encodeURI(imgSrc)}`);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(mailToURL())} icon={<GrMail />} external url={mailToURL()}>
      Email
    </Button>
  );
};

const TwitterShareButton = ({ imgSrc, title }: ImgProp) => {
  const twitterURL = () => {
    const url = new URL(`https://twitter.com/intent/tweet?`);
    url.searchParams.append('url', imgSrc);
    url.searchParams.append('text', title);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(twitterURL())} icon={<GrTwitter />} external url={twitterURL()}>
      Twitter
    </Button>
  );
};

const WhatsAppShareButton = ({ imgSrc, title }: ImgProp) => {
  const whatsappURL = () => {
    const url = new URL(`https://wa.me/?`);
    url.searchParams.append('text', `See this beautiful photo of a ${title} from NASA ${encodeURI(imgSrc)}`);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(whatsappURL())} icon={<AiOutlineWhatsApp />} external url={whatsappURL()}>
      WhatsApp
    </Button>
  );
};

function getFileNameFromURL(title: string) {
  const text = `A Lovely NASA photo of a ${title || ''}`;
  return text;
}

function createShareDataObj({ srcURL, text, file }: { srcURL: string; text: string; file: File }): ShareData {
  return {
    url: srcURL,
    title: text,
    text: text,
    files: [file],
  };
}

async function shareData(dataToShare: ShareData) {
  try {
    if (await (window.navigator as any).canShare(dataToShare)) {
      await navigator.share(dataToShare);
    }
  } catch (error) {
    console.warn(error);
  }
}

async function makeFile(srcURL: string) {
  const matches = srcURL.match('/[^/]*$');
  const [endOfURL] = matches as Array<string>;
  const url = nextImageURL(srcURL);
  const blob = await fetch(url).then((res) => res.blob());
  const file = new File([blob], `${endOfURL.replace('/', '')}.jpg`, {
    type: 'image/jpeg',
    lastModified: Number(new Date()),
  });
  return file;
}

const WebShareAPIButton = ({ imgSrc, imageObj, title }: PropTypes) => {
  const handleButtonShare = async () => {
    if (imageObj === undefined) {
      const file = await makeFile(imgSrc);
      const text = getFileNameFromURL(title);
      const dataToShare = createShareDataObj({ srcURL: imgSrc, text, file });
      shareData(dataToShare);
    } else {
      const file = await makeFile(imageObj.srcURL);
      const text = getFileNameFromURL(title);
      const dataToShare = createShareDataObj({
        srcURL: imageObj.srcURL,
        text: text,
        file: file,
      });
      shareData(dataToShare);
    }
  };

  return (
    <Button onClick={handleButtonShare} icon={<GrShareOption />}>
      Share Link
    </Button>
  );
};

const ShareModal = ({ imgSrc, imageObj, title }: PropTypes) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleModalChange = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const handleModalClose = () => {
    handleModalChange();
  };

  const activator = (
    <Button icon={<GrShareOption />} onClick={handleModalChange}>
      Share
    </Button>
  );
  return (
    <Modal
      small
      sectioned
      open={isOpen}
      activator={activator}
      onClose={handleModalClose}
      title="Share To Social"
      primaryAction={{
        content: 'Done',
        onAction: handleModalClose,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleModalClose,
        },
      ]}
    >
      <Modal.Section>
        <Stack distribution="center" alignment="trailing">
          <FacebookShareButton imgSrc={imgSrc} title={title} />
          <LinkedInShareButton imgSrc={imgSrc} title={title} />
          <TwitterShareButton imgSrc={imgSrc} title={title} />
          <MailToShareButton imgSrc={imgSrc} title={title} />
          <WhatsAppShareButton imgSrc={imgSrc} title={title} />
          <WebShareAPIButton imgSrc={imgSrc} title={title} imageObj={imageObj} />
        </Stack>
      </Modal.Section>
    </Modal>
  );
};

export { ShareModal };
