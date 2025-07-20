<template>
  <div class="container">
    <!-- Header -->
    <div class="document-header">
      <div class="breadcrumb">
        <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
        <span class="breadcrumb-separator">›</span>
        <router-link :to="`/projects/${projectId}`" class="breadcrumb-link">{{ projectName }}</router-link>
        <span class="breadcrumb-separator">›</span>
        <span>Timesheets</span>
      </div>
      
      <div class="header-section">
        <div class="header-title-section">
          <h1 class="page-title">Timesheets</h1>
          <p class="page-subtitle">Manage timesheets for {{ projectName }}</p>
        </div>
        <div class="header-actions">
          <button 
            @click="createNewTimesheet"
            class="btn-primary"
            :disabled="loading"
          >
            <FilePlusIcon class="w-5 h-5 mr-2" />
            New Timesheet
          </button>
          <button 
            @click="refreshData"
            class="btn-secondary"
            :disabled="loading"
          >
            <RefreshCwIcon class="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <LoaderIcon class="w-8 h-8 animate-spin text-primary-green" />
      <span>Loading timesheets...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <AlertCircleIcon class="w-8 h-8 text-red-500" />
      <span>{{ error }}</span>
      <button @click="refreshData" class="btn-secondary mt-4">Try Again</button>
    </div>

    <!-- Timesheets Content -->
    <div v-else class="documents-section">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon bg-indigo-100 text-indigo-600">
            <ClockIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ timesheets.length }}</div>
            <div class="summary-label">Total Timesheets</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-green-100 text-green-600">
            <CheckCircleIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ submittedTimesheets }}</div>
            <div class="summary-label">Submitted</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-yellow-100 text-yellow-600">
            <CalendarIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ draftTimesheets }}</div>
            <div class="summary-label">Draft</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-blue-100 text-blue-600">
            <UserIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ formatHours(totalHours) }}</div>
            <div class="summary-label">Total Hours</div>
          </div>
        </div>
      </div>

      <!-- Timesheets List -->
      <div class="documents-list" v-if="timesheets.length > 0">
        <div class="list-header">
          <h3 class="list-title">Timesheets</h3>
          <div class="list-controls">
            <div class="search-box">
              <SearchIcon class="w-5 h-5 text-gray-400" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search timesheets..."
                class="search-input"
              >
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="table-container hidden md:block">
          <table class="documents-table">
            <thead>
              <tr>
                <th>Timesheet ID</th>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="timesheet in filteredTimesheets" :key="timesheet.name" class="table-row">
                <td>
                  <div class="cell-content">
                    <span class="font-medium text-gray-900">{{ timesheet.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="font-medium">{{ timesheet.employee_name || timesheet.employee }}</span>
                </td>
                <td>
                  <span class="text-sm">{{ formatDate(timesheet.start_date || '') }}</span>
                </td>
                <td>
                  <span class="text-sm">{{ formatDate(timesheet.end_date || '') }}</span>
                </td>
                <td>
                  <span class="font-medium">{{ formatHours(timesheet.total_hours || 0) }}</span>
                </td>
                <td>
                  <span 
                    class="status-badge"
                    :class="getStatusClass(timesheet.docstatus || 0)"
                  >
                    {{ getStatusText(timesheet.docstatus || 0) }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button 
                      @click="viewTimesheet(timesheet)"
                      class="action-btn action-btn-view"
                      title="View Details"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="editTimesheet(timesheet)"
                      class="action-btn action-btn-edit"
                      title="Edit"
                    >
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="downloadPDF(timesheet)"
                      class="action-btn action-btn-download"
                      title="Download PDF"
                    >
                      <DownloadIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-cards md:hidden">
          <div 
            v-for="timesheet in filteredTimesheets" 
            :key="timesheet.name" 
            class="mobile-card"
          >
            <div class="mobile-card-header">
              <div>
                <h4 class="mobile-card-title">{{ timesheet.name }}</h4>
                <p class="mobile-card-subtitle">{{ timesheet.employee_name || timesheet.employee }}</p>
              </div>
              <span 
                class="status-badge"
                :class="getStatusClass(timesheet.docstatus || 0)"
              >
                {{ getStatusText(timesheet.docstatus || 0) }}
              </span>
            </div>
            <div class="mobile-card-content">
              <div class="mobile-card-row">
                <span class="mobile-card-label">Period:</span>
                <span>{{ formatDate(timesheet.start_date || '') }} - {{ formatDate(timesheet.end_date || '') }}</span>
              </div>
              <div class="mobile-card-row">
                <span class="mobile-card-label">Total Hours:</span>
                <span class="font-medium">{{ formatHours(timesheet.total_hours || 0) }}</span>
              </div>
            </div>
            <div class="mobile-card-actions">
              <button 
                @click="viewTimesheet(timesheet)"
                class="mobile-action-btn"
              >
                <EyeIcon class="w-4 h-4 mr-1" />
                View
              </button>
              <button 
                @click="editTimesheet(timesheet)"
                class="mobile-action-btn"
              >
                <EditIcon class="w-4 h-4 mr-1" />
                Edit
              </button>
              <button 
                @click="downloadPDF(timesheet)"
                class="mobile-action-btn"
              >
                <DownloadIcon class="w-4 h-4 mr-1" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <ClockIcon class="w-16 h-16 text-gray-300" />
        <h3 class="empty-title">No Timesheets Found</h3>
        <p class="empty-description">
          No timesheets have been created for this project yet.
        </p>
        <button 
          @click="createNewTimesheet"
          class="btn-primary"
        >
          <FilePlusIcon class="w-5 h-5 mr-2" />
          Create First Timesheet
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  FilePlusIcon, 
  RefreshCwIcon, 
  LoaderIcon, 
  AlertCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  DownloadIcon
} from 'lucide-vue-next';
import { getProjectDocuments, createTimesheet } from '../services/documents';
import { getProject } from '../services/projects';
import { getDomainConfig } from '../config/domains';

// Types
interface Timesheet {
  name: string;
  employee: string;
  employee_name?: string;
  timesheet_approver?: string;
  start_date?: string;
  end_date?: string;
  total_hours?: number;
  timesheet_entries?: any[];
  docstatus?: number;
  [key: string]: any;
}

// Route and router
const route = useRoute();
const router = useRouter();

// Reactive data
const timesheets = ref<Timesheet[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const projectId = ref('');
const projectName = ref('');
const projectData = ref<any>({});
const searchQuery = ref('');

// Computed properties
const filteredTimesheets = computed(() => {
  let filtered = timesheets.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(timesheet => 
      timesheet.name.toLowerCase().includes(query) ||
      (timesheet.employee && timesheet.employee.toLowerCase().includes(query)) ||
      (timesheet.employee_name && timesheet.employee_name.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

const submittedTimesheets = computed(() => 
  timesheets.value.filter(timesheet => timesheet.docstatus === 1).length
);

const draftTimesheets = computed(() => 
  timesheets.value.filter(timesheet => timesheet.docstatus === 0).length
);

const totalHours = computed(() => 
  timesheets.value.reduce((sum, timesheet) => sum + (timesheet.total_hours || 0), 0)
);

// Methods
const getErpNextUrl = () => {
  const config = getDomainConfig();
  return config.apiUrl || config.fallbackUrl;
};

const loadProject = async () => {
  try {
    projectId.value = route.params.projectId as string;
    const project = await getProject(projectId.value);
    projectName.value = project?.project_name || 'Unknown Project';
    projectData.value = project;
  } catch (err: any) {
    console.error('Error loading project:', err);
    projectName.value = 'Unknown Project';
  }
};

const loadTimesheets = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await loadProject();
    
    if (projectData.value.name) {
      const timesheetData = await getProjectDocuments('Timesheet', projectData.value.name);
      timesheets.value = timesheetData || [];
    }
  } catch (err: any) {
    console.error('Error loading timesheets:', err);
    error.value = err.message || 'Failed to load timesheets';
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadTimesheets();
};

const createNewTimesheet = () => {
  // Generate a unique form ID based on project data
  const formId = `${projectData.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  // Navigate to Vue frontend form
  router.push(`/timesheet/new-timesheet-${formId}?project=${encodeURIComponent(projectData.value.name)}&projectId=${encodeURIComponent(projectId.value)}`);
};

const viewTimesheet = (timesheet: Timesheet) => {
  // Navigate to ERPNext document view
  const baseUrl = getErpNextUrl();
  window.location.href = `${baseUrl}/app/timesheet/${timesheet.name}`;
};

const editTimesheet = (timesheet: Timesheet) => {
  // Navigate to ERPNext document edit
  const baseUrl = getErpNextUrl();
  window.location.href = `${baseUrl}/app/timesheet/${timesheet.name}`;
};

const downloadPDF = (timesheet: Timesheet) => {
  // Navigate to ERPNext PDF download
  const baseUrl = getErpNextUrl();
  window.open(`${baseUrl}/app/timesheet/${timesheet.name}/print`, '_blank');
};

const formatDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatHours = (hours: number): string => {
  return `${hours.toFixed(1)}h`;
};

const getStatusText = (docstatus: number): string => {
  switch (docstatus) {
    case 0: return 'Draft';
    case 1: return 'Submitted';
    case 2: return 'Cancelled';
    default: return 'Unknown';
  }
};

const getStatusClass = (docstatus: number): string => {
  switch (docstatus) {
    case 0: return 'status-draft';
    case 1: return 'status-submitted';
    case 2: return 'status-cancelled';
    default: return 'status-unknown';
  }
};

// Lifecycle
onMounted(() => {
  loadTimesheets();
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
.document-header {
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
}

.header-title-section {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0 0 var(--spacing-xs) 0;
}

.page-subtitle {
  font-size: 16px;
  color: var(--monday-medium);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Buttons */
.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  text-decoration: none;
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

.btn-secondary:hover:not(:disabled) {
  background: var(--monday-very-light);
  border-color: var(--primary-green);
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  background: var(--monday-white);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  gap: var(--spacing-md);
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.summary-card {
  background: var(--monday-white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.summary-icon {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-medium);
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
}

.summary-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--monday-dark);
  line-height: 1;
}

.summary-label {
  font-size: 12px;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--spacing-xs);
}

/* Documents Section */
.documents-section {
  background: var(--monday-white);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
}

.documents-list {
  padding: var(--spacing-xl);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-lg);
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.list-controls {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: var(--spacing-sm);
  pointer-events: none;
}

.search-input {
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) var(--spacing-xl);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px var(--primary-green-light);
}

/* Table */
.table-container {
  overflow-x: auto;
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--monday-light);
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
}

.documents-table thead th {
  background: var(--monday-background);
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--monday-light);
}

.documents-table tbody td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--monday-very-light);
}

.table-row:hover {
  background: var(--monday-very-light);
}

.cell-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-small);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-draft {
  background: #fef3c7;
  color: #92400e;
}

.status-submitted {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-unknown {
  background: #f3f4f6;
  color: #374151;
}

/* Actions */
.actions-cell {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  padding: var(--spacing-xs);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-small);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--primary-green);
  background: var(--primary-green-light);
}

.action-btn-view:hover {
  border-color: var(--secondary-green);
  background: var(--secondary-green-light);
}

.action-btn-edit:hover {
  border-color: #f59e0b;
  background: #fef3c7;
}

.action-btn-download:hover {
  border-color: #8b5cf6;
  background: #f3e8ff;
}

/* Mobile Cards */
.mobile-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.mobile-card {
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-lg);
}

.mobile-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.mobile-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.mobile-card-subtitle {
  font-size: 14px;
  color: var(--monday-medium);
  margin: var(--spacing-xs) 0 0 0;
}

.mobile-card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.mobile-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-card-label {
  font-size: 12px;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-card-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-small);
  background: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-action-btn:hover {
  border-color: var(--primary-green);
  background: var(--primary-green-light);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  text-align: center;
  gap: var(--spacing-lg);
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.empty-description {
  font-size: 16px;
  color: var(--monday-medium);
  margin: 0;
  max-width: 400px;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .list-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .list-controls {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .search-input {
    width: 100%;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
