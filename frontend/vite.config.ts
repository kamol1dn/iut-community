import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

function figmaAssetResolver() {
	return {
		name: 'figma-asset-resolver',
		resolveId(id: string) {
			if (id.startsWith('figma:asset/')) {
				const filename = id.replace('figma:asset/', '')
				return path.resolve(__dirname, 'src/assets', filename)
			}
		},
	}
}

export default defineConfig({
	plugins: [figmaAssetResolver(), react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	assetsInclude: ['**/*.svg', '**/*.csv'],

	server: {
		proxy: {
			'/timetable': { target: 'http://46.101.98.64:8001', changeOrigin: true },
			'/bookings': { target: 'http://46.101.98.64:8001', changeOrigin: true },
			'/notifications': {
				target: 'http://46.101.98.64:8001',
				changeOrigin: true,
			},
			'/login': { target: 'http://46.101.98.64:8088', changeOrigin: true },
			'/register': { target: 'http://46.101.98.64:8088', changeOrigin: true },
			'/me': { target: 'http://46.101.98.64:8088', changeOrigin: true },
			'/clubs': { target: 'http://46.101.98.64:8088', changeOrigin: true },
		},
	},
})
