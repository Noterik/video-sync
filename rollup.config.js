import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import includePaths from "rollup-plugin-includepaths";
import pkg from "./package.json";

const env = process.env.BUILD;

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const includePathOptions = {
  include: {},
  paths: ["src"],
  external: ["react", "react-dom"],
  extensions
};

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    autoExternal(),
    typescript()
    //includePaths(includePathOptions),
    //resolve({ extensions }),
    
    /*
    babel({
      extensions,
      exclude: "node_modules/**",
      runtimeHelpers: true
    }),
    */
    /*
    commonjs({
      include: "node_modules/**",
      // left-hand side can be an absolute path, a path
      // relative to the current directory, or the name
      // of a module in node_modules
      namedExports: {
        "node_modules/react/index.js": [
          "cloneElement",
          "createContext",
          "Component",
          "createElement"
        ],
        "node_modules/react-dom/index.js": ["render", "hydrate"],
        "node_modules/react-is/index.js": [
          "isElement",
          "isValidElementType",
          "ForwardRef"
        ]
      }
    })
    */
  ]
};
