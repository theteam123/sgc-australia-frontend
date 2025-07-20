<template>
  <div class="project-dashboard">



    <!-- Recent Projects Table -->
    <div class="monday-card">
      <div class="monday-card-body">
        <div class="monday-table">
          <table class="w-full">
            <thead>
              <tr>
                <th class="monday-table-header text-left">Project</th>
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
import {
  FolderIcon
} from 'lucide-vue-next';
import { getProjects } from '../services/projects';

// Props
const props = defineProps<{
  searchQuery?: string;
}>();

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
  console.log('Filtering projects with query:', props.searchQuery);
  console.log('Total projects:', projects.value.length);
  
  if (!props.searchQuery || props.searchQuery.trim() === '') {
    console.log('No search query, returning all projects');
    return projects.value;
  }
  
  const query = props.searchQuery.toLowerCase().trim();
  const filtered = projects.value.filter(project => 
    (project.project_name || '').toString().toLowerCase().includes(query) ||
    (project.project_code || '').toString().toLowerCase().includes(query) ||
    (project.organisation || '').toString().toLowerCase().includes(query) ||
    (project.status || '').toString().toLowerCase().includes(query)
  );
  
  console.log('Filtered projects:', filtered.length);
  return filtered;
});

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
}
</style>