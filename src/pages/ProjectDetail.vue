<template>
  <div class="container">
    <!-- Header -->
    <div class="project-header">
      <div class="breadcrumb">
        <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
        <span class="breadcrumb-separator">›</span>
        <span>{{ project.project_name }}</span>
      </div>
      
      <div class="project-title-section">
        <div>
          <h1 class="project-title">{{ project.project_name }}</h1>
          <p class="project-number">Project #{{ project.project_code }}</p>
        </div>
        <select 
          v-if="isEditing"
          v-model="project.status" 
          class="status-select"
          data-fieldtype="Select" 
          data-fieldname="status" 
          data-doctype="Project"
        >
          <option value="Opportunity">Opportunity</option>
          <option value="Estimate">Estimate</option>
          <option value="Project">Project</option>
          <option value="Archived">Archived</option>
        </select>
        <span v-else :class="['status-badge', getStatusClass(project.status)]">{{ project.status }}</span>
      </div>
    </div>

    <!-- Project Overview -->
    <div class="project-overview">
      <div class="project-info">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Client</div>
            <div class="info-value large">{{ project.organisation }}</div>
          </div>
        </div>

        <div class="info-item scope-of-work">
          <div class="info-label">Scope of Work</div>
          <div class="info-value">
            <textarea 
              v-if="isEditing"
              v-model="project.custom_scope_of_work" 
              class="form-control scope-textarea"
              data-fieldtype="Text" 
              data-fieldname="custom_scope_of_work" 
              data-doctype="Project"
              placeholder="Enter scope of work details..."
              spellcheck="false"
              aria-label="Scope of Work"
            ></textarea>
            <div v-else class="scope-display">
              {{ project.custom_scope_of_work || 'No scope of work defined.' }}
            </div>
          </div>
        </div>

        <div class="progress-section">
          <div class="info-label">Project Progress</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: getCompletionPercentage() + '%' }"></div>
          </div>
          <div class="progress-text">{{ getCompletionPercentage() }}% Complete</div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Start Date</div>
            <div class="info-value">{{ formatDate(project.project_start_date) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">End Date</div>
            <div class="info-value">{{ formatDate(project.project_end_date) }}</div>
          </div>
        </div>
      </div>

      <div class="project-stats">
        <div class="stat-card">
          <div class="stat-value">{{ formatCurrency(project.estimated_revenue) }}</div>
          <div class="stat-label">Estimated Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-value spent">{{ formatCurrency(project.estimated_labour_cost) }}</div>
          <div class="stat-label">Estimated Labour Cost</div>
        </div>
        <div class="stat-card">
          <div class="stat-value time">{{ project.estimated_hours }}h</div>
          <div class="stat-label">Estimated Hours</div>
        </div>
        <div class="stat-card">
          <div class="stat-value time">{{ project.labour_hours }}h</div>
          <div class="stat-label">Actual Hours</div>
        </div>
      </div>
    </div>

    <!-- Widgets Section -->
    <div class="widgets-section">
      <div class="widgets-grid">
        <div class="widget-column">
          <h4 class="widget-column-title">Sales</h4>
          <div class="widget-item">
            <span class="widget-label">Sales Order</span>
            <div class="widget-stats">
              <span class="widget-count">{{ project.sales_order_count || 0 }}</span>
              <span class="widget-value">{{ formatCurrency(project.sales_order_value || 0) }}</span>
            </div>
            <button class="widget-add-btn" @click="addWidget('sales-order')">+</button>
          </div>
          <div class="widget-item">
            <span class="widget-label">Sales Invoice</span>
            <div class="widget-stats">
              <span class="widget-count">{{ project.sales_invoice_count || 0 }}</span>
              <span class="widget-value">{{ formatCurrency(project.sales_invoice_value || 0) }}</span>
            </div>
            <button class="widget-add-btn" @click="addWidget('sales-invoice')">+</button>
          </div>
        </div>
        
        <div class="widget-column">
          <h4 class="widget-column-title">Purchases</h4>
          <div class="widget-item">
            <span class="widget-label">Purchase Order</span>
            <div class="widget-stats">
              <span class="widget-count">{{ project.purchase_order_count || 0 }}</span>
              <span class="widget-value">{{ formatCurrency(project.purchase_order_value || 0) }}</span>
            </div>
            <button class="widget-add-btn" @click="addWidget('purchase-order')">+</button>
          </div>
          <div class="widget-item">
            <span class="widget-label">Purchase Invoice</span>
            <div class="widget-stats">
              <span class="widget-count">{{ project.purchase_invoice_count || 0 }}</span>
              <span class="widget-value">{{ formatCurrency(project.purchase_invoice_value || 0) }}</span>
            </div>
            <button class="widget-add-btn" @click="addWidget('purchase-invoice')">+</button>
          </div>
        </div>
        
        <div class="widget-column">
          <h4 class="widget-column-title">Project</h4>
          <div class="widget-item">
            <span class="widget-label">Activity</span>
            <div class="widget-stats">
              <span class="widget-count">{{ activities.length }}</span>
            </div>
            <button class="widget-add-btn" @click="addWidget('activity')">+</button>
          </div>
          <div class="widget-item">
            <span class="widget-label">Timesheet</span>
            <div class="widget-stats">
              <span class="widget-count">{{ project.timesheet_count || 9 }}</span>
              <span class="widget-value">{{ project.labour_hours }}h</span>
            </div>
            <button class="widget-add-btn" @click="addWidget('timesheet')">+</button>
          </div>
          <div class="widget-item">
            <span class="widget-label">Staffing Plan</span>
            <div class="widget-stats">
              <span class="widget-count">{{ project.staffing_plan_count || 1 }}</span>
            </div>
            <button class="widget-add-btn" @click="addWidget('staffing-plan')">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'project-details' }"
        @click="activeTab = 'project-details'"
      >
        Project Details
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'activities' }"
        @click="activeTab = 'activities'"
      >
        Activities
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'activity' }"
        @click="activeTab = 'activity'"
      >
        Activity
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Project Details Tab (Active by default) -->
      <div v-show="activeTab === 'project-details'" class="tab-pane">
        <!-- Project Detail Overview -->
        <div class="project-detail-overview">
          <div class="project-detail-info">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Client</div>
                <div class="info-value large">{{ project.organisation }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Priority</div>
                <div class="info-value large">{{ project.priority || 'Medium' }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">Work Type</div>
              <div class="info-value">{{ project.work_type }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Description</div>
              <div class="info-value">{{ project.description || 'No description available.' }}</div>
            </div>

            <div class="progress-section">
              <div class="info-label">Project Progress</div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getCompletionPercentage() + '%' }"></div>
              </div>
              <div class="progress-text">{{ getCompletionPercentage() }}% Complete</div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Start Date</div>
                <div class="info-value">{{ formatDate(project.project_start_date) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">End Date</div>
                <div class="info-value">{{ formatDate(project.project_end_date) }}</div>
              </div>
            </div>
          </div>

          <div class="project-detail-stats">
            <div class="stat-card">
              <div class="stat-value">{{ formatCurrency(project.estimated_revenue) }}</div>
              <div class="stat-label">Estimated Revenue</div>
            </div>
            <div class="stat-card">
              <div class="stat-value spent">{{ formatCurrency(project.estimated_labour_cost) }}</div>
              <div class="stat-label">Estimated Labour Cost</div>
            </div>
            <div class="stat-card">
              <div class="stat-value time">{{ project.estimated_hours }}h</div>
              <div class="stat-label">Estimated Hours</div>
            </div>
            <div class="stat-card">
              <div class="stat-value time">{{ project.labour_hours }}h</div>
              <div class="stat-label">Actual Hours</div>
            </div>
          </div>
        </div>

        <!-- Project Details Form -->
        <div class="project-details-section">
          <div class="section-header">
            <h3 class="section-title">Project Details</h3>
            <div class="edit-controls" v-if="permissions.write">
              <button 
                v-if="!isEditing" 
                @click="startEditing"
                class="edit-btn"
              >
                Edit
              </button>
              <div v-if="isEditing" class="edit-actions">
                <button 
                  @click="saveProject"
                  :disabled="isSaving"
                  class="save-btn"
                >
                  {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
                <button 
                  @click="cancelEditing"
                  :disabled="isSaving"
                  class="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Project Name <span class="required">*</span></label>
              <input 
                v-if="isEditing" 
                v-model="project.project_name" 
                type="text" 
                class="form-input"
              >
              <input 
                v-else 
                type="text" 
                class="form-input" 
                :value="project.project_name" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Project Code</label>
              <input type="text" class="form-input" :value="project.project_code" readonly>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Site</label>
              <input 
                v-if="isEditing" 
                v-model="project.site" 
                type="text" 
                class="form-input"
              >
              <input 
                v-else 
                type="text" 
                class="form-input" 
                :value="project.site" 
                readonly
              >
            </div>
          </div>

          <h4 class="subsection-title">Project Classification</h4>
          <div class="form-grid four-col">
            <div class="form-field">
              <label class="form-label">Division</label>
              <select 
                v-if="isEditing" 
                v-model="project.division_id" 
                class="form-input"
              >
                <option value="">Select Division</option>
                <option 
                  v-for="option in divisionOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input 
                v-else 
                type="text" 
                class="form-input" 
                :value="project.division" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Project Type</label>
              <select 
                v-if="isEditing" 
                v-model="project.project_type_id" 
                class="form-input"
              >
                <option value="">Select Project Type</option>
                <option 
                  v-for="option in projectTypeOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input 
                v-else 
                type="text" 
                class="form-input" 
                :value="project.project_type" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Work Type</label>
              <select 
                v-if="isEditing" 
                v-model="project.work_type_id" 
                class="form-input"
              >
                <option value="">Select Work Type</option>
                <option 
                  v-for="option in workTypeOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input 
                v-else 
                type="text" 
                class="form-input" 
                :value="project.work_type" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Industry Sector</label>
              <select 
                v-if="isEditing" 
                v-model="project.industry_sector_id" 
                class="form-input"
              >
                <option value="">Select Industry Sector</option>
                <option 
                  v-for="option in industrySectorOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input 
                v-else 
                type="text" 
                class="form-input" 
                :value="project.industry_sector" 
                readonly
              >
            </div>
          </div>

          <h4 class="subsection-title">Project Timeline</h4>
          <div class="form-grid three-col">
            <div class="form-field">
              <label class="form-label">Project Award Date</label>
              <input 
                v-if="isEditing" 
                v-model="project.project_award_date" 
                type="date" 
                class="form-input"
              >
              <input 
                v-else 
                type="date" 
                class="form-input" 
                :value="formatDateForInput(project.project_award_date)" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Project Start Date</label>
              <input 
                v-if="isEditing" 
                v-model="project.project_start_date" 
                type="date" 
                class="form-input"
              >
              <input 
                v-else 
                type="date" 
                class="form-input" 
                :value="formatDateForInput(project.project_start_date)" 
                readonly
              >
            </div>
            <div class="form-field">
              <label class="form-label">Project End Date</label>
              <input 
                v-if="isEditing" 
                v-model="project.project_end_date" 
                type="date" 
                class="form-input"
              >
              <input 
                v-else 
                type="date" 
                class="form-input" 
                :value="formatDateForInput(project.project_end_date)" 
                readonly
              >
            </div>
          </div>

          <h4 class="subsection-title">Financial Overview</h4>
          <div class="form-grid four-col">
            <div class="form-field">
              <label class="form-label">Estimated Revenue</label>
              <input type="text" class="form-input" :value="formatCurrency(project.estimated_revenue)" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">Estimated Labour Cost</label>
              <input type="text" class="form-input" :value="formatCurrency(project.estimated_labour_cost)" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">Estimated Margin</label>
              <input type="text" class="form-input" :value="formatCurrency(project.estimated_margin)" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">Margin Percentage</label>
              <input type="text" class="form-input" :value="project.estimated_margin_percent + '%'" readonly>
            </div>
          </div>
        </div>
      </div>

      <!-- Activities Tab -->
      <div v-show="activeTab === 'activities'" class="tab-pane">
        <div class="activities-section">
          <h3 class="section-title">Project Activities</h3>
          <div class="activity-list">
            <div 
              v-for="activity in activities" 
              :key="activity.id" 
              class="activity-item"
              @click="selectActivity(activity)"
            >
              <div class="activity-info">
                <div class="activity-name">{{ activity.name }}</div>
                <div class="activity-id">{{ activity.id }}</div>
              </div>
              <div class="activity-status">{{ activity.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-show="activeTab === 'activity'" class="tab-pane">
        <div class="activity-section">
          <TimelineView 
            :doctype="'Project'" 
            :docname="project.name"
            v-if="project.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProject, updateProject, getDropdownOptions, getProjectPermissions } from '../services/projects';
import { 
  createSalesOrder, 
  createSalesInvoice, 
  createPurchaseOrder, 
  createPurchaseInvoice, 
  createActivity, 
  createTimesheet, 
  createStaffingPlan
} from '../services/documents';
import TimelineView from '../components/TimelineView.vue';

// Types
interface Activity {
  id: string;
  name: string;
  status: string;
  start_date?: string;
  end_date?: string;
  completion?: number;
  estimated_hours?: number;
  actual_hours?: number;
}

// Route and router
const route = useRoute();
const router = useRouter();

// Reactive data
const project = ref<any>({});
const originalProject = ref<any>({});
const activeTab = ref('project-details');
const loading = ref(false);
const error = ref<string | null>(null);
const isEditing = ref(false);
const isSaving = ref(false);
const permissions = ref<any>({});

// Dropdown options for linked fields
const organisationOptions = ref<any[]>([]);
const divisionOptions = ref<any[]>([]);
const projectTypeOptions = ref<any[]>([]);
const workTypeOptions = ref<any[]>([]);
const industrySectorOptions = ref<any[]>([]);

// Sample activities data
const activities = ref<Activity[]>([
  { id: '2324-T-ACT-398328', name: 'Travel', status: 'Completed' },
  { id: '2324-T-ACT-398329', name: 'Perth Work Day Shift', status: 'Completed' },
  { id: '2324-T-ACT-398330', name: 'Perth Work Night Shift', status: 'Completed' },
  { id: '2324-T-ACT-398331', name: 'Site Work Day Shift', status: 'Completed' },
  { id: '2324-T-ACT-398332', name: 'Site Work Night Shift', status: 'Completed' },
  { id: '2324-T-ACT-398333', name: 'Inductions', status: 'Completed' },
  { id: '2324-T-ACT-398334', name: 'Mobilisations', status: 'Completed' },
  { id: '2324-T-ACT-398335', name: 'Project Management', status: 'Completed' },
  { id: '2324-T-ACT-398336', name: 'Recruitment', status: 'Completed' }
]);

// Methods
const loadProject = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const projectId = route.params.id as string;
    
    // Load project data and permissions in parallel
    const [projectData, projectPermissions] = await Promise.all([
      getProject(projectId),
      getProjectPermissions(projectId)
    ]);
    
    project.value = projectData || {};
    // Ensure custom_scope_of_work field exists
    if (!project.value.custom_scope_of_work) {
      project.value.custom_scope_of_work = '';
    }
    originalProject.value = { ...project.value };
    permissions.value = projectPermissions;
    
    // Load dropdown options if user has write permission
    if (projectPermissions.write) {
      loadDropdownOptions();
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load project';
    console.error('Error loading project:', err);
  } finally {
    loading.value = false;
  }
};

const loadDropdownOptions = async () => {
  try {
    const [organisations, divisions, projectTypes, workTypes, industrySectors] = await Promise.all([
      getDropdownOptions('Organisation'),
      getDropdownOptions('Division'),
      getDropdownOptions('Project Type'),
      getDropdownOptions('Work Type'),
      getDropdownOptions('Industry Sector')
    ]);
    
    organisationOptions.value = organisations;
    divisionOptions.value = divisions;
    projectTypeOptions.value = projectTypes;
    workTypeOptions.value = workTypes;
    industrySectorOptions.value = industrySectors;
  } catch (err: any) {
    console.error('Error loading dropdown options:', err);
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const formatDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatDateForInput = (date: string): string => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const getCompletionPercentage = (): number => {
  if (project.value.status === 'Completed') return 100;
  if (project.value.status === 'Active') return 75;
  if (project.value.status === 'Planning') return 25;
  return 0;
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Opportunity':
      return 'status-opportunity';
    case 'Estimate':
      return 'status-estimate';
    case 'Project':
      return 'status-project';
    case 'Archived':
      return 'status-archived';
    default:
      return 'status-default';
  }
};

const addWidget = async (widgetType: string) => {
  console.log('Add widget:', widgetType);
  
  if (!project.value?.project_code) {
    alert('Project data not loaded. Please refresh the page.');
    return;
  }

  try {
    loading.value = true;
    let result;

    switch (widgetType) {
      case 'sales-order':
        result = await createSalesOrder(project.value);
        alert(`Sales Order created successfully: ${result.name}`);
        break;
        
      case 'sales-invoice':
        result = await createSalesInvoice(project.value);
        alert(`Sales Invoice created successfully: ${result.name}`);
        break;
        
      case 'purchase-order':
        result = await createPurchaseOrder(project.value);
        alert(`Purchase Order created successfully: ${result.name}`);
        break;
        
      case 'purchase-invoice':
        result = await createPurchaseInvoice(project.value);
        alert(`Purchase Invoice created successfully: ${result.name}`);
        break;
        
      case 'activity':
        result = await createActivity(project.value, 'New Project Activity');
        alert(`Activity created successfully: ${result.name}`);
        break;
        
      case 'timesheet':
        result = await createTimesheet(project.value, 'Default Employee');
        alert(`Timesheet created successfully: ${result.name}`);
        break;
        
      case 'staffing-plan':
        result = await createStaffingPlan(project.value);
        alert(`Staffing Plan created successfully: ${result.name}`);
        break;
        
      default:
        console.log('Unknown widget type:', widgetType);
        alert('Unknown document type');
    }

    // Optionally refresh project data to update counts
    await loadProject();
    
  } catch (error) {
    console.error('Error creating document:', error);
    alert(`Error creating document: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const selectActivity = (activity: any) => {
  console.log('Selected activity:', activity);
  // Implement activity selection logic
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  project.value = { ...originalProject.value };
};

const saveProject = async () => {
  if (!permissions.value.write) {
    alert('You do not have permission to edit this project');
    return;
  }

  try {
    isSaving.value = true;
    
    // Prepare the data for saving - use the ID fields for linked documents
    const updateData = {
      project_name: project.value.project_name,
      site: project.value.site,
      status: project.value.status,
      organisation: project.value.organisation_id,
      division: project.value.division_id,
      project_type: project.value.project_type_id,
      work_type: project.value.work_type_id,
      industry_sector: project.value.industry_sector_id,
      description: project.value.description,
      estimate_opening_date: project.value.estimate_opening_date,
      estimate_closing_date: project.value.estimate_closing_date,
      project_award_date: project.value.project_award_date,
      project_start_date: project.value.project_start_date,
      project_end_date: project.value.project_end_date,
      reputation: project.value.reputation,
      relationship: project.value.relationship,
      client_positioning: project.value.client_positioning,
      estimate_type: project.value.estimate_type,
      project_value: project.value.project_value,
      probability: project.value.probability,
      tender_documentation: project.value.tender_documentation,
      tender_timeframe: project.value.tender_timeframe,
      project_timeframe: project.value.project_timeframe,
      estimated_hours: project.value.estimated_hours
    };

    console.log('Saving project data:', updateData);
    await updateProject(project.value.id, updateData);
    
    // Reload the project to get updated data with resolved names
    await loadProject();
    
    isEditing.value = false;
    alert('Project updated successfully!');
    
  } catch (error: any) {
    console.error('Error saving project:', error);
    alert(`Error saving project: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};

// Helper function to find the UUID value for a given display name
const findOptionValue = (options: any[], currentValue: string) => {
  if (!options || !currentValue) return currentValue;
  
  // If currentValue is already a UUID (option value), return it
  const optionByValue = options.find(opt => opt.value === currentValue);
  if (optionByValue) return currentValue;
  
  // If currentValue is a display name (option label), find the corresponding UUID
  const optionByLabel = options.find(opt => opt.label === currentValue);
  return optionByLabel ? optionByLabel.value : currentValue;
};

// Lifecycle
onMounted(() => {
  loadProject();
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
.project-header {
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

.project-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.project-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.project-number {
  font-size: 16px;
  color: var(--monday-medium);
  margin: var(--spacing-xs) 0 0 0;
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

.status-badge.status-opportunity {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.status-estimate {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.status-project {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.status-archived {
  background: #f5f5f5;
  color: #757575;
}

.status-badge.status-default {
  background: var(--accent-green-light);
  color: var(--accent-green);
}

.status-select {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-xl);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border: 2px solid var(--monday-light);
  background: white;
  color: var(--monday-dark);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.status-select:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(63, 217, 33, 0.1);
}

/* Project Overview */
.project-overview {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.project-info {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.info-item {
  margin-bottom: var(--spacing-lg);
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

.info-value {
  font-size: 14px;
  color: var(--monday-dark);
  font-weight: 500;
}

.info-value.large {
  font-size: 16px;
  font-weight: 600;
}

.progress-section {
  margin: var(--spacing-xl) 0;
}

.progress-bar {
  background: var(--monday-very-light);
  height: 8px;
  border-radius: var(--border-radius-small);
  overflow: hidden;
  margin: var(--spacing-sm) 0;
}

.progress-fill {
  background: var(--primary-green);
  height: 100%;
  border-radius: var(--border-radius-small);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--monday-medium);
}

.project-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--monday-white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-medium);
  text-align: center;
  box-shadow: var(--shadow-small);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--primary-green);
}

.stat-value.spent {
  color: var(--monday-orange);
}

.stat-value.time {
  color: var(--primary-green);
}

.stat-label {
  font-size: 11px;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Widgets Section */
.widgets-section {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.widget-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.widget-column-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: var(--spacing-md);
}

.widget-item {
  background: var(--monday-background);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.widget-label {
  font-size: 14px;
  color: var(--monday-dark);
  font-weight: 500;
}

.widget-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.widget-count {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-green);
}

.widget-value {
  font-size: 12px;
  color: var(--monday-medium);
}

.widget-add-btn {
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  margin-left: var(--spacing-md);
}

.widget-add-btn:hover {
  background: var(--primary-green-hover);
  transform: scale(1.1);
}

/* Tabs */
.tab-navigation {
  display: flex;
  border-bottom: 1px solid var(--monday-light);
  margin-bottom: var(--spacing-xl);
  background: var(--monday-white);
  border-radius: var(--border-radius-large) var(--border-radius-large) 0 0;
}

.tab {
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--monday-medium-dark);
}

.tab.active {
  border-bottom-color: var(--primary-green);
  color: var(--primary-green);
}

.tab:hover {
  color: var(--primary-green);
}

/* Tab Content */
.tab-content {
  margin-top: 0;
}

.tab-pane {
  display: block;
}

/* Project Detail Overview within tab */
.project-detail-overview {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.project-detail-info {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
}

.project-detail-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

/* Activities Section */
.activities-section {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
}

/* Activity Section */
.activity-section {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: var(--spacing-lg);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.activity-item {
  background: var(--monday-background);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  cursor: pointer;
}

.activity-item:hover {
  box-shadow: var(--shadow-small);
  transform: translateX(2px);
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.activity-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--monday-dark);
}

.activity-id {
  font-size: 12px;
  color: var(--monday-medium);
}

.activity-status {
  background: var(--accent-green-light);
  color: var(--accent-green);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-xl);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Project Details Form */
.project-details-section {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.edit-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.edit-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.edit-btn, .save-btn, .cancel-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.edit-btn {
  background: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

.edit-btn:hover {
  background: var(--primary-green-hover);
  border-color: var(--primary-green-hover);
}

.save-btn {
  background: var(--accent-green);
  color: white;
  border-color: var(--accent-green);
}

.save-btn:hover:not(:disabled) {
  background: var(--primary-green);
  border-color: var(--primary-green);
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

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: var(--spacing-xl) 0 var(--spacing-lg) 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-grid.four-col {
  grid-template-columns: repeat(4, 1fr);
}

.form-grid.three-col {
  grid-template-columns: repeat(3, 1fr);
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

.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  color: var(--monday-dark);
  background: var(--monday-background);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px var(--primary-green-light);
}

.required {
  color: var(--monday-red);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }

  .project-overview {
    grid-template-columns: 1fr;
  }

  .project-detail-overview {
    grid-template-columns: 1fr;
  }

  .project-detail-stats {
    grid-template-columns: 1fr 1fr;
  }

  .widgets-grid {
    grid-template-columns: 1fr;
  }

  .form-grid.four-col,
  .form-grid.three-col {
    grid-template-columns: 1fr;
  }

  .project-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}

@media (max-width: 1024px) {
  .form-grid.four-col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .project-detail-stats {
    grid-template-columns: 1fr;
  }
}

/* Scope of Work Styles */
.scope-of-work {
  width: 100%;
}

.scope-of-work .info-value {
  width: 100%;
}

.scope-textarea {
  width: 100%;
  min-height: 300px;
  padding: var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  font-family: inherit;
  font-size: var(--text-base);
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.scope-textarea:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(63, 217, 33, 0.1);
}

.scope-display {
  padding: var(--spacing-md);
  background: var(--monday-background);
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  min-height: 150px;
  white-space: pre-wrap;
  line-height: 1.5;
  color: var(--monday-medium-dark);
}
</style>