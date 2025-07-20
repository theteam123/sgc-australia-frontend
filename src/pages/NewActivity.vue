<template>
  <div class="container">
    <!-- Header -->
    <div class="activity-header">
      <div class="breadcrumb">
        <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
        <span class="breadcrumb-separator">›</span>
        <router-link 
          v-if="fromProjectId" 
          :to="`/projects/${fromProjectId}`" 
          class="breadcrumb-link"
        >
          #{{ fromProjectCode }} {{ fromProjectName }}
        </router-link>
        <span v-if="fromProjectId" class="breadcrumb-separator">›</span>
        <span>New Activity</span>
      </div>
      
      <div class="header-content">
        <div class="header-left">
          <div class="title-section">
            <h1 class="activity-title">New Activity</h1>
            <span class="status-indicator not-saved">Not Saved</span>
          </div>
        </div>
        
        <div class="header-right">
          <div class="header-actions">
            <button 
              @click="goBack"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button 
              @click="saveActivity"
              :disabled="isSaving || !isFormValid"
              class="btn-primary"
            >
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="loadData" class="retry-btn">Retry</button>
    </div>

    <!-- Activity Form -->
    <div v-if="!loading && !error" class="activity-form">
      <!-- Tab Navigation -->
      <div class="form-tabs">
        <div 
          class="form-tab" 
          :class="{ active: activeTab === 'details' }"
          @click="activeTab = 'details'"
        >
          Details
        </div>
        <div 
          class="form-tab" 
          :class="{ active: activeTab === 'performance' }"
          @click="activeTab = 'performance'"
        >
          Performance
        </div>
      </div>

      <!-- Tab Content -->
      <div class="form-content">
        <!-- Details Tab -->
        <div v-show="activeTab === 'details'" class="tab-pane">
          <!-- Task Details Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">Task Details</h3>
            </div>
            
            <div class="form-grid three-col">
              <div class="form-field">
                <label class="form-label required">Project</label>
                <div class="control-input">
                  <select 
                    v-model="activity.project" 
                    class="form-control"
                    required
                  >
                    <option value="">Select Project</option>
                    <option 
                      v-for="project in projectOptions" 
                      :key="project.value" 
                      :value="project.value"
                    >
                      {{ project.label }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="form-field">
                <label class="form-label required">Activity Name</label>
                <div class="control-input">
                  <input 
                    v-model="activity.activity_name" 
                    type="text" 
                    class="form-control"
                    maxlength="140"
                    required
                    placeholder="Enter activity name"
                  >
                </div>
              </div>
              
              <div class="form-field">
                <label class="form-label required">Status</label>
                <div class="control-input">
                  <select 
                    v-model="activity.status" 
                    class="form-control"
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="Working">Working</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Template">Template</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Duration Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">Task Duration</h3>
            </div>
            
            <div class="form-grid three-col">
              <div class="form-field">
                <label class="form-label required">Estimated Hours</label>
                <div class="control-input">
                  <input 
                    v-model.number="activity.estimated_hours" 
                    type="number" 
                    class="form-control"
                    step="0.5"
                    min="0"
                    required
                    placeholder="0.0"
                  >
                </div>
              </div>
              
              <div class="form-field">
                <label class="form-label">Start Date</label>
                <div class="control-input">
                  <input 
                    v-model="activity.start_date" 
                    type="date" 
                    class="form-control"
                  >
                </div>
                <div class="help-text">Expected Start Date</div>
              </div>
              
              <div class="form-field">
                <label class="form-label">End Date</label>
                <div class="control-input">
                  <input 
                    v-model="activity.end_date" 
                    type="date" 
                    class="form-control"
                  >
                </div>
                <div class="help-text">Expected End Date</div>
              </div>
            </div>
          </div>

          <!-- Financial Details Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">Financial Details</h3>
            </div>
            
            <div class="form-grid two-col">
              <div class="form-field">
                <label class="form-label">Estimated Revenue</label>
                <div class="control-input">
                  <input 
                    v-model.number="activity.estimated_revenue" 
                    type="number" 
                    class="form-control"
                    step="100"
                    min="0"
                    placeholder="0.00"
                  >
                </div>
              </div>
              
              <div class="form-field">
                <label class="form-label">Estimated Cost</label>
                <div class="control-input">
                  <input 
                    v-model.number="activity.estimated_cost" 
                    type="number" 
                    class="form-control"
                    step="100"
                    min="0"
                    placeholder="0.00"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Tab -->
        <div v-show="activeTab === 'performance'" class="tab-pane">
          <!-- Task Hours Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">Task Hours</h3>
            </div>
            
            <div class="form-grid three-col">
              <div class="form-field">
                <label class="form-label required">Completion</label>
                <div class="control-input">
                  <input 
                    v-model.number="activity.completion" 
                    type="number" 
                    class="form-control"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="0"
                  >
                </div>
                <div class="help-text">Percentage of Task Completed</div>
              </div>
              
              <div class="form-field">
                <label class="form-label">Burnt Hours</label>
                <div class="control-value">
                  {{ activity.burnt_hours || 0 }}
                </div>
              </div>
              
              <div class="form-field">
                <label class="form-label">Remaining Hours</label>
                <div class="control-value">
                  {{ remainingHours }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createActivity } from '../services/activities';
import { getDropdownOptions } from '../services/projects';

// Types
interface NewActivity {
  project?: string;
  activity_name?: string;
  status: string;
  estimated_hours?: number;
  start_date?: string;
  end_date?: string;
  completion: number;
  burnt_hours: number;
  estimated_revenue?: number;
  estimated_cost?: number;
}

// Route and router
const route = useRoute();
const router = useRouter();

// Reactive data
const activeTab = ref('details');
const loading = ref(false);
const error = ref<string | null>(null);
const isSaving = ref(false);

// Navigation context from query parameters
const fromProjectId = ref<string | null>(null);
const fromProjectName = ref<string | null>(null);
const fromProjectCode = ref<string | null>(null);

// Form data
const activity = ref<NewActivity>({
  status: 'Open',
  completion: 0,
  burnt_hours: 0
});

// Dropdown options
const projectOptions = ref<any[]>([]);

// Computed properties
const isFormValid = computed(() => {
  return !!(
    activity.value.project &&
    activity.value.activity_name &&
    activity.value.status &&
    activity.value.estimated_hours !== undefined &&
    activity.value.estimated_hours > 0
  );
});

const remainingHours = computed(() => {
  const estimated = activity.value.estimated_hours || 0;
  const burnt = activity.value.burnt_hours || 0;
  return Math.max(0, estimated - burnt);
});

// Methods
const loadData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Load project dropdown options
    const projects = await getDropdownOptions('Project');
    projectOptions.value = projects;
    
    // If we have a project from context, pre-select it
    if (fromProjectId.value) {
      activity.value.project = fromProjectId.value;
    }
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load data';
    console.error('Error loading data:', err);
  } finally {
    loading.value = false;
  }
};

const saveActivity = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    isSaving.value = true;
    
    // Prepare activity data for saving
    const activityData = {
      project: activity.value.project,
      activity_name: activity.value.activity_name,
      status: activity.value.status,
      estimated_hours: activity.value.estimated_hours,
      start_date: activity.value.start_date,
      end_date: activity.value.end_date,
      completion: activity.value.completion,
      estimated_revenue: activity.value.estimated_revenue,
      estimated_cost: activity.value.estimated_cost
    };

    const result = await createActivity(activityData);
    
    alert('Activity created successfully!');
    
    // Navigate back to project details if we have context
    if (fromProjectId.value) {
      router.push(`/projects/${fromProjectId.value}`);
    } else {
      router.push('/projects');
    }
    
  } catch (error: any) {
    console.error('Error saving activity:', error);
    alert(`Error saving activity: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};

const goBack = () => {
  if (fromProjectId.value) {
    router.push(`/projects/${fromProjectId.value}`);
  } else {
    router.push('/projects');
  }
};

// Lifecycle
onMounted(() => {
  // Extract navigation context from query parameters
  fromProjectId.value = route.query.fromProject as string || null;
  fromProjectName.value = route.query.fromProjectName as string || null;
  fromProjectCode.value = route.query.fromProjectCode as string || null;
  
  loadData();
});
</script>

<style scoped>
@import '../styles/monday-design-system.css';

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* Header */
.activity-header {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  font-size: 14px;
  font-weight: 600;
}

.breadcrumb-link {
  color: var(--primary-green);
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb-link:hover {
  color: var(--primary-green-hover);
}

.breadcrumb-separator {
  color: var(--monday-medium);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.activity-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.status-indicator {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-xl);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.not-saved {
  background: #fff3e0;
  color: #f57c00;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Buttons */
.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.btn-primary {
  background: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-green-hover);
  border-color: var(--primary-green-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--monday-white);
  color: var(--monday-medium-dark);
  border-color: var(--monday-light);
}

.btn-secondary:hover {
  background: var(--monday-very-light);
}

/* Loading and Error States */
.loading-state, .error-state {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--monday-light);
  border-top: 4px solid var(--primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: var(--monday-red);
  margin-bottom: var(--spacing-md);
}

.retry-btn {
  background: var(--primary-green);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
}

/* Form */
.activity-form {
  background: var(--monday-white);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  overflow: hidden;
}

/* Form Tabs */
.form-tabs {
  display: flex;
  border-bottom: 1px solid var(--monday-light);
  background: var(--monday-background);
}

.form-tab {
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--monday-medium-dark);
}

.form-tab.active {
  background: var(--monday-white);
  border-bottom-color: var(--primary-green);
  color: var(--primary-green);
  font-weight: 600;
}

.form-tab:hover {
  color: var(--primary-green);
  background: var(--monday-very-light);
}

/* Form Content */
.form-content {
  padding: var(--spacing-xl);
}

.form-section {
  margin-bottom: var(--spacing-xl);
}

.section-header {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

/* Form Grids */
.form-grid {
  display: grid;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-grid.two-col {
  grid-template-columns: 1fr 1fr;
}

.form-grid.three-col {
  grid-template-columns: repeat(3, 1fr);
}

/* Form Fields */
.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

.form-label.required::after {
  content: ' *';
  color: var(--monday-red);
}

.control-input {
  position: relative;
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  font-size: var(--text-base);
  background: white;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(63, 217, 33, 0.1);
}

.control-value {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  background: var(--monday-background);
  color: var(--monday-medium-dark);
  font-weight: 600;
}

.help-text {
  font-size: 12px;
  color: var(--monday-medium);
  margin-top: var(--spacing-xs);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .form-grid.two-col,
  .form-grid.three-col {
    grid-template-columns: 1fr;
  }

  .form-tabs {
    overflow-x: auto;
  }

  .form-tab {
    min-width: max-content;
  }
}
</style>