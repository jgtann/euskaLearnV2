'use server';

export async function synthesizeGoogleSpeech(text: string): Promise<{ audioDataUri?: string, error?: string }> {
  try {
     const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=eu&q=${encodeURIComponent(text)}`;
     const response = await fetch(url, {
         // Some basic headers to impersonate a regular request if needed, 
         // though 'tw-ob' usually works without headers on a server fetch.
         headers: {
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
         }
     });

     if (!response.ok) {
         throw new Error(`Google TTS API returned ${response.status}`);
     }

     const buffer = await response.arrayBuffer();
     const base64 = Buffer.from(buffer).toString('base64');
     
     return { audioDataUri: `data:audio/mp3;base64,${base64}` };
  } catch (err: any) {
     console.error('Google TTS proxy error:', err);
     return { error: err.message };
  }
}
