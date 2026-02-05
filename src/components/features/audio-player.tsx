'use client';

import { useState, useTransition } from 'react';
import { getSpeech } from '@/app/speech-actions';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2, User, UserRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Gender = 'male' | 'female';

export function AudioPlayer({ text }: { text: string }) {
    const [isPending, startTransition] = useTransition();
    const [audioSrc, setAudioSrc] = useState<Record<Gender, string | null>>({ male: null, female: null });
    const [selectedGender, setSelectedGender] = useState<Gender>('male');
    const { toast } = useToast();

    const handlePlay = () => {
        if (audioSrc[selectedGender]) {
            const audio = new Audio(audioSrc[selectedGender]!);
            audio.play();
            return;
        }

        startTransition(async () => {
            const response = await getSpeech(text, selectedGender);
            if (response.error) {
                toast({
                    variant: 'destructive',
                    title: 'Speech Synthesis Error',
                    description: response.error,
                });
            } else if (response.data) {
                setAudioSrc(prev => ({...prev, [selectedGender]: response.data.audio}));
                const audio = new Audio(response.data.audio);
                audio.play();
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border bg-background p-0.5">
                 <Button
                    variant={selectedGender === 'male' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setSelectedGender('male')}
                    className="h-7 w-7"
                    aria-label="Select male voice"
                >
                    <User className="size-4" />
                    <span className="sr-only">Male voice</span>
                </Button>
                <Button
                    variant={selectedGender === 'female' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setSelectedGender('female')}
                    className="h-7 w-7"
                    aria-label="Select female voice"
                >
                    <UserRound className="size-4" />
                    <span className="sr-only">Female voice</span>
                </Button>
            </div>
            <Button onClick={handlePlay} disabled={isPending} variant="secondary" size="icon" className="h-9 w-9">
                {isPending ? <Loader2 className="animate-spin" /> : <Volume2 />}
                <span className="sr-only">Play audio</span>
            </Button>
        </div>
    );
}
