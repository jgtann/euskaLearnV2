'use client';

import { useState, useTransition } from 'react';
import { getSpeech } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AudioPlayer({ text }: { text: string }) {
    const [isPending, startTransition] = useTransition();
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const { toast } = useToast();

    const handlePlay = () => {
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
            return;
        }

        startTransition(async () => {
            const response = await getSpeech(text);
            if (response.error) {
                toast({
                    variant: 'destructive',
                    title: 'Speech Synthesis Error',
                    description: response.error,
                });
            } else if (response.data) {
                setAudioSrc(response.data.audio);
                const audio = new Audio(response.data.audio);
                audio.play();
            }
        });
    };

    return (
        <Button onClick={handlePlay} disabled={isPending} variant="ghost" size="icon">
            {isPending ? <Loader2 className="animate-spin" /> : <Volume2 />}
            <span className="sr-only">Play audio</span>
        </Button>
    );
}
