# **App Name**: Euskal Sustatzailea

## Core Features:

- Daily Retention Scan: A scheduled cloud function scans user data daily to identify at-risk learners based on login activity and triggers the Rescue Mission.
- Rescue Mission Trigger: Assigns 'rescue' missions to at-risk users, setting a low difficulty level and providing a streak shield as a reward upon completion, safeguarding progress.
- AI-Powered Translanguaging: Gemini AI is used to translate user inputs and learning content between English and Basque, incorporating contrastive hints to aid schema formation and understanding.
- Morpheme Construction UI: Tile-based user interface components facilitate the construction of Basque words by combining morphemes, creating an interactive and educational experience.
- Spaced Retrieval System: Firestore is used to implement a spaced retrieval system, tracking and managing the intervals at which learning items are presented to users to optimize retention.
- Mastery Gates Validation: Backend logic automatically validates user accuracy before allowing progression to the next learning world, ensuring a solid understanding of the material.
- Personalized Error Analysis Tool: AI tool analyzes user performance data to identify specific morphemes (e.g., Ergative *-k* vs. Dative *-ri*) that cause the most errors, creating error heatmaps to reveal learning friction points.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a scholarly, intellectual feel.
- Background color: Very light Indigo (#E8EAF6).
- Accent color: Violet (#7953D2) to draw attention to key interactive elements.
- Headline font: 'Belleza', a humanist sans-serif, will provide personality.
- Body font: 'Alegreya' serif offers an elegant, contemporary reading experience. It will also be used where lengthier prose is expected.
- Use simple, clear icons to represent grammatical concepts.
- Employ a clean, card-based layout to organize learning content and provide a clear sense of progression.
- Subtle animations on the tile-based UI to provide feedback upon morpheme construction.