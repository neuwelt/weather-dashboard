//eslint config for the client side code base
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
      // here we can add custom rules for the code base if needed 
    },
  };