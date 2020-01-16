import typescript from "rollup-plugin-typescript2";
import autoExternal from "rollup-plugin-auto-external";
import pkg from "./package.json";

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
