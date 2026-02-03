// Gradient color for favorite icons (Sparkle, etc.)
// Usage: use as style={{ fill: 'url(#favorite-gradient)' }} or as a className for bg-gradient
export const FAVORITE_GRADIENT = {
  id: 'favorite-gradient',
  gradient: 'linear-gradient(80deg, #FFC300 0%, #FF4CD2 100%)',
  // For SVG usage
  svg: (
    <linearGradient id="favorite-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFC300" />
      <stop offset="100%" stopColor="#FF4CD2" />
    </linearGradient>
  ),
};
