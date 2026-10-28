import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      if (!config.baseUrl && config.env.baseUrl) {
        config.baseUrl = config.env.baseUrl;
      }
      return config;
    },
  },
});
