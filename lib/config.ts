import fs from 'fs';
import path from 'path';

interface Config {
  serverUrl: string;
  apiKey: string;
  clientId: string;
}

let cachedConfig: Config | null = null;

export function getServerConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  // Try environment variables first
  const envConfig = {
    serverUrl: process.env.SERVER_URL,
    apiKey: process.env.API_KEY,
    clientId: process.env.CLIENT_ID,
  };

  if (envConfig.serverUrl && envConfig.apiKey && envConfig.clientId) {
    cachedConfig = envConfig as Config;
    return cachedConfig;
  }

  // Try to read from local storage data (for Next.js API routes)
  if (typeof window !== 'undefined') {
    const localConfig = {
      serverUrl: localStorage.getItem('serverUrl'),
      apiKey: localStorage.getItem('apiKey'),
      clientId: localStorage.getItem('clientId'),
    };

    if (localConfig.serverUrl && localConfig.apiKey && localConfig.clientId) {
      cachedConfig = localConfig as Config;
      return cachedConfig;
    }
  }

  // For server-side, try to read from a temporary config file
  try {
    const configPath = path.join(process.cwd(), '.setup-config.json');
    if (fs.existsSync(configPath)) {
      const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')) as Config;
      cachedConfig = fileConfig;
      return cachedConfig;
    }
  } catch (error) {
    console.warn('Could not read config file:', error);
  }

  throw new Error('Configuration not found. Please complete setup first.');
}

export function setServerConfig(config: Config): void {
  cachedConfig = config;
  
  // Also write to a temporary file for server-side access
  try {
    const configPath = path.join(process.cwd(), '.setup-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.warn('Could not write config file:', error);
  }
}
