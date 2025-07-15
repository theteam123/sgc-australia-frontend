<template>
  <div v-if="!authStore.isAuthenticated" class="monday-layout min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="monday-card max-w-md w-full">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="rounded-lg flex items-center justify-center">
            <img :src="logo" alt="App Logo" class="" />
          </div>
        </div>
        <h2 class="mt-6 text-h1">
          Sign in to your account
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="authStore.error" class="monday-card rounded-md bg-red-50 p-4">
          <div class="flex">
            <AlertCircleIcon class="h-5 w-5 monday-text-danger" />
            <div class="ml-3">
              <h3 class="text-label monday-text-danger">Authentication Error</h3>
              <div class="mt-2 text-body monday-text-danger">
                <p>{{ authStore.error }}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-monday btn-primary w-full"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockIcon v-if="!authStore.loading" class="h-5 w-5 " />
              <LoaderIcon v-else class="h-5 w-5  animate-spin" />
            </span>
            Login with ERPNext
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { LockIcon, LoaderIcon, AlertCircleIcon } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { getLogo } from '../config/domains';

const router = useRouter();
const authStore = useAuthStore();
const showDebug = ref(false);

const emailError = ref('');
const passwordError = ref('');
const fullNameError = ref('');

const logo = computed(() => getLogo());

const clearErrors = () => {
  emailError.value = '';
  passwordError.value = '';
  fullNameError.value = '';
  authStore.clearError();
};

const handleSubmit = async () => {
  try {
    await authStore.signIn();
  } catch (error) {
    console.error('Auth error:', error);
  }
};

// Add mounted hook to check authentication
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'home' });
  }
});
</script>