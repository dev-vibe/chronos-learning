import { createApp } from './app.ts';
import { loadConfig } from './config.ts';

const cfg = loadConfig();
createApp(cfg).listen(cfg.port, () => {
  console.log(`chronos-image MCP listening on :${cfg.port}`);
  console.log(`Connector URL: ${cfg.publicBaseUrl}/mcp/<CONNECTOR_SECRET>`);
});
