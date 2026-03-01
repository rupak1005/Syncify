import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 3000,
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom", "react-router-dom"],
					ui: [
						"@radix-ui/react-dialog",
						"@radix-ui/react-slider",
						"@radix-ui/react-scroll-area",
						"@radix-ui/react-tabs",
						"@radix-ui/react-select",
						"@radix-ui/react-avatar",
						"@radix-ui/react-dropdown-menu",
					],
					icons: ["lucide-react"],
					state: ["zustand", "axios", "socket.io-client"],
				},
			},
		},
		target: "es2020",
		sourcemap: false,
		minify: "esbuild",
	},
});
