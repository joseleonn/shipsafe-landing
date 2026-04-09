export const FPS = 30;
export const SCREEN_COUNT = 4;
export const SCREEN_DURATION = 5 * FPS; // 150 frames = 5 sec per screen
export const FADE_FRAMES = 20;
export const TOTAL_FRAMES = SCREEN_COUNT * SCREEN_DURATION; // 600

export const SCREENSHOTS = {
  dashboard: "screenshots/dashboard.jpg",
  analytics: "screenshots/analytics.jpg",
  checklist: "screenshots/checklist.jpg",
  menu: "screenshots/menu.jpg",
} as const;
