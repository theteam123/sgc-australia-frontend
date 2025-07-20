<template>
  <div class="container">
    <!-- Header -->
    <div class="activity-header">
      <div class="breadcrumb">
        <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
        <span class="breadcrumb-separator">›</span>
        <router-link :to="`/projects/${projectId}`" class="breadcrumb-link">{{ projectName }}</router-link>
        <span class="breadcrumb-separator">›</span>
        <span>Edit Activity</span>
      </div>
      
      <div class="activity-title-section">
        <div>
          <h1 class="activity-title">{{ activity.activity_name || 'Loading...' }}</h1>
          <div class="status-indicator">
            <span :class="['status-badge', getStatusClass(activity.status)]">{{ activity.status }}</span>
          </div>
        </div>
        <div class="header-actions">
          <button 
            @click="goBack"
            class="back-btn"
          >
            ← Back to Project
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Form -->
    <div class="activity-form-section">
      <div class="section-header">
        <h3 class="section-title">Activity Details</h3>
        <div class="form-actions" v-if="permissions.write">
          <button 
            @click="saveActivity"
            :disabled="isSaving"
            class="save-btn"
          >
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button 
            @click="goBack"
            :disabled="isSaving"
            class="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>

      <div class="form-content">
        <!-- Task Details Section -->
        <div class="form-section">
          <h4 class="subsection-title">Task Details</h4>
          <div class="form-grid three-col">
            <div class="form-field">
              <label class="form-label">Project <span class="required">*</span></label>
              <input 
                type="text" 
                class="form-input" 
                :value="activity.project" 
                readonly
                data-fieldtype="Link"
                data-fieldname="project"
                data-doctype="Activity"
                data-target="Project"
              >
            </div>
            <div class="form-field">
              <label class="form-label">Activity Name <span class="required">*</span></label>
              <input 
                v-if="permissions.write"
                v-model="activity.activity_name" 
                type="text" 
                class="form-input"
                placeholder="Enter activity name"
                data-fieldtype="Data"
                data-fieldname="activity_name"
                data-doctype="Activity"
                maxlength="140"
                required
              >
              <input 
                v-else
                type="text" 
                class="form-input" 
                :value="activity.activity_name" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Status <span class="required">*</span></label>
              <select 
                v-if="permissions.write"
                v-model="activity.status" 
                class="form-input"
                data-fieldtype="Select"
                data-fieldname="status"
                data-doctype="Activity"
              >
                <option value="Open">Open</option>
                <option value="Complete">Complete</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input 
                v-else
                type="text" 
                class="form-input" 
                :value="activity.status" 
                readonly
              >
            </div>
          </div>
        </div>

        <!-- Task Duration Section -->
        <div class="form-section">
          <h4 class="subsection-title">Task Duration</h4>
          <div class="form-grid three-col">
            <div class="form-field">
              <label class="form-label">Estimated Hours <span class="required">*</span></label>
              <input 
                v-if="permissions.write"
                v-model.number="activity.estimated_hours" 
                type="number" 
                class="form-input"
                min="0"
                step="0.5"
                placeholder="0"
                data-fieldtype="Float"
                data-fieldname="estimated_hours"
                data-doctype="Activity"
              >
              <input 
                v-else
                type="text" 
                class="form-input" 
                :value="activity.estimated_hours || 0" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Start Date</label>
              <input 
                v-if="permissions.write"
                v-model="activity.start_date" 
                type="date" 
                class="form-input"
                data-fieldtype="Date"
                data-fieldname="start_date"
                data-doctype="Activity"
              >
              <input 
                v-else
                type="date" 
                class="form-input" 
                :value="formatDateForInput(activity.start_date)" 
                readonly
              >
              <div class="help-text">Expected Start Date</div>
            </div>
            <div class="form-field">
              <label class="form-label">End Date</label>
              <input 
                v-if="permissions.write"
                v-model="activity.end_date" 
                type="date" 
                class="form-input"
                data-fieldtype="Date"
                data-fieldname="end_date"
                data-doctype="Activity"
              >
              <input 
                v-else
                type="date" 
                class="form-input" 
                :value="formatDateForInput(activity.end_date)" 
                readonly
              >
              <div class="help-text">Expected End Date</div>
            </div>
          </div>
        </div>

        <!-- Task Hours Section (Performance Tab) -->
        <div class="form-section">
          <h4 class="subsection-title">Task Hours</h4>
          <div class="form-grid three-col">
            <div class="form-field">
              <label class="form-label">Completion <span class="required">*</span></label>
              <input 
                v-if="permissions.write"
                v-model.number="activity.completion" 
                type="number" 
                class="form-input"
                min="0"
                max="100"
                placeholder="0"
                data-fieldtype="Float"
                data-fieldname="completion"
                data-doctype="Activity"
              >
              <input 
                v-else
                type="text" 
                class="form-input" 
                :value="activity.completion || 0" 
                readonly
              >
              <div class="help-text">Percentage of Task Completed</div>
            </div>
            <div class="form-field">
              <label class="form-label">Burnt Hours</label>
              <input 
                type="text" 
                class="form-input" 
                :value="activity.burnt_hours || 0" 
                readonly
                data-fieldtype="Float"
                data-fieldname="burnt_hours"
                data-doctype="Activity"
              >
            </div>
            <div class="form-field">
              <label class="form-label">Remaining Hours</label>
              <input 
                type="text" 
                class="form-input" 
                :value="activity.remaining_hours || 0" 
                readonly
                data-fieldtype="Float"
                data-fieldname="remaining_hours"
                data-doctype="Activity"
              >
            </div>
          </div>
        </div>

        <!-- Progress Visualization -->
        <div class="form-section" v-if="activity.estimated_hours">
          <h4 class="subsection-title">Progress Overview</h4>
          <div class="progress-overview">
            <div class="progress-bar-container">
              <div class="progress-bar-header">
                <span class="progress-label">Completion Progress</span>
                <span class="progress-percentage">{{ activity.completion || 0 }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (activity.completion || 0) + '%' }"></div>
              </div>
            </div>
            
            <div class="hours-summary">
              <div class="hours-item">
                <span class="hours-label">Estimated</span>
                <span class="hours-value">{{ activity.estimated_hours || 0 }}h</span>
              </div>
              <div class="hours-item">
                <span class="hours-label">Burnt</span>
                <span class="hours-value">{{ activity.burnt_hours || 0 }}h</span>
              </div>
              <div class="hours-item">
                <span class="hours-label">Remaining</span>
                <span class="hours-value">{{ activity.remaining_hours || 0 }}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getActivity, updateActivity, getActivityPermissions } from '../services/activities';
import { getProject } from '../services/projects';

// Types
interface Activity {
  name: string;
  activity_name: string;
  project: string;
  status: string;
  estimated_hours?: number;
  start_date?: string;
  end_date?: string;
  completion?: number;
  burnt_hours?: number;
  remaining_hours?: number;
  creation?: string;
  modified?: string;
  owner?: string;
}

// Route and router
const route = useRoute();
const router = useRouter();

// Reactive data
const activity = ref<Activity>({
  name: '',
  activity_name: '',
  project: '',
  status: 'Open',
  completion: 0,
  estimated_hours: 1.0
});

const originalActivity = ref<Partial<Activity>>({});
const isSaving = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const projectId = ref('');
const projectName = ref('');
const permissions = ref<any>({ read: true, write: false, delete: false });

// Methods
const loadActivity = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const activityId = route.params.activityId as string;
    projectId.value = route.params.projectId as string;
    
    // Load activity data and permissions in parallel
    const [activityData, activityPermissions, projectData] = await Promise.all([
      getActivity(activityId),
      getActivityPermissions(activityId),
      getProject(projectId.value)
    ]);
    
    activity.value = activityData || {};
    originalActivity.value = { ...activityData };
    permissions.value = activityPermissions;
    projectName.value = projectData?.project_name || 'Unknown Project';
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load activity';
    console.error('Error loading activity:', err);
    
    // If activity not found, create a placeholder
    if (err.message?.includes('404') || err.message?.includes('not found')) {
      const activityName = route.query.activityName as string || 'Unknown Activity';
      activity.value = {
        name: route.params.activityId as string,
        activity_name: activityName,
        project: projectId.value,
        status: 'Open',
        completion: 0,
        estimated_hours: 1.0
      };
      originalActivity.value = { ...activity.value };
    }
  } finally {
    loading.value = false;
  }
};

const saveActivity = async () => {
  if (!permissions.value.write) {
    alert('You do not have permission to edit this activity');
    return;
  }

  try {
    isSaving.value = true;
    
    // Prepare the data for saving
    const updateData = {
      activity_name: activity.value.activity_name,
      status: activity.value.status,
      estimated_hours: activity.value.estimated_hours,
      start_date: activity.value.start_date,
      end_date: activity.value.end_date,
      completion: activity.value.completion
    };

    console.log('Saving activity data:', updateData);
    await updateActivity(activity.value.name, updateData);
    
    alert(`Activity "${activity.value.activity_name}" has been updated successfully!`);
    
    // Navigate back to project detail
    goBack();
    
  } catch (error: any) {
    console.error('Error saving activity:', error);
    alert(`Error saving activity: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};

const goBack = () => {
  const returnTo = route.query.returnTo as string;
  
  if (returnTo === 'project-detail') {
    router.push(`/projects/${projectId.value}`);
  } else {
    router.back();
  }
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Open':
      return 'status-open';
    case 'Complete':
      return 'status-complete';
    case 'Cancelled':
      return 'status-cancelled';
    default:
      return 'status-default';
  }
};

const formatDateForInput = (date: string | undefined): string => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

// Lifecycle
onMounted(() => {
  loadActivity();
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
  padding: var(--spacing-xl) 0;
  border-bottom: 1px solid var(--monday-light);
  margin-bottom: var(--spacing-xl);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  font-size: 14px;
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

.activity-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.activity-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.activity-number {
  font-size: 16px;
  color: var(--monday-medium);
  margin: var(--spacing-xs) 0 0 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.back-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--monday-light);
  background: var(--monday-white);
  color: var(--monday-medium-dark);
}

.back-btn:hover {
  background: var(--monday-very-light);
  border-color: var(--primary-green);
}

/* Form */
.activity-form-section {
  background: var(--monday-white);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--monday-light);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.form-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.save-btn, .cancel-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.save-btn {
  background: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

.save-btn:hover:not(:disabled) {
  background: var(--primary-green-hover);
  border-color: var(--primary-green-hover);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--monday-white);
  color: var(--monday-medium-dark);
  border-color: var(--monday-light);
}

.cancel-btn:hover:not(:disabled) {
  background: var(--monday-very-light);
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-content {
  padding: var(--spacing-xl);
}

.form-section {
  margin-bottom: var(--spacing-xl);
}

.form-section:last-child {
  margin-bottom: 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0 0 var(--spacing-lg) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--monday-very-light);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.form-grid.three-col {
  grid-template-columns: repeat(3, 1fr);
}

.form-grid.four-col {
  grid-template-columns: repeat(4, 1fr);
}

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

.form-input, .form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  color: var(--monday-dark);
  background: var(--monday-background);
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px var(--primary-green-light);
}

.form-textarea {
  resize: vertical;
  line-height: 1.5;
}

.required {
  color: var(--monday-red);
}

/* Status Indicators */
.status-indicator {
  margin-top: var(--spacing-sm);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-xl);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border: none;
  display: inline-block;
}

.status-badge.status-open {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.status-complete {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.status-cancelled {
  background: #f5f5f5;
  color: #757575;
}

.status-badge.status-default {
  background: var(--accent-green-light);
  color: var(--accent-green);
}

/* Progress Overview */
.progress-overview {
  padding: var(--spacing-lg);
  background: var(--monday-background);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--monday-light);
}

.progress-bar-container {
  margin-bottom: var(--spacing-lg);
}

.progress-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.progress-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--monday-dark);
}

.progress-percentage {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-green);
}

.progress-bar {
  background: var(--monday-very-light);
  height: 8px;
  border-radius: var(--border-radius-small);
  overflow: hidden;
}

.progress-fill {
  background: var(--primary-green);
  height: 100%;
  border-radius: var(--border-radius-small);
  transition: width 0.3s ease;
}

.hours-summary {
  display: flex;
  gap: var(--spacing-xl);
  justify-content: space-around;
}

.hours-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.hours-label {
  font-size: 12px;
  color: var(--monday-medium);
  text-transform: uppercase;
  font-weight: 500;
}

.hours-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--monday-dark);
}

/* Help Text */
.help-text {
  font-size: 11px;
  color: var(--monday-medium);
  margin-top: var(--spacing-xs);
}

.required {
  color: var(--monday-red);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }

  .activity-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .form-grid.four-col,
  .form-grid.three-col {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .hours-summary {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}

@media (max-width: 1024px) {
  .form-grid.four-col {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
