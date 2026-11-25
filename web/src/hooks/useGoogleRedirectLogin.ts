import { useEffect, useRef } from "react";
import { GOOGLE_CLIENT_ID } from "../constants/google";

const STATE_KEY = "primo-google-state";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const redirectUri = () => `${window.location.origin}/auth`;

export function startGoogleRedirect(): void {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: "token",
    scope: "openid email profile",
    prompt: "select_account",
    state,
  });
  window.location.assign(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}

const consumeRedirectToken = (): string | null => {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get("access_token");
  if (!token && !params.get("error")) return null;
  const expectedState = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  window.history.replaceState(null, "", window.location.pathname);
  return token && expectedState && params.get("state") === expectedState ? token : "";
};

export function useGoogleRedirectToken(onToken: (token: string) => void, onError: () => void): void {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const token = consumeRedirectToken();
    if (token === null) return;
    if (token) onToken(token);
    else onError();
  }, [onToken, onError]);
}
