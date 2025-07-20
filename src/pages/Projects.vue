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
            <h1 class="text-h1 mb-1">Projects Dashboard</h1>
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
      <!-- Quick Actions Bar -->
      <div class="monday-card">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="monday-search">
              <SearchIcon class="monday-search-icon" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search projects, clients, or codes..."
                class="monday-search-input"
              />
            </div>
            <select class="form-select" v-model="selectedStatus">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-monday btn-tertiary btn-small" @click="exportData">
              <DownloadIcon class="w-4 h-4 mr-1" />
              Export
            </button>
            <button class="btn-monday btn-tertiary btn-small" @click="toggleFilters">
              <FilterIcon class="w-4 h-4 mr-1" />
              Filters
            </button>
          </div>
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
        <ProjectDashboard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  FolderOpenIcon,
  RefreshCwIcon,
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  FilterIcon,
  AlertTriangleIcon
} from 'lucide-vue-next';
import ProjectDashboard from '../components/ProjectDashboard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

// State management
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedStatus = ref('');

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
  // Navigate to create project form
  console.log('Creating new project...');
};

const exportData = () => {
  // Export projects data
  console.log('Exporting project data...');
};

const toggleFilters = () => {
  // Toggle advanced filters
  console.log('Toggling filters...');
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

.monday-search {
  position: relative;
  min-width: 300px;
}

.form-select {
  min-width: 120px;
}

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