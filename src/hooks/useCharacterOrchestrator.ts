import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeech } from './useSpeech';
import type { RoastResponse } from '../types';

type Anim = 'idle' | 'talking' | 'roasting' | 'laughing';

export function useCharacterOrchestrator(response: RoastResponse | null) {
  const [animation, setAnimation] = useState<Anim>('idle');
  const { speak, cancel } = useSpeech();
  const prevResponseRef = useRef<RoastResponse | null>(null);

  useEffect(() => {
    if (!response || response === prevResponseRef.current) return;
    prevResponseRef.current = response;

    const timeout = setTimeout(() => {
      setAnimation('roasting');

      const roastText = response.roast;
      setTimeout(() => {
        setAnimation('talking');
        speak(roastText, {
          onEnd: () => {
            const grade = response.toxicGrade;
            if (grade === 'A' || grade === 'F' || grade === 'A+') {
              setAnimation('laughing');
              setTimeout(() => setAnimation('idle'), 2000);
            } else {
              setAnimation('idle');
            }
          },
        });
      }, 600);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [response, speak]);

  const resetAnimation = useCallback(() => {
    cancel();
    setAnimation('idle');
  }, [cancel]);

  return { animation, resetAnimation };
}
