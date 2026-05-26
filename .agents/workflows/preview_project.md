# Preview Project Workflow

This workflow documents the standard procedure for running the preview server for the Euskal Sustatzailea (NextJS) project.

## Steps

1. **Start the Development Server:**
   To preview the app locally, start the NextJS development server by running:
   ```bash
   npm run dev -- --port $PORT --hostname 0.0.0.0
   ```
   *Note: If `$PORT` is not defined in your environment, you can simply run `npm run dev` to start it on the default port (usually 3000).*

2. **Access the Preview:**
   - Wait for the server to indicate it has started successfully (e.g., `ready - started server on 0.0.0.0:3000`).
   - Open your web browser and navigate to the provided URL (e.g., `http://localhost:3000`).
