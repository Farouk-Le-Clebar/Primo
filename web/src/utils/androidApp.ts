import { ANDROID_APK_URL } from "../constants/androidApp";

export const downloadAndroidApp = (): void => {
  window.location.assign(ANDROID_APK_URL);
};
