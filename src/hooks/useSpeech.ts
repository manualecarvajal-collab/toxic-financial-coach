import { useCallback, useRef, useEffect, useState } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

function findWebSpeechVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.lang.startsWith('es-US') && /male/i.test(v.name)) ||
    voices.find(v => v.lang.startsWith('es-US')) ||
    voices.find(v => v.lang.startsWith('es-MX') && /male/i.test(v.name)) ||
    voices.find(v => v.lang.startsWith('es-MX')) ||
    voices.find(v => v.lang.startsWith('es') && /male/i.test(v.name)) ||
    voices.find(v => v.lang.startsWith('es')) ||
    null
  );
}

function speakWithWebSpeech(text: string, options: SpeechOptions) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = findWebSpeechVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || 'es-MX';
  utterance.rate = options.rate ?? 0.8;
  utterance.pitch = options.pitch ?? 0.3;
  utterance.volume = options.volume ?? 1;
  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = (e) => options.onError?.(e.error);
  window.speechSynthesis.speak(utterance);
}

export function useSpeech() {
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      window.speechSynthesis.getVoices();
      setReady(true);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    setTimeout(load, 1000);
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback(async (text: string, options: SpeechOptions = {}) => {
    cancel();

    const baseUrl = import.meta.env.VITE_API_URL || '';
    try {
      const res = await fetch(`${baseUrl}/api/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error('TTS API no disponible');

      const data = await res.json();
      if (!data.audio) throw new Error('Sin audio');

      options.onStart?.();

      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      currentAudio.current = audio;

      audio.onended = () => {
        currentAudio.current = null;
        options.onEnd?.();
      };
      audio.onerror = () => {
        currentAudio.current = null;
        options.onError?.('Error reproduciendo audio');
      };

      audio.play().catch(() => {
        currentAudio.current = null;
        options.onError?.('Error al reproducir');
      });

    } catch {
      speakWithWebSpeech(text, options);
    }
  }, []);

  const cancel = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }
    window.speechSynthesis.cancel();
  }, []);

  const isSpeaking = useCallback(() => {
    return !!(currentAudio.current || window.speechSynthesis.speaking);
  }, []);

  return { speak, cancel, isSpeaking, ready };
}
