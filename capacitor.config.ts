import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.wanlianli',
  appName: '万年历',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
