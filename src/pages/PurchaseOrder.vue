<template>
  <div class="container">
    <!-- Header -->
    <div class="document-header">
      <div class="breadcrumb">
        <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
        <span class="breadcrumb-separator">›</span>
        <router-link :to="`/projects/${projectId}`" class="breadcrumb-link">{{ projectName }}</router-link>
        <span class="breadcrumb-separator">›</span>
        <span>Purchase Orders</span>
      </div>
      
      <div class="header-section">
        <div class="header-title-section">
          <h1 class="page-title">Purchase Orders</h1>
          <p class="page-subtitle">Manage purchase orders for {{ projectName }}</p>
        </div>
        <div class="header-actions">
          <button 
            @click="createNewPurchaseOrder"
            class="btn-primary"
            :disabled="loading"
          >
            <FilePlusIcon class="w-5 h-5 mr-2" />
            New Purchase Order
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
      <span>Loading purchase orders...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <AlertCircleIcon class="w-8 h-8 text-red-500" />
      <span>{{ error }}</span>
      <button @click="refreshData" class="btn-secondary mt-4">Try Again</button>
    </div>

    <!-- Purchase Orders Content -->
    <div v-else class="documents-section">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon bg-orange-100 text-orange-600">
            <ShoppingCartIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ purchaseOrders.length }}</div>
            <div class="summary-label">Total Orders</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-green-100 text-green-600">
            <CheckCircleIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ submittedOrders }}</div>
            <div class="summary-label">Submitted</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon bg-yellow-100 text-yellow-600">
            <ClockIcon class="w-6 h-6" />
          </div>
          <div class="summary-content">
            <div class="summary-number">{{ draftOrders }}</div>
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

      <!-- Purchase Orders List -->
      <div class="documents-list" v-if="purchaseOrders.length > 0">
        <div class="list-header">
          <h3 class="list-title">Purchase Orders</h3>
          <div class="list-controls">
            <div class="search-box">
              <SearchIcon class="w-5 h-5 text-gray-400" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search purchase orders..."
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
                <th>Order ID</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Division</th>
                <th>Payment Due</th>
                <th>Grand Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredPurchaseOrders" :key="order.name" class="table-row">
                <td>
                  <div class="cell-content">
                    <span class="font-medium text-gray-900">{{ order.name }}</span>
                    <span v-if="order.title" class="text-sm text-gray-500">{{ order.title }}</span>
                  </div>
                </td>
                <td>
                  <span class="text-sm">{{ order.project }}</span>
                </td>
                <td>
                  <span class="font-medium">{{ order.customer }}</span>
                </td>
                <td>
                  <span class="text-sm">{{ order.division }}</span>
                </td>
                <td>
                  <span class="text-sm">{{ formatDate(order.payment_due_date || '') }}</span>
                </td>
                <td>
                  <span class="font-medium">{{ formatCurrency(order.grand_total || 0) }}</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button 
                      @click="viewPurchaseOrder(order)"
                      class="action-btn action-btn-view"
                      title="View Details"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="editPurchaseOrder(order)"
                      class="action-btn action-btn-edit"
                      title="Edit"
                    >
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="downloadPDF(order)"
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
            v-for="order in filteredPurchaseOrders" 
            :key="order.name" 
            class="mobile-card"
          >
            <div class="mobile-card-header">
              <div>
                <h4 class="mobile-card-title">{{ order.name }}</h4>
                <p class="mobile-card-subtitle">{{ order.customer }}</p>
              </div>
            </div>
            <div class="mobile-card-content">
              <div class="mobile-card-row">
                <span class="mobile-card-label">Project:</span>
                <span>{{ order.project }}</span>
              </div>
              <div class="mobile-card-row">
                <span class="mobile-card-label">Division:</span>
                <span>{{ order.division }}</span>
              </div>
              <div class="mobile-card-row">
                <span class="mobile-card-label">Total:</span>
                <span class="font-medium">{{ formatCurrency(order.grand_total || 0) }}</span>
              </div>
              <div class="mobile-card-row">
                <span class="mobile-card-label">Due Date:</span>
                <span>{{ formatDate(order.payment_due_date || '') }}</span>
              </div>
            </div>
            <div class="mobile-card-actions">
              <button 
                @click="viewPurchaseOrder(order)"
                class="mobile-action-btn"
              >
                <EyeIcon class="w-4 h-4 mr-1" />
                View
              </button>
              <button 
                @click="editPurchaseOrder(order)"
                class="mobile-action-btn"
              >
                <EditIcon class="w-4 h-4 mr-1" />
                Edit
              </button>
              <button 
                @click="downloadPDF(order)"
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
        <ShoppingCartIcon class="w-16 h-16 text-gray-300" />
        <h3 class="empty-title">No Purchase Orders Found</h3>
        <p class="empty-description">
          No purchase orders have been created for this project yet.
        </p>
        <button 
          @click="createNewPurchaseOrder"
          class="btn-primary"
        >
          <FilePlusIcon class="w-5 h-5 mr-2" />
          Create First Purchase Order
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
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  DownloadIcon
} from 'lucide-vue-next';
import { getProjectDocuments, createPurchaseOrder } from '../services/documents';
import { getProject } from '../services/projects';
import { getDomainConfig } from '../config/domains';

// Types
interface PurchaseOrder {
  name: string;
  title?: string;
  project: string;
  customer: string;
  division: string;
  payment_due_date?: string;
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
const purchaseOrders = ref<PurchaseOrder[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const projectId = ref('');
const projectName = ref('');
const projectData = ref<any>({});
const searchQuery = ref('');

// Computed properties
const filteredPurchaseOrders = computed(() => {
  let filtered = purchaseOrders.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order => 
      order.name.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.project.toLowerCase().includes(query) ||
      (order.title && order.title.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

const submittedOrders = computed(() => 
  purchaseOrders.value.filter(order => order.docstatus === 1).length
);

const draftOrders = computed(() => 
  purchaseOrders.value.filter(order => order.docstatus === 0).length
);

const totalValue = computed(() => 
  purchaseOrders.value.reduce((sum, order) => sum + (order.grand_total || 0), 0)
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

const loadPurchaseOrders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await loadProject();
    
    if (projectData.value.name) {
      const orders = await getProjectDocuments('Purchase Order', projectData.value.name);
      purchaseOrders.value = orders || [];
    }
  } catch (err: any) {
    console.error('Error loading purchase orders:', err);
    error.value = err.message || 'Failed to load purchase orders';
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadPurchaseOrders();
};

const createNewPurchaseOrder = () => {
  // Generate a unique form ID based on project data
  const formId = `${projectData.value.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  // Navigate to Vue frontend form
  router.push(`/purchase-order/new-purchase-order-${formId}?project=${encodeURIComponent(projectData.value.name)}&projectId=${encodeURIComponent(projectId.value)}`);
};

const viewPurchaseOrder = (order: PurchaseOrder) => {
  // Navigate to ERPNext document view
  const baseUrl = getErpNextUrl();
  window.location.href = `${baseUrl}/app/purchase-order/${order.name}`;
};

const editPurchaseOrder = (order: PurchaseOrder) => {
  // Navigate to ERPNext document edit
  const baseUrl = getErpNextUrl();
  window.location.href = `${baseUrl}/app/purchase-order/${order.name}`;
};

const downloadPDF = (order: PurchaseOrder) => {
  // Navigate to ERPNext PDF download
  const baseUrl = getErpNextUrl();
  window.open(`${baseUrl}/app/purchase-order/${order.name}/print`, '_blank');
};

const formatDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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
  loadPurchaseOrders();
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
