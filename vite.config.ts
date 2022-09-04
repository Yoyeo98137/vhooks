import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@/packages': resolve(__dirname, 'packages'),
    },
  },

  server: {
    host: true,
    port: 5779,
  },

  build: {
    outDir: 'lib',

    // 调整成库的打包模式
    // see: https://cn.vitejs.dev/guide/build.html#library-mode
    lib: {
      // 指定编译入口文件
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'vhooks',
      fileName: 'vhooks',
    },

    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
