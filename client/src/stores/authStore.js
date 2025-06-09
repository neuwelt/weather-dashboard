import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.token && !!state.user,
        userName: (state) => state.user?.name || '',
        userEmail: (state) => state.user?.email || ''
    },

    actions: {
        // Initialize auth state from localStorage
        initAuth() {
            const token = localStorage.getItem('auth_token')
            const user = localStorage.getItem('auth_user')

            if (token && user) {
                try {
                    this.token = token
                    this.user = JSON.parse(user)
                    this.isAuthenticated = true
                } catch (error) {
                    console.error('Error parsing stored user data:', error)
                    this.clearAuth()
                }
            }
        },

        // Register new user
        async register(userData) {
            this.loading = true
            this.error = null

            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Registration failed')
                }

                // Auto-login after successful registration
                const loginResult = await this.login({
                    email: userData.email,
                    password: userData.password
                })

                if (!loginResult.success) {
                    return { success: false, error: 'Registration successful but auto-login failed' }
                }

                return { success: true, message: 'Registration successful!' }

            } catch (error) {
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.loading = false
            }
        },

        // Login user
        async login(credentials) {
            this.loading = true
            this.error = null

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Login failed')
                }

                // Store auth data
                this.token = data.token
                this.user = data.user
                this.isAuthenticated = true

                // Persist to localStorage
                localStorage.setItem('auth_token', data.token)
                localStorage.setItem('auth_user', JSON.stringify(data.user))

                return { success: true }

            } catch (error) {
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.loading = false
            }
        },

        // Logout user
        logout() {
            this.clearAuth()
        },

        // Clear auth state
        clearAuth() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            this.error = null

            // Clear localStorage
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        },

        // Get user profile
        async getProfile() {
            if (!this.token) return { success: false, error: 'Not authenticated' }

            try {
                const response = await fetch('/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        this.clearAuth()
                    }
                    throw new Error(data.error || 'Failed to fetch profile')
                }

                this.user = data.user
                localStorage.setItem('auth_user', JSON.stringify(data.user))

                return { success: true, user: data.user }

            } catch (error) {
                this.error = error.message
                return { success: false, error: error.message }
            }
        },

        // Update user profile
        async updateProfile(profileData) {
            if (!this.token) return { success: false, error: 'Not authenticated' }

            this.loading = true
            this.error = null

            try {
                const response = await fetch('/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profileData)
                })

                const data = await response.json()

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        this.clearAuth()
                    }
                    throw new Error(data.error || 'Failed to update profile')
                }

                this.user = data.user
                localStorage.setItem('auth_user', JSON.stringify(data.user))

                return { success: true, user: data.user }

            } catch (error) {
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.loading = false
            }
        },

        // Delete user account
        async deleteAccount() {
            if (!this.token) return { success: false, error: 'Not authenticated' }

            this.loading = true

            try {
                const response = await fetch('/api/users/account', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to delete account')
                }

                this.clearAuth()
                return { success: true, message: 'Account deleted successfully' }

            } catch (error) {
                this.error = error.message
                return { success: false, error: error.message }
            } finally {
                this.loading = false
            }
        },

        // Helper method to get auth headers
        getAuthHeaders() {
            return this.token ? {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            }
        }
    }
})