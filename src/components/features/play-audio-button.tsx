'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2 } from 'lucide-react';
import { synthesizeElhuyarSpeech } from '@/app/actions/elhuyar-tts';
import { synthesizeGoogleSpeech } from '@/app/actions/google-tts';

export function PlayAudioButton({ 
  text, 
  className = '',
  onPlayStateChange
}: { 
  text: string; 
  className?: string;
  onPlayStateChange?: (isPlaying: boolean, duration?: number) => void;
}) {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const playAudio = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    
    try {
      // 1. Try Elhuyar (Gold Standard Authentic Basque)
      const elhuyarResult = await synthesizeElhuyarSpeech(text);
      if (!elhuyarResult.error && elhuyarResult.audioDataUri) {
         const audio = new Audio(elhuyarResult.audioDataUri);
         audio.playbackRate = 0.85;
         
         await new Promise((resolve) => {
             if (audio.readyState >= 1) resolve(null);
             else audio.addEventListener('loadedmetadata', () => resolve(null), { once: true });
         });

         audio.onended = () => { setIsSynthesizing(false); onPlayStateChange?.(false); };
         audio.onerror = () => tryTranslateTTS(text);
         
         await audio.play();
         const realDurationMs = (audio.duration / audio.playbackRate) * 1000;
         onPlayStateChange?.(true, Number.isFinite(realDurationMs) ? realDurationMs : undefined);
         return;
      }
      
      // If Elhuyar API key is missing or errored, fallback to standard
      console.warn('Elhuyar TTS not available, falling back:', elhuyarResult.error);
      tryTranslateTTS(text);
      
    } catch (err) {
      console.warn('Audio play error, falling back', err);
      tryTranslateTTS(text);
    }
  };

  const tryTranslateTTS = async (fallbackText: string) => {
     try {
       // 2. Try Server-Proxied Google TTS (Bypasses CORS and tracking protections)
       const googleResult = await synthesizeGoogleSpeech(fallbackText);
       
       if (googleResult.audioDataUri) {
           const audio = new Audio(googleResult.audioDataUri);
           audio.playbackRate = 0.85;

           await new Promise((resolve) => {
               if (audio.readyState >= 1) resolve(null);
               else audio.addEventListener('loadedmetadata', () => resolve(null), { once: true });
           });

           audio.onended = () => { setIsSynthesizing(false); onPlayStateChange?.(false); };
           audio.onerror = () => {
               console.warn('Translate TTS audio playback failed, falling back to browser TTS');
               fallbackBrowserTTS(fallbackText);
           };
           
           await audio.play();
           const realDurationMs = (audio.duration / audio.playbackRate) * 1000;
           onPlayStateChange?.(true, Number.isFinite(realDurationMs) ? realDurationMs : undefined);
       } else {
           throw new Error(googleResult.error || 'Google TTS failed');
       }
     } catch (e) {
         console.warn('Server TTS failed:', e);
         fallbackBrowserTTS(fallbackText);
     }
  };

  const fallbackBrowserTTS = (fallbackText: string) => {
    // 3. Absolute fallback to Browser TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fallbackText);
      utterance.lang = 'eu-ES';
      utterance.rate = 0.85;
      utterance.onend = () => { setIsSynthesizing(false); onPlayStateChange?.(false); };
      utterance.onerror = () => { setIsSynthesizing(false); onPlayStateChange?.(false); };
      window.speechSynthesis.speak(utterance);
      onPlayStateChange?.(true);
    } else {
      setIsSynthesizing(false);
      onPlayStateChange?.(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 text-muted-foreground hover:text-primary rounded-full ${className}`}
      onClick={playAudio}
      disabled={isSynthesizing}
      title="Play authentic Basque pronunciation"
    >
      {isSynthesizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );
}
