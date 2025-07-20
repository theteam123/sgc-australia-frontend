<template>
  <div class="monday-layout">
    <!-- Header Section -->
    <div class="monday-main-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-r from-primary-green to-accent-green rounded-xl">
            <PlusIcon class="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 class="text-h1 mb-1">New Project</h1>
            <p class="text-body text-monday-medium">Create a new project with all necessary details</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn-monday btn-secondary" @click="goBack">
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Back to Projects
          </button>
          <button class="btn-monday btn-primary" @click="saveProject" :disabled="!isValid">
            <SaveIcon class="w-4 h-4 mr-2" />
            Save Project
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="monday-main-content">
      <div class="monday-card">
        <div class="monday-card-body">
          <!-- Tab Navigation -->
          <div class="tab-container">
            <nav class="tab-nav">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['tab-btn', { 'active': activeTab === tab.id }]"
              >
                {{ tab.name }}
              </button>
            </nav>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Project Details Tab -->
              <div v-if="activeTab === 'details'" class="form-section">
                <h3 class="section-title">Project Details</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Project Name *</label>
                    <input 
                      type="text" 
                      v-model="projectData.project_name" 
                      class="form-control"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Site</label>
                    <input 
                      type="text" 
                      v-model="projectData.site" 
                      class="form-control"
                      placeholder="Enter site location"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Scope of Work</label>
                  <textarea 
                    v-model="projectData.custom_scope_of_work" 
                    class="form-control"
                    rows="6"
                    placeholder="Describe the scope of work in detail..."
                  ></textarea>
                </div>
              </div>

              <!-- Classification Tab -->
              <div v-if="activeTab === 'classification'" class="form-section">
                <h3 class="section-title">Project Classification</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Division</label>
                    <select v-model="projectData.division" class="form-control">
                      <option value="">Select Division</option>
                      <option v-for="option in divisionOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Project Type</label>
                    <select v-model="projectData.project_type" class="form-control">
                      <option value="">Select Project Type</option>
                      <option v-for="option in projectTypeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Work Type</label>
                    <select v-model="projectData.work_type" class="form-control">
                      <option value="">Select Work Type</option>
                      <option v-for="option in workTypeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Industry Sector</label>
                    <select v-model="projectData.industry_sector" class="form-control">
                      <option value="">Select Industry Sector</option>
                      <option v-for="option in industrySectorOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Timeline Tab -->
              <div v-if="activeTab === 'timeline'" class="form-section">
                <h3 class="section-title">Project Timeline</h3>
                
                <!-- Estimate Timeline -->
                <div class="subsection">
                  <h4 class="subsection-title">Estimate Timeline</h4>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Opening Date</label>
                      <input 
                        type="date" 
                        v-model="projectData.estimate_opening_date" 
                        class="form-control"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Closing Date</label>
                      <input 
                        type="date" 
                        v-model="projectData.estimate_closing_date" 
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <!-- Project Timeline -->
                <div class="subsection">
                  <h4 class="subsection-title">Project Timeline</h4>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Award Date</label>
                      <input 
                        type="date" 
                        v-model="projectData.award_date" 
                        class="form-control"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Start Date</label>
                      <input 
                        type="date" 
                        v-model="projectData.project_start_date" 
                        class="form-control"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">End Date</label>
                      <input 
                        type="date" 
                        v-model="projectData.project_end_date" 
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Client Tab -->
              <div v-if="activeTab === 'client'" class="form-section">
                <h3 class="section-title">Client Details</h3>
                
                <!-- Organisation -->
                <div class="form-group">
                  <label class="form-label">Organisation *</label>
                  <select v-model="projectData.organisation" class="form-control" required>
                    <option value="">Select Organisation</option>
                    <option v-for="option in organisationOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <!-- Contact Details Table -->
                <div class="subsection">
                  <h4 class="subsection-title">Contact Details</h4>
                  <div class="contact-table">
                    <table class="w-full">
                      <thead>
                        <tr>
                          <th>Contact Type</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(contact, index) in projectData.contacts" :key="index" class="contact-row">
                          <td>
                            <select v-model="contact.type" class="form-control-small">
                              <option value="Primary">Primary</option>
                              <option value="Secondary">Secondary</option>
                              <option value="Technical">Technical</option>
                            </select>
                          </td>
                          <td>
                            <input type="text" v-model="contact.name" class="form-control-small" placeholder="Contact name" />
                          </td>
                          <td>
                            <input type="email" v-model="contact.email" class="form-control-small" placeholder="Email" />
                          </td>
                          <td>
                            <input type="tel" v-model="contact.phone" class="form-control-small" placeholder="Phone" />
                          </td>
                          <td>
                            <button @click="removeContact(index)" class="btn-danger-small">
                              <TrashIcon class="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button @click="addContact" class="btn-secondary mt-4">
                      <PlusIcon class="w-4 h-4 mr-2" />
                      Add Contact
                    </button>
                  </div>
                </div>
              </div>

              <!-- Value Analysis Tab -->
              <div v-if="activeTab === 'value'" class="form-section">
                <h3 class="section-title">Value Analysis</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Reputation</label>
                    <select v-model="projectData.reputation" class="form-control">
                      <option value="">Select Reputation Value</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Relationship</label>
                    <select v-model="projectData.relationship" class="form-control">
                      <option value="">Select Relationship Value</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Client Positioning</label>
                    <select v-model="projectData.client_positioning" class="form-control">
                      <option value="">Select Client Positioning</option>
                      <option value="Strategic">Strategic</option>
                      <option value="Important">Important</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Financial Tab -->
              <div v-if="activeTab === 'financial'" class="form-section">
                <h3 class="section-title">Estimate Risk & Financial</h3>
                
                <!-- Estimate Risk -->
                <div class="subsection">
                  <h4 class="subsection-title">Estimate Risk</h4>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Estimate Type</label>
                      <select v-model="projectData.estimate_type" class="form-control">
                        <option value="">Select Estimate Type</option>
                        <option value="Detailed">Detailed</option>
                        <option value="Preliminary">Preliminary</option>
                        <option value="Conceptual">Conceptual</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Project Value</label>
                      <input 
                        type="number" 
                        v-model="projectData.project_value" 
                        class="form-control"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Competitive Landscape</label>
                      <select v-model="projectData.competitive_landscape" class="form-control">
                        <option value="">Select Competitive Level</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Probability (%)</label>
                      <input 
                        type="number" 
                        v-model="projectData.probability" 
                        class="form-control"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                <!-- Delivery Timeframe -->
                <div class="subsection">
                  <h4 class="subsection-title">Delivery Timeframe</h4>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Tender Timeframe</label>
                      <input 
                        type="text" 
                        v-model="projectData.tender_timeframe" 
                        class="form-control"
                        placeholder="e.g., 2 weeks"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Project Timeframe</label>
                      <input 
                        type="text" 
                        v-model="projectData.project_timeframe" 
                        class="form-control"
                        placeholder="e.g., 6 months"
                      />
                    </div>
                  </div>
                </div>

                <!-- PVA Score -->
                <div class="subsection">
                  <h4 class="subsection-title">Score</h4>
                  <div class="form-group">
                    <label class="form-label">PVA Score</label>
                    <input 
                      type="number" 
                      v-model="projectData.pva_score" 
                      class="form-control"
                      placeholder="0"
                      step="0.1"
                    />
                  </div>
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
import { useRouter } from 'vue-router';
import {
  PlusIcon,
  ArrowLeftIcon,
  SaveIcon,
  TrashIcon
} from 'lucide-vue-next';
import { getDropdownOptions, createProject } from '../services/projects';

const router = useRouter();

// Tab management
const activeTab = ref('details');
const tabs = [
  { id: 'details', name: 'Project Details' },
  { id: 'classification', name: 'Classification' },
  { id: 'timeline', name: 'Timeline' },
  { id: 'client', name: 'Client Details' },
  { id: 'value', name: 'Value Analysis' },
  { id: 'financial', name: 'Financial' }
];

// Form data
const projectData = ref({
  project_name: '',
  site: '',
  custom_scope_of_work: '',
  division: '',
  project_type: '',
  work_type: '',
  industry_sector: '',
  estimate_opening_date: '',
  estimate_closing_date: '',
  award_date: '',
  project_start_date: '',
  project_end_date: '',
  organisation: '',
  contacts: [
    { type: 'Primary', name: '', email: '', phone: '' }
  ],
  reputation: '',
  relationship: '',
  client_positioning: '',
  estimate_type: '',
  project_value: 0,
  competitive_landscape: '',
  probability: 0,
  tender_timeframe: '',
  project_timeframe: '',
  pva_score: 0
});

// Dropdown options
const divisionOptions = ref([]);
const projectTypeOptions = ref([]);
const workTypeOptions = ref([]);
const industrySectorOptions = ref([]);
const organisationOptions = ref([]);

// Computed properties
const isValid = computed(() => {
  return projectData.value.project_name.trim() !== '' && 
         projectData.value.organisation !== '';
});

// Methods
const loadDropdownOptions = async () => {
  try {
    const [divisions, projectTypes, workTypes, sectors, organisations] = await Promise.all([
      getDropdownOptions('Division'),
      getDropdownOptions('Project Type'),
      getDropdownOptions('Work Type'),
      getDropdownOptions('Industry Sector'),
      getDropdownOptions('Organisation')
    ]);
    
    divisionOptions.value = divisions;
    projectTypeOptions.value = projectTypes;
    workTypeOptions.value = workTypes;
    industrySectorOptions.value = sectors;
    organisationOptions.value = organisations;
  } catch (error) {
    console.error('Error loading dropdown options:', error);
  }
};

const addContact = () => {
  projectData.value.contacts.push({
    type: 'Secondary',
    name: '',
    email: '',
    phone: ''
  });
};

const removeContact = (index: number) => {
  if (projectData.value.contacts.length > 1) {
    projectData.value.contacts.splice(index, 1);
  }
};

const saveProject = async () => {
  if (!isValid.value) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    // Generate project code
    const timestamp = Date.now().toString().slice(-6);
    const code = `PRJ-${timestamp}`;
    
    const projectPayload = {
      ...projectData.value,
      project_code: code,
      status: 'Planning'
    };

    await createProject(projectPayload);
    alert('Project created successfully!');
    router.push('/projects');
  } catch (error) {
    console.error('Error creating project:', error);
    alert('Error creating project. Please try again.');
  }
};

const goBack = () => {
  router.push('/projects');
};

// Lifecycle
onMounted(() => {
  loadDropdownOptions();
});
</script>

<style scoped>
@import '../styles/monday-design-system.css';

.monday-main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Tab Navigation */
.tab-container {
  width: 100%;
}

.tab-nav {
  display: flex;
  border-bottom: 2px solid var(--monday-very-light);
  margin-bottom: 2rem;
  overflow-x: auto;
}

.tab-btn {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: var(--monday-medium);
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--monday-dark);
  background: var(--monday-background);
}

.tab-btn.active {
  color: var(--primary-green);
  border-bottom-color: var(--primary-green);
  background: var(--monday-background);
}

/* Form Sections */
.form-section {
  max-width: 1000px;
  margin: 0 auto;
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--monday-very-light);
}

.subsection {
  margin-bottom: 2rem;
}

.subsection-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--monday-medium-dark);
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--monday-medium-dark);
  font-size: var(--text-sm);
}

.form-control {
  padding: 0.75rem;
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  font-size: var(--text-base);
  background: var(--monday-white);
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(63, 217, 33, 0.1);
}

.form-control-small {
  padding: 0.5rem;
  border: 1px solid var(--monday-light);
  border-radius: 4px;
  font-size: var(--text-sm);
  background: var(--monday-white);
}

/* Contact Table */
.contact-table {
  background: var(--monday-background);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--monday-light);
}

.contact-table table {
  border-collapse: collapse;
}

.contact-table th {
  background: var(--monday-very-light);
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--monday-medium-dark);
  border-bottom: 1px solid var(--monday-light);
}

.contact-table td {
  padding: 0.5rem;
  border-bottom: 1px solid var(--monday-very-light);
}

.contact-row:last-child td {
  border-bottom: none;
}

.btn-danger-small {
  background: var(--monday-red);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-danger-small:hover {
  background: var(--monday-red-hover);
}

.btn-secondary {
  background: var(--monday-background);
  color: var(--monday-medium-dark);
  border: 1px solid var(--monday-light);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--monday-very-light);
  border-color: var(--monday-medium);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .tab-nav {
    gap: 0;
  }
  
  .tab-btn {
    padding: 0.75rem 1rem;
    font-size: var(--text-sm);
  }
  
  .contact-table {
    overflow-x: auto;
  }
}
</style>