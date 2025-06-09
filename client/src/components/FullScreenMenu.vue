<template>
  <div
    class="fullscreen-menu"
    :class="{ 'menu-open': isOpen }"
  >
    <button
      class="close-menu-button"
      @click="$emit('close')"
    >
      ×
    </button>
    <div class="menu-content">
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'news' }"
        @click="$emit('set-menu', 'news')"
      >
        News
      </div>
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'saved' }"
        @click="$emit('set-menu', 'saved')"
      >
        Saved Locations
      </div>
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'profile' }"
        @click="$emit('set-menu', 'profile')"
      >
        Profile
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    activeMenu: {
        type: String,
        required: true
    }
})

defineEmits(['close', 'set-menu'])
</script>

<style scoped>
.fullscreen-menu {
    position: fixed;
    top: -100vh;
    left: 0;
    right: 0;
    height: 100vh;
    background: linear-gradient(135deg, #F28C38 0%, #F9C497 40%, #FCE0C7 62%, #FFFCF7 100%);
    z-index: 1002;
    transition: top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex;
    align-items: center;
    justify-content: center;
}

.fullscreen-menu.menu-open {
    top: 0;
}

.menu-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.menu-item {
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
    cursor: pointer;
    padding: 20px 40px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
}

.menu-item:hover {
    color: #2D2D2D;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.menu-item.active {
    color: #2D2D2D;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.menu-item:active {
    transform: translateY(2px);
}

.close-menu-button {
    position: absolute;
    top: 30px;
    right: 30px;
    background: none;
    border: none;
    color: white;
    font-size: 3rem;
    font-weight: 300;
    cursor: pointer;
    z-index: 1004;
    transition: all 0.3s ease;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.close-menu-button:hover {
    background-color: rgba(255,255,255,0.1);
    transform: rotate(90deg);
}
</style>