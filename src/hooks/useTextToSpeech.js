import { useState, useEffect } from 'react';
import { TTS_CONFIG } from '../config/tts';

const useTextToSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(TTS_CONFIG.DEFAULT_SETTINGS.voice);
  const [rate, setRate] = useState(TTS_CONFIG.DEFAULT_SETTINGS.rate);
  const [volume, setVolume] = useState(TTS_CONFIG.DEFAULT_SETTINGS.volume);

  const voices = TTS_CONFIG.SUPPORTED_VOICES;

  useEffect(() => {
    // Check for ResponsiveVoice after mount (script load)
    if (typeof window !== 'undefined') {
      if (window.responsiveVoice) {
        setIsSupported(true);
      } else {
        // Wait for script to load if not ready yet
        const interval = setInterval(() => {
          if (window.responsiveVoice) {
            setIsSupported(true);
            clearInterval(interval);
          }
        }, 200);
        // Timeout after 5s
        setTimeout(() => clearInterval(interval), 5000);
      }
    }
  }, []);

  // Hàm để làm sạch HTML tags và lấy text thuần
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const speak = (text) => {
    if (!isSupported || !window.responsiveVoice) {
      alert('Trình duyệt không hỗ trợ ResponsiveVoice.js');
      return;
    }
    const cleanText = stripHtml(text);
    if (!cleanText.trim()) {
      alert('Không có nội dung để đọc');
      return;
    }
    setIsLoading(true);
    window.responsiveVoice.speak(
      cleanText,
      selectedVoice,
      {
        rate: rate,
        volume: volume,
        onstart: () => {
          setIsPlaying(true);
          setIsPaused(false);
          setIsLoading(false);
        },
        onend: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setIsLoading(false);
        },
        onpause: () => {
          setIsPaused(true);
        },
        onresume: () => {
          setIsPaused(false);
        },
        onerror: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setIsLoading(false);
        }
      }
    );
  };

  const pause = () => {
    if (window.responsiveVoice && isPlaying && !isPaused) {
      window.responsiveVoice.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.responsiveVoice && isPaused) {
      window.responsiveVoice.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (window.responsiveVoice && (isPlaying || isPaused)) {
      window.responsiveVoice.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isPlaying,
    isPaused,
    isLoading,
    voices,
    selectedVoice,
    rate,
    volume,
    setSelectedVoice,
    setRate,
    setVolume,
    speak,
    pause,
    resume,
    stop
  };
};

export default useTextToSpeech;
