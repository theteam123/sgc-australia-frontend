<template>
  <div class="container">
    <!-- Header -->
    <div class="document-header">
      <div class="breadcrumb">
        <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
        <span class="breadcrumb-separator">›</span>
        <router-link :to="`/projects/${projectId}`" class="breadcrumb-link">{{ projectName }}</router-link>
        <span class="breadcrumb-separator">›</span>
        <span>Purchase Invoices</span>
      </div>
      
      <div class="header-section">
        <div class="header-title-section">
          <h1 class="page-title">Purchase Invoices</h1>
          <p class="page-subtitle">Manage purchase invoices for {{ projectName }}</p>
        </div>
        <div class="header-actions">
          <button 
            @click="createNewPurchaseInvoice"
            class="btn-primary"
            :disabled="loading"
          >
            <FilePlusIcon class="w-5 h-5 mr-2" />
            New Purchase Invoice
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
      <span>Loading purchase invoices...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <AlertCircleIcon class="w-8 h-8 text-red-500" />
      <span>{{ error }}</span>
      <button @click="refreshData" class="btn-secondary mt-4">Try Again</button>
    </div>

    <!-- Purchase Invoices Content -->
    <div v-else class="documents-section">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon bg-red-100 text-red-600">
            <ReceiptIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ purchaseInvoices.length }}</div>
            <div class="summary-label">Total Invoices</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-green-100 text-green-600">
            <CheckCircleIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ submittedInvoices }}</div>
            <div class="summary-label">Submitted</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-yellow-100 text-yellow-600">
            <ClockIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ draftInvoices }}</div>
            <div class="summary-label">Draft</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-purple-100 text-purple-600">
            <DollarSignIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ formatCurrency(totalValue) }}</div>
            <div class="summary-label">Total Value</div>
          </div>
        </div>
      </div>

      <!-- Purchase Invoices List -->
      <div class="documents-list" v-if="purchaseInvoices.length > 0">
        <div class="list-header">
          <h3 class="list-title">Purchase Invoices</h3>
          <div class="list-controls">
            <div class="search-box">
              <SearchIcon class="w-5 h-5 text-gray-400" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search purchase invoices..."
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
                <th>Invoice ID</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Division</th>
                <th>Customer PO</th>
                <th>Grand Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in filteredPurchaseInvoices" :key="invoice.name" class="table-row">
                <td>
                  <div class="cell-content">
                    <span class="font-medium text-gray-900">{{ invoice.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="text-sm">{{ invoice.project }}</span>
                </td>
                <td>
                  <span class="font-medium">{{ invoice.customer }}</span>
                </td>
                <td>
                  <span class="text-sm">{{ invoice.division }}</span>
                </td>
                <td>
                  <span class="text-sm">{{ invoice.customer_purchase_order || 'N/A' }}</span>
                </td>
                <td>
                  <span class="font-medium">{{ formatCurrency(invoice.grand_total || 0) }}</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button 
                      @click="viewPurchaseInvoice(invoice)"
                      class="action-btn action-btn-view"
                      title="View Details"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="editPurchaseInvoice(invoice)"
                      class="action-btn action-btn-edit"
                      title="Edit"
                    >
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="downloadPDF(invoice)"
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
            v-for="invoice in filteredPurchaseInvoices" 
            :key="invoice.name" 
            class="mobile-card"
          >
            <div class="mobile-card-header">
              <div>
                <h4 class="mobile-card-title">{{ invoice.name }}</h4>
                <p class="mobile-card-subtitle">{{ invoice.customer }}</p>
              </div>
            </div>
            <div class="mobile-card-content">
              <div class="mobile-card-row">
                <span class="mobile-card-label">Project:</span>
                <span>{{ invoice.project }}</span>
              </div>
              <div class="mobile-card-row">
                <span class="mobile-card-label">Division:</span>
                <span>{{ invoice.division }}</span>
              </div>
              <div class="mobile-card-row">
                <span class="mobile-card-label">Customer PO:</span>
                <span>{{ invoice.customer_purchase_order || 'N/A' }}</span>
              </div>
              <div class="mobile-card-row">
                <span class="mobile-card-label">Total:</span>
                <span class="font-medium">{{ formatCurrency(invoice.grand_total || 0) }}</span>
              </div>
            </div>
            <div class="mobile-card-actions">
              <button 
                @click="viewPurchaseInvoice(invoice)"
                class="mobile-action-btn"
              >
                <EyeIcon class="w-4 h-4 mr-1" />
                View
              </button>
              <button 
                @click="editPurchaseInvoice(invoice)"
                class="mobile-action-btn"
              >
                <EditIcon class="w-4 h-4 mr-1" />
                Edit
              </button>
              <button 
                @click="downloadPDF(invoice)"
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
        <ReceiptIcon class="w-16 h-16 text-gray-300" />
        <h3 class="empty-title">No Purchase Invoices Found</h3>
        <p class="empty-description">
          No purchase invoices have been created for this project yet.
        </p>
        <button 
          @click="createNewPurchaseInvoice"
          class="btn-primary"
        >
          <FilePlusIcon class="w-5 h-5 mr-2" />
          Create First Purchase Invoice
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
  ReceiptIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  DownloadIcon
} from 'lucide-vue-next';
import { getProjectDocuments, createPurchaseInvoice } from '../services/documents';
import { getProject } from '../services/projects';
import { getDomainConfig } from '../config/domains';

// Types
interface PurchaseInvoice {
  name: string;
  project: string;
  customer: string;
  division: string;
  customer_purchase_order?: string;
  customer_purchase_order_date?: string;
  total_amount: number;
  total_taxes: number;
  grand_total: number;
  items?: any[];
  [key: string]: any;
}

// Route and router
const route = useRoute();
const router = useRouter();

// Reactive data
const purchaseInvoices = ref<PurchaseInvoice[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const projectId = ref('');
const projectName = ref('');
const projectData = ref<any>({});
const searchQuery = ref('');

// Computed properties
const filteredPurchaseInvoices = computed(() => {
  let filtered = purchaseInvoices.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(invoice => 
      invoice.name.toLowerCase().includes(query) ||
      invoice.customer.toLowerCase().includes(query) ||
      invoice.project.toLowerCase().includes(query) ||
      (invoice.customer_purchase_order && invoice.customer_purchase_order.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

const submittedInvoices = computed(() => 
  purchaseInvoices.value.filter(invoice => invoice.docstatus === 1).length
);

const draftInvoices = computed(() => 
  purchaseInvoices.value.filter(invoice => invoice.docstatus === 0).length
);

const totalValue = computed(() => 
  purchaseInvoices.value.reduce((sum, invoice) => sum + (invoice.grand_total || 0), 0)
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

const loadPurchaseInvoices = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await loadProject();
    
    if (projectData.value.name) {
      const invoices = await getProjectDocuments('Purchase Invoice', projectData.value.name);
      purchaseInvoices.value = invoices || [];
    }
  } catch (err: any) {
    console.error('Error loading purchase invoices:', err);
    error.value = err.message || 'Failed to load purchase invoices';
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadPurchaseInvoices();
};

const createNewPurchaseInvoice = () => {
  // Generate a unique form ID based on project data
  const formId = `${projectData.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  // Navigate to Vue frontend form
  router.push(`/purchase-invoice/new-purchase-invoice-${formId}?project=${encodeURIComponent(projectData.value.name)}&projectId=${encodeURIComponent(projectId.value)}`);
};

const viewPurchaseInvoice = (invoice: PurchaseInvoice) => {
  // Navigate to ERPNext document view
  const baseUrl = getErpNextUrl();
  window.location.href = `${baseUrl}/app/purchase-invoice/${invoice.name}`;
};

const editPurchaseInvoice = (invoice: PurchaseInvoice) => {
  // Navigate to ERPNext document edit
  const baseUrl = getErpNextUrl();
  window.location.href = `${baseUrl}/app/purchase-invoice/${invoice.name}`;
};

const downloadPDF = (invoice: PurchaseInvoice) => {
  // Navigate to ERPNext PDF download
  const baseUrl = getErpNextUrl();
  window.open(`${baseUrl}/app/purchase-invoice/${invoice.name}/print`, '_blank');
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Lifecycle
onMounted(() => {
  loadPurchaseInvoices();
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
