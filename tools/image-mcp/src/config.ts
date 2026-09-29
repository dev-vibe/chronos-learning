export interface Config {
  port: number;
  dataDir: string;
  publicBaseUrl: string;
  connectorSecret: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  models: { reference: string; draft: string };
  maxReferenceBytes: number;
  /** Test-only: allow http:// and private-address reference URLs. */
  allowInsecureReferenceUrls: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const missing = ['OPENAI_API_KEY', 'CONNECTOR_SECRET', 'PUBLIC_BASE_URL'].filter((k) => !env[k]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  const secret = env.CONNECTOR_SECRET!;
  if (!/^[A-Za-z0-9_-]{24,}$/.test(secret)) {
    throw new Error('CONNECTOR_SECRET must be at least 24 URL-safe characters (A-Z a-z 0-9 _ -).');
  }
  return {
    port: Number(env.PORT ?? 8787),
    dataDir: env.DATA_DIR ?? './data',
    publicBaseUrl: env.PUBLIC_BASE_URL!.replace(/\/+$/, ''),
    connectorSecret: secret,
    openaiApiKey: env.OPENAI_API_KEY!,
    openaiBaseUrl: (env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/+$/, ''),
    models: {
      reference: env.IMAGE_MODEL_REFERENCE ?? 'gpt-image-2.5-sunburst',
      draft: env.IMAGE_MODEL_DRAFT ?? 'gpt-image-2.5-flare',
    },
    maxReferenceBytes: 20 * 1024 * 1024,
    allowInsecureReferenceUrls: env.ALLOW_INSECURE_REFERENCE_URLS === '1',
  };
}
