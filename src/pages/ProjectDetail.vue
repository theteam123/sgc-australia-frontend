<template>
  <div class="container">
    <!-- Header -->
    <div class="project-header">
      <div class="header-content">
        <div class="header-left">
          <div class="breadcrumb">
            <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
            <span class="breadcrumb-separator">›</span>
            <span>#{{ project.project_code }} {{ project.project_name }}</span>
          </div>
          
          <div class="project-title-section">
            <div class="status-progress-section">
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
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getCompletionPercentage() + '%' }"></div>
                </div>
                <div class="progress-text">{{ getCompletionPercentage() }}% Complete</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="header-right">
          <div class="financial-stats">
            <div class="stat-item">
              <span class="stat-label">REVENUE</span>
              <span class="stat-value">{{ formatCurrency(project.estimated_revenue) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">COST</span>
              <span class="stat-value">{{ formatCurrency(project.estimated_labour_cost) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">MARGIN $</span>
              <span class="stat-value">{{ formatCurrency(project.estimated_margin) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">MARGIN %</span>
              <span class="stat-value" :class="getMarginColorClass(project.estimated_margin_percent)">{{ project.estimated_margin_percent }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Overview -->
    <div class="project-overview">
      <div class="project-widgets">
        <div class="widget-column">
          <div class="widget-row">
            <div class="widget-item clickable-widget" @click="navigateToDocuments('sales-orders')">
              <span class="widget-label">Sales Order</span>
              <div class="widget-stats">
                <span class="widget-count">{{ project.sales_order_count || 0 }}</span>
                <span class="widget-value">{{ formatCurrency(project.sales_order_value || 0) }}</span>
              </div>
              <button class="widget-add-btn" @click.stop="addWidget('sales-order')">+</button>
            </div>
            <div class="widget-item clickable-widget" @click="navigateToDocuments('sales-invoices')">
              <span class="widget-label">Sales Invoice</span>
              <div class="widget-stats">
                <span class="widget-count">{{ project.sales_invoice_count || 0 }}</span>
                <span class="widget-value">{{ formatCurrency(project.sales_invoice_value || 0) }}</span>
              </div>
              <button class="widget-add-btn" @click.stop="addWidget('sales-invoice')">+</button>
            </div>
          </div>
        </div>
        
        <div class="widget-column">
          <div class="widget-row">
            <div class="widget-item clickable-widget" @click="navigateToDocuments('purchase-orders')">
              <span class="widget-label">Purchase Order</span>
              <div class="widget-stats">
                <span class="widget-count">{{ project.purchase_order_count || 0 }}</span>
                <span class="widget-value">{{ formatCurrency(project.purchase_order_value || 0) }}</span>
              </div>
              <button class="widget-add-btn" @click.stop="addWidget('purchase-order')">+</button>
            </div>
            <div class="widget-item clickable-widget" @click="navigateToDocuments('purchase-invoices')">
              <span class="widget-label">Purchase Invoice</span>
              <div class="widget-stats">
                <span class="widget-count">{{ project.purchase_invoice_count || 0 }}</span>
                <span class="widget-value">{{ formatCurrency(project.purchase_invoice_value || 0) }}</span>
              </div>
              <button class="widget-add-btn" @click.stop="addWidget('purchase-invoice')">+</button>
            </div>
          </div>
        </div>
        
        <div class="widget-column">
          <div class="widget-row">
            <div class="widget-item clickable-widget" @click="navigateToDocuments('timesheets')">
              <span class="widget-label">Timesheet</span>
              <div class="widget-stats">
                <span class="widget-count">{{ project.timesheet_count || 0 }}</span>
                <span class="widget-value">{{ project.labour_hours || 0 }}h</span>
              </div>
              <button class="widget-add-btn" @click.stop="addWidget('timesheet')">+</button>
            </div>
            <div class="widget-item clickable-widget" @click="navigateToDocuments('staffing-plans')">
              <span class="widget-label">Staffing Plan</span>
              <div class="widget-stats">
                <span class="widget-count">{{ project.staffing_plan_count || 0 }}</span>
              </div>
              <button class="widget-add-btn" @click.stop="addWidget('staffing-plan')">+</button>
            </div>
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
        Timeline
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'files' }"
        @click="activeTab = 'files'"
      >
        Files
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'people' }"
        @click="activeTab = 'people'"
      >
        People
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'reports' }"
        @click="activeTab = 'reports'"
      >
        Reports
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'forms' }"
        @click="activeTab = 'forms'"
      >
        Forms
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'tasks' }"
        @click="activeTab = 'tasks'"
      >
        Tasks
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Project Details Tab (Active by default) -->
      <div v-show="activeTab === 'project-details'" class="tab-pane">
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
              <div v-if="isEditing" class="control-input">
                <input 
                  v-model="project.project_name" 
                  type="text" 
                  class="input-with-feedback form-control"
                  autocomplete="off"
                  data-fieldtype="Data"
                  data-fieldname="project_name"
                  data-doctype="Project"
                >
              </div>
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
              <label class="form-label">Client</label>
              <div v-if="isEditing" class="control-input">
                <select 
                  v-model="project.organisation_id" 
                  class="form-control"
                  data-fieldtype="Link"
                  data-fieldname="organisation"
                  data-doctype="Project"
                >
                  <option value="">Select Client</option>
                  <option 
                    v-for="option in organisationOptions" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div 
                v-else 
                class="form-input clickable-field" 
                @click="navigateToOrganisation"
                :title="'Click to view ' + (project.organisation || 'organisation')"
              >
                {{ project.organisation || '' }}
              </div>
            </div>
            <div class="form-field">
              <label class="form-label">Site</label>
              <div v-if="isEditing" class="control-input">
                <input 
                  v-model="project.site" 
                  type="text" 
                  autocomplete="off" 
                  class="input-with-feedback form-control" 
                  maxlength="140" 
                  data-fieldtype="Data" 
                  data-fieldname="site" 
                  placeholder="" 
                  data-doctype="Project"
                >
              </div>
              <input 
                v-else 
                type="text" 
                class="form-input" 
                :value="project.site || ''" 
                readonly
              >
            </div>
          </div>

          <div class="form-grid single-col">
            <div class="form-field">
              <label class="form-label">Scope of Works</label>
              <div v-if="isEditing" class="control-input">
                <textarea 
                  v-model="project.custom_scope_of_work" 
                  class="form-control scope-textarea"
                  data-fieldtype="Text" 
                  data-fieldname="custom_scope_of_work" 
                  data-doctype="Project"
                  placeholder="Enter scope of work details..."
                  spellcheck="false"
                  aria-label="Scope of Works"
                ></textarea>
              </div>
              <div v-else class="form-input scope-display">
                {{ project.custom_scope_of_work || 'No scope of work defined.' }}
              </div>
            </div>
          </div>

          <h4 class="subsection-title">Project Classification</h4>
          <div class="form-grid four-col">
            <div class="form-field">
              <label class="form-label">Division</label>
              <div v-if="isEditing" class="control-input">
                <select 
                  v-model="project.division_id" 
                  class="form-control"
                  data-fieldtype="Link"
                  data-fieldname="division"
                  data-doctype="Project"
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
              </div>
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
              <div v-if="isEditing" class="control-input">
                <select 
                  v-model="project.project_type_id" 
                  class="form-control"
                  data-fieldtype="Link"
                  data-fieldname="project_type"
                  data-doctype="Project"
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
              </div>
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
              <div v-if="isEditing" class="control-input">
                <select 
                  v-model="project.work_type_id" 
                  class="form-control"
                  data-fieldtype="Link"
                  data-fieldname="work_type"
                  data-doctype="Project"
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
              </div>
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
              <div v-if="isEditing" class="control-input">
                <select 
                  v-model="project.industry_sector_id" 
                  class="form-control"
                  data-fieldtype="Link"
                  data-fieldname="industry_sector"
                  data-doctype="Project"
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
              </div>
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
              <div v-if="isEditing" class="control-input">
                <input 
                  v-model="project.project_award_date" 
                  type="date" 
                  class="form-control"
                  data-fieldtype="Date"
                  data-fieldname="project_award_date"
                  data-doctype="Project"
                >
              </div>
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
              <div v-if="isEditing" class="control-input">
                <input 
                  v-model="project.project_start_date" 
                  type="date" 
                  class="form-control"
                  data-fieldtype="Date"
                  data-fieldname="project_start_date"
                  data-doctype="Project"
                >
              </div>
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
              <div v-if="isEditing" class="control-input">
                <input 
                  v-model="project.project_end_date" 
                  type="date" 
                  class="form-control"
                  data-fieldtype="Date"
                  data-fieldname="project_end_date"
                  data-doctype="Project"
                >
              </div>
              <input 
                v-else 
                type="date" 
                class="form-input" 
                :value="formatDateForInput(project.project_end_date)" 
                readonly
              >
            </div>
          </div>

        </div>
      </div>

      <!-- Activities Tab -->
      <div v-show="activeTab === 'activities'" class="tab-pane">
        <div class="activities-section">
          <div class="activities-header">
            <h3 class="section-title">Project Activities</h3>
            
            <!-- Filter Controls -->
            <div class="filter-controls">
              <div class="filter-buttons">
                <button class="btn-primary" @click="createNewActivity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M9 15h6"></path>
                    <path d="M12 18v-6"></path>
                  </svg>
                  New Activity
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
                  v-if="selectedStatus || activityNameFilter || progressFilter || parsedQuery.isNaturalLanguage"
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
                  placeholder="Smart Search: Try 'open with less than 200 hours', 'estimated hours greater than 100', 'activities starting this week', 'completed estimates'... (Press Enter to search)"
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
              <div v-if="parsedQuery.isNaturalLanguage" 
                   class="query-interpretation"
                   :class="{ 'ai-enhanced': parsedQuery.isAiParsed, 'natural-language': !parsedQuery.isAiParsed }">
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
            <div v-show="showFilters" class="filters-container">
              <div class="filter-grid">
                <div class="filter-field">
                  <label class="filter-label">Status</label>
                  <select v-model="selectedStatus" class="filter-select">
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Estimate">Estimate</option>
                    <option value="Working">Working</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Template">Template</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div class="filter-field">
                  <label class="filter-label">Activity Name</label>
                  <input 
                    v-model="activityNameFilter"
                    type="text" 
                    placeholder="Filter by name..."
                    class="filter-input"
                  >
                </div>
                <div class="filter-field">
                  <label class="filter-label">Progress</label>
                  <select v-model="progressFilter" class="filter-select">
                    <option value="">All Progress</option>
                    <option value="0">Not Started (0%)</option>
                    <option value="1-25">1-25%</option>
                    <option value="26-50">26-50%</option>
                    <option value="51-75">51-75%</option>
                    <option value="76-99">76-99%</option>
                    <option value="100">Complete (100%)</option>
                  </select>
                </div>
              </div>
              
              <!-- Filter Actions -->
              <div class="filter-actions">
                <button 
                  @click="clearFilters"
                  class="clear-filters-btn"
                  title="Clear all filters"
                  v-if="selectedStatus || activityNameFilter || progressFilter || parsedQuery.isNaturalLanguage"
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
              Showing {{ filteredActivities.length }} of {{ activities.length }} activities
            </div>
          </div>

          <div class="activity-list">
            <div 
              v-for="activity in filteredActivities" 
              :key="activity.id" 
              class="activity-item"
            >
              <div class="activity-info" @click="selectActivity(activity)">
                <div class="activity-name">{{ activity.name }}</div>
              </div>
              <div class="activity-actions">
                <div class="activity-status">{{ activity.status }}</div>
                
                <!-- Activity Financial Stats -->
                <div class="activity-financial-stats">
                  <div class="activity-stat-item">
                    <span class="activity-stat-label">REVENUE</span>
                    <span class="activity-stat-value">{{ formatCurrency(activity.estimated_revenue || 0) }}</span>
                  </div>
                  <div class="activity-stat-item">
                    <span class="activity-stat-label">COST</span>
                    <span class="activity-stat-value">{{ formatCurrency(activity.estimated_cost || 0) }}</span>
                  </div>
                  <div class="activity-stat-item">
                    <span class="activity-stat-label">MARGIN $</span>
                    <span class="activity-stat-value">{{ formatCurrency((activity.estimated_revenue || 0) - (activity.estimated_cost || 0)) }}</span>
                  </div>
                  <div class="activity-stat-item">
                    <span class="activity-stat-label">MARGIN %</span>
                    <span class="activity-stat-value" :class="getMarginColorClass(getActivityMarginPercent(activity))">
                      {{ getActivityMarginPercent(activity) }}%
                    </span>
                  </div>
                  <div class="activity-stat-item">
                    <span class="activity-stat-label">PROGRESS</span>
                    <span class="activity-stat-value">{{ activity.progress || 0 }}%</span>
                  </div>
                  <div class="activity-stat-item">
                    <span class="activity-stat-label">EST. HOURS</span>
                    <span class="activity-stat-value">{{ activity.estimated_hours || 0 }}h</span>
                  </div>
                </div>
                
                <button 
                  @click.stop="editActivity(activity)" 
                  class="edit-btn"
                >
                  Edit
                </button>
              </div>
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

      <!-- Files Tab -->
      <div v-show="activeTab === 'files'" class="tab-pane">
        <div class="coming-soon-section">
          <div class="coming-soon-content">
            <div class="coming-soon-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
              </svg>
            </div>
            <h3 class="coming-soon-title">Files</h3>
            <p class="coming-soon-description">File management and document storage will be available here soon.</p>
            <span class="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- People Tab -->
      <div v-show="activeTab === 'people'" class="tab-pane">
        <div class="coming-soon-section">
          <div class="coming-soon-content">
            <div class="coming-soon-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 class="coming-soon-title">People</h3>
            <p class="coming-soon-description">Team management and project assignments will be available here soon.</p>
            <span class="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- Reports Tab -->
      <div v-show="activeTab === 'reports'" class="tab-pane">
        <div class="coming-soon-section">
          <div class="coming-soon-content">
            <div class="coming-soon-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 class="coming-soon-title">Reports</h3>
            <p class="coming-soon-description">Project analytics and reporting dashboard will be available here soon.</p>
            <span class="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- Forms Tab -->
      <div v-show="activeTab === 'forms'" class="tab-pane">
        <div class="coming-soon-section">
          <div class="coming-soon-content">
            <div class="coming-soon-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            <h3 class="coming-soon-title">Forms</h3>
            <p class="coming-soon-description">Custom forms and data collection tools will be available here soon.</p>
            <span class="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </div>

      <!-- Tasks Tab -->
      <div v-show="activeTab === 'tasks'" class="tab-pane">
        <div class="coming-soon-section">
          <div class="coming-soon-content">
            <div class="coming-soon-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3l8-8"></path>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03"></path>
              </svg>
            </div>
            <h3 class="coming-soon-title">Tasks</h3>
            <p class="coming-soon-description">Task management and tracking tools will be available here soon.</p>
            <span class="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProject, updateProject, getDropdownOptions, getProjectPermissions } from '../services/projects';
import { searchProjects } from '../services/projects';
import { 
  getProjectDocuments, 
  createSalesOrder, 
  createPurchaseOrder, 
  createPurchaseInvoice, 
  createSalesInvoice,
  createActivity, 
  createTimesheet, 
  createStaffingPlan
} from '../services/documents';
import { getProjectActivities } from '../services/activities.js';
import { parseNaturalLanguageQuery } from '../services/claudeAI.js';
import TimelineView from '../components/TimelineView.vue';

// Types
interface Activity {
  // Core fields
  id: string;
  name: string;
  activity_name?: string;
  status: string;
  
  // Date fields
  start_date?: string;
  end_date?: string;
  expected_start_date?: string;
  expected_end_date?: string;
  creation?: string;
  modified?: string;
  
  // Progress and time tracking
  progress?: number;
  estimated_hours?: number;
  actual_hours?: number;
  burnt_hours?: number;
  remaining_hours?: number;
  
  // Financial fields
  estimated_revenue?: number;
  estimated_cost?: number;
  actual_cost?: number;
  billing_amount?: number;
  costing_amount?: number;
  
  // Project and task management
  project?: string;
  parent_task?: string;
  priority?: string;
  weight?: number;
  
  // User assignment
  assigned_to?: string;
  owner?: string;
  
  // Additional tracking
  task_type?: string;
  description?: string;
  subject?: string;
  
  // Doctype standard fields
  docstatus?: number;
  idx?: number;
  
  // Custom fields (if any)
  [key: string]: any;
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

// Activity filters
const showFilters = ref(false);
const activitySearchQuery = ref('');
const selectedStatus = ref('');
const activityNameFilter = ref('');
const progressFilter = ref('');

// Natural language processing
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
    progress: null,
    progressRange: null,
    nameContains: null,
    nameStartsWith: null,
    nameExact: null,
    semantic: null,
    dateRange: null,
    startDateRange: null,
    endDateRange: null,
    isOverdue: null,
    estimatedHours: null
  },
  suggestions: [],
  matchedActivities: []
});

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

// Load saved API key on component mount
const loadAiConfiguration = () => {
  const savedKey = localStorage.getItem('claude_api_key');
  if (savedKey) {
    claudeApiKey.value = savedKey;
    aiEnabled.value = true;
  }
  console.log('AI configuration loaded - AI enabled:', aiEnabled.value);
};

// Dropdown options for linked fields
const organisationOptions = ref<any[]>([]);
const divisionOptions = ref<any[]>([]);
const projectTypeOptions = ref<any[]>([]);
const workTypeOptions = ref<any[]>([]);
const industrySectorOptions = ref<any[]>([]);

// Activities data from Frappe backend
const activities = ref<Activity[]>([]);

// Computed filtered activities
const filteredActivities = computed(() => {
  let filtered = activities.value;

  // Apply natural language query if active
  if (parsedQuery.value.isNaturalLanguage) {
    const filters = parsedQuery.value.filters;
    
    console.log('🔍 Natural language filtering active. Total activities:', filtered.length);
    console.log('📋 All activity statuses:', [...new Set(filtered.map(a => a.status))]);
    console.log('🎯 Applied filters:', filters);
    
    // Check for deprecated field names from AI
    if (filters.progressExact !== undefined) {
      console.warn('⚠️ AI returned deprecated field "progressExact" - should be "progress"');
    }
    
    // Apply AI or basic name filters
    if (filters.nameStartsWith) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().startsWith(filters.nameStartsWith.toLowerCase())
      );
    }
    
    if (filters.nameContains) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().includes(filters.nameContains.toLowerCase()) ||
        activity.id.toLowerCase().includes(filters.nameContains.toLowerCase())
      );
    }
    
    if (filters.nameExact) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase() === filters.nameExact.toLowerCase()
      );
    }
    
    // Legacy support for old filter structure
    if (filters.startsWith) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().startsWith(filters.startsWith.toLowerCase())
      );
    }
    
    if (filters.contains) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().includes(filters.contains.toLowerCase()) ||
        activity.id.toLowerCase().includes(filters.contains.toLowerCase())
      );
    }
    
    // Apply status filter from natural language
    if (filters.status) {
      console.log(`Applying status filter: "${filters.status}"`);
      console.log('Available statuses in activities:', [...new Set(filtered.map(a => a.status))]);
      
      const beforeStatusFilter = filtered.length;
      filtered = filtered.filter(activity => 
        activity.status.toLowerCase() === filters.status.toLowerCase()
      );
      console.log(`Status filter applied: ${beforeStatusFilter} -> ${filtered.length} activities`);
      
      if (filtered.length === 0) {
        console.log(`⚠️ No activities found with status "${filters.status}". Available statuses:`, [...new Set(activities.value.map(a => a.status))]);
      }
    }
    
    // Apply exact progress filter
    if (filters.progress !== null) {
      filtered = filtered.filter(activity => 
        (activity.progress || 0) === filters.progress
      );
    }
    
    // Apply progress range filter
    if (filters.progressRange) {
      const { min, max } = filters.progressRange;
      filtered = filtered.filter(activity => {
        const progress = activity.progress || 0;
        return progress >= min && progress <= max;
      });
    }
    
    // Apply semantic filters
    if (filters.semantic) {
      switch (filters.semantic) {
        case 'commenced':
        case 'in-progress':
          filtered = filtered.filter(activity => (activity.progress || 0) > 0);
          break;
        case 'not-started':
          filtered = filtered.filter(activity => (activity.progress || 0) === 0);
          break;
        case 'completed':
          filtered = filtered.filter(activity => 
            (activity.progress || 0) === 100 || 
            activity.status.toLowerCase() === 'completed'
          );
          break;
      }
    }
    
    // Apply date range filters (AI enhancement)
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(activity => {
        const startDate = activity.start_date ? new Date(activity.start_date) : null;
        const endDate = activity.end_date ? new Date(activity.end_date) : null;
        const rangeStart = new Date(start);
        const rangeEnd = new Date(end);
        
        // Activity overlaps with the date range
        return (startDate && startDate <= rangeEnd) && (endDate && endDate >= rangeStart);
      });
    }
    
    // Apply start date range filters (AI enhancement)
    if (filters.startDateRange) {
      const { start, end } = filters.startDateRange;
      filtered = filtered.filter(activity => {
        const startDate = activity.start_date ? new Date(activity.start_date) : null;
        if (!startDate) return false;
        
        const rangeStart = new Date(start);
        const rangeEnd = new Date(end);
        
        // Activity starts within the specified date range
        return startDate >= rangeStart && startDate <= rangeEnd;
      });
    }
    
    // Apply end date range filters (AI enhancement)
    if (filters.endDateRange) {
      const { start, end } = filters.endDateRange;
      filtered = filtered.filter(activity => {
        const endDate = activity.end_date ? new Date(activity.end_date) : null;
        if (!endDate) return false;
        
        const rangeStart = new Date(start);
        const rangeEnd = new Date(end);
        
        // Activity ends within the specified date range
        return endDate >= rangeStart && endDate <= rangeEnd;
      });
    }
    
    // Apply overdue filter (AI enhancement)
    if (filters.isOverdue === true) {
      const today = new Date();
      filtered = filtered.filter(activity => {
        const endDate = activity.end_date ? new Date(activity.end_date) : null;
        return endDate && endDate < today && (activity.progress || 0) < 100;
      });
    }
    
    // Apply estimated hours filter
    if (filters.estimatedHours) {
      const { operator, value } = filters.estimatedHours;
      console.log('Applying estimated hours filter:', { operator, value });
      console.log('ALL ACTIVITIES AND THEIR ESTIMATED HOURS:');
      filtered.forEach((activity, index) => {
        const hours = parseFloat(activity.estimated_hours) || 0;
        console.log(`${index + 1}. "${activity.name}" - estimated_hours: ${activity.estimated_hours} (${typeof activity.estimated_hours}) -> parsed: ${hours}`);
      });
      
      console.log(`\nApplying filter: estimated_hours ${operator} ${value}`);
      const filterResults = filtered.map(a => {
        const hours = parseFloat(a.estimated_hours) || 0;
        const passes = operator === 'greater' ? hours > value : hours < value;
        return { 
          name: a.name, 
          estimated_hours: a.estimated_hours,
          parsed_hours: hours,
          passes: passes,
          comparison: `${hours} ${operator === 'greater' ? '>' : '<'} ${value} = ${passes}`
        };
      });
      
      console.log('Filter evaluation results:', filterResults);
      
      filtered = filtered.filter(activity => {
        // Convert string to number for proper comparison
        const estimatedHours = parseFloat(activity.estimated_hours) || 0;
        
        if (operator === 'greater') {
          return estimatedHours > value;
        } else if (operator === 'less') {
          return estimatedHours < value;
        }
        return true;
      });
      
      console.log(`\nFINAL RESULT: Found ${filtered.length} activities with estimated hours ${operator} ${value}`);
      if (filtered.length > 0) {
        console.log('Matching activities:', filtered.map(a => ({ name: a.name, estimated_hours: a.estimated_hours, parsed: parseFloat(a.estimated_hours) || 0 })));
      } else {
        console.log('No activities match the criteria. Try a lower threshold like "estimated hours greater than 10" or "estimated hours greater than 1"');
      }
    }
    
  } else {
    // Apply traditional search filter
    if (activitySearchQuery.value) {
      const query = activitySearchQuery.value.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().includes(query) ||
        activity.id.toLowerCase().includes(query)
      );
    }
  }

  // Apply status filter (traditional filters)
  if (selectedStatus.value && !parsedQuery.value.isNaturalLanguage) {
    filtered = filtered.filter(activity => activity.status === selectedStatus.value);
  }

  // Apply activity name filter (traditional filters)
  if (activityNameFilter.value && !parsedQuery.value.isNaturalLanguage) {
    const nameQuery = activityNameFilter.value.toLowerCase();
    filtered = filtered.filter(activity => 
      activity.name.toLowerCase().includes(nameQuery)
    );
  }

  // Apply progress filter (traditional filters)
  if (progressFilter.value && !parsedQuery.value.isNaturalLanguage) {
    filtered = filtered.filter(activity => {
      const progress = activity.progress || 0;
      switch (progressFilter.value) {
        case '0':
          return progress === 0;
        case '1-25':
          return progress >= 1 && progress <= 25;
        case '26-50':
          return progress >= 26 && progress <= 50;
        case '51-75':
          return progress >= 51 && progress <= 75;
        case '76-99':
          return progress >= 76 && progress <= 99;
        case '100':
          return progress === 100;
        default:
          return true;
      }
    });
  }

  return filtered;
});

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
    
    // Load project activities
    await loadProjectActivities();
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load project';
    console.error('Error loading project:', err);
  } finally {
    loading.value = false;
  }
};

const loadProjectActivities = async () => {
  console.log('Loading project activities for project:', project.value);
  console.log('Project name (ID):', project.value.name);
  console.log('Project code:', project.value.project_code);
  try {
    if (project.value.name) {
      // Try using project.name (ID) first, then fall back to project_code
      console.log('Calling getProjectActivities with project name:', project.value.name);
      let activityData = await getProjectActivities(project.value.name);
      
      // If no activities found with name, try with project_code
      if (!activityData || activityData.length === 0) {
        console.log('No activities found with project name, trying project_code:', project.value.project_code);
        if (project.value.project_code) {
          activityData = await getProjectActivities(project.value.project_code);
        }
      }
      
      // Map activity data to our interface - use all fields from backend
      activities.value = activityData
        .filter(activity => {
          // Filter out any test data that might be in the backend
          const id = activity.name || '';
          const displayName = activity.activity_name || activity.subject || '';
          const isTestData = id.includes('TEST-') || id.includes('test-') || 
                           displayName.includes('Test') || displayName.includes('TEST');
          
          if (isTestData) {
            console.warn('Filtering out test activity:', { id, displayName });
            return false;
          }
          return true;
        })
        .map((activity: any) => ({
          // Keep all original fields from backend
          ...activity,
          // Ensure consistent field mapping for core fields
          id: activity.name, // Use 'name' field as ID (this is the document ID in Frappe)
          name: activity.activity_name || activity.subject || activity.name, // Display name
          // Map common field variations
          actual_hours: parseFloat(activity.burnt_hours) || parseFloat(activity.actual_hours) || 0,
          // Ensure numeric fields are properly converted from strings to numbers
          progress: parseFloat(activity.progress) || 0,
          estimated_hours: parseFloat(activity.estimated_hours) || 0,
          estimated_revenue: parseFloat(activity.estimated_revenue) || 0,
          estimated_cost: parseFloat(activity.estimated_cost) || 0
        }));
      
      console.log(`Loaded ${activities.value.length} activities from backend (after filtering test data):`);
      console.log('Raw activity data from backend:', activityData);
      console.log('🔍 Checking estimated_hours in raw data:');
      activityData.forEach((activity, index) => {
        console.log(`  ${index + 1}. "${activity.activity_name}" - estimated_hours: ${activity.estimated_hours} (${typeof activity.estimated_hours})`);
      });
      console.log('Mapped activity data:', activities.value);
      console.log('📋 All available fields in first activity:', activityData.length > 0 ? Object.keys(activityData[0]) : 'No activities');
      console.log('Activity estimated hours summary:', activities.value.map(a => ({ 
        name: a.name, 
        estimated_hours: a.estimated_hours,
        type: typeof a.estimated_hours 
      })));
      
      // Log estimated hours summary for debugging
      const hours = activities.value.map(a => a.estimated_hours || 0).filter(h => h > 0);
      if (hours.length > 0) {
        console.log(`Estimated hours range: ${Math.min(...hours)} - ${Math.max(...hours)} hours`);
        console.log(`Activities with hours > 0: ${hours.length}/${activities.value.length}`);
      } else {
        console.log('No activities have estimated hours set');
        console.log('🔍 Check if the backend field name is "estimated_hours" or something else like "total_hours", "planned_hours", etc.');
      }
      
    } else {
      console.log('No project name or code available for loading activities');
    }
  } catch (err: any) {
    console.error('Error loading project activities:', err);
    // If no activities are available, set empty array
    activities.value = [];
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

const getMarginColorClass = (marginPercent: number): string => {
  if (marginPercent > 20) {
    return 'margin-high';
  } else if (marginPercent > 0) {
    return 'margin-medium';
  } else {
    return 'margin-low';
  }
};

const getActivityMarginPercent = (activity: any): number => {
  const revenue = activity.estimated_revenue || 0;
  const cost = activity.estimated_cost || 0;
  if (revenue === 0) return 0;
  return Math.round(((revenue - cost) / revenue) * 100);
};

const createNewActivity = () => {
  router.push({
    name: 'new-activity',
    query: {
      fromProject: project.value.name || route.params.id,
      fromProjectName: project.value.project_name,
      fromProjectCode: project.value.project_code
    }
  });
};

// Project Search Functions
const searchForProjectByNumber = async (projectNumber: string) => {
  try {
    isAiProcessing.value = true;
    console.log('Searching for project with number:', projectNumber);
    
    // Search for projects with this number
    const searchResults = await searchProjects(projectNumber);
    console.log('Project search results:', searchResults);
    
    // Filter results to find exact or close matches for project code
    const exactMatches = searchResults.filter(proj => 
      proj.project_code === projectNumber || 
      proj.project_code === `P${projectNumber}` ||
      proj.project_code?.includes(projectNumber)
    );
    
    // Also check project names for the number
    const nameMatches = searchResults.filter(proj => 
      proj.project_name?.includes(projectNumber) ||
      proj.name?.includes(projectNumber)
    );
    
    const allMatches = [...exactMatches, ...nameMatches].filter((proj, index, self) => 
      self.findIndex(p => p.name === proj.name) === index // Remove duplicates
    );
    
    if (allMatches.length > 0) {
      // Project(s) found - offer navigation options
      const primaryMatch = allMatches[0];
      
      parsedQuery.value = {
        isNaturalLanguage: true,
        isAiParsed: false,
        interpretation: `Found ${allMatches.length} project(s) with number "${projectNumber}"`,
        confidence: 0.95,
        filters: {},
        suggestions: allMatches.slice(0, 3).map(proj => 
          `Go to Project ${proj.project_code}: ${proj.project_name}`
        ),
        matchedActivities: [],
        projectMatches: allMatches
      };
      
      // Auto-navigate to the first match if there's only one
      if (allMatches.length === 1) {
        const confirmed = confirm(
          `Found Project ${primaryMatch.project_code}: ${primaryMatch.project_name}\n\nWould you like to navigate to this project?`
        );
        if (confirmed) {
          router.push(`/projects/${primaryMatch.name}`);
          return;
        }
      }
    } else {
      // No project found - fall back to activity search
      console.log('No project found with number, searching activities instead');
      parsedQuery.value = {
        isNaturalLanguage: true,
        isAiParsed: false,
        interpretation: `No project found with number "${projectNumber}". Searching activities instead...`,
        confidence: 0.7,
        filters: {
          nameContains: projectNumber
        },
        suggestions: [
          `Search for activity containing "${projectNumber}"`,
          'Try searching with project code format (e.g., P3000)',
          'Browse all projects'
        ],
        matchedActivities: []
      };
    }
  } catch (error) {
    console.error('Error searching for project:', error);
    // Fall back to activity search
    parsedQuery.value = {
      isNaturalLanguage: true,
      isAiParsed: false,
      interpretation: `Search error. Searching activities for "${projectNumber}"...`,
      confidence: 0.6,
      filters: {
        nameContains: projectNumber
      },
      suggestions: ['Try a different search term'],
      matchedActivities: []
    };
  } finally {
    isAiProcessing.value = false;
  }
};

// Natural Language Processing Functions
const processNaturalLanguageQuery = async () => {
  const query = naturalLanguageQuery.value.toLowerCase().trim();
  
  if (!query) {
    parsedQuery.value = {
      isNaturalLanguage: false,
      isAiParsed: false,
      interpretation: '',
      confidence: 0,
      filters: {
        startsWith: '',
        contains: '',
        status: '',
        progress: null,
        progressRange: null,
        nameContains: null,
        nameStartsWith: null,
        nameExact: null,
        semantic: null,
        dateRange: null,
        startDateRange: null,
        endDateRange: null,
        isOverdue: null,
        estimatedHours: null
      },
      suggestions: [],
      matchedActivities: []
    };
    return;
  }

  // PRIORITY: Check if query is a potential project number first
  const isNumericQuery = /^\d+$/.test(query);
  if (isNumericQuery) {
    console.log('Detected numeric query, searching for project:', query);
    await searchForProjectByNumber(query);
    return;
  }

  // Check for project-related queries like "project 3000" or "go to project 3000"
  const projectNumberMatch = query.match(/(?:project|proj)\s+(\d+)|(\d+)\s+project/i);
  if (projectNumberMatch) {
    const projectNumber = projectNumberMatch[1] || projectNumberMatch[2];
    console.log('Detected project number in query:', projectNumber);
    await searchForProjectByNumber(projectNumber);
    return;
  }

  // Use fast pattern matching as primary method (60x faster than AI!)
  console.log('Processing query with pattern matching:', query);
  parsedQuery.value = processBasicQuery(query);
  
  // Optional: Try AI enhancement if enabled AND pattern matching has low confidence
  if (aiEnabled.value && claudeApiKey.value && parsedQuery.value.confidence < 0.8) {
    try {
      console.log('Pattern matching confidence low, trying AI enhancement...');
      isAiProcessing.value = true;
      
      const aiResult = await parseNaturalLanguageQuery(
        query,
        claudeApiKey.value, 
        'activities',
        activities.value
      );
      
      console.log('AI enhancement result:', aiResult);
      
      // Only use AI result if it has meaningfully higher confidence
      if (aiResult.confidence > parsedQuery.value.confidence + 0.1) {
        console.log('Using AI result (significantly higher confidence)');
        parsedQuery.value = aiResult;
      } else {
        console.log('Keeping pattern matching result (sufficient confidence)');
      }
      
    } catch (error) {
      // Quietly handle AI service issues - pattern matching will be used instead
      if (error.message.includes('AI service') || error.message.includes('temporarily unavailable')) {
        console.log('AI service unavailable, using pattern matching fallback');
      } else {
        console.log('AI enhancement failed, using pattern matching result:', error.message);
      }
      // Keep the pattern matching result
    } finally {
      isAiProcessing.value = false;
    }
  }
};

const processBasicQuery = (query) => {
  const filters = {
    startsWith: '',
    contains: '',
    status: '',
    progress: null,
    progressRange: null,
    nameContains: null,
    nameStartsWith: null,
    nameExact: null,
    semantic: null,
    dateRange: null,
    startDateRange: null,
    endDateRange: null,
    isOverdue: null,
    estimatedHours: null
  };
  
  let interpretation = '';
  let isNaturalLanguage = false;

  // Date pattern matching for month/year queries
  const monthNames = {
    january: '01', jan: '01',
    february: '02', feb: '02',
    march: '03', mar: '03',
    april: '04', apr: '04',
    may: '05',
    june: '06', jun: '06',
    july: '07', jul: '07',
    august: '08', aug: '08',
    september: '09', sep: '09', sept: '09',
    october: '10', oct: '10',
    november: '11', nov: '11',
    december: '12', dec: '12'
  };
  
  // Starting in month patterns
  const startingInMonthMatch = query.match(/(?:starting|start|begins?)\s+(?:in\s+)?([a-zA-Z]+)(?:\s+(\d{4}))?/);
  if (startingInMonthMatch) {
    const monthName = startingInMonthMatch[1].toLowerCase();
    const year = startingInMonthMatch[2] || '2025'; // Default to current year
    const monthNum = monthNames[monthName];
    
    if (monthNum) {
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-${new Date(parseInt(year), parseInt(monthNum), 0).getDate()}`;
      
      filters.startDateRange = { start: startDate, end: endDate };
      interpretation = `Activities starting in ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
      isNaturalLanguage = true;
    }
  }
  
  // Ending in month patterns
  const endingInMonthMatch = query.match(/(?:ending|end|finish|due)\s+(?:in\s+)?([a-zA-Z]+)(?:\s+(\d{4}))?/);
  if (endingInMonthMatch && !startingInMonthMatch) {
    const monthName = endingInMonthMatch[1].toLowerCase();
    const year = endingInMonthMatch[2] || '2025'; // Default to current year
    const monthNum = monthNames[monthName];
    
    if (monthNum) {
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-${new Date(parseInt(year), parseInt(monthNum), 0).getDate()}`;
      
      filters.endDateRange = { start: startDate, end: endDate };
      interpretation = `Activities ending in ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
      isNaturalLanguage = true;
    }
  }
  
  // Activities in month patterns (general)
  const inMonthMatch = query.match(/(?:activities?\s+)?(?:in\s+)?([a-zA-Z]+)(?:\s+(\d{4}))?(?:\s+activities?)?/);
  if (inMonthMatch && !startingInMonthMatch && !endingInMonthMatch) {
    const monthName = inMonthMatch[1].toLowerCase();
    const year = inMonthMatch[2] || '2025'; // Default to current year
    const monthNum = monthNames[monthName];
    
    if (monthNum && monthName.length > 3) { // Avoid matching short words
      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-${new Date(parseInt(year), parseInt(monthNum), 0).getDate()}`;
      
      filters.dateRange = { start: startDate, end: endDate };
      interpretation = `Activities active during ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
      isNaturalLanguage = true;
    }
  }

  // Estimated hours patterns - check these FIRST before status patterns
  // Handle patterns like "with less than 200 hours", "less than 200 hours", "hours less than 200"
  // Include common typos and variations
  const hoursGreaterMatch = query.match(/(?:with\s+)?(?:estimated\s+(?:hours?|hors?|houres?)|(?:hours?|hors?|houres?))\s+(?:greater\s+than|more\s+than|over|above|\>|greter|grater)\s+(\d+)|(?:greater\s+than|more\s+than|over|above|\>|greter|grater)\s+(\d+)\s+(?:estimated\s+)?(?:hours?|hors?|houres?)/i);
  if (hoursGreaterMatch) {
    const threshold = parseInt(hoursGreaterMatch[1] || hoursGreaterMatch[2]);
    console.log('Hours greater match found:', { threshold, query });
    filters.estimatedHours = { operator: 'greater', value: threshold };
    interpretation = `Activities with estimated hours greater than ${threshold}`;
    isNaturalLanguage = true;
  }
  
  const hoursLessMatch = query.match(/(?:with\s+)?(?:estimated\s+(?:hours?|hors?|houres?)|(?:hours?|hors?|houres?))\s+(?:less\s+than|under|below|\<|les|lss)\s+(\d+)|(?:less\s+than|under|below|\<|les|lss)\s+(\d+)\s+(?:estimated\s+)?(?:hours?|hors?|houres?)/i);
  if (hoursLessMatch && !hoursGreaterMatch) {
    const threshold = parseInt(hoursLessMatch[1] || hoursLessMatch[2]);
    console.log('Hours less match found:', { threshold, query });
    filters.estimatedHours = { operator: 'less', value: threshold };
    interpretation = `Activities with estimated hours less than ${threshold}`;
    isNaturalLanguage = true;
  }

  // Status patterns (after hours patterns to allow combined queries like "open with less than 200 hours")
  // Include common typos and variations
  const statusPatterns = [
    { pattern: /\b(completed?|finished?|done|compelte|complte|copmplete)\b/i, status: 'Completed' },
    { pattern: /\b(estimates?|estimation|quote|quoting|estimat|estiamte|etsimate)\b/i, status: 'Estimate' },
    { pattern: /\b(open|new|not\s+started|opn|opne|oepn)\b/i, status: 'Open' },
    { pattern: /\b(working|active|workin|workng)\b/i, status: 'Working' },
    { pattern: /\b(pending\s+review|review|reviw|reveiw)\b/i, status: 'Pending Review' },
    { pattern: /\b(overdue|late|overdeu|overdu)\b/i, status: 'Overdue' },
    { pattern: /\b(template|templat|tempalte)\b/i, status: 'Template' },
    { pattern: /\b(cancelled?|canceled?|canceld|cancled)\b/i, status: 'Cancelled' }
  ];
  
  // Check for status patterns and combine with existing interpretation
  for (const statusPattern of statusPatterns) {
    if (statusPattern.pattern.test(query)) {
      filters.status = statusPattern.status;
      if (interpretation) {
        interpretation = `${statusPattern.status} activities with estimated hours ${filters.estimatedHours.operator === 'greater' ? 'greater than' : 'less than'} ${filters.estimatedHours.value}`;
      } else {
        interpretation = `Activities with status "${filters.status}"`;
      }
      isNaturalLanguage = true;
      break;
    }
  }

  // If no hours patterns matched with status, continue with other patterns
  if (!isNaturalLanguage) {
    // "starts with" or "starting with" patterns
    const startsWithMatch = query.match(/(?:starts?\s+with|starting\s+with|begins?\s+with)\s+['"]?([^'"]+)['"]?/);
    if (startsWithMatch) {
      filters.nameStartsWith = startsWithMatch[1].trim();
      interpretation = `Activities starting with "${filters.nameStartsWith}"`;
      isNaturalLanguage = true;
    }
    
    // "contains" patterns
    const containsMatch = query.match(/(?:contains?|includes?|has)\s+['"]?([^'"]+)['"]?/);
    if (containsMatch && !startsWithMatch) {
      filters.nameContains = containsMatch[1].trim();
      interpretation = `Activities containing "${filters.nameContains}"`;
      isNaturalLanguage = true;
    }
    
    // Special handling for "in progress" - activities with progress > 0
    const inProgressMatch = query.match(/\b(in\s+progress|in-progress)\b/);
    if (inProgressMatch) {
      filters.progressRange = { min: 1, max: 100 };
      filters.semantic = 'in-progress';
      interpretation = `Activities that are in progress (1-100% progress)`;
      isNaturalLanguage = true;
    }
    
    // Special handling for "commenced" - activities with progress > 0
    const commencedMatch = query.match(/\b(commenced?|started?|begun)\b/);
    if (commencedMatch && !inProgressMatch) {
      filters.progressRange = { min: 1, max: 100 };
      filters.semantic = 'commenced';
      interpretation = `Activities that have commenced (1-100% progress)`;
      isNaturalLanguage = true;
    }
    
    // Progress patterns
    const progressMatch = query.match(/(\d+)%?\s*(?:progress|complete|completion)/);
    if (progressMatch) {
      filters.progress = parseInt(progressMatch[1]);
      interpretation = interpretation ? 
        `${interpretation} at ${filters.progress}% progress` : 
        `Activities at ${filters.progress}% progress`;
      isNaturalLanguage = true;
    }
    
    // Progress range patterns
    const progressRangeMatch = query.match(/(?:between|from)\s+(\d+)%?\s+(?:to|and)\s+(\d+)%?/);
    if (progressRangeMatch) {
      filters.progressRange = {
        min: parseInt(progressRangeMatch[1]),
        max: parseInt(progressRangeMatch[2])
      };
      interpretation = interpretation ? 
        `${interpretation} with ${filters.progressRange.min}-${filters.progressRange.max}% progress` : 
        `Activities with ${filters.progressRange.min}-${filters.progressRange.max}% progress`;
      isNaturalLanguage = true;
    }
    
    // Fallback for simple text search
    if (!isNaturalLanguage && query.length > 0) {
      filters.nameContains = query;
      interpretation = `Activities containing "${query}"`;
      isNaturalLanguage = true;
    }
  }

  // Calculate confidence based on what we matched
  let confidence = 0.5; // Base confidence for fallback text search
  let hasTypos = false;
  let missedCompoundIntent = false;
  
  // Check for potential typos that AI could help with
  const typoPatterns = [
    // Common hour variations with typos
    /\b(hors?|houres?|hrs?)\b/i, // hours typos
    /\b(les|lss|lesss)\b/i, // less typos  
    /\b(opn|opne|oepn)\b/i, // open typos
    /\b(estimat|estiamte|etsimate)\b/i, // estimate typos
    /\b(greter|grater|greather)\b/i, // greater typos
    /\b(activit|actvity|activties)\b/i, // activity typos
    /\b(progreess|progres|porgresss)\b/i, // progress typos
    /\b(compelte|complte|copmplete)\b/i, // complete typos
  ];
  
  // Check if query contains potential typos
  hasTypos = typoPatterns.some(pattern => pattern.test(query));
  
  // Check for compound query indicators that we might have missed
  const compoundIndicators = [
    // Hours-related patterns (even with typos)
    /\b(?:hours?|hors?|houres?|hrs?)\b.*\b(?:greater|less|more|under|over|above|below)\b|\b(?:greater|less|more|under|over|above|below)\b.*\b(?:hours?|hors?|houres?|hrs?)\b/i,
    // Multiple concepts in one query
    /\b(?:with|and|plus|also)\b/i, // connector words
    // Numbers in context of comparisons
    /\b(?:than|then)\s+\d+\b/i,
    // Time-related with comparisons
    /\b\d+\s*(?:hours?|hors?|houres?|hrs?|days?|weeks?|months?)\b/i
  ];
  
  const hasCompoundIndicators = compoundIndicators.some(pattern => pattern.test(query));
  
  // Count how many filter types we actually matched
  const activeFilters = Object.values(filters).filter(v => 
    v !== null && v !== '' && (typeof v !== 'object' || Object.keys(v).length > 0)
  ).length;
  
  // Detect if we likely missed compound intent
  if (hasCompoundIndicators && activeFilters <= 1) {
    missedCompoundIntent = true;
    console.log('🚨 Detected missed compound intent:', {
      query,
      hasCompoundIndicators,
      activeFilters,
      detectedFilters: Object.entries(filters).filter(([k,v]) => v !== null && v !== '')
    });
  }
  
  // Add some fuzzy matching for common typos
  if (hasTypos) {
    console.log('Potential typos detected in query:', query);
    
    // Try to fix common typos and re-process
    let fixedQuery = query
      .replace(/\b(hors?|houres?)\b/gi, 'hours')
      .replace(/\b(les|lss|lesss)\b/gi, 'less')
      .replace(/\b(opn|opne|oepn)\b/gi, 'open')
      .replace(/\b(greter|grater|greather)\b/gi, 'greater')
      .replace(/\b(estimat|estiamte|etsimate)\b/gi, 'estimate')
      .replace(/\b(activit|activties)\b/gi, 'activity')
      .replace(/\b(progreess|progres|porgresss)\b/gi, 'progress')
      .replace(/\b(compelte|complte|copmplete)\b/gi, 'complete');
    
    if (fixedQuery !== query) {
      console.log('Fixed query:', fixedQuery);
      
      // Re-run pattern matching on fixed query
      const fixedResult = processBasicQuery(fixedQuery);
      if (fixedResult.isNaturalLanguage) {
        // Use the fixed result but lower confidence to trigger AI
        Object.assign(filters, fixedResult.filters);
        interpretation = fixedResult.interpretation + ' (auto-corrected)';
        isNaturalLanguage = true;
        confidence = 0.7; // Lower confidence to potentially trigger AI enhancement
      }
    }
  }
  
  // Set confidence based on what we successfully matched vs what we think user intended
  if (filters.estimatedHours) confidence = Math.max(confidence, hasTypos || missedCompoundIntent ? 0.75 : 0.95);
  if (filters.status) confidence = Math.max(confidence, hasTypos || missedCompoundIntent ? 0.65 : 0.9); 
  if (filters.progressRange || filters.progress) confidence = Math.max(confidence, hasTypos || missedCompoundIntent ? 0.7 : 0.85);
  if (filters.startDateRange || filters.endDateRange || filters.dateRange) confidence = Math.max(confidence, hasTypos || missedCompoundIntent ? 0.75 : 0.9);
  if (filters.nameStartsWith || filters.nameContains) confidence = Math.max(confidence, hasTypos || missedCompoundIntent ? 0.65 : 0.8);
  if (filters.semantic) confidence = Math.max(confidence, hasTypos || missedCompoundIntent ? 0.7 : 0.85);
  
  // If we detected typos but couldn't fix them completely, lower confidence significantly
  if (hasTypos && !isNaturalLanguage) {
    confidence = 0.4; // Very low confidence to definitely trigger AI
  }
  
  // If we suspect missed compound intent, significantly lower confidence
  if (missedCompoundIntent) {
    confidence = Math.min(confidence, 0.6); // Cap confidence at 60% to likely trigger AI
    console.log('🔽 Lowering confidence due to suspected missed compound intent:', confidence);
  }
  
  // Bonus confidence for complex combined queries (unless issues detected)
  const filterCount = Object.values(filters).filter(v => v !== null && v !== '').length;
  if (filterCount > 1 && !hasTypos && !missedCompoundIntent) {
    confidence = Math.min(0.95, confidence + 0.05);
  }

  const result = {
    isNaturalLanguage,
    isAiParsed: false,
    interpretation,
    confidence,
    filters,
    suggestions: [],
    matchedActivities: [],
    // Debug info for developers
    _debug: {
      hasTypos,
      missedCompoundIntent,
      compoundIndicators: hasCompoundIndicators,
      activeFilters,
      originalQuery: query
    }
  };
  
  console.log('Basic query processing result:', result);
  
  // User-friendly feedback for missed compound intent
  if (missedCompoundIntent) {
    console.log('💡 This query appears to have multiple intentions. AI enhancement may provide better results.');
  }
  
  return result;
};

const clearNaturalLanguageQuery = () => {
  naturalLanguageQuery.value = '';
  parsedQuery.value = {
    isNaturalLanguage: false,
    isAiParsed: false,
    interpretation: '',
    confidence: 0,
    filters: {
      startsWith: '',
      contains: '',
      status: '',
      progress: null,
      progressRange: null,
      nameContains: null,
      nameStartsWith: null,
      nameExact: null,
      semantic: null,
      dateRange: null,
      startDateRange: null,
      endDateRange: null,
      isOverdue: null,
      estimatedHours: null
    },
    suggestions: [],
    matchedActivities: []
  };
};

const applySuggestion = (suggestion) => {
  // Check if suggestion is a project navigation command
  const projectNavMatch = suggestion.match(/^Go to Project ([^:]+): (.+)$/);
  if (projectNavMatch) {
    const projectCode = projectNavMatch[1];
    const projectName = projectNavMatch[2];
    
    // Find the project in the matches
    const targetProject = parsedQuery.value.projectMatches?.find(proj => 
      proj.project_code === projectCode
    );
    
    if (targetProject) {
      const confirmed = confirm(
        `Navigate to Project ${projectCode}: ${projectName}?`
      );
      if (confirmed) {
        router.push(`/projects/${targetProject.name}`);
        return;
      }
    }
  }
  
  // Handle other suggestion types
  if (suggestion === 'Browse all projects') {
    router.push('/projects');
    return;
  }
  
  // Default behavior: apply suggestion as search query
  naturalLanguageQuery.value = suggestion;
  processNaturalLanguageQuery();
};

const getConfidenceClass = (confidence) => {
  if (confidence >= 0.8) return 'confidence-high';
  if (confidence >= 0.6) return 'confidence-medium';
  return 'confidence-low';
};

const clearFilters = () => {
  selectedStatus.value = '';
  activityNameFilter.value = '';
  progressFilter.value = '';
  clearNaturalLanguageQuery();
};

const addWidget = async (widgetType: string) => {
  console.log('Add widget:', widgetType);
  
  if (!project.value?.project_code) {
    alert('Project data not loaded. Please refresh the page.');
    return;
  }

  const projectId = route.params.id as string;

  try {
    switch (widgetType) {
      case 'sales-order':
        // Generate a unique form ID and navigate to Vue frontend form
        const salesOrderFormId = `${project.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        router.push(`/sales-order/new-sales-order-${salesOrderFormId}?project=${encodeURIComponent(project.value.name)}&projectId=${encodeURIComponent(projectId)}`);
        break;
        
      case 'sales-invoice':
        // Generate a unique form ID and navigate to Vue frontend form
        const salesInvoiceFormId = `${project.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        router.push(`/sales-invoice/new-sales-invoice-${salesInvoiceFormId}?project=${encodeURIComponent(project.value.name)}&projectId=${encodeURIComponent(projectId)}`);
        break;
        
      case 'purchase-order':
        // Generate a unique form ID and navigate to Vue frontend form
        const purchaseOrderFormId = `${project.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        router.push(`/purchase-order/new-purchase-order-${purchaseOrderFormId}?project=${encodeURIComponent(project.value.name)}&projectId=${encodeURIComponent(projectId)}`);
        break;
        
      case 'purchase-invoice':
        // Generate a unique form ID and navigate to Vue frontend form
        const purchaseInvoiceFormId = `${project.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        router.push(`/purchase-invoice/new-purchase-invoice-${purchaseInvoiceFormId}?project=${encodeURIComponent(project.value.name)}&projectId=${encodeURIComponent(projectId)}`);
        break;
        
      case 'timesheet':
        // Generate a unique form ID and navigate to Vue frontend form
        const timesheetFormId = `${project.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        router.push(`/timesheet/new-timesheet-${timesheetFormId}?project=${encodeURIComponent(project.value.name)}&projectId=${encodeURIComponent(projectId)}`);
        break;
        
      case 'staffing-plan':
        // Generate a unique form ID and navigate to Vue frontend form
        const staffingPlanFormId = `${project.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        router.push(`/staffing-plan/new-staffing-plan-${staffingPlanFormId}?project=${encodeURIComponent(project.value.name)}&projectId=${encodeURIComponent(projectId)}`);
        break;
        
      default:
        console.log('Unknown widget type:', widgetType);
        alert('Unknown document type');
    }

    // Optionally refresh project data to update counts (for non-activity cases)
    await loadProject();
    
  } catch (error) {
    console.error('Error opening form:', error);
    alert(`Error opening form: ${error.message}`);
  }
};

const selectActivity = (activity: any) => {
  console.log('Selected activity:', activity);
  // Implement activity selection logic
};

const navigateToDocuments = (documentType: string) => {
  const projectId = route.params.id as string;
  router.push({
    name: `project-${documentType}`,
    params: {
      projectId: projectId
    },
    query: {
      fromProject: project.value.name || projectId,
      fromProjectName: project.value.project_name,
      fromProjectCode: project.value.project_code
    }
  });
};

const editActivity = (activity: any) => {
  console.log('Edit activity:', activity);
  
  // Validate that activity exists and has valid ID
  if (!activity || !activity.id) {
    console.error('Cannot edit activity: Invalid activity data', activity);
    return;
  }
  
  // Ensure the activity ID doesn't contain test data
  if (activity.id.includes('TEST-') || activity.id.includes('test-')) {
    console.error('Cannot edit test activity:', activity.id);
    return;
  }
  
  // Navigate to full page activity edit using the Frappe activity name (ID)
  const projectId = route.params.id as string;
  router.push({
    name: 'ActivityEdit',
    params: {
      projectId: projectId,
      activityId: activity.id // This is the Frappe activity name/ID
    },
    query: {
      activityName: activity.name,
      returnTo: 'project-detail',
      fromProject: project.value.name || projectId,
      fromProjectName: project.value.project_name,
      fromProjectCode: project.value.project_code
    }
  });
};

const navigateToOrganisation = () => {
  if (project.value.organisation_id) {
    router.push({
      name: 'organisation-detail',
      params: {
        id: project.value.organisation_id
      },
      query: {
        fromProject: project.value.name || route.params.id,
        fromProjectName: project.value.project_name,
        fromProjectCode: project.value.project_code
      }
    });
  } else {
    console.log('No organisation ID available');
  }
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
      custom_scope_of_work: project.value.custom_scope_of_work,
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

// Helper function to clean any stale test data
const cleanupTestData = () => {
  // Remove any test activities that might persist
  activities.value = activities.value.filter(activity => 
    !activity.id.includes('TEST-') && 
    !activity.id.includes('test-') &&
    !activity.name.includes('Test') &&
    activity.id !== 'TEST-001'
  );
  
  // Clear any cached search results that might contain test data
  if (parsedQuery.value.matchedActivities) {
    parsedQuery.value.matchedActivities = parsedQuery.value.matchedActivities.filter(activity =>
      !activity.id.includes('TEST-') && !activity.id.includes('test-')
    );
  }
};

// Lifecycle
onMounted(() => {
  loadAiConfiguration();
  loadProject();
  // Clean up any residual test data
  cleanupTestData();
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
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.project-title-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 14px;
  font-weight: 600;
}

/* Financial Stats Widgets */
.financial-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  max-width: 400px;
  width: 100%;
}

.stat-item {
  background: var(--monday-white);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
  border-color: var(--primary-green-light);
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
  line-height: 1.2;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-green);
  line-height: 1;
}

/* Margin percentage color classes */
.stat-value.margin-high {
  color: #2e7d32; /* Green for > 20% */
}

.stat-value.margin-medium {
  color: #f57c00; /* Orange for 0-20% */
}

.stat-value.margin-low {
  color: #d32f2f; /* Red for <= 0% */
}

/* Clickable field styling */
.clickable-field {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.clickable-field:hover {
  background: var(--primary-green-light);
  color: var(--primary-green);
  border-color: var(--primary-green);
}

.clickable-field:hover::after {
  content: '→';
  position: absolute;
  right: var(--spacing-sm);
  color: var(--primary-green);
  font-weight: bold;
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
  margin-bottom: var(--spacing-xl);
}

.project-widgets {
  display: flex;
  gap: var(--spacing-lg);
}

.progress-section {
  margin: var(--spacing-sm) 0;
  flex: 1;
  max-width: 75%; /* 3/4 of the left column */
}

.status-progress-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
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

.widget-row {
  display: flex;
  gap: var(--spacing-sm);
}

.widget-row .widget-item {
  flex: 1;
}

.widget-column-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: var(--spacing-md);
}

.widget-item {
  background: var(--monday-white);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.clickable-widget {
  cursor: pointer;
}

.clickable-widget:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
  border-color: var(--primary-green-light);
  background: var(--primary-green-light);
}

.clickable-widget:hover .widget-label {
  color: var(--primary-green);
  font-weight: 600;
}

.clickable-widget:hover .widget-add-btn {
  background: var(--primary-green);
  color: white;
}

.widget-placeholder {
  background: transparent;
  border: none;
  visibility: hidden;
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
  padding: 0 var(--spacing-xl);
  box-shadow: var(--shadow-small);
  min-height: 60px;
  align-items: center;
  overflow-x: auto;
  gap: var(--spacing-xs);
}

.tab {
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--monday-medium-dark);
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  font-size: 14px;
  white-space: nowrap;
  position: relative;
  margin-bottom: -1px;
}

.tab.active {
  border-bottom-color: var(--primary-green);
  color: var(--primary-green);
  font-weight: 600;
}

.tab:hover {
  color: var(--primary-green);
  background: var(--monday-very-light);
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
  padding: 0;
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
  width: 100%;
}

/* Coming Soon Sections */
.coming-soon-section {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coming-soon-content {
  text-align: center;
  max-width: 400px;
}

.coming-soon-icon {
  color: var(--monday-medium);
  margin-bottom: var(--spacing-lg);
  opacity: 0.7;
}

.coming-soon-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: var(--spacing-md);
}

.coming-soon-description {
  font-size: 16px;
  color: var(--monday-medium-dark);
  line-height: 1.5;
  margin-bottom: var(--spacing-lg);
}

.coming-soon-badge {
  display: inline-block;
  background: var(--primary-green-light);
  color: var(--primary-green);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-xl);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Activities Filter Styles */
.activities-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
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

.clear-all-filters-btn {
  background: #f0f0f0 !important;
  color: #333 !important;
  border: 1px solid #ccc !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.clear-all-filters-btn:hover {
  background: #6b46c1 !important;
  color: white !important;
  border-color: #553c9a !important;
}

.search-filter-section {
  background: var(--monday-white);
  border: 1px solid var(--monday-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.search-container {
  margin-bottom: var(--spacing-md);
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--monday-medium);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) 120px var(--spacing-sm) 40px;
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

.search-input.ai-enabled {
  background: linear-gradient(90deg, transparent 0%, rgba(138, 43, 226, 0.05) 100%);
  font-weight: 500;
  border-color: rgba(138, 43, 226, 0.3);
}

.search-input.ai-processing {
  color: var(--monday-medium);
  pointer-events: none;
  background: var(--monday-light-grey);
}

.search-controls {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px;
  border-radius: 4px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.search-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.clear-search-btn:hover:not(:disabled) {
  background: #6b46c1;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.clear-search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-enable-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: linear-gradient(135deg, #8a2be2, #9932cc);
  color: white;
  border: none;
  border-radius: var(--border-radius-small);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-enable-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
}

.ai-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.ai-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(186, 85, 211, 0.15);
  color: #ba55d3;
}

.ai-indicator.active {
  background: rgba(138, 43, 226, 0.2);
  color: #6a1b9a;
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

.ai-disable-btn {
  background: rgba(138, 43, 226, 0.15);
  color: #8a2be2;
  border: none;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-disable-btn:hover {
  background: rgba(138, 43, 226, 0.2);
}

.ai-processing {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--monday-medium);
  font-size: 12px;
  background: var(--monday-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-small);
  border: 1px solid var(--monday-light);
}

.ai-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(138, 43, 226, 0.3);
  border-top: 2px solid #8a2be2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Natural Language Search Enhancements */
.natural-language-input {
  font-style: italic;
  background: linear-gradient(135deg, #f8fffe 0%, #f3fcf9 100%);
  border-color: var(--primary-green-light);
}

.natural-language-input::placeholder {
  color: var(--primary-green);
  opacity: 0.7;
}

.query-interpretation {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-medium);
  font-size: 14px;
  position: relative;
  transition: all 0.2s ease;
}

/* Default green styling for natural language searches */
.query-interpretation.natural-language {
  background: var(--primary-green-light);
  border: 1px solid var(--primary-green);
}

/* Purple styling for AI-enhanced searches */
.query-interpretation.ai-enhanced {
  background: rgba(107, 70, 193, 0.1);
  border: 1px solid #6b46c1;
}

.interpretation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.interpretation-label {
  font-weight: 600;
  font-size: 13px;
}

/* Green theme for natural language */
.query-interpretation.natural-language .interpretation-label {
  color: var(--primary-green-dark);
}

/* Purple theme for AI-enhanced */
.query-interpretation.ai-enhanced .interpretation-label {
  color: #553c9a;
}

.confidence-indicator {
  display: flex;
  align-items: center;
}

.confidence-score {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--border-radius-small);
  text-transform: uppercase;
}

.confidence-score.confidence-high {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}

.confidence-score.confidence-medium {
  background: rgba(245, 124, 0, 0.1);
  color: #f57c00;
}

.confidence-score.confidence-low {
  background: rgba(211, 47, 47, 0.1);
  color: #d32f2f;
}

.interpretation-text {
  flex: 1;
  line-height: 1.4;
}

/* Green theme for natural language */
.query-interpretation.natural-language .interpretation-text {
  color: var(--primary-green-dark);
}

/* Purple theme for AI-enhanced */
.query-interpretation.ai-enhanced .interpretation-text {
  color: #553c9a;
}

.ai-suggestions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
}

/* Green theme border for natural language */
.query-interpretation.natural-language .ai-suggestions {
  border-top: 1px solid rgba(var(--primary-green-rgb), 0.3);
}

/* Purple theme border for AI-enhanced */
.query-interpretation.ai-enhanced .ai-suggestions {
  border-top: 1px solid rgba(107, 70, 193, 0.3);
}

.suggestions-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--monday-medium);
  text-transform: uppercase;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.suggestion-chip {
  background: var(--monday-white);
  border: 1px solid var(--primary-green);
  color: var(--primary-green);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-large);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  background: var(--primary-green);
  color: var(--monday-white);
  transform: translateY(-1px);
}

.clear-query-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--monday-light);
  border-radius: 50%;
  color: var(--primary-green-dark);
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-query-btn:hover {
  background: var(--primary-green);
  color: white;
  box-shadow: var(--shadow-small);
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
  justify-content: flex-end;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--monday-light);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.clear-filters-btn:hover {
  background: #6b46c1;
  color: white;
  border-color: #553c9a;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.results-count {
  font-size: 14px;
  color: var(--monday-medium);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--monday-very-light);
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
}

.activity-item:hover {
  box-shadow: var(--shadow-small);
  transform: translateX(2px);
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  cursor: pointer;
  flex: 1;
}

.activity-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--monday-dark);
}

.activity-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  justify-content: flex-end;
}

/* Activity Financial Stats */
.activity-financial-stats {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.activity-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: var(--spacing-xs);
}

.activity-stat-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--monday-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
  line-height: 1;
}

.activity-stat-value {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-green);
  line-height: 1;
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

.activity-edit-btn {
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.activity-edit-btn:hover {
  background: var(--primary-green-hover);
  transform: scale(1.05);
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

.form-grid.single-col {
  grid-template-columns: 1fr;
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

  .header-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .header-right {
    justify-content: flex-start;
  }

  .financial-stats {
    grid-template-columns: 1fr 1fr;
    max-width: 100%;
  }

  .project-widgets {
    flex-direction: column;
  }
  
  .widget-column {
    flex: 1;
    min-width: 200px;
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

  .stat-item {
    padding: var(--spacing-sm);
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-value {
    font-size: 14px;
  }

  .tab-navigation {
    padding: 0 var(--spacing-md);
  }

  .tab {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 13px;
    min-width: max-content;
  }

  .activity-financial-stats {
    display: none;
  }

  .activity-actions {
    gap: var(--spacing-sm);
  }

  .activities-header {
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
}

@media (max-width: 1024px) {
  .form-grid.four-col {
    grid-template-columns: repeat(2, 1fr);
  }

  .activity-financial-stats {
    gap: var(--spacing-xs);
  }

  .activity-stat-item {
    min-width: 50px;
    padding: 2px;
  }

  .activity-stat-label {
    font-size: 8px;
  }

  .activity-stat-value {
    font-size: 10px;
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

/* Consistent editable field styling */
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
</style>