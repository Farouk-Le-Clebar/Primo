export {};

declare global {
  interface Window {
    _env_?: {
      API_URL?: string;
    };
  }
}
