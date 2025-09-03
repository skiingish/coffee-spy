'use client';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function useAddToHomescreenPrompt(): [
  IBeforeInstallPromptEvent | null,
  () => void
] {
  const [prompt, setState] = useState<IBeforeInstallPromptEvent | null>(null);

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt();
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    );
  };

  useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault();
      setState(e);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener('beforeinstallprompt', ready as any);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener('beforeinstallprompt', ready as any);
    };
  }, []);

  return [prompt, promptToInstall];
}

export default function InstallPrompt() {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [isVisible, setVisibleState] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  //const hide = () => setVisibleState(false);

  useEffect(() => {
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    if (prompt && !isIOS) {
      setVisibleState(true);
    }
  }, [prompt]);

  // if no need for the button, don't render anything.
  if (!isVisible || isStandalone) {
    return null;
  }

  if (isIOS) {
    return (
      <div className='text-white text-center'>
        <p>
          To install this app on your iOS device, tap the share button
          <span role='img' aria-label='share icon'>
            {' '}
            ⎋{' '}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role='img' aria-label='plus icon'>
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-row justify-start px-2'>
      <button
        className='whitespace-no-wrap py-2 px-4 rounded-full text-white border-grey-900 border-2 flex items-center'
        onClick={promptToInstall}
      >
        <Download size={16} className='mr-1' /> Install App
      </button>
    </div>
  );
}