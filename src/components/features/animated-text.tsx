'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';

// Hidden Phonetic Layer: Estimates the speaking duration relative to word complexity
function getWordPhoneticWeight(word: string): number {
    // 1. Basque phonology is vowel-heavy. We count vowel clusters as a proxy for syllables.
    // e.g., "Euskal" -> Eu, a (2). "Herria" -> e, i, a (3)
    const vowelClusters = word.match(/[aeiouyáéíóúüñ]+/gi);
    let weight = vowelClusters ? vowelClusters.length : 1;
    
    // 2. Add linguistic pause weights for punctuation that naturally forces breath/cadence pauses
    if (word.includes(',')) weight += 2; // Short pause
    if (word.match(/[.!?:]/)) weight += 4; // Long sentence-ending pause
    if (word.match(/[-;]/)) weight += 1.5; // Micro pause
    
    // Guarantee minimal baseline weight so impossibly short tokens still register visually
    return Math.max(1, weight);
}

export function AnimatedText({ 
  text, 
  isPlaying, 
  duration,
  className,
  activeClassName = 'text-primary font-bold scale-105 drop-shadow-md'
}: { 
  text: string; 
  isPlaying: boolean;
  duration?: number;
  className?: string;
  activeClassName?: string;
}) {
  const words = useMemo(() => text.split(' '), [text]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!isPlaying) {
      setActiveIndex(-1);
      return;
    }
    
    // Pre-calculate phonetic weights for the whole sentence
    const wordWeights = words.map(getWordPhoneticWeight);
    const totalSentenceWeight = wordWeights.reduce((acc, weight) => acc + weight, 0);
    
    // Pad the sentence with 3 extra "syllables" worth of time at the very end to let the last word linger
    const PADDED_TOTAL_WEIGHT = totalSentenceWeight + 3; 
    
    // If exact metadata duration provided from audio context, derive absolute ms weight. 
    // Otherwise fallback to an authentic basque heuristic of ~180ms per syllable/weight.
    const workingDurationMs = (duration && duration > 0) ? duration : (PADDED_TOTAL_WEIGHT * 180);
    
    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];
    
    let currentStartTimeMs = 0;
    
    words.forEach((word, index) => {
        const weight = wordWeights[index];
        // Distribute the exact amount of milliseconds this word gets proportional to its phonetic weight
        const allocatedTimeMs = (weight / PADDED_TOTAL_WEIGHT) * workingDurationMs;
        
        const timeoutId = setTimeout(() => {
            if (isMounted) setActiveIndex(index);
        }, currentStartTimeMs);
        
        timeouts.push(timeoutId);
        currentStartTimeMs += allocatedTimeMs;
    });
    
    // Final timeout to clear the active highlight gracefully
    const cleanupTimeoutId = setTimeout(() => {
        if (isMounted) setActiveIndex(-1);
    }, currentStartTimeMs);
    timeouts.push(cleanupTimeoutId);
    
    return () => {
        isMounted = false;
        timeouts.forEach(clearTimeout);
    };
  }, [isPlaying, duration, words]);

  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className={cn(
            "inline-block mr-[0.25em] transition-all duration-300",
            // We highlight the current active word AND visually link the next contiguous word subtly for a smoother 'sweep'
            activeIndex === i || activeIndex === i + 1 
                ? activeClassName 
                : "opacity-100" 
          )}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
