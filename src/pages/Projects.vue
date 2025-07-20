<template>
  <div class="monday-layout">
    <!-- Modern Header Section -->
    <div class="monday-main-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-r from-primary-green to-accent-green rounded-xl">
            <FolderOpenIcon class="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 class="text-h1 mb-1">Projects</h1>
            <p class="text-body text-monday-medium">Monitor and manage all your projects in one place</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="status-badge status-done">
            <div class="w-2 h-2 bg-accent-green rounded-full mr-2 animate-pulse"></div>
            Live Data
          </span>
          <button class="btn-monday btn-secondary" @click="refreshData">
            <RefreshCwIcon class="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button class="btn-monday btn-primary" @click="createProject">
            <PlusIcon class="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="monday-main-content">
      <!-- Search Section -->
      <div class="mb-6">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search projects..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="monday-card">
        <LoadingSpinner message="Loading project data..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="monday-card">
        <div class="flex items-center gap-3 p-4 bg-monday-red-light rounded-lg">
          <div class="w-8 h-8 bg-monday-red rounded-full flex items-center justify-center">
            <AlertTriangleIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="text-h3 text-monday-red mb-1">Error Loading Projects</h3>
            <p class="text-body text-monday-medium-dark">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <ProjectDashboard :searchQuery="searchQuery" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  FolderOpenIcon,
  RefreshCwIcon,
  PlusIcon,
  SearchIcon,
  AlertTriangleIcon
} from 'lucide-vue-next';
import ProjectDashboard from '../components/ProjectDashboard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();

// State management
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');

// Debug: Watch for changes in search query
watch(searchQuery, (newValue) => {
  console.log('Search query changed in Projects.vue:', newValue);
});

// Methods
const refreshData = () => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    loading.value = false;
    // Show success notification
    console.log('Data refreshed successfully');
  }, 1000);
};

const createProject = () => {
  router.push('/projects/new');
};


onMounted(() => {
  // Initialize data
  refreshData();
});
</script>

<style scoped>
@import '../styles/monday-design-system.css';

.monday-main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Filter section styling handled by Tailwind classes */

/* Status Badge Enhancement */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: var(--border-radius-xl);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-done {
  background-color: var(--accent-green-light);
  color: var(--accent-green);
}

/* Responsive Design */
@media (max-width: 768px) {
  .monday-main-header .flex {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .monday-search {
    min-width: 100%;
  }
  
  .monday-card .flex {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>