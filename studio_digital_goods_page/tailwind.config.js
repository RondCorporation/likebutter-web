/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backgrounddefault: "var(--backgrounddefault)",
        backgroundsecondary: "var(--backgroundsecondary)",
        borderdefault: "var(--borderdefault)",
        "dark-modebackgrounddefault": "var(--dark-modebackgrounddefault)",
        "dark-modebackgrounddisabled": "var(--dark-modebackgrounddisabled)",
        "dark-modebackgroundprimary": "var(--dark-modebackgroundprimary)",
        "dark-modebackgroundprimary-hover":
          "var(--dark-modebackgroundprimary-hover)",
        "dark-modebackgroundsecondary": "var(--dark-modebackgroundsecondary)",
        "dark-modeborderdefault": "var(--dark-modeborderdefault)",
        "dark-modeborderprimary": "var(--dark-modeborderprimary)",
        "dark-modeiconsecondary": "var(--dark-modeiconsecondary)",
        "dark-modetextdefault": "var(--dark-modetextdefault)",
        "dark-modetextsecondary": "var(--dark-modetextsecondary)",
        "light-modebackgrounddefault": "var(--light-modebackgrounddefault)",
        "light-modebackgroundprimary": "var(--light-modebackgroundprimary)",
        "light-modebackgroundprimary-hover":
          "var(--light-modebackgroundprimary-hover)",
        "light-modebackgroundsecondary": "var(--light-modebackgroundsecondary)",
        "light-modeborderdefault": "var(--light-modeborderdefault)",
        "light-modebordersecondary": "var(--light-modebordersecondary)",
        "light-modetextdefault": "var(--light-modetextdefault)",
        "light-modetexton-primary": "var(--light-modetexton-primary)",
        "light-modetexttertiary": "var(--light-modetexttertiary)",
        textdefault: "var(--textdefault)",
        textsecondary: "var(--textsecondary)",
      },
      fontFamily: {
        "button-button2-semibold": "var(--button-button2-semibold-font-family)",
        "button-button3-semibold": "var(--button-button3-semibold-font-family)",
        "header-h3": "var(--header-h3-font-family)",
        "text-body1-regular": "var(--text-body1-regular-font-family)",
        "text-body2-medium": "var(--text-body2-medium-font-family)",
        "text-body2-regular": "var(--text-body2-regular-font-family)",
        "text-body3-medium": "var(--text-body3-medium-font-family)",
        "text-body3-regular": "var(--text-body3-regular-font-family)",
      },
    },
  },
  plugins: [],
};
