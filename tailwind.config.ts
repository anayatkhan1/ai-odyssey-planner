
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Neobrutalism colors
				neo: {
					blue: '#0066FF',     // Electric blue
					yellow: '#FFD100',   // Vibrant yellow
					pink: '#FF3864',     // Hot pink
					green: '#00FFAA',    // Mint green
					orange: '#FF9E00',   // Bright orange
					background: '#F7F7F2', // Off-white background
					black: '#000000',    // Pure black for borders
					white: '#FFFFFF',    // White
				},
				travel: {
					blue: '#0A3D62',
					orange: '#FF9F43',
					teal: '#079992',
					lightBlue: '#C7ECEE',
					sand: '#F6F6E9'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'neo': '16px',  // Exaggerated rounded corners for neo-brutalism
			},
			borderWidth: {
				'3': '3px',
				'5': '5px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'push-down': {
					'0%': { transform: 'translateY(0) translateX(0)' },
					'100%': { transform: 'translateY(4px) translateX(4px)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 5s ease-in-out infinite',
				'fade-in': 'fade-in 0.7s ease-out forwards',
				'push-down': 'push-down 0.1s ease-out forwards',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Merriweather', 'serif'],
				'archivo': ['Archivo Black', 'sans-serif'],
				'space-grotesk': ['Space Grotesk', 'sans-serif'],
				'space-mono': ['Space Mono', 'monospace'],
			},
			boxShadow: {
				'neo': '4px 4px 0 0 #000000',
				'neo-lg': '8px 8px 0 0 #000000',
				'neo-sm': '2px 2px 0 0 #000000',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
