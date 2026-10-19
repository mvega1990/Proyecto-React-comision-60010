export const Logo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="42" r="34" fill="#000000" stroke="var(--accent)" strokeWidth="6" />
    <text
      x="50"
      y="53"
      textAnchor="middle"
      fontFamily="Space Grotesk, sans-serif"
      fontWeight="700"
      fontSize="28"
      fill="#FFFFFF"
    >
      BA
    </text>
    <polygon points="14,68 86,68 92,84 8,84" fill="url(#logo-ribbon-gradient)" />
    <text
      x="50"
      y="80"
      textAnchor="middle"
      fontFamily="Space Grotesk, sans-serif"
      fontWeight="700"
      fontSize="9"
      fill="#FFFFFF"
    >
      HERRAMIENTAS
    </text>
    <defs>
      <linearGradient id="logo-ribbon-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="var(--accent-3)" />
        <stop offset="1" stopColor="var(--accent-2)" />
      </linearGradient>
    </defs>
  </svg>
);
