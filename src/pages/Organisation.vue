<template>
  <div class="container">
    <!-- Header -->
    <div class="organisation-header">
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
        <span>{{ organisation.customer_name || 'Organisation' }}</span>
      </div>
      
      <div class="header-content">
        <div class="header-left">
          <h1 class="organisation-title">{{ organisation.customer_name || 'Organisation Details' }}</h1>
        </div>
        
        <div class="header-right">
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
                @click="saveOrganisation"
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
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading organisation details...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="loadOrganisation" class="retry-btn">Retry</button>
    </div>

    <!-- Organisation Details -->
    <div v-if="!loading && !error" class="organisation-details">
      <!-- Organisation Details Section -->
      <div class="details-section">
        <div class="section-header">
          <h3 class="section-title">Organisation Details</h3>
        </div>
        
        <div class="form-grid single-col">
          <div class="form-field">
            <label class="form-label">Organisation Name <span class="required">*</span></label>
            <div v-if="isEditing" class="control-input">
              <input 
                v-model="organisation.customer_name" 
                type="text" 
                class="input-with-feedback form-control"
                autocomplete="off"
                data-fieldtype="Data"
                data-fieldname="customer_name"
                data-doctype="Organisation"
              >
            </div>
            <input 
              v-else 
              type="text" 
              class="form-input" 
              :value="organisation.customer_name || ''" 
              readonly
            >
          </div>
        </div>
      </div>

      <!-- Contact Details Section -->
      <div class="details-section">
        <h4 class="subsection-title">Contact Details</h4>
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">Email Address</label>
            <div v-if="isEditing" class="control-input">
              <input 
                v-model="organisation.email_address" 
                type="email" 
                class="form-control"
                data-fieldtype="Data"
                data-fieldname="email_address"
                data-doctype="Organisation"
              >
            </div>
            <input 
              v-else 
              type="email" 
              class="form-input" 
              :value="organisation.email_address || ''" 
              readonly
            >
          </div>
          <div class="form-field">
            <label class="form-label">Phone Number</label>
            <div v-if="isEditing" class="control-input">
              <input 
                v-model="organisation.phone_number" 
                type="tel" 
                class="form-control"
                data-fieldtype="Data"
                data-fieldname="phone_number"
                data-doctype="Organisation"
              >
            </div>
            <input 
              v-else 
              type="tel" 
              class="form-input" 
              :value="organisation.phone_number || ''" 
              readonly
            >
          </div>
        </div>
      </div>

      <!-- Addresses Section -->
      <div class="details-section">
        <h4 class="subsection-title">Addresses</h4>
        
        <div class="address-grid">
          <!-- Billing Address -->
          <div class="address-column">
            <h5 class="address-title">Billing Address</h5>
            <div class="form-grid single-col">
              <div class="form-field">
                <label class="form-label">Address Line 1</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.billing_address_line_one" 
                    type="text" 
                    class="form-control"
                    data-fieldtype="Data"
                    data-fieldname="billing_address_line_one"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.billing_address_line_one || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">Address Line 2</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.billing_address_line_two" 
                    type="text" 
                    class="form-control"
                    data-fieldtype="Data"
                    data-fieldname="billing_address_line_two"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.billing_address_line_two || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">City</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.billing_city" 
                    type="text" 
                    class="form-control"
                    data-fieldtype="Data"
                    data-fieldname="billing_city"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.billing_city || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">Postcode</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.billing_postcode" 
                    type="number" 
                    class="form-control"
                    data-fieldtype="Int"
                    data-fieldname="billing_postcode"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.billing_postcode || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">State</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.billing_state" 
                    type="text" 
                    class="form-control"
                    data-fieldtype="Data"
                    data-fieldname="billing_state"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.billing_state || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">Country</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.billing_country" 
                    type="text" 
                    class="form-control"
                    data-fieldtype="Link"
                    data-fieldname="billing_country"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.billing_country || ''" 
                  readonly
                >
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="address-column">
            <h5 class="address-title">Shipping Address</h5>
            <div class="form-field checkbox-field">
              <label class="checkbox-label">
                <input 
                  v-if="isEditing"
                  v-model="organisation.same_as_billing_address" 
                  type="checkbox" 
                  class="checkbox-input"
                  @change="copyBillingToShipping"
                >
                <input 
                  v-else
                  type="checkbox" 
                  class="checkbox-input"
                  :checked="organisation.same_as_billing_address"
                  disabled
                >
                <span class="checkbox-text">Same as Billing Address</span>
              </label>
            </div>
            <div class="form-grid single-col">
              <div class="form-field">
                <label class="form-label">Address Line 1</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.shipping_address_line_one" 
                    type="text" 
                    class="form-control"
                    :disabled="organisation.same_as_billing_address"
                    data-fieldtype="Data"
                    data-fieldname="shipping_address_line_one"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.shipping_address_line_one || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">Address Line 2</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.shipping_address_line_two" 
                    type="text" 
                    class="form-control"
                    :disabled="organisation.same_as_billing_address"
                    data-fieldtype="Data"
                    data-fieldname="shipping_address_line_two"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.shipping_address_line_two || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">City</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.shipping_city" 
                    type="text" 
                    class="form-control"
                    :disabled="organisation.same_as_billing_address"
                    data-fieldtype="Data"
                    data-fieldname="shipping_city"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.shipping_city || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">Postcode</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.shipping_postcode" 
                    type="number" 
                    class="form-control"
                    :disabled="organisation.same_as_billing_address"
                    data-fieldtype="Int"
                    data-fieldname="shipping_postcode"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.shipping_postcode || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">State</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.shipping_state" 
                    type="text" 
                    class="form-control"
                    :disabled="organisation.same_as_billing_address"
                    data-fieldtype="Data"
                    data-fieldname="shipping_state"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.shipping_state || ''" 
                  readonly
                >
              </div>
              <div class="form-field">
                <label class="form-label">Country</label>
                <div v-if="isEditing" class="control-input">
                  <input 
                    v-model="organisation.shipping_country" 
                    type="text" 
                    class="form-control"
                    :disabled="organisation.same_as_billing_address"
                    data-fieldtype="Link"
                    data-fieldname="shipping_country"
                    data-doctype="Organisation"
                  >
                </div>
                <input 
                  v-else 
                  type="text" 
                  class="form-input" 
                  :value="organisation.shipping_country || ''" 
                  readonly
                >
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
import { getOrganisation, updateOrganisation, getOrganisationPermissions } from '../services/organisations';

// Types
interface Organisation {
  name?: string;
  customer_name?: string;
  email_address?: string;
  phone_number?: string;
  billing_address_line_one?: string;
  billing_address_line_two?: string;
  billing_city?: string;
  billing_postcode?: number;
  billing_state?: string;
  billing_country?: string;
  shipping_address_line_one?: string;
  shipping_address_line_two?: string;
  shipping_city?: string;
  shipping_postcode?: number;
  shipping_state?: string;
  shipping_country?: string;
  same_as_billing_address?: boolean;
}

// Route and router
const route = useRoute();
const router = useRouter();

// Reactive data
const organisation = ref<Organisation>({});
const originalOrganisation = ref<Organisation>({});
const loading = ref(false);
const error = ref<string | null>(null);
const isEditing = ref(false);
const isSaving = ref(false);
const permissions = ref<any>({});

// Navigation context from query parameters
const fromProjectId = ref<string | null>(null);
const fromProjectName = ref<string | null>(null);
const fromProjectCode = ref<string | null>(null);

// Methods
const loadOrganisation = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const organisationId = route.params.id as string;
    
    // Load organisation data and permissions in parallel
    const [organisationData, organisationPermissions] = await Promise.all([
      getOrganisation(organisationId),
      getOrganisationPermissions(organisationId)
    ]);
    
    organisation.value = organisationData || {};
    originalOrganisation.value = { ...organisation.value };
    permissions.value = organisationPermissions;
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load organisation';
    console.error('Error loading organisation:', err);
  } finally {
    loading.value = false;
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  organisation.value = { ...originalOrganisation.value };
};

const copyBillingToShipping = () => {
  if (organisation.value.same_as_billing_address) {
    organisation.value.shipping_address_line_one = organisation.value.billing_address_line_one;
    organisation.value.shipping_address_line_two = organisation.value.billing_address_line_two;
    organisation.value.shipping_city = organisation.value.billing_city;
    organisation.value.shipping_postcode = organisation.value.billing_postcode;
    organisation.value.shipping_state = organisation.value.billing_state;
    organisation.value.shipping_country = organisation.value.billing_country;
  }
};

const saveOrganisation = async () => {
  if (!permissions.value.write) {
    alert('You do not have permission to edit this organisation');
    return;
  }

  try {
    isSaving.value = true;
    
    // Copy billing to shipping if checkbox is checked
    if (organisation.value.same_as_billing_address) {
      copyBillingToShipping();
    }
    
    await updateOrganisation(organisation.value.name!, organisation.value);
    
    // Reload the organisation to get updated data
    await loadOrganisation();
    
    isEditing.value = false;
    alert('Organisation updated successfully!');
    
  } catch (error: any) {
    console.error('Error saving organisation:', error);
    alert(`Error saving organisation: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Extract navigation context from query parameters
  fromProjectId.value = route.query.fromProject as string || null;
  fromProjectName.value = route.query.fromProjectName as string || null;
  fromProjectCode.value = route.query.fromProjectCode as string || null;
  
  loadOrganisation();
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
.organisation-header {
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

.organisation-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

/* Edit Controls */
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

/* Details Sections */
.details-section {
  background: var(--monday-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--monday-dark);
  margin: var(--spacing-xl) 0 var(--spacing-lg) 0;
}

.address-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: var(--spacing-md);
}

/* Form Layouts */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-grid.single-col {
  grid-template-columns: 1fr;
}

.address-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.address-column {
  display: flex;
  flex-direction: column;
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

.form-control:disabled {
  background: var(--monday-very-light);
  color: var(--monday-medium);
  cursor: not-allowed;
}

/* Checkbox Field */
.checkbox-field {
  margin-bottom: var(--spacing-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: 14px;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-text {
  color: var(--monday-dark);
  font-weight: 500;
}

.required {
  color: var(--monday-red);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .address-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>