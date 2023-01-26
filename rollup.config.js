import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser';
import svelte from 'rollup-plugin-svelte'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-css-only'
import sveltePreprocess from 'svelte-preprocess'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  watch: {
    clearScreen: false,
    chokidar: true,
    include: 'src/**/**'
  },
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins: [
    css({
      output: 'bundle.css'
    }),
    svelte({
      preprocess: sveltePreprocess()
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),

    production &&
    babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      // runtimeHelpers: true,
      babelHelpers: 'runtime',
      exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            // targets: '> 0.25%, not dead',
            targets: {
              chrome: '58',
              edge: '16',
              ie: '11',
              firefox: '52',
              safari: '10',
              ios: '10'
            },
            useBuiltIns: 'usage',
            corejs: 3
          }
        ]
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true
          }
        ]
      ]
    }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ]
}
