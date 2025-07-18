import {defineConfig} from "cypress";

export default defineConfig({
  screenshotOnRunFailure: true,
  video: false,
  e2e: {
    setupNodeEvents(_on, _config) {
    },
  },
});
