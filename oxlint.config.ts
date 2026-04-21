import config from "@cstrlcs/configs/oxlint/base.js";
import { defineConfig } from "oxlint";

export default defineConfig({
  ...config,
  rules: {
    "eslint/no-eq-null": "off",
  },
});
