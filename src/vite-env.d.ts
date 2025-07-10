/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_FEATURE_USE_CUSTOM_VERSION_UPDATE: string;
  readonly VITE_FEATURE_DEMO_MODE: string;
  readonly VITE_FEATURE_BETA_LANGUAGES: string;
  readonly VITE_FEATURE_NOTIFICATIONS: string;
  readonly VITE_STACK_PROJECT_ID: string;
  readonly VITE_STACK_PUBLISHABLE_CLIENT_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
