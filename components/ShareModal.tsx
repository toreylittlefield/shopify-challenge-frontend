import { Button, Modal, Stack } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { GrLinkedin, GrFacebook, GrMail, GrTwitter, GrShareOption } from 'react-icons/gr';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { nextImageURL } from '../utils';
// import { ImagesData } from './App';

type ImgProp = {
  srcURL: string;
  title: string;
};

type PropTypes = ImgProp & {
  media_type?: 'image' | 'video' | string;
};

const handleClick = (url: string) => {
  window.open(url, 'DescriptiveWindowName', 'left=100,top=100,width=320,height=320');
};

const LinkedInShareButton = ({ srcURL, title }: ImgProp) => {
  const linkeninURL = () => {
    const url = new URL('http://www.linkedin.com/sharing/share-offsite?');
    url.searchParams.append('url', encodeURI(srcURL));
    url.searchParams.append('title', title || '');
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(linkeninURL())} icon={<GrLinkedin />} external url={linkeninURL()}>
      LinkedIn
    </Button>
  );
};

const FacebookShareButton = ({ srcURL, title }: ImgProp) => {
  const facebookURL = () => {
    const url = new URL('https://www.facebook.com/sharer/sharer.php?');
    url.searchParams.append('u', srcURL);
    url.searchParams.append('t', title);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(facebookURL())} icon={<GrFacebook />} external url={facebookURL()}>
      Facebook
    </Button>
  );
};

const MailToShareButton = ({ srcURL, title }: ImgProp) => {
  // email
  const mailToURL = () => {
    const url = new URL('mailto:');
    url.searchParams.append('subject', `Beautiful NASA Photo of: ${title}`);
    url.searchParams.append('body', `Sharing this lovely NASA photo of a ${title} with you from ${encodeURI(srcURL)}`);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(mailToURL())} icon={<GrMail />} external url={mailToURL()}>
      Email
    </Button>
  );
};

const TwitterShareButton = ({ srcURL, title }: ImgProp) => {
  const twitterURL = () => {
    const url = new URL(`https://twitter.com/intent/tweet?`);
    url.searchParams.append('url', srcURL);
    url.searchParams.append('text', title);
    return url.toString();
  };

  return (
    <Button onClick={() => handleClick(twitterURL())} icon={<GrTwitter />} external url={twitterURL()}>
      Twitter
    </Button>
  );
};

const WhatsAppShareButton = ({ srcURL, title }: ImgProp) => {
  const whatsappURL = () => {
    const url = new URL(`https://wa.me/?`);
    url.searchParams.append('text', `See this beautiful photo of a ${title} from NASA ${encodeURI(srcURL)}`);
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

function createShareDataObj({ srcURL, text, file }: { srcURL: string; text: string; file?: File }): ShareData {
  if (!file) {
    return {
      url: srcURL,
      title: text,
      text: text,
    };
  }

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

const WebShareAPIButton = ({ srcURL, media_type, title }: PropTypes) => {
  const handleButtonShare = async () => {
    if (srcURL) {
      const createShareObj: { srcURL: string; text: string; file: undefined | File } = {
        srcURL,
        text: '',
        file: undefined,
      };
      if (media_type !== 'video') {
        const fileToMake = await makeFile(srcURL);
        createShareObj.file = fileToMake;
      }
      createShareObj.text = getFileNameFromURL(title);
      const dataToShare = createShareDataObj(createShareObj);
      shareData(dataToShare);
    }
  };

  return (
    <Button onClick={handleButtonShare} icon={<GrShareOption />}>
      Share Link
    </Button>
  );
};

const ShareModal = ({ srcURL, media_type, title }: PropTypes) => {
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
          <FacebookShareButton srcURL={srcURL} title={title} />
          <LinkedInShareButton srcURL={srcURL} title={title} />
          <TwitterShareButton srcURL={srcURL} title={title} />
          <MailToShareButton srcURL={srcURL} title={title} />
          <WhatsAppShareButton srcURL={srcURL} title={title} />
          <WebShareAPIButton srcURL={srcURL} media_type={media_type} title={title} />
        </Stack>
      </Modal.Section>
    </Modal>
  );
};

export { ShareModal };
