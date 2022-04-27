import ts from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [{
    file: 'index.js',
    format: 'umd',
    name: 'VuePressUtil'
  }],
  plugins: [
    ts()
  ]
}
