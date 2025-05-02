import { defineConfig } from 'tsup';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  entry: {
    agent: 'src/agent.index.tsx'
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.REACT_APP_REPOSITORY_URL': JSON.stringify(process.env.REACT_APP_REPOSITORY_URL || ''),
    'process.env.REACT_APP_API_DATE_FORMAT': JSON.stringify(process.env.REACT_APP_API_DATE_FORMAT || ''),
    'process.env.REACT_APP_API_TIME_FORMAT': JSON.stringify(process.env.REACT_APP_API_TIME_FORMAT || '')
  },
  format: ['iife'],
  bundle: true,
  outDir: 'public',
  globalName: 'agent'
});
