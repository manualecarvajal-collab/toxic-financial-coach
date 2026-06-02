import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.toxicfinancial.coach',
  appName: 'Toxic Financial Coach',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
