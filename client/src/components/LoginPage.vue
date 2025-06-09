<!-- components/LoginPage.vue -->
<template>
  <div
    class="login-page"
    style="background-color: #F8F5EC; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; padding: 20px;"
  >
    <div
      class="brand"
      style="text-align: center; margin-bottom: 40px;"
    >
      <div style="font-size: 3rem; font-weight: bold; color: #2D2D2D; margin-bottom: 10px; font-family: 'Comfortaa', sans-serif;">
        WeatherPress
      </div>
      <div style="font-size: 1.2rem; color: #2D2D2D; font-family: 'Comfortaa', sans-serif;">
        {{ isLogin ? 'Welcome back!' : 'Join us today!' }}
      </div>
    </div>

    <div
      class="login-form"
      style="background-color: #FFFCF7; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px;"
    >
      <!-- Back Button -->
      <button
        style="background: none; border: none; color: #2D2D2D; cursor: pointer; padding: 8px; margin-bottom: 20px; font-family: 'Comfortaa', sans-serif; text-decoration: underline; font-size: 14px;"
        @click="$emit('back')"
      >
        ← Back to search
      </button>

      <!-- Error Message -->
      <div
        v-if="authStore.error"
        style="background-color: #ffebee; color: #c62828; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #ef5350; font-family: 'Comfortaa', sans-serif;"
      >
        {{ authStore.error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Name field (only for registration) -->
        <div
          v-if="!isLogin"
          style="margin-bottom: 20px;"
        >
          <label style="display: block; margin-bottom: 8px; color: #2D2D2D; font-weight: 500; font-family: 'Comfortaa', sans-serif;">Full Name</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Enter your full name"
            required
            :disabled="authStore.loading"
            style="width: 100%; padding: 12px; border: 2px solid #2D2D2D; border-radius: 8px; background-color: #FFFCF7; color: #2D2D2D; font-family: 'Comfortaa', sans-serif; box-sizing: border-box;"
          >
        </div>

        <!-- Email field -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #2D2D2D; font-weight: 500; font-family: 'Comfortaa', sans-serif;">Email</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
            required
            :disabled="authStore.loading"
            style="width: 100%; padding: 12px; border: 2px solid #2D2D2D; border-radius: 8px; background-color: #FFFCF7; color: #2D2D2D; font-family: 'Comfortaa', sans-serif; box-sizing: border-box;"
          >
        </div>

        <!-- Password field -->
        <div style="margin-bottom: 30px;">
          <label style="display: block; margin-bottom: 8px; color: #2D2D2D; font-weight: 500; font-family: 'Comfortaa', sans-serif;">Password</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            required
            :disabled="authStore.loading"
            :minlength="isLogin ? 1 : 6"
            style="width: 100%; padding: 12px; border: 2px solid #2D2D2D; border-radius: 8px; background-color: #FFFCF7; color: #2D2D2D; font-family: 'Comfortaa', sans-serif; box-sizing: border-box;"
          >
          <small
            v-if="!isLogin"
            style="color: #2D2D2D; font-size: 12px; font-family: 'Comfortaa', sans-serif; margin-top: 4px; display: block;"
          >
            Password must be at least 6 characters long
          </small>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.loading"
          style="width: 100%; padding: 12px; background-color: #2D2D2D; color: #FFFCF7; border: none; border-radius: 8px; font-family: 'Comfortaa', sans-serif; font-weight: 500; cursor: pointer; margin-bottom: 20px;"
        >
          <span v-if="authStore.loading">
            {{ isLogin ? 'Signing In...' : 'Creating Account...' }}
          </span>
          <span v-else>
            {{ isLogin ? 'Login' : 'Create Account' }}
          </span>
        </button>

        <!-- Toggle Mode -->
        <div style="text-align: center;">
          <span style="color: #2D2D2D; font-family: 'Comfortaa', sans-serif; font-size: 14px;">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          </span>
          <button
            type="button"
            :disabled="authStore.loading"
            style="background: none; border: none; color: #2D2D2D; cursor: pointer; text-decoration: underline; font-family: 'Comfortaa', sans-serif; font-size: 14px; margin-left: 4px;"
            @click="toggleMode"
          >
            {{ isLogin ? 'Sign Up' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const emit = defineEmits(['login', 'back'])
const authStore = useAuthStore()

const isLogin = ref(true)

const formData = reactive({
    name: '',
    email: '',
    password: ''
})

onMounted(() => {
    // Clear any previous errors when component mounts
    authStore.error = null
})

async function handleSubmit() {
    // Clear previous errors
    authStore.error = null

    try {
        let result

        if (isLogin.value) {
            result = await authStore.login({
                email: formData.email,
                password: formData.password
            })
        } else {
            result = await authStore.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
        }

        if (result.success) {
            emit('login')
        }
        // Error handling is done in the store
    } catch (error) {
        console.error('Auth error:', error)
    }
}

function toggleMode() {
    isLogin.value = !isLogin.value
    authStore.error = null

    // Clear form data when switching modes
    formData.name = ''
    formData.email = ''
    formData.password = ''
}
</script>