import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rfp.app',
  appName: 'RFP',
  webDir: 'dist',
  server: {
    hostname: 'app.rfp.com',
  }
};

export default config;
