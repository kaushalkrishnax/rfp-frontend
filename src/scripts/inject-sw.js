import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const template = fs.readFileSync("src/firebase/sw.template.js", "utf8");

const injected = template
  .replace("__API_KEY__", process.env.VITE_FIREBASE_API_KEY)
  .replace("__AUTH_DOMAIN__", process.env.VITE_FIREBASE_AUTH_DOMAIN)
  .replace("__PROJECT_ID__", process.env.VITE_FIREBASE_PROJECT_ID)
  .replace("__STORAGE_BUCKET__", process.env.VITE_FIREBASE_STORAGE_BUCKET)
  .replace("__MESSAGING_SENDER_ID__", process.env.VITE_FIREBASE_MESSAGING_SENDER_ID)
  .replace("__APP_ID__", process.env.VITE_FIREBASE_APP_ID)
  .replace("__MEASUREMENT_ID__", process.env.VITE_FIREBASE_MEASUREMENT_ID);

fs.writeFileSync("public/firebase-messaging-sw.js", injected);