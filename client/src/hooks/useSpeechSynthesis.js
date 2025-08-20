// frontend/src/hooks/useSpeechSynthesis.js
import { useState, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      setSpeaking(true);
      
      utterance.onend = () => {
        setSpeaking(false);
      };
      
      utterance.onerror = () => {
        setSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis not supported');
    }
  }, []);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  return { speak, speaking, cancel };
};