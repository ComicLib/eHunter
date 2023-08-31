import vue from '@vitejs/plugin-vue2'

export default {
  plugins: [vue()],
  build: {
    lib: {
        entry: 'src/comiclib.js',
        formats: ['es']
    },
    sourcemap: true,
    // watch: true
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
    }
  }
}