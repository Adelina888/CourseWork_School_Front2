import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                registration: resolve(__dirname, "registration.html")
            },
        },
    },
});