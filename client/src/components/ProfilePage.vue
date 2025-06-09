<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar">
          <div class="avatar-circle">
            {{ userInitials }}
          </div>
        </div>
        <div class="user-info">
          <h2>{{ authStore.userName || 'User' }}</h2>
          <p>{{ authStore.userEmail || 'No email' }}</p>
        </div>
      </div>

      <!-- Profile Actions -->
      <div class="profile-actions">
        <div class="action-card">
          <h3>Account Settings</h3>

          <!-- Edit Profile Form -->
          <form
            v-if="isEditing"
            class="edit-form"
            @submit.prevent="saveProfile"
          >
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                id="name"
                v-model="editForm.name"
                type="text"
                required
                :disabled="authStore.loading"
              >
            </div>

            <div class="form-buttons">
              <button
                type="button"
                class="cancel-btn"
                :disabled="authStore.loading"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="save-btn"
                :disabled="authStore.loading"
              >
                <span v-if="authStore.loading">Saving...</span>
                <span v-else>Save</span>
              </button>
            </div>
          </form>

          <!-- Profile Display -->
          <div
            v-else
            class="profile-display"
          >
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">{{ authStore.userName || 'Not set' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">{{ authStore.userEmail || 'Not set' }}</span>
            </div>

            <button
              class="edit-btn"
              @click="startEdit"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        <!-- Account Statistics -->
        <div class="action-card">
          <h3>Account Statistics</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">
                {{ weatherStore.savedLocations?.length || 0 }}
              </div>
              <div class="stat-label">
                Saved Locations
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-number">
                {{ formatDate(authStore.user?.created_at) }}
              </div>
              <div class="stat-label">
                Member Since
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="action-card danger-card">
          <h3>Danger Zone</h3>
          <p>These actions cannot be undone.</p>

          <div class="danger-actions">
            <button
              class="logout-btn"
              @click="confirmLogout"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              Sign Out
            </button>

            <button
              class="delete-btn"
              :disabled="authStore.loading"
              @click="confirmDelete"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div
        v-if="message"
        class="message"
        :class="messageType"
      >
        {{ message }}
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="modal-overlay"
      @click="closeModal"
    >
      <div
        class="modal"
        @click.stop
      >
        <h3>{{ confirmModal.title }}</h3>
        <p>{{ confirmModal.message }}</p>
        <div class="modal-buttons">
          <button
            class="cancel-btn"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="confirm-btn"
            :class="{ 'danger': confirmModal.isDanger }"
            :disabled="authStore.loading"
            @click="confirmModal.action"
          >
            <span v-if="authStore.loading">Processing...</span>
            <span v-else>{{ confirmModal.confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useWeatherStore } from '../stores/weatherStore'

const authStore = useAuthStore()
const weatherStore = useWeatherStore()

const isEditing = ref(false)
const message = ref('')
const messageType = ref('success')
const showConfirmModal = ref(false)

const editForm = reactive({
    name: ''
})

const confirmModal = reactive({
    title: '',
    message: '',
    confirmText: '',
    action: null,
    isDanger: false
})

const userInitials = computed(() => {
    const name = authStore.userName
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

onMounted(async () => {
    // Refresh user profile data if auth store has getProfile method
    if (authStore.getProfile) {
        await authStore.getProfile()
    }
})

function startEdit() {
    editForm.name = authStore.userName
    isEditing.value = true
}

function cancelEdit() {
    isEditing.value = false
    editForm.name = ''
}

async function saveProfile() {
    if (authStore.updateProfile) {
        const result = await authStore.updateProfile({
            name: editForm.name
        })

        if (result.success) {
            isEditing.value = false
            showMessage('Profile updated successfully!', 'success')
        } else {
            showMessage(result.error, 'error')
        }
    } else {
        showMessage('Update functionality not available', 'error')
    }
}

function confirmLogout() {
    confirmModal.title = 'Sign Out'
    confirmModal.message = 'Are you sure you want to sign out?'
    confirmModal.confirmText = 'Sign Out'
    confirmModal.action = handleLogout
    confirmModal.isDanger = false
    showConfirmModal.value = true
}

function confirmDelete() {
    confirmModal.title = 'Delete Account'
    confirmModal.message = 'This will permanently delete your account and all saved locations. This action cannot be undone.'
    confirmModal.confirmText = 'Delete Account'
    confirmModal.action = handleDeleteAccount
    confirmModal.isDanger = true
    showConfirmModal.value = true
}

function handleLogout() {
    if (authStore.logout) {
        authStore.logout()
    }
    closeModal()
    showMessage('You have been signed out', 'success')

    setTimeout(() => {
        window.location.reload()
    }, 1000)
}

async function handleDeleteAccount() {
    if (authStore.deleteAccount) {
        const result = await authStore.deleteAccount()

        if (result.success) {
            closeModal()
            showMessage('Account deleted successfully', 'success')
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else {
            showMessage(result.error, 'error')
        }
    } else {
        showMessage('Delete functionality not available', 'error')
    }
}

function closeModal() {
    showConfirmModal.value = false
}

function showMessage(text, type = 'success') {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    })
}
</script>

<style scoped>
.profile-page {
    padding: 20px 0;
    max-width: 800px;
    margin: 0 auto;
}

.profile-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar-circle {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    font-weight: 600;
}

.user-info h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #333;
}

.user-info p {
    margin: 0;
    color: #666;
    font-size: 16px;
}

.profile-actions {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.action-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-card h3 {
    margin: 0 0 20px 0;
    font-size: 20px;
    color: #333;
}

.profile-display {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-row:last-of-type {
    border-bottom: none;
}

.label {
    font-weight: 500;
    color: #666;
}

.value {
    color: #333;
}

.edit-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    align-self: flex-start;
    margin-top: 12px;
}

.edit-btn:hover {
    background: #5a67d8;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 500;
    color: #333;
}

.form-group input {
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
}

.form-buttons {
    display: flex;
    gap: 12px;
}

.cancel-btn, .save-btn {
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.cancel-btn {
    background: #f0f0f0;
    color: #333;
}

.cancel-btn:hover {
    background: #e0e0e0;
}

.save-btn {
    background: #667eea;
    color: white;
}

.save-btn:hover {
    background: #5a67d8;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.stat-item {
    text-align: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
}

.stat-number {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.stat-label {
    color: #666;
    font-size: 14px;
}

.danger-card {
    border: 2px solid #fee;
}

.danger-card h3 {
    color: #e53e3e;
}

.danger-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.logout-btn, .delete-btn {
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logout-btn {
    background: #f0f0f0;
    color: #333;
}

.logout-btn:hover {
    background: #e0e0e0;
}

.delete-btn {
    background: #e53e3e;
    color: white;
}

.delete-btn:hover {
    background: #c53030;
}

.message {
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 16px;
}

.message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 24px;
    border-radius: 16px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal h3 {
    margin: 0 0 16px 0;
    font-size: 20px;
    color: #333;
}

.modal p {
    margin: 0 0 20px 0;
    color: #666;
    line-height: 1.5;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.confirm-btn {
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    background: #667eea;
    color: white;
}

.confirm-btn:hover {
    background: #5a67d8;
}

.confirm-btn.danger {
    background: #e53e3e;
}

.confirm-btn.danger:hover {
    background: #c53030;
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .danger-actions {
        flex-direction: column;
    }

    .form-buttons, .modal-buttons {
        flex-direction: column;
    }
}</style>