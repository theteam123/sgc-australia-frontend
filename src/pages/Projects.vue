<template>
  <div class="monday-layout">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">Home</router-link>
      <span class="breadcrumb-separator">›</span>
      <span>Projects</span>
    </div>

    <!-- Main Content -->
    <div class="monday-main-content">
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
        <ProjectDashboard :onRefresh="refreshData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  RefreshCwIcon,
  AlertTriangleIcon
} from 'lucide-vue-next';
import ProjectDashboard from '../components/ProjectDashboard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

// State management
const loading = ref(false);
const error = ref<string | null>(null);

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

onMounted(() => {
  // Initialize data
  refreshData();
});
</script>

<style scoped>
@import '../styles/monday-design-system.css';

/* Breadcrumb Navigation */
.breadcrumb {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--monday-very-light);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
}

.breadcrumb-link {
  color: var(--monday-medium);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--primary-green);
}

.breadcrumb-separator {
  color: var(--monday-medium);
  font-size: 16px;
  margin: 0 0.25rem;
}

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