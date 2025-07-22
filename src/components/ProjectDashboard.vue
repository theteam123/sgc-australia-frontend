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
          <button 
            class="btn-secondary clear-all-filters-btn" 
            @click="clearFilters"
            title="Clear all filters"
            v-if="selectedDivision || clientFilter || selectedStatus || valueRange || completionRange || marginRange || parsedQuery.isNaturalLanguage"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <!-- Smart Search -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input 
            v-model="naturalLanguageQuery"
            type="text" 
            placeholder="Smart Search: Try 'projects worth more than 500k', 'completed projects', 'margin less than 10%', 'PRO division projects'... (Press Enter to search)"
            class="search-input natural-language-input"
            :class="{ 'ai-enabled': aiEnabled, 'ai-processing': isAiProcessing }"
            @keyup.enter="processNaturalLanguageQuery"
            :disabled="isAiProcessing"
          >
          <div class="search-controls">
            <button 
              @click="processNaturalLanguageQuery"
              class="search-btn"
              title="Search (or press Enter)"
              :disabled="isAiProcessing"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
            <button 
              @click="clearNaturalLanguageQuery"
              class="clear-search-btn"
              title="Clear search"
              :disabled="isAiProcessing"
              v-if="naturalLanguageQuery"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button 
              v-if="!aiEnabled" 
              @click="enableAiSearch"
              class="ai-enable-btn"
              title="Enable AI enhancement for complex queries (optional)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
              </svg>
              AI+
            </button>
            <button 
              v-if="aiEnabled" 
              @click="disableAiSearch"
              class="ai-indicator-btn active" 
              title="Click to disable AI enhancement"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
              </svg>
            </button>
            <div v-if="isAiProcessing" class="ai-processing">
              <div class="ai-spinner"></div>
              <span>AI enhancing...</span>
            </div>
          </div>
        </div>
        <div v-if="parsedQuery.isNaturalLanguage" class="query-interpretation">
          <div class="interpretation-header">
            <span class="interpretation-label">
              {{ parsedQuery.isAiParsed ? '🤖 AI Search:' : '🔍 Search results:' }}
            </span>
            <div v-if="parsedQuery.isAiParsed" class="confidence-indicator">
              <span class="confidence-score" :class="getConfidenceClass(parsedQuery.confidence)">
                {{ Math.round(parsedQuery.confidence * 100) }}% confident
              </span>
            </div>
          </div>
          <span class="interpretation-text">{{ parsedQuery.interpretation }}</span>
          <div v-if="parsedQuery.suggestions && parsedQuery.suggestions.length > 0" class="ai-suggestions">
            <span class="suggestions-label">Suggestions:</span>
            <div class="suggestion-chips">
              <button 
                v-for="suggestion in parsedQuery.suggestions.slice(0, 3)" 
                :key="suggestion"
                @click="applySuggestion(suggestion)"
                class="suggestion-chip"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
          <button @click="clearNaturalLanguageQuery" class="clear-query-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-container" v-show="showFilters">
        <div class="filter-grid">
          <div class="filter-field">
            <label class="filter-label">Division</label>
            <select v-model="selectedDivision" class="filter-select">
              <option value="">All Divisions</option>
              <option value="PRO">PRO</option>
              <option value="ADM">ADM</option>
              <option value="AUT">AUT</option>
              <option value="ELC">ELC</option>
              <option value="TSD">TSD</option>
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
              <option value="Opportunity">Opportunity</option>
              <option value="Estimate">Estimate</option>
              <option value="Project">Project</option>
              <option value="Archived">Archived</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
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
          <button 
            @click="clearFilters"
            class="clear-filters-btn"
            title="Clear all filters"
            v-if="selectedDivision || clientFilter || selectedStatus || valueRange || completionRange || marginRange || parsedQuery.isNaturalLanguage"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Clear All Filters
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-count">
        <span v-if="isLoadingActivityFilter" class="loading-indicator">
          🔄 Filtering projects by activity status...
        </span>
        <span v-else>
          Showing {{ filteredProjects.length }} of {{ projects.length }} projects
        </span>
      </div>
    </div>

    <!-- Recent Projects Table -->
    <div class="monday-card">
      <div class="monday-card-body">
        <!-- Debug Information -->
        <div v-if="isDev" style="background: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
          <h4>Debug Information:</h4>
          <p><strong>Projects loaded:</strong> {{ projects.length }}</p>
          <p><strong>Filtered projects:</strong> {{ filteredProjects.length }}</p>
          <p><strong>Loading state:</strong> {{ loading ? 'Loading...' : 'Complete' }}</p>
          <p><strong>Environment:</strong> DEV MODE</p>
          <div v-if="projects.length > 0">
            <p><strong>First project:</strong></p>
            <pre style="font-size: 12px; background: white; padding: 5px;">{{ JSON.stringify(projects[0], null, 2) }}</pre>
          </div>
          <div v-else>
            <p><strong>No projects found</strong></p>
            <p style="color: red;">This might indicate an API authentication issue.</p>
            <p>Try visiting <a href="/documents/Project" target="_blank">/documents/Project</a> to see if projects are accessible via the documents interface.</p>
          </div>
        </div>
        
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
              <tr v-if="filteredProjects.length === 0" class="monday-table-row">
                <td colspan="7" class="monday-table-cell text-center" style="padding: 40px;">
                  <div v-if="loading">Loading projects...</div>
                  <div v-else>No projects found</div>
                </td>
              </tr>
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
import { parseNaturalLanguageQuery } from '../services/claudeAI.js';
import { filterProjectsByActivityStatus } from '../services/activities.js';

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

// Natural language processing state
const naturalLanguageQuery = ref('');
const isAiProcessing = ref(false);
const aiEnabled = ref(false);
const claudeApiKey = ref('');
const parsedQuery = ref({
  isNaturalLanguage: false,
  isAiParsed: false,
  interpretation: '',
  confidence: 0,
  filters: {
    startsWith: '',
    contains: '',
    status: '',
    division: '',
    client: '',
    valueRange: null,
    completionRange: null,
    marginRange: null,
    projectName: null,
    projectCode: null,
    semantic: null
  },
  suggestions: [],
  matchedProjects: []
});

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
const activityFilteredProjects = ref<Project[] | null>(null); // Projects filtered by activity status
const isLoadingActivityFilter = ref(false); // Loading state for activity filtering
const loading = ref(false);
const isDev = ref(false); // Disable debug mode - projects are now working correctly

// Load projects from ERP
const loadProjects = async () => {
  loading.value = true;
  
  try {
    const result = await getProjects(1, 100);
    projects.value = result.data || [];
    
    if (projects.value.length > 0) {
      console.log('✅ Projects loaded successfully:', projects.value.length, 'projects');
    } else {
      console.log('⚠️ No projects found');
    }
  } catch (error) {
    console.error('❌ Error loading projects:', error);
    projects.value = [];
  } finally {
    loading.value = false;
  }
};


// Computed properties for statistics
const filteredProjects = computed(() => {
  // If activity filtering is active, use the activity-filtered projects as base
  let filtered = activityFilteredProjects.value !== null ? activityFilteredProjects.value : projects.value;
  
  // Apply natural language query if active
  if (parsedQuery.value.isNaturalLanguage) {
    const filters = parsedQuery.value.filters;
    
    console.log('🔍 Natural language filtering active. Total projects:', filtered.length);
    console.log('🎯 Applied filters:', filters);
    
    // Activity status filtering is handled separately via async function
    // Skip other filters if we're currently loading activity filter results
    if (filters.activityStatus && isLoadingActivityFilter.value) {
      console.log('⏳ Activity filtering in progress, showing current state...');
      return filtered;
    }
    
    // Apply AI or basic name filters
    if (filters.projectName) {
      filtered = filtered.filter(project => 
        String(project.project_name || '').toLowerCase().includes(filters.projectName.toLowerCase())
      );
    }
    
    if (filters.projectCode) {
      filtered = filtered.filter(project => 
        String(project.project_code || '').toLowerCase().includes(filters.projectCode.toLowerCase())
      );
    }
    
    if (filters.contains) {
      filtered = filtered.filter(project => 
        String(project.project_name || '').toLowerCase().includes(filters.contains.toLowerCase()) ||
        String(project.project_code || '').toLowerCase().includes(filters.contains.toLowerCase()) ||
        String(project.organisation || '').toLowerCase().includes(filters.contains.toLowerCase())
      );
    }
    
    // Apply project number filter (prioritized for numeric searches)
    if (filters.projectNumber) {
      console.log(`Applying project number filter: "${filters.projectNumber}"`);
      const beforeNumberFilter = filtered.length;
      filtered = filtered.filter(project => 
        String(project.project_code || '').includes(filters.projectNumber) ||
        String(project.project_code || '') === `P${filters.projectNumber}` ||
        String(project.project_name || '').includes(filters.projectNumber) ||
        String(project.project_code || '').toLowerCase().includes(filters.projectNumber.toLowerCase())
      );
      console.log(`Project number filter applied: ${beforeNumberFilter} -> ${filtered.length} projects`);
    }
    
    // Apply status filter from natural language
    if (filters.status) {
      console.log(`Applying status filter: "${filters.status}"`);
      const beforeStatusFilter = filtered.length;
      filtered = filtered.filter(project => 
        project.status.toLowerCase() === filters.status.toLowerCase()
      );
      console.log(`Status filter applied: ${beforeStatusFilter} -> ${filtered.length} projects`);
    }
    
    // Apply division filter from natural language
    if (filters.division) {
      console.log(`Applying division filter: "${filters.division}"`);
      const beforeDivisionFilter = filtered.length;
      filtered = filtered.filter(project => 
        (project.division || '').toLowerCase() === filters.division.toLowerCase()
      );
      console.log(`Division filter applied: ${beforeDivisionFilter} -> ${filtered.length} projects`);
    }
    
    // Apply client filter from natural language
    if (filters.client) {
      console.log(`Applying client filter: "${filters.client}"`);
      const beforeClientFilter = filtered.length;
      filtered = filtered.filter(project => 
        String(project.organisation || '').toLowerCase().includes(filters.client.toLowerCase())
      );
      console.log(`Client filter applied: ${beforeClientFilter} -> ${filtered.length} projects`);
    }
    
    // Apply value range filter from natural language
    if (filters.valueRange) {
      console.log(`Applying value range filter: "${filters.valueRange}"`);
      const beforeValueFilter = filtered.length;
      filtered = filtered.filter(project => {
        const value = project.project_value || 0;
        switch (filters.valueRange) {
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
      console.log(`Value range filter applied: ${beforeValueFilter} -> ${filtered.length} projects`);
    }
    
    // Apply margin range filter from natural language
    if (filters.marginRange) {
      console.log(`Applying margin range filter: "${filters.marginRange}"`);
      const beforeMarginFilter = filtered.length;
      filtered = filtered.filter(project => {
        const margin = project.estimated_margin_percent || 0;
        switch (filters.marginRange) {
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
      console.log(`Margin range filter applied: ${beforeMarginFilter} -> ${filtered.length} projects`);
    }
    
    // Apply activity status filter from natural language
    if (filters.activityStatus) {
      console.log(`Applying activity status filter: "${filters.activityStatus}"`);
      
      // Trigger async activity filtering (this will update activityFilteredProjects)
      // Note: This is called from the computed property, but the actual filtering
      // happens asynchronously and updates the reactive activityFilteredProjects
      if (!isLoadingActivityFilter.value && activityFilteredProjects.value === null) {
        console.log('🚀 Triggering activity status filter...');
        applyActivityStatusFilter(filters.activityStatus);
      }
      
      // Return current filtered state (will be updated when async filtering completes)
      return filtered;
    }
    
    // Reset activity filtered projects if no activity status filter is active
    if (activityFilteredProjects.value !== null && !filters.activityStatus) {
      activityFilteredProjects.value = null;
    }
    
  } else {
    // Apply traditional search query filter
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
  }

  // Apply traditional filters only if natural language is not active
  if (!parsedQuery.value.isNaturalLanguage) {
    // Apply division filter
    if (selectedDivision.value && selectedDivision.value.trim() !== '') {
      filtered = filtered.filter(project => {
        const projectDivision = project.division || '';
        // Check for exact match with division name
        if (projectDivision === selectedDivision.value) {
          return true;
        }
        // Check if division contains the selected value (for partial matches)
        if (projectDivision.toString().toLowerCase().includes(selectedDivision.value.toLowerCase())) {
          return true;
        }
        return false;
      });
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
  }
  
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
  clearNaturalLanguageQuery();
};

// AI Configuration
const enableAiSearch = () => {
  const apiKey = prompt('Enter your Claude API key to enable AI enhancement for complex queries:\n\nNote: Most searches work great without AI! This is only for advanced query understanding.');
  if (apiKey && apiKey.trim()) {
    claudeApiKey.value = apiKey.trim();
    aiEnabled.value = true;
    localStorage.setItem('claude_api_key', apiKey.trim());
    alert('AI enhancement enabled! It will help with complex queries when pattern matching has low confidence. Most searches are already lightning-fast with smart pattern matching.');
  }
};

const disableAiSearch = () => {
  aiEnabled.value = false;
  claudeApiKey.value = '';
  localStorage.removeItem('claude_api_key');
  // Reset to basic parsing
  if (naturalLanguageQuery.value) {
    processNaturalLanguageQuery();
  }
};

// Activity Status Filtering
const applyActivityStatusFilter = async (activityStatus: string) => {
  try {
    isLoadingActivityFilter.value = true;
    console.log(`🔄 Starting activity status filtering for: ${activityStatus}`);
    
    // Use current projects as base
    const baseProjects = projects.value;
    
    // Filter projects by activity status
    const filtered = await filterProjectsByActivityStatus(baseProjects, activityStatus);
    
    // Update the activity filtered projects
    activityFilteredProjects.value = filtered;
    
    // Update the interpretation with results
    const resultMessage = `Found ${filtered.length} project(s) with activities having status "${activityStatus}".`;
    parsedQuery.value.interpretation = resultMessage;
    
    console.log(`✅ Activity filtering complete: ${filtered.length} projects found`);
    
  } catch (error) {
    console.error('Error applying activity status filter:', error);
    // On error, show all projects
    activityFilteredProjects.value = null;
    parsedQuery.value.interpretation = `Error filtering projects by activity status "${activityStatus}". Showing all projects.`;
  } finally {
    isLoadingActivityFilter.value = false;
  }
};

// Load saved API key on component mount
const loadAiConfiguration = () => {
  const savedKey = localStorage.getItem('claude_api_key');
  if (savedKey) {
    claudeApiKey.value = savedKey;
    aiEnabled.value = true;
  }
  console.log('AI configuration loaded - AI enabled:', aiEnabled.value);
};

// Natural Language Processing Functions
const processNaturalLanguageQuery = async () => {
  const query = naturalLanguageQuery.value.toLowerCase().trim();
  
  if (!query) {
    clearNaturalLanguageQuery();
    return;
  }

  // PRIORITY: Check if query is a potential project number first
  const isNumericQuery = /^\d+$/.test(query);
  if (isNumericQuery) {
    console.log('Detected numeric query for project search:', query);
    // For ProjectDashboard, directly filter projects by number
    parsedQuery.value = {
      isNaturalLanguage: true,
      isAiParsed: false,
      interpretation: `Showing projects with number "${query}"`,
      confidence: 0.95,
      filters: {
        projectNumber: query,
        contains: query
      },
      suggestions: [
        `Search for project code P${query}`,
        `Show all projects containing "${query}"`,
        'Clear search to see all projects'
      ],
      matchedProjects: []
    };
    return;
  }

  // Check for project-related queries like "project 3000"
  const projectNumberMatch = query.match(/(?:project|proj)\s+(\d+)|(\d+)\s+project/i);
  if (projectNumberMatch) {
    const projectNumber = projectNumberMatch[1] || projectNumberMatch[2];
    console.log('Detected project number in query:', projectNumber);
    parsedQuery.value = {
      isNaturalLanguage: true,
      isAiParsed: false,
      interpretation: `Showing projects with number "${projectNumber}"`,
      confidence: 0.9,
      filters: {
        projectNumber: projectNumber,
        contains: projectNumber
      },
      suggestions: [
        `Search for project code P${projectNumber}`,
        `Show all projects containing "${projectNumber}"`,
        'Clear search to see all projects'
      ],
      matchedProjects: []
    };
    return;
  }

  // Use fast pattern matching as primary method (60x faster than AI!)
  console.log('Processing project query with pattern matching:', query);
  parsedQuery.value = processBasicProjectQuery(query);
  
  // Optional: Try AI enhancement if enabled AND pattern matching has low confidence
  if (aiEnabled.value && claudeApiKey.value && parsedQuery.value.confidence < 0.8) {
    console.log('Pattern matching confidence low, trying AI enhancement...');
    try {
      isAiProcessing.value = true;
      const aiResult = await parseNaturalLanguageQuery(query, claudeApiKey.value, 'projects', projects.value);
      if (aiResult && aiResult.confidence > parsedQuery.value.confidence) {
        parsedQuery.value = aiResult;
        parsedQuery.value.isAiParsed = true;
        console.log('AI enhancement successful:', aiResult);
      }
    } catch (error) {
      // Quietly handle AI service issues - pattern matching will be used instead
      if (error.message.includes('AI service') || error.message.includes('temporarily unavailable')) {
        console.log('AI service unavailable, using pattern matching fallback');
      } else {
        console.error('AI enhancement failed:', error);
      }
      // Continue with pattern matching result
    } finally {
      isAiProcessing.value = false;
    }
  }
};

const processBasicProjectQuery = (query) => {
  const filters = {
    startsWith: '',
    contains: '',
    status: '',
    division: '',
    client: '',
    valueRange: null,
    completionRange: null,
    marginRange: null,
    projectName: null,
    projectCode: null,
    semantic: null,
    activityStatus: null
  };
  
  let interpretation = '';
  let isNaturalLanguage = false;
  let confidence = 0.5;

  // Activity status pattern matching - check for "projects with activities with status of X"
  const activityStatusMatch = query.match(/projects?\s+with\s+activities?\s+with\s+(?:a\s+)?status\s+(?:of\s+)?(\w+)/i);
  if (activityStatusMatch) {
    const activityStatus = activityStatusMatch[1].toLowerCase();
    
    // Map common status terms to actual ERPNext activity statuses
    const activityStatusMap = {
      'open': 'Open',
      'working': 'Working', 
      'estimate': 'Estimate',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'pending': 'Pending Review',
      'overdue': 'Overdue',
      'template': 'Template'
    };
    
    const mappedStatus = activityStatusMap[activityStatus] || activityStatus;
    filters.activityStatus = mappedStatus;
    interpretation = `Projects that have activities with status: ${mappedStatus}`;
    isNaturalLanguage = true;
    confidence = 0.95;
  } else {
    // Status pattern matching (for project status)
    const statusPatterns = {
      'active': /\b(active|running|ongoing|in progress)\b/i,
      'completed': /\b(completed|finished|done|complete)\b/i,
      'planning': /\b(planning|plan|preparation|prep)\b/i,
      'opportunity': /\b(opportunity|opps?|potential)\b/i,
      'estimate': /\b(estimate|quote|proposal)\b/i,
      'project': /\b(project|proj)\b/i,
      'archived': /\b(archived|archive|old|closed)\b/i,
      'on hold': /\b(on hold|hold|paused|suspended)\b/i
    };

    for (const [status, pattern] of Object.entries(statusPatterns)) {
      if (pattern.test(query)) {
        filters.status = status;
        interpretation = `Projects with status: ${status}`;
        isNaturalLanguage = true;
        confidence = 0.9;
        break;
      }
    }
  }

  // Division pattern matching
  const divisionPatterns = {
    'PRO': /\b(pro|process|production)\b/i,
    'ADM': /\b(adm|admin|administration)\b/i,
    'AUT': /\b(aut|automation|auto)\b/i,
    'ELC': /\b(elc|electric|electrical)\b/i,
    'TSD': /\b(tsd|technical|support)\b/i
  };

  for (const [division, pattern] of Object.entries(divisionPatterns)) {
    if (pattern.test(query)) {
      filters.division = division;
      interpretation = `${division} division projects`;
      isNaturalLanguage = true;
      confidence = 0.85;
      break;
    }
  }

  // Value range pattern matching
  const valueMatch = query.match(/(?:worth|value|cost|budget).*?(?:more|greater|above|over|>)\s*(?:than\s*)?[\$]?(\d+)k?/i) ||
                   query.match(/(?:worth|value|cost|budget).*?(?:less|under|below|<)\s*(?:than\s*)?[\$]?(\d+)k?/i) ||
                   query.match(/[\$]?(\d+)k?\s*(?:and|to|-)\s*[\$]?(\d+)k?/i);

  if (valueMatch) {
    const amount = parseInt(valueMatch[1]) * (query.includes('k') ? 1000 : 1);
    
    if (query.includes('more') || query.includes('greater') || query.includes('above') || query.includes('over') || query.includes('>')) {
      if (amount >= 500000) {
        filters.valueRange = '500000+';
      } else if (amount >= 100000) {
        filters.valueRange = '100000-500000';
      } else if (amount >= 50000) {
        filters.valueRange = '50000-100000';
      }
      interpretation = `Projects worth more than $${amount.toLocaleString()}`;
    } else if (query.includes('less') || query.includes('under') || query.includes('below') || query.includes('<')) {
      if (amount <= 50000) {
        filters.valueRange = '0-50000';
      } else if (amount <= 100000) {
        filters.valueRange = '50000-100000';
      } else if (amount <= 500000) {
        filters.valueRange = '100000-500000';
      }
      interpretation = `Projects worth less than $${amount.toLocaleString()}`;
    }
    
    if (filters.valueRange) {
      isNaturalLanguage = true;
      confidence = 0.9;
    }
  }

  // Margin pattern matching
  const marginMatch = query.match(/margin.*?(?:more|greater|above|over|>)\s*(?:than\s*)?(\d+)%?/i) ||
                     query.match(/margin.*?(?:less|under|below|<)\s*(?:than\s*)?(\d+)%?/i);

  if (marginMatch) {
    const margin = parseInt(marginMatch[1]);
    
    if (query.includes('more') || query.includes('greater') || query.includes('above') || query.includes('over') || query.includes('>')) {
      if (margin >= 20) {
        filters.marginRange = '20+';
      } else if (margin >= 10) {
        filters.marginRange = '10-20';
      } else if (margin >= 0) {
        filters.marginRange = '0-10';
      }
      interpretation = `Projects with margin greater than ${margin}%`;
    } else if (query.includes('less') || query.includes('under') || query.includes('below') || query.includes('<')) {
      if (margin <= 0) {
        filters.marginRange = 'negative';
      } else if (margin <= 10) {
        filters.marginRange = '0-10';
      } else if (margin <= 20) {
        filters.marginRange = '10-20';
      }
      interpretation = `Projects with margin less than ${margin}%`;
    }
    
    if (filters.marginRange) {
      isNaturalLanguage = true;
      confidence = 0.9;
    }
  }

  // Client name pattern matching
  const clientMatch = query.match(/(?:client|customer|organisation?)\s+(?:is|named?|called)?\s*([a-zA-Z0-9\s]+)/i);
  if (clientMatch) {
    filters.client = clientMatch[1].trim();
    interpretation = `Projects for client: ${filters.client}`;
    isNaturalLanguage = true;
    confidence = 0.8;
  }

  // Default text search fallback
  if (!isNaturalLanguage) {
    filters.contains = query;
    interpretation = `Text search: "${query}"`;
    confidence = 0.3;
  }

  return {
    isNaturalLanguage: isNaturalLanguage,
    isAiParsed: false,
    interpretation,
    confidence,
    filters,
    suggestions: isNaturalLanguage ? [] : ['Try: "completed projects"', 'Try: "PRO division"', 'Try: "worth more than 500k"'],
    matchedProjects: []
  };
};

const clearNaturalLanguageQuery = () => {
  naturalLanguageQuery.value = '';
  activityFilteredProjects.value = null; // Reset activity filtering
  parsedQuery.value = {
    isNaturalLanguage: false,
    isAiParsed: false,
    interpretation: '',
    confidence: 0,
    filters: {
      startsWith: '',
      contains: '',
      status: '',
      division: '',
      client: '',
      valueRange: null,
      completionRange: null,
      marginRange: null,
      projectName: null,
      projectCode: null,
      semantic: null,
      activityStatus: null
    },
    suggestions: [],
    matchedProjects: []
  };
};

const applySuggestion = (suggestion) => {
  naturalLanguageQuery.value = suggestion;
  processNaturalLanguageQuery();
};

const getConfidenceClass = (confidence) => {
  if (confidence >= 0.8) return 'confidence-high';
  if (confidence >= 0.6) return 'confidence-medium';
  return 'confidence-low';
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
  loadAiConfiguration();
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

/* AI Search Styles */
.natural-language-input {
  padding-right: 120px;
}

.natural-language-input.ai-enabled {
  border-color: rgba(138, 43, 226, 0.3);
  box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.1);
}

.natural-language-input.ai-processing {
  border-color: rgba(255, 193, 7, 0.5);
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.2);
}

.search-controls {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 28px;
  height: 28px;
}

.search-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-search-btn {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: none;
  border-radius: 4px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 28px;
  height: 28px;
}

.clear-search-btn:hover {
  background: rgba(108, 117, 125, 0.2);
  transform: translateY(-1px);
}

.ai-enable-btn {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  border: none;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 2px;
}

.ai-enable-btn:hover {
  background: rgba(255, 193, 7, 0.25);
  transform: translateY(-1px);
}

.ai-indicator-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(186, 85, 211, 0.1);
  color: rgba(186, 85, 211, 0.7);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-indicator-btn:hover {
  background: rgba(186, 85, 211, 0.15);
  transform: translateY(-1px);
}

.ai-indicator-btn.active {
  background: rgba(138, 43, 226, 0.9);
  color: white;
}

.ai-indicator-btn.active:hover {
  background: rgba(138, 43, 226, 1);
}

.ai-processing {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 4px;
  font-size: 11px;
  color: #856404;
}

.ai-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-top: 2px solid #ffc107;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.query-interpretation {
  background: rgba(138, 43, 226, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.15);
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
  position: relative;
}

.interpretation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.interpretation-label {
  font-weight: 600;
  font-size: 13px;
  color: #6a1b9a;
}

.confidence-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-score {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
}

.confidence-high {
  background: rgba(40, 167, 69, 0.15);
  color: #28a745;
}

.confidence-medium {
  background: rgba(255, 193, 7, 0.15);
  color: #856404;
}

.confidence-low {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

.interpretation-text {
  font-size: 14px;
  color: #495057;
  margin-bottom: 8px;
  display: block;
}

.ai-suggestions {
  margin-top: 8px;
}

.suggestions-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 4px;
  display: block;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-chip {
  background: rgba(138, 43, 226, 0.1);
  color: #6a1b9a;
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  background: rgba(138, 43, 226, 0.15);
  transform: translateY(-1px);
}

.clear-query-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-query-btn:hover {
  background: rgba(108, 117, 125, 0.2);
}

.clear-all-filters-btn {
  background: #6c757d !important;
  color: white !important;
  border: 1px solid #6c757d !important;
}

.clear-all-filters-btn:hover {
  background: #5a6268 !important;
  border-color: #545b62 !important;
}

.clear-filters-btn {
  background: #6c757d !important;
  color: white !important;
  border: 1px solid #6c757d !important;
  padding: 8px 16px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 14px !important;
  transition: all 0.2s ease !important;
}

.clear-filters-btn:hover {
  background: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-1px) !important;
}
</style>