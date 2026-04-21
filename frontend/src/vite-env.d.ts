/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ADMIN_TELEGRAM_USERNAME?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
