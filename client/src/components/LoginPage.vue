<!-- components/LoginPage.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Back Button -->
        <button
          class="back-btn"
          @click="$emit('back')"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- Header -->
        <div class="login-header">
          <h1>{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h1>
          <p>{{ isLogin ? 'Sign in to your account' : 'Join us to save your favorite locations' }}</p>
        </div>

        <!-- Form -->
        <form
          class="login-form"
          @submit.prevent="handleSubmit"
        >
          <!-- Name field (only for registration) -->
          <div
            v-if="!isLogin"
            class="form-group"
          >
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Enter your full name"
              required
              :disabled="authStore.loading"
            >
          </div>

          <!-- Email field -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              required
              :disabled="authStore.loading"
            >
          </div>

          <!-- Password field -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              required
              :disabled="authStore.loading"
              :minlength="isLogin ? 1 : 6"
            >
            <small
              v-if="!isLogin"
              class="password-hint"
            >
              Password must be at least 6 characters long
            </small>
          </div>

          <!-- Error Message -->
          <div
            v-if="authStore.error"
            class="error-message"
          >
            {{ authStore.error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-btn"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading">
              <svg
                class="spinner"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                  opacity="0.3"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                  stroke-dasharray="32"
                  stroke-dashoffset="32"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="1s"
                    values="32;0"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
              {{ isLogin ? 'Signing In...' : 'Creating Account...' }}
            </span>
            <span v-else>
              {{ isLogin ? 'Sign In' : 'Create Account' }}
            </span>
          </button>

          <!-- Toggle Mode -->
          <div class="toggle-mode">
            <p>
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <button
                type="button"
                class="toggle-btn"
                :disabled="authStore.loading"
                @click="toggleMode"
              >
                {{ isLogin ? 'Sign Up' : 'Sign In' }}
              </button>
            </p>
          </div>
        </form>
      </div>
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

<style scoped>
.login-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.login-container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    margin: 0 auto;
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    position: relative;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
    margin-top: 20px;
}

.login-header h1 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.login-header p {
    color: #666;
    font-size: 16px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 500;
    color: #333;
    font-size: 14px;
}

.form-group input {
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: white;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
}

.password-hint {
    color: #666;
    font-size: 12px;
    margin-top: -4px;
}

.error-message {
    background: #fee;
    color: #c53030;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    border: 1px solid #fed7d7;
}

.submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.toggle-mode {
    text-align: center;
    margin-top: 20px;
}

.toggle-mode p {
    color: #666;
    font-size: 14px;
}

.toggle-btn {
    background: none;
    border: none;
    color: #667eea;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    font-size: 14px;
    margin-left: 4px;
}

.toggle-btn:hover:not(:disabled) {
    color: #5a67d8;
}

.toggle-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    .login-container {
        padding: 10px;
    }

    .login-card {
        padding: 30px 20px;
    }

    .login-header h1 {
        font-size: 24px;
    }
}
</style>