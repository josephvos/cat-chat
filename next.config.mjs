import { config } from 'dotenv';


config(); // Load environment variables from .env file

/** @type {NextConfig} */
const nextConfig = {
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
};

export default nextConfig;