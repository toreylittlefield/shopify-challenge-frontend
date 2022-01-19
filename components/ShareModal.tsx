import { Button, Modal, Stack } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { GrLinkedin, GrFacebook, GrMail, GrTwitter, GrShareOption } from 'react-icons/gr';
import { AiOutlineWhatsApp } from 'react-icons/ai';
// import { ImagesData } from './App';

type ImgProp = {
  imgSrc: string;
};

type PropTypes = ImgProp & {
  imageObj?: {};
};

const handleClick = (url: string) => {
  window.open(url, 'DescriptiveWindowName', 'left=100,top=100,width=320,height=320');
};

const LinkedInShareButton = ({ imgSrc }: ImgProp) => {
  const linkeninURL = () => {
    const url = new URL('http://www.linkedin.com/sharing/share-offsite?');
    url.searchParams.append('url', encodeURI(imgSrc));
    url.searchParams.append('title', `See this photo of a dog`);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(linkeninURL())} icon={<GrLinkedin />} external url={linkeninURL()}>
      LinkedIn
    </Button>
  );
};

const FacebookShareButton = ({ imgSrc }: ImgProp) => {
  const facebookURL = () => {
    const url = new URL('https://www.facebook.com/sharer/sharer.php?');
    url.searchParams.append('u', imgSrc);
    url.searchParams.append('t', 'hellow world');
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(facebookURL())} icon={<GrFacebook />} external url={facebookURL()}>
      Facebook
    </Button>
  );
};

const MailToShareButton = ({ imgSrc }: ImgProp) => {
  // email
  const mailToURL = () => {
    const url = new URL('mailto:');
    url.searchParams.append('subject', `See this photo of a dog`);
    url.searchParams.append('body', `See this photo of a dog at ${encodeURI(imgSrc)}`);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(mailToURL())} icon={<GrMail />} external url={mailToURL()}>
      Email
    </Button>
  );
};

const TwitterShareButton = ({ imgSrc }: ImgProp) => {
  const twitterURL = () => {
    const url = new URL(`https://twitter.com/intent/tweet?`);
    url.searchParams.append('url', imgSrc);
    url.searchParams.append('text', 'hellow world');
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(twitterURL())} icon={<GrTwitter />} external url={twitterURL()}>
      Twitter
    </Button>
  );
};

const WhatsAppShareButton = ({ imgSrc }: ImgProp) => {
  const whatsappURL = () => {
    const url = new URL(`https://wa.me/?`);
    url.searchParams.append('text', `See this photo of a dog at ${encodeURI(imgSrc)}`);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(whatsappURL())} icon={<AiOutlineWhatsApp />} external url={whatsappURL()}>
      WhatsApp
    </Button>
  );
};

function getFileNameFromURL(srcURL: string) {
  const url = new URL(srcURL);
  let dogType = url.pathname.split('/')[2];
  const text = `A pic of a cute ${dogType || ''} doggo`;
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
  const blob = await (await fetch(srcURL)).blob();
  const file = new File([blob], `${endOfURL.replace('/', '')}.jpg`, {
    type: 'image/jpeg',
    lastModified: Number(new Date()),
  });
  return file;
}

const WebShareAPIButton = ({ imgSrc, imageObj }: PropTypes) => {
  const handleButtonShare = async () => {
    if (imageObj === undefined) {
      const file = await makeFile(imgSrc);
      const text = getFileNameFromURL(imgSrc);
      const dataToShare = createShareDataObj({ srcURL: imgSrc, text, file });
      shareData(dataToShare);
    } else {
      const file = await makeFile(imageObj.srcURL);
      const text = getFileNameFromURL(imageObj.srcURL);
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

const ShareModal = ({ imgSrc, imageObj }: PropTypes) => {
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
        <Stack distribution="fillEvenly" alignment="center">
          <FacebookShareButton imgSrc={imgSrc} />
          <LinkedInShareButton imgSrc={imgSrc} />
          <TwitterShareButton imgSrc={imgSrc} />
          <MailToShareButton imgSrc={imgSrc} />
          <WhatsAppShareButton imgSrc={imgSrc} />
          <WebShareAPIButton imgSrc={imgSrc} imageObj={imageObj} />
        </Stack>
      </Modal.Section>
    </Modal>
  );
};

export { ShareModal };
