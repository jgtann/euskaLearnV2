'use server';

/**
 * Server action to call the Elhuyar TTS API.
 * Requires ELHUYAR_API_KEY to be set in the .env file.
 */
export async function synthesizeElhuyarSpeech(text: string): Promise<{ audioDataUri?: string, error?: string }> {
  try {
    const apiKey = process.env.ELHUYAR_API_KEY;
    
    // If the user hasn't added their key yet, return an error so the frontend can gracefully fallback
    if (!apiKey || apiKey === 'your_key_here') {
      return { error: 'ELHUYAR_API_KEY is not configured in .env' };
    }

    // Example Elhuyar REST API endpoint
    // Note: The specific URL and payload may vary slightly based on Elhuyar's current API documentation version.
    const endpoint = 'https://api.elhuyar.eus/tts/v1/synthesize';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: text,
        language: 'eu', // Basque
        // voice: 'Ainhoa', // Optional: specify a particular Elhuyar synthetic voice if desired
      }),
    });

    if (!response.ok) {
        throw new Error(`Elhuyar API returned ${response.status}: ${response.statusText}`);
    }

    // Assuming the API returns the audio binary directly (MPEG/MP3)
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return { audioDataUri: `data:audio/mp3;base64,${base64Audio}` };
    
    /* 
     * NOTE: If Elhuyar returns JSON instead of binary, you would parse it like this:
     * const data = await response.json();
     * return { audioDataUri: `data:audio/mp3;base64,${data.audioBase64}` };
     */
  } catch (err: any) {
    console.error('Elhuyar TTS Error:', err);
    return { error: err.message };
  }
}
