export const isStandaloneApp = (): boolean =>
  window.matchMedia("(display-mode: standalone)").matches || document.referrer.startsWith("android-app://");

export const canInstallAndroidApp = (): boolean => /Android/i.test(navigator.userAgent) && !isStandaloneApp();

export const canDisplayPdfInline = (): boolean => navigator.pdfViewerEnabled !== false;
