<template>
  <div class="fixed-header">
    <div class="profile-section">
      Profile
    </div>
    <div class="web-name">
      Weather Press
    </div>
    <div class="header-right">
      <button
        class="menu-button"
        :class="{ 'menu-active': isMenuOpen }"
        @click="$emit('toggle-menu')"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
    isMenuOpen: {
        type: Boolean,
        required: true
    }
})

defineEmits(['toggle-menu'])
</script>

<style scoped>
.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #FFFCF7;
    z-index: 1000;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: none;
    border-bottom: 1px solid rgba(45, 45, 45, 0.1);
}

.profile-section {
    font-weight: 500;
    color: #2D2D2D;
    font-size: 16px;
    flex: 1;
}

.web-name {
    font-weight: bold;
    font-size: 1.2rem;
    color: #2D2D2D;
    flex: 1;
    text-align: center;
}

.header-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.menu-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    display: flex;
    flex-direction: column;
    width: 40px;
    height: 30px;
    justify-content: space-around;
    z-index: 1003;
    position: relative;

    margin-right: 50px;
}

.menu-button span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: #2D2D2D;
    border-radius: 1px;
    transition: all 0.3s ease;
    transform-origin: center;
}

.menu-button.menu-active span {
    background-color: white;
}

.menu-button.menu-active span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
}

.menu-button.menu-active span:nth-child(2) {
    opacity: 0;
}

.menu-button.menu-active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
}</style>