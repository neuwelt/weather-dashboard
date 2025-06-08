<template>
  <div
    class="login-page"
    style="background-color: #F8F5EC; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; padding: 20px;"
  >
    <div
      class="brand"
      style="text-align: center; margin-bottom: 40px;"
    >
      <div style="font-size: 3rem; font-weight: bold; color: #333; margin-bottom: 10px;">
        WeatherPress
      </div>
      <div style="font-size: 1.2rem; color: #666;">
        Welcome back!
      </div>
    </div>

    <div
      class="login-form"
      style="background-color: #FFFCF7; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px;"
    >
      <div
        v-if="loginError"
        style="background-color: #ffebee; color: #c62828; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #ef5350;"
      >
        {{ loginError }}
      </div>
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Email</label>
        <input
          v-model="loginEmail"
          type="email"
          placeholder="Enter your email"
          style="width: 100%; padding: 12px; border: 2px solid #2D2D2D; border-radius: 8px; background-color: #FFFCF7; color: #333; font-family: 'Comfortaa', sans-serif; box-sizing: border-box;"
        >
      </div>

      <div style="margin-bottom: 30px;">
        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Password</label>
        <input
          v-model="loginPassword"
          type="password"
          placeholder="Enter your password"
          style="width: 100%; padding: 12px; border: 2px solid #2D2D2D; border-radius: 8px; background-color: #FFFCF7; color: #333; font-family: 'Comfortaa', sans-serif; box-sizing: border-box;"
        >
      </div>

      <button
        style="width: 100%;
        padding: 12px;
        background-color: #2D2D2D;
        color: #FFFCF7;
        border: none;
        border-radius: 8px;
        font-family: 'Comfortaa', sans-serif;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 20px;"
        @click="handleLogin"
      >
        Login
      </button>

      <div style="text-align: center;">
        <span
          style="color: #2D2D2D;
          cursor: pointer;
          text-decoration: underline;
          font-size: 14px;"
          @click="$emit('back')"
        >Back to search</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login', 'back'])

const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')

function handleLogin() {
    // Clear previous error
    loginError.value = ''

    // Check if fields are empty
    if (!loginEmail.value.trim()) {
        loginError.value = 'Please enter your email'
        return
    }

    if (!loginPassword.value.trim()) {
        loginError.value = 'Please enter your password'
        return
    }

    // Handle login logic here
    console.log('Login attempt:', loginEmail.value, loginPassword.value)
    // After successful login, emit to parent
    emit('login')
}
</script>