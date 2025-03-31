import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { 
    themes: [{
      light: {
        "primary": "#4A3F35",
        "secondary": "#8B7355",
        "accent": "#E5E5E5",
        "neutral": "#4A3F35",
        "base-100": "#fffdf4",
        "base-200": "#F5F5F5",
        "base-300": "#E5E5E5",
        "base-content": "#4A3F35",
        "--rounded-box": "0.5rem",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "0.5rem",
        "--animation-btn": "0.3s",
        "--animation-input": "0.2s",
        "--btn-focus-scale": "0.95",
        "--border-btn": "1px",
        "--tab-border": "1px",
        "--tab-radius": "0.5rem",
      },
    }],
    logs: false 
  },
  content: ["./**/*.tsx"],
  theme: {
    container: { 
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        'brown': {
          DEFAULT: '#4A3F35',
          light: '#8B7355',
        },
        'beige': {
          DEFAULT: '#F5F5F5',
          dark: '#E5E5E5',
        }
      },
      animation: {
        sliding: "sliding 30s linear infinite",
        slideDown: "slideDown 0.3s ease-out",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideDown: {
          "0%": { 
            opacity: "0",
            transform: "translateY(-10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        }
      },
    },
  },
};
