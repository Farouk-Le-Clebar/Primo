const HIDE_ON_LOGIN_KEY = "primo-news-hide-on-login";
const LAST_VISIT_KEY = "primo-news-last-visit";
const SHOWN_THIS_SESSION_KEY = "primo-news-shown";

export const newsPreferences = {
  isHiddenOnLogin: (): boolean => localStorage.getItem(HIDE_ON_LOGIN_KEY) === "1",
  hideOnLogin: (): void => localStorage.setItem(HIDE_ON_LOGIN_KEY, "1"),
  lastVisit: (): string | null => localStorage.getItem(LAST_VISIT_KEY),
  saveVisit: (): void => localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString()),
  wasShownThisSession: (): boolean => sessionStorage.getItem(SHOWN_THIS_SESSION_KEY) === "1",
  markShownThisSession: (): void => sessionStorage.setItem(SHOWN_THIS_SESSION_KEY, "1"),
};

export const OPEN_NEWS_EVENT = "primo:open-news";

export const openNewsPopup = (): void => {
  window.dispatchEvent(new Event(OPEN_NEWS_EVENT));
};
