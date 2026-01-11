import postcss from "rollup-plugin-postcss";

export default {
  input: "src/main.jsx",
  output: {
    file: "dist/bundle.js",
    format: "esm",
  },
  plugins: [
    postcss({
      extract: true,
      minimize: true,
      sourceMap: true,
    }),
  ],
};
