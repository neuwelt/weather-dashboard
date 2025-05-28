module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2020: true,
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    globals: {
      defineProps: 'readonly',
      defineEmits: 'readonly',
      defineExpose: 'readonly',
      defineSlots: 'readonly',
    },
    rules: {
      // You can add custom rules here
    },
  };