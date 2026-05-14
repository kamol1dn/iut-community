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
			'/api/auth': {
				target: 'http://46.101.98.64:8088',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/auth/, ''),
			},
			'/api/tt': {
				target: 'http://46.101.98.64:8001',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api\/tt/, ''),
			},
		},
	},
})
