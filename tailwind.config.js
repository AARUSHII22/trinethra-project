/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-tertiary-container": "#fafdff",
        "surface-dim": "#e6d7cd",
        "on-secondary": "#ffffff",
        "surface-container": "#faebe1",
        "on-surface": "#211a14",
        "surface-bright": "#fff8f5",
        "on-secondary-container": "#fffbff",
        "error-container": "#ffdad6",
        "inverse-on-surface": "#fdeee4",
        "on-error": "#ffffff",
        "tertiary-fixed": "#b6ebff",
        "surface-variant": "#efe0d6",
        "secondary-fixed": "#dde1ff",
        "primary-fixed": "#ffdcbf",
        "surface-container-highest": "#efe0d6",
        "on-tertiary-fixed": "#001f28",
        "tertiary": "#00657c",
        "surface": "#fff8f5",
        "primary-fixed-dim": "#ffb874",
        "on-background": "#211a14",
        "on-secondary-fixed": "#001355",
        "on-primary": "#ffffff",
        "primary": "#894d00",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#d8c3b2",
        "on-surface-variant": "#534437",
        "on-secondary-fixed-variant": "#0736ba",
        "surface-container-low": "#fff1e8",
        "secondary-fixed-dim": "#b8c3ff",
        "tertiary-fixed-dim": "#63d4f8",
        "on-primary-container": "#fffbff",
        "inverse-surface": "#372f28",
        "tertiary-container": "#007f9b",
        "error": "#ba1a1a",
        "outline": "#867465",
        "surface-container-high": "#f4e5db",
        "secondary": "#2d4fcf",
        "on-error-container": "#93000a",
        "on-tertiary-fixed-variant": "#004e60",
        "on-primary-fixed": "#2d1600",
        "secondary-container": "#4b69ea",
        "inverse-primary": "#ffb874",
        "surface-tint": "#8c4f00",
        "background": "#fff8f5",
        "primary-container": "#aa640e",
        "on-tertiary": "#ffffff",
        "on-primary-fixed-variant": "#6b3b00"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "margin": "32px",
        "container-max": "1280px",
        "gutter": "24px",
        "unit": "4px"
      },
      "maxWidth": {
        "container-max": "1280px"
      },
      "fontFamily": {
        "headline-md": ["Inter"],
        "label-caps": ["Inter"],
        "display-lg": ["Inter"],
        "body-base": ["Inter"],
        "transcript-text": ["Literata"],
        "data-mono": ["JetBrains Mono"]
      },
      "fontSize": {
        "headline-md": ["24px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "500"}],
        "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "display-lg": ["36px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "500"}],
        "body-base": ["16px", {"lineHeight": "1.7", "letterSpacing": "0", "fontWeight": "400"}],
        "transcript-text": ["17px", {"lineHeight": "1.8", "letterSpacing": "0", "fontWeight": "400"}],
        "data-mono": ["14px", {"lineHeight": "1.5", "letterSpacing": "0", "fontWeight": "400"}]
      }
    },
  },
  plugins: [],
}
