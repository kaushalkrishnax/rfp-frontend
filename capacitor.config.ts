import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rfp.app",
  appName: "RFP",
  webDir: "dist",
  server: {
    hostname: "app.rfp.com",
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["phone"],
    }
  }
};

export default config;
