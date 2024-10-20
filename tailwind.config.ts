import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    direction: {
      rtl: "rtl",
    },
    fontFamily: {
      primary: ["var(--font-iran-sans)"],
      "primary-medium": ["var(--font-iran-sans-medium)"],
      "primary-bold": ["var(--font-iran-sans-bold)"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "15px",
        sm: "15px",
        md: "15px",
        lg: "15px",
      },
    },
    letterSpacing: {
      tightest: "-1.2px",
      tighter: "-0.8px",
      tight: "-.0.4px",
      normal: "0",
      wide: "0.3px",
      wider: "0.8px",
      widest: "1.6px",
    },
    extend: {
      backgroundSize: {
        full: "100%",
      },
      padding: {
        "3.5": "14px",
        "4.5": "18px",
        "5.5": "22px",
        "13": "52px",
        "18": "72px",
        "22": "88px",
        "23": "92px",
        "25": "100px",
      },
      margin: {
        "3.5": "14px",
        "4.5": "18px",
        "5.5": "22px",
        "13": "52px",
        "18": "72px",
        "22": "88px",
        "23": "92px",
        "25": "100px",
      },
      spacing: {
        "3.5": "14px",
        "4.5": "18px",
        "5.5": "22px",
        "9.5": "38px",
        "10.5": "42px",
        "13": "52px",
        "15": "58px",
        "18": "72px",
        "20.5": "82px",
        "21": "84px",
        "21.5": "86px",
        "22": "88px",
        "23": "92px",
        "25": "100px",
        "25.5": "102px",
        "26": "104px",
        "29": "116px",
        "30": "120px",
        "50": "200px",
        "54": "218px",
      },
      fontSize: {
        xs: "10px",
        xsl: "12px",
        sm: "14px",
        sml: "14.5px",
        base: "16px",
        basel: "17px",
        lg: "18px",
        lgl: "18.4px",
        xlx: "20px",
        xl: "22px",
        "2xl": "25px",
        "3xl": "32px",
        "4.5xl": "40px",
        "5xl": "48px",
        "7xl": "80px",
        "8xl": "84rem",
      },
      colors: {
        foreground: {
          DEFAULT: "hsla(var(--foreground))",
          mute: "hsla(var(--foreground-mute))",
        },
        background: {
          DEFAULT: "hsla(var(--background))",
          active: "hsla(var(--background-active))",
        },
        subtitle: {
          DEFAULT: "hsla(var(--subtitle))",
          dark: "hsla(var(--subtitle-dark))",
        },
        link: {
          DEFAULT: "hsla(var(--foreground))",
          active: "hsla(var(--link-active))",
          "active-background": "hsla(var(--link-active-background))",
        },
        btn: {
          DEFAULT: "hsla(var(--btn))",
          foreground: "hsla(var(--btn-foreground))",
          active: "hsla(var(--btn-active))",
        },
        badge: {
          DEFAULT: "hsla(var(--badge))",
          foreground: "hsla(var(--badge-foreground))",
          active: "hsla(var(--badge-active))",
        },
        header: "hsla(var(--header))",
        dark: "hsla(var(--subtitle-dark))",

        border: "hsla(var(--border))",
        input: "hsla(var(--input))",
        ring: "hsla(var(--ring))",

        negative: {
          DEFAULT: "hsla(var(--negative))",
          foreground: "hsla(var(--negative-foreground))",
          active: "hsla(var(--negative-active))",
        },
        success: {
          DEFAULT: "hsla(var(--success))",
          foreground: "hsla(var(--success-foreground))",
          active: "hsla(var(--success-active))",
        },
        warning: {
          DEFAULT: "hsla(var(--warning))",
          foreground: "hsla(var(--warning-foreground))",
          active: "hsla(var(--warning-active))",
        },
        info: {
          DEFAULT: "hsla(var(--info))",
          foreground: "hsla(var(--info-foreground))",
          active: "hsla(var(--info-active))",
        },
        primary: {
          DEFAULT: "hsla(var(--primary))",
          foreground: "hsla(var(--primary-foreground))",
          active: "hsla(var(--primary-active))",
          hover: "hsla(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsla(var(--secondary))",
          foreground: "hsla(var(--secondary-foreground))",
          active: "hsla(var(--secondary-active))",
          hover: "hsla(var(--secondary-hover))",
        },
        tertiary: {
          DEFAULT: "hsla(var(--tertiary))",
          foreground: "hsla(var(--tertiary-foreground))",
          active: "hsla(var(--tertiary-active))",
          background: "hsla(var(--tertiary-background))",
        },
        quartiery: {
          DEFAULT: "hsla(var(--quartiery))",
          foreground: "hsla(var(--quartiery-foreground))",
          active: "hsla(var(--quartiery-active))",
        },
        accent: {
          DEFAULT: "hsla(var(--accent))",
          foreground: "hsla(var(--accent-foreground))",
          active: "hsla(var(--accent-active))",
        },
        accessible: {
          DEFAULT: "hsla(var(--accessible))",
          foreground: "hsla(var(--accessible-foreground))",
          active: "hsla(var(--accessible-active))",
        },
        destructive: {
          DEFAULT: "hsla(var(--destructive))",
          foreground: "hsla(var(--destructive-foreground))",
          active: "hsla(var(--destructive-active))",
        },
        muted: {
          DEFAULT: "hsla(var(--muted))",
          foreground: "hsla(var(--muted-foreground))",
        },
        disable: {
          DEFAULT: "hsla(var(--disable))",
          foreground: "hsla(var(--disable-foreground))",
          mute: "hsla(var(--disable-mute))",
        },
        popover: {
          DEFAULT: "hsla(var(--popover))",
          foreground: "hsla(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsla(var(--card))",
          foreground: "hsla(var(--card-foreground))",
          active: "hsla(var(--card-active))",
          gradient: "var(--card-gradient)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "28px",
        "5xl": "32px",
        "6xl": "36px",
        "7xl": "40px",
        "7.5xl": "44px",
        "8xl": "48px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        showModal: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        modal: "showModal 0.4s forwards",
      },
      backgroundImage: {
        banner:
          "linear-gradient(270deg, #A5A5A5 0%, rgba(231, 231, 231, 0.5) 58.5%, #A5A5A5 100%)",
      },
      boxShadow: {
        header: "0px 8px 28px 0px #4859661A",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
