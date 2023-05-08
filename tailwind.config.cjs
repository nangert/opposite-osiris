/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: "640px",
    },

    // Uncomment the following extend
    // if existing Tailwind color palette will be used

    extend: {
      backgroundColor: {
        'mantine-button-hover': withOpacity('--color-accent'),
        'mantine-button-hover-dark': withOpacity('--color-accent-dark'),
      },
      textColor: {
        'mantine-button-text': withOpacity('--color-text-button'),
        'mantine-button-text-dark': withOpacity('--color-text-button-dark'),
        'mantine-checkbox-label': withOpacity('--color-text-base'),
        'mantine-checkbox-label-dark': withOpacity('--color-text-base-dark'),
        'mantine-text-input-label': withOpacity('--color-text-base'),
        'mantine-text-input-label-dark': withOpacity('--color-text-base-dark'),
      },

    },
    textColor: {
      skin: {
        base: withOpacity("--color-text-base"),
        accent: withOpacity("--color-accent"),
        inverted: withOpacity("--color-fill"),
      },
    },
    backgroundColor: {
      skin: {
        fill: withOpacity("--color-fill"),
        accent: withOpacity("--color-accent"),
        inverted: withOpacity("--color-text-base"),
        card: withOpacity("--color-card"),
        "card-muted": withOpacity("--color-card-muted"),
      },
    },
    outlineColor: {
      skin: {
        fill: withOpacity("--color-accent"),
      },
    },
    borderColor: {
      skin: {
        line: withOpacity("--color-border"),
        fill: withOpacity("--color-text-base"),
        accent: withOpacity("--color-accent"),
      },
    },
    fill: {
      skin: {
        base: withOpacity("--color-text-base"),
        accent: withOpacity("--color-accent"),
      },
      transparent: "transparent",
    },
    fontFamily: {
      mono: ["IBM Plex Mono", "monospace"],
    },
    // },
  },
  plugins: [require("@tailwindcss/typography")],
};
