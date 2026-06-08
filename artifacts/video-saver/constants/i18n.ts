export type Language = "ar" | "en";

export const translations = {
  ar: {
    appName: "فيديو سيفر",
    appTagline: "حمّل أي فيديو بجودة عالية",
    pasteLink: "الصق رابط الفيديو هنا",
    download: "تحميل",
    downloading: "جاري التحميل...",
    fetchingInfo: "جاري جلب معلومات الفيديو...",
    downloadSuccess: "تم التحميل بنجاح!",
    downloadError: "فشل التحميل. تحقق من الرابط.",
    invalidUrl: "الرابط غير صالح",
    selectQuality: "اختر الجودة",
    quality: "الجودة",
    format: "الصيغة",
    duration: "المدة",
    title: "العنوان",
    history: "السجل",
    noHistory: "لا يوجد سجل تحميل بعد",
    clearHistory: "مسح السجل",
    settings: "الإعدادات",
    language: "اللغة",
    theme: "المظهر",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    systemDefault: "افتراضي النظام",
    supportedPlatforms: "المنصات المدعومة",
    howToUse: "كيفية الاستخدام",
    step1: "انسخ رابط الفيديو",
    step2: "الصق الرابط في الحقل",
    step3: "اختر الجودة واضغط تحميل",
    openInBrowser: "افتح في المتصفح",
    copyLink: "نسخ الرابط",
    share: "مشاركة",
    delete: "حذف",
    bytes: "بايت",
    kb: "كيلوبايت",
    mb: "ميجابايت",
    gb: "جيجابايت",
    seconds: "ث",
    minutes: "د",
    hours: "س",
    videoInfo: "معلومات الفيديو",
    tapToDownload: "اضغط للتحميل",
    pasteFromClipboard: "لصق من الحافظة",
    clearInput: "مسح",
    retry: "إعادة المحاولة",
    cancel: "إلغاء",
    done: "تم",
    youtube: "يوتيوب",
    instagram: "انستغرام",
    tiktok: "تيك توك",
    twitter: "تويتر / إكس",
    facebook: "فيسبوك",
    reddit: "ريديت",
    other: "أخرى",
    noTitle: "بدون عنوان",
    downloadedAt: "تم التحميل في",
    errorFetchingInfo: "لم يتمكن من جلب معلومات الفيديو",
    pasteHint: "YouTube, Instagram, TikTok, Twitter...",
    downloadHint: "يتم التحميل عبر المتصفح",
  },
  en: {
    appName: "VideoSaver",
    appTagline: "Download any video in high quality",
    pasteLink: "Paste video URL here",
    download: "Download",
    downloading: "Downloading...",
    fetchingInfo: "Fetching video info...",
    downloadSuccess: "Downloaded successfully!",
    downloadError: "Download failed. Check the URL.",
    invalidUrl: "Invalid URL",
    selectQuality: "Select Quality",
    quality: "Quality",
    format: "Format",
    duration: "Duration",
    title: "Title",
    history: "History",
    noHistory: "No download history yet",
    clearHistory: "Clear History",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    systemDefault: "System Default",
    supportedPlatforms: "Supported Platforms",
    howToUse: "How to Use",
    step1: "Copy the video link",
    step2: "Paste the link in the field",
    step3: "Select quality and press Download",
    openInBrowser: "Open in Browser",
    copyLink: "Copy Link",
    share: "Share",
    delete: "Delete",
    bytes: "B",
    kb: "KB",
    mb: "MB",
    gb: "GB",
    seconds: "s",
    minutes: "m",
    hours: "h",
    videoInfo: "Video Info",
    tapToDownload: "Tap to Download",
    pasteFromClipboard: "Paste from Clipboard",
    clearInput: "Clear",
    retry: "Retry",
    cancel: "Cancel",
    done: "Done",
    youtube: "YouTube",
    instagram: "Instagram",
    tiktok: "TikTok",
    twitter: "Twitter / X",
    facebook: "Facebook",
    reddit: "Reddit",
    other: "Other",
    noTitle: "No Title",
    downloadedAt: "Downloaded at",
    errorFetchingInfo: "Could not fetch video info",
    pasteHint: "YouTube, Instagram, TikTok, Twitter...",
    downloadHint: "Download opens in browser",
  },
};

export function t(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] ?? translations.en[key];
}

export function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("facebook.com") || url.includes("fb.com")) return "facebook";
  if (url.includes("reddit.com")) return "reddit";
  return "other";
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: "#FF0000",
    instagram: "#E1306C",
    tiktok: "#000000",
    twitter: "#1DA1F2",
    facebook: "#1877F2",
    reddit: "#FF4500",
    other: "#6b7280",
  };
  return colors[platform] ?? colors.other;
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildDownloadUrl(url: string): string {
  const platform = detectPlatform(url);
  // Use y2mate for YouTube, saveinsta for Instagram, etc.
  const serviceMap: Record<string, string> = {
    youtube: `https://www.y2mate.com/youtube/${encodeURIComponent(url)}`,
    instagram: `https://saveinsta.app/?url=${encodeURIComponent(url)}`,
    tiktok: `https://snaptik.app/?url=${encodeURIComponent(url)}`,
    twitter: `https://twittervideodownloader.com/?url=${encodeURIComponent(url)}`,
    facebook: `https://fdown.net/?URLz=${encodeURIComponent(url)}`,
    reddit: `https://redditsave.com/?url=${encodeURIComponent(url)}`,
    other: `https://9convert.com/?url=${encodeURIComponent(url)}`,
  };
  return serviceMap[platform] ?? serviceMap.other;
}
