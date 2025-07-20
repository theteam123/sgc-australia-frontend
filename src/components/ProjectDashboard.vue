<template>
  <div class="project-dashboard">
    <!-- Projects Header -->
    <div class="projects-header">
      <h3 class="section-title">Projects</h3>
      
      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-buttons">
          <button class="btn-primary" @click="createNewProject">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="M9 15h6"></path>
              <path d="M12 18v-6"></path>
            </svg>
            New Project
          </button>
          <button class="btn-secondary" @click="handleRefresh" v-if="props.onRefresh">
            <RefreshCwIcon class="w-5 h-5" />
            Refresh
          </button>
          <button class="btn-secondary" @click="showFilters = !showFilters">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <!-- Global Search -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search projects..."
            class="search-input"
          >
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-container" v-show="showFilters">
        <div class="filter-grid">
          <div class="filter-field">
            <label class="filter-label">Division</label>
            <select v-model="selectedDivision" class="filter-select">
              <option value="">All Divisions</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Construction">Construction</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          <div class="filter-field">
            <label class="filter-label">Client</label>
            <input 
              v-model="clientFilter"
              type="text" 
              placeholder="Filter by client..."
              class="filter-input"
            >
          </div>
          <div class="filter-field">
            <label class="filter-label">Status</label>
            <select v-model="selectedStatus" class="filter-select">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div class="filter-field">
            <label class="filter-label">Value</label>
            <select v-model="valueRange" class="filter-select">
              <option value="">All Values</option>
              <option value="0-50000">$0 - $50K</option>
              <option value="50000-100000">$50K - $100K</option>
              <option value="100000-500000">$100K - $500K</option>
              <option value="500000+">$500K+</option>
            </select>
          </div>
          <div class="filter-field">
            <label class="filter-label">% Complete</label>
            <select v-model="completionRange" class="filter-select">
              <option value="">All Completion</option>
              <option value="0-25">0% - 25%</option>
              <option value="25-50">25% - 50%</option>
              <option value="50-75">50% - 75%</option>
              <option value="75-100">75% - 100%</option>
            </select>
          </div>
          <div class="filter-field">
            <label class="filter-label">Margin %</label>
            <select v-model="marginRange" class="filter-select">
              <option value="">All Margins</option>
              <option value="negative">Negative</option>
              <option value="0-10">0% - 10%</option>
              <option value="10-20">10% - 20%</option>
              <option value="20+">20%+</option>
            </select>
          </div>
        </div>
        
        <!-- Filter Actions -->
        <div class="filter-actions">
          <button @click="clearFilters" class="btn-clear-filters">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-count">
        Showing {{ filteredProjects.length }} of {{ projects.length }} projects
      </div>
    </div>

    <!-- Recent Projects Table -->
    <div class="monday-card">
      <div class="monday-card-body">
        <div class="monday-table">
          <table class="w-full">
            <thead>
              <tr>
                <th class="monday-table-header text-left">Project</th>
                <th class="monday-table-header text-left">Division</th>
                <th class="monday-table-header text-left">Client</th>
                <th class="monday-table-header text-left">Status</th>
                <th class="monday-table-header text-left">Value</th>
                <th class="monday-table-header text-left">% Complete</th>
                <th class="monday-table-header text-left">Margin %</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in filteredProjects" :key="project.id" class="monday-table-row group">
                <td class="monday-table-cell">
                  <div class="flex items-center gap-3">
                    <div class="project-icon">
                      <FolderIcon class="w-4 h-4 text-primary-green" />
                    </div>
                    <div>
                      <router-link 
                        :to="`/projects/${project.id}`"
                        class="text-label text-monday-dark hover:text-primary-green transition-colors"
                      >
                        {{ project.project_name }}
                      </router-link>
                      <div class="text-small text-monday-medium">{{ project.project_code }}</div>
                    </div>
                  </div>
                </td>
                <td class="monday-table-cell">
                  <div class="text-body text-monday-dark">{{ project.division }}</div>
                </td>
                <td class="monday-table-cell">
                  <div class="text-body text-monday-dark">{{ project.organisation }}</div>
                </td>
                <td class="monday-table-cell">
                  <span class="status-badge" :class="getStatusClass(project.status)">
                    {{ project.status }}
                  </span>
                </td>
                <td class="monday-table-cell">
                  <div class="text-label text-monday-dark">{{ formatCurrency(project.project_value) }}</div>
                </td>
                <td class="monday-table-cell">
                  <div class="completion-indicator">
                    <div class="completion-bar">
                      <div class="completion-fill" :style="{ width: getCompletionPercentage(project) + '%' }"></div>
                    </div>
                    <span class="text-small text-monday-medium">{{ getCompletionPercentage(project) }}%</span>
                  </div>
                </td>
                <td class="monday-table-cell">
                  <div class="text-label" :class="getMarginColorClass(project.estimated_margin_percent)">
                    {{ formatMarginPercent(project.estimated_margin_percent) }}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  FolderIcon,
  RefreshCwIcon
} from 'lucide-vue-next';
import { getProjects } from '../services/projects';

const router = useRouter();

// Props
const props = defineProps<{
  searchQuery?: string;
  onRefresh?: () => void;
}>();

// Filter state
const searchQuery = ref('');
const showFilters = ref(false);
const selectedDivision = ref('');
const clientFilter = ref('');
const selectedStatus = ref('');
const valueRange = ref('');
const completionRange = ref('');
const marginRange = ref('');

interface Project {
  id: string;
  organisation: string;
  contact: string;
  project_code: string;
  project_name: string;
  division: string;
  project_type: string;
  status: string;
  work_type: string;
  industry_sector: string;
  project_start_date: string;
  project_end_date: string;
  reputation: string;
  relationship: string;
  client_positioning: string;
  project_value: number;
  probability: number;
  estimated_revenue: number;
  estimated_total_cost: number;
  estimated_margin: number;
  estimated_margin_percent: number;
  pva_score: number;
  likelyhood_of_works: number;
  estimated_hours: number;
  labour_hours: number;
}

// Projects data
const projects = ref<Project[]>([]);

// Load projects from ERP
const loadProjects = async () => {
  try {
    const result = await getProjects(1, 100);
    projects.value = result.data || [];
    console.log('Loaded projects:', projects.value.length);
    console.log('Sample project:', projects.value[0]);
  } catch (error) {
    console.error('Error loading projects:', error);
    projects.value = [];
  }
};


// Computed properties for statistics
const filteredProjects = computed(() => {
  console.log('Filtering projects with query:', searchQuery.value);
  console.log('Total projects:', projects.value.length);
  
  let filtered = projects.value;
  
  // Apply search query filter
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(project => 
      (project.project_name || '').toString().toLowerCase().includes(query) ||
      (project.project_code || '').toString().toLowerCase().includes(query) ||
      (project.organisation || '').toString().toLowerCase().includes(query) ||
      (project.status || '').toString().toLowerCase().includes(query)
    );
  }
  
  // Apply external search query prop filter
  if (props.searchQuery && props.searchQuery.trim() !== '') {
    const query = props.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(project => 
      (project.project_name || '').toString().toLowerCase().includes(query) ||
      (project.project_code || '').toString().toLowerCase().includes(query) ||
      (project.organisation || '').toString().toLowerCase().includes(query) ||
      (project.status || '').toString().toLowerCase().includes(query)
    );
  }
  
  // Apply division filter
  if (selectedDivision.value) {
    filtered = filtered.filter(project => project.division === selectedDivision.value);
  }
  
  // Apply client filter
  if (clientFilter.value && clientFilter.value.trim() !== '') {
    const clientQuery = clientFilter.value.toLowerCase().trim();
    filtered = filtered.filter(project => 
      (project.organisation || '').toString().toLowerCase().includes(clientQuery)
    );
  }
  
  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(project => project.status === selectedStatus.value);
  }
  
  // Apply value range filter
  if (valueRange.value) {
    filtered = filtered.filter(project => {
      const value = project.project_value || 0;
      switch (valueRange.value) {
        case '0-50000':
          return value >= 0 && value <= 50000;
        case '50000-100000':
          return value > 50000 && value <= 100000;
        case '100000-500000':
          return value > 100000 && value <= 500000;
        case '500000+':
          return value > 500000;
        default:
          return true;
      }
    });
  }
  
  // Apply completion range filter
  if (completionRange.value) {
    filtered = filtered.filter(project => {
      const completion = getCompletionPercentage(project);
      switch (completionRange.value) {
        case '0-25':
          return completion >= 0 && completion <= 25;
        case '25-50':
          return completion > 25 && completion <= 50;
        case '50-75':
          return completion > 50 && completion <= 75;
        case '75-100':
          return completion > 75 && completion <= 100;
        default:
          return true;
      }
    });
  }
  
  // Apply margin range filter
  if (marginRange.value) {
    filtered = filtered.filter(project => {
      const margin = project.estimated_margin_percent || 0;
      switch (marginRange.value) {
        case 'negative':
          return margin < 0;
        case '0-10':
          return margin >= 0 && margin <= 10;
        case '10-20':
          return margin > 10 && margin <= 20;
        case '20+':
          return margin > 20;
        default:
          return true;
      }
    });
  }
  
  console.log('Filtered projects:', filtered.length);
  return filtered;
});

// Filter methods
const clearFilters = () => {
  searchQuery.value = '';
  selectedDivision.value = '';
  clientFilter.value = '';
  selectedStatus.value = '';
  valueRange.value = '';
  completionRange.value = '';
  marginRange.value = '';
};

const createNewProject = () => {
  router.push('/projects/new');
};

const handleRefresh = () => {
  if (props.onRefresh) {
    props.onRefresh();
  }
};

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Active': 'status-done',
    'Planning': 'status-working',
    'Completed': 'status-done',
    'On Hold': 'status-stuck'
  };
  return statusMap[status] || 'status-blank';
};

const getCompletionPercentage = (project: Project): number => {
  // Calculate completion based on project status
  switch (project.status) {
    case 'Completed':
      return 100;
    case 'Active':
      return 65; // Assume active projects are roughly 65% complete
    case 'Planning':
      return 15; // Planning stage is early completion
    case 'On Hold':
      return 25; // On hold projects might be partially done
    default:
      return 0;
  }
};

const formatMarginPercent = (margin: number): string => {
  return (Math.round(margin * 10) / 10).toString(); // Round to 1 decimal place
};

const getMarginColorClass = (margin: number): string => {
  if (margin > 20) {
    return 'text-green-600'; // Green for >20%
  } else if (margin > 0) {
    return 'text-orange-500'; // Orange for 0-20%
  } else {
    return 'text-red-600'; // Red for ≤0%
  }
};

onMounted(() => {
  loadProjects();
});
</script>

<style scoped>
@import '../styles/monday-design-system.css';

.project-dashboard {
  padding: 0;
  gap: 1.5rem;
  display: flex;
  flex-direction: column;
}

/* Projects Header */
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.filter-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.filter-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

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

.btn-primary:hover {
  background: var(--primary-green-hover);
  border-color: var(--primary-green-hover);
}

.btn-secondary {
  background: var(--monday-white);
  color: var(--monday-medium-dark);
  border-color: var(--monday-light);
}

.btn-secondary:hover {
  background: var(--monday-very-light);
}

/* Search and Filter Styles */
.search-filter-section {
  background: var(--monday-white);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-lg);
  margin-bottom: 0;
}

.search-container {
  margin-bottom: var(--spacing-md);
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--monday-medium);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 40px;
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px var(--primary-green-light);
}

.filters-container {
  border-top: 1px solid var(--monday-very-light);
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.filter-field {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

.filter-input, .filter-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 2px var(--primary-green-light);
}

.filter-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  align-items: center;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--monday-very-light);
}

.btn-clear-filters, .btn-toggle-filters {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear-filters {
  background: var(--monday-white);
  color: var(--monday-medium-dark);
}

.btn-clear-filters:hover {
  background: var(--monday-very-light);
  border-color: var(--monday-medium);
}

.btn-toggle-filters {
  background: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

.btn-toggle-filters:hover {
  background: var(--primary-green-hover);
  border-color: var(--primary-green-hover);
}

.results-count {
  font-size: 14px;
  color: var(--monday-medium);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--monday-very-light);
}



/* KPI Grid */
.kpi-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kpi-item {
  text-align: center;
}

.kpi-score {
  font-size: 2rem;
  font-weight: 700;
  color: var(--monday-dark);
  margin-bottom: 0.5rem;
}

.kpi-label {
  font-size: 0.875rem;
  color: var(--monday-medium);
  margin-bottom: 0.75rem;
}

.kpi-bar {
  height: 6px;
  background: var(--monday-light);
  border-radius: 3px;
  overflow: hidden;
}

.kpi-fill {
  height: 100%;
  background: var(--primary-green);
  transition: width 0.3s ease;
}

.kpi-fill.success {
  background: var(--accent-green);
}

.kpi-fill.warning {
  background: var(--monday-orange);
}


/* Table Enhancements */
.project-icon {
  width: 32px;
  height: 32px;
  background: var(--primary-green-light);
  border-radius: var(--border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
}

.completion-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.completion-bar {
  width: 60px;
  height: 4px;
  background: var(--monday-light);
  border-radius: 2px;
  overflow: hidden;
}

.completion-fill {
  height: 100%;
  background: var(--accent-green);
  transition: width 0.3s ease;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--monday-light);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-green);
  transition: width 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .kpi-grid {
    gap: 1rem;
  }
  
  .projects-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .filter-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-clear-filters {
    width: 100%;
    text-align: center;
  }
}
</style>