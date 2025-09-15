/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundsecondary: "var(--backgroundsecondary)",
        borderdefault: "var(--borderdefault)",
        "dark-modebackgrounddefault": "var(--dark-modebackgrounddefault)",
        "dark-modebackgroundprimary": "var(--dark-modebackgroundprimary)",
        "dark-modebackgroundprimary-disabled":
          "var(--dark-modebackgroundprimary-disabled)",
        "dark-modebackgroundsecondary": "var(--dark-modebackgroundsecondary)",
        "dark-modeborderdefault": "var(--dark-modeborderdefault)",
        "dark-modeborderprimary": "var(--dark-modeborderprimary)",
        "dark-modetextdefault": "var(--dark-modetextdefault)",
        "dark-modetextprimary": "var(--dark-modetextprimary)",
        "dark-modetextsecondary": "var(--dark-modetextsecondary)",
        "light-modebackgrounddefault": "var(--light-modebackgrounddefault)",
        "light-modebackgroundprimary": "var(--light-modebackgroundprimary)",
        "light-modebackgroundsecondary": "var(--light-modebackgroundsecondary)",
        "light-modeborderdefault": "var(--light-modeborderdefault)",
        "light-modetextdefault": "var(--light-modetextdefault)",
        "light-modetexton-primary": "var(--light-modetexton-primary)",
        textsecondary: "var(--textsecondary)",
      },
      fontFamily: {
        "button-button3-semibold": "var(--button-button3-semibold-font-family)",
        "header-h2": "var(--header-h2-font-family)",
        "header-h4": "var(--header-h4-font-family)",
        "label-regular": "var(--label-regular-font-family)",
        "text-body1-medium": "var(--text-body1-medium-font-family)",
        "text-body1-regular": "var(--text-body1-regular-font-family)",
        "text-body2-medium": "var(--text-body2-medium-font-family)",
        "text-body2-regular": "var(--text-body2-regular-font-family)",
        "text-body3-medium": "var(--text-body3-medium-font-family)",
      },
    },
  },
  plugins: [],
};
