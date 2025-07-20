<template>
  <div class="monday-layout">
    <!-- Modern Header Section -->
    <div class="monday-main-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-r from-primary-green to-accent-green rounded-xl">
            <FileIcon class="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 class="text-h1 mb-1">{{ pageTitle }}</h1>
            <p v-if="isTaktecPortal" class="text-body text-monday-medium">Viewing Taktec ERPNext Documents</p>
            <p v-else class="text-body text-monday-medium">Manage and organize your business documents</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="status-badge status-done">Live</span>
          <button class="btn-monday btn-primary" @click="showModal = true">
            <FilePlusIcon class="w-4 h-4 mr-2" />
            Create New
          </button>
        </div>
      </div>
    </div>
    
    <!-- Role Permissions Display -->
    <div class="mb-6 bg-white rounded-lg shadow p-4" style="display: none;">
      <button 
        @click="showPermissions = !showPermissions"
        class="flex items-center justify-between w-full"
      >
        <h2 class="text-lg font-semibold">DocTypes with Permissions:</h2>
        <span class="text-sm text-gray-500">
          {{ showPermissions ? 'Hide' : 'Show' }} Permissions
          <span class="ml-2 inline-block transition-transform" :class="{ 'rotate-180': showPermissions }">
            ▼
          </span>
        </span>
      </button>
      
      <div v-if="showPermissions" class="mt-4">
        <div v-if="docTypes.length > 0" class="overflow-auto max-h-60">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DocType</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Linked DocTypes</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="doctype in docTypes" :key="doctype.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ doctype.name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <span v-for="(value, perm) in doctype.permissions" :key="perm" 
                        :class="value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                        class="px-2 py-1 rounded-full text-xs font-medium mr-2">
                    {{ perm }}: {{ value ? '✓' : '✗' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <span v-for="linked in doctype.linked_doctypes" :key="linked" 
                        class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    {{ linked }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="loading" class="text-center py-4">
          <LoaderIcon class="w-6 h-6 animate-spin text-green-600 mx-auto" />
        </div>
        <div v-else class="text-center py-4 text-gray-500">
          No permissions data available
        </div>
      </div>
    </div>

    <!-- Modern Search and Controls -->
    <div class="monday-main-content">
      <div class="monday-card">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex-1 max-w-md">
            <div class="monday-search">
              <SearchIcon class="monday-search-icon" />
              <input
                type="text"
                id="doctype-search"
                v-model="searchQuery"
                placeholder="Search documents, types, or descriptions..."
                class="monday-search-input"
              />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 bg-monday-very-light rounded-lg p-1">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'btn-icon',
                  viewMode === 'grid' ? 'bg-primary-green text-white' : 'text-monday-medium hover:bg-monday-white'
                ]"
                title="Grid View"
              >
                <GridIcon class="w-4 h-4" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'btn-icon',
                  viewMode === 'list' ? 'bg-primary-green text-white' : 'text-monday-medium hover:bg-monday-white'
                ]"
                title="List View"
              >
                <ListIcon class="w-4 h-4" />
              </button>
            </div>
            <button class="btn-monday btn-secondary" @click="fetchDocTypes()">
              <span class="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="monday-card">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-monday-very-light rounded-lg p-4 text-center">
            <div class="text-h2 text-primary-green mb-1">{{ totalItems }}</div>
            <div class="text-small text-monday-medium">Total Documents</div>
          </div>
          <div class="bg-monday-very-light rounded-lg p-4 text-center">
            <div class="text-h2 text-accent-green mb-1">{{ docTypes.length }}</div>
            <div class="text-small text-monday-medium">Showing</div>
          </div>
          <div class="bg-monday-very-light rounded-lg p-4 text-center">
            <div class="text-h2 text-monday-orange mb-1">{{ docTypes.filter(d => d.permissions.create === 1).length }}</div>
            <div class="text-small text-monday-medium">Can Create</div>
          </div>
          <div class="bg-monday-very-light rounded-lg p-4 text-center">
            <div class="text-h2 text-secondary-green mb-1">{{ docTypes.filter(d => d.permissions.write === 1).length }}</div>
            <div class="text-small text-monday-medium">Can Edit</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="monday-card">
        <LoadingSpinner message="Loading documents..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="monday-card">
        <div class="flex items-center gap-3 p-4 bg-monday-red-light rounded-lg">
          <div class="w-8 h-8 bg-monday-red rounded-full flex items-center justify-center">
            <span class="text-white font-bold">!</span>
          </div>
          <div>
            <h3 class="text-h3 text-monday-red mb-1">Error Loading Documents</h3>
            <p class="text-body text-monday-medium-dark">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div v-else>
      <!-- Modern Grid View -->
      <div v-if="docTypes.length > 0 && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="doctype in docTypes"
          :key="doctype.id"
          class="monday-card monday-hover-lift group cursor-pointer"
          @click="viewDocuments(doctype)"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-3">
              <div class="p-3 bg-gradient-to-br from-primary-green to-accent-green rounded-xl">
                <FileIcon class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="text-h3 text-monday-dark mb-1">{{ doctype.name }}</h3>
                <p class="text-small text-monday-medium line-clamp-2">{{ doctype.description || 'No description available' }}</p>
              </div>
            </div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click.stop="router.push(`/documents/${doctype.id}/new`)"
                v-if="doctype.permissions.create === 1"
                class="btn-icon hover:bg-primary-green-light hover:text-primary-green"
                :title="`New ${doctype.name}`"
              >
                <FilePlusIcon class="w-4 h-4" />
              </button>
              <button
                @click.stop="viewDocuments(doctype)"
                class="btn-icon hover:bg-accent-green-light hover:text-accent-green"
                :title="`View ${doctype.name} submissions`"
              >
                <FileTextIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Module Badge -->
          <div class="mb-4">
            <span class="px-3 py-1 text-xs font-medium rounded-full bg-primary-green-light text-primary-green">
              {{ doctype.module }}
            </span>
          </div>

          <!-- Permissions Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', doctype.permissions.create === 1 ? 'bg-accent-green' : 'bg-monday-light']" />
              <span class="text-small text-monday-medium">Create</span>
            </div>
            <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', doctype.permissions.write === 1 ? 'bg-monday-orange' : 'bg-monday-light']" />
              <span class="text-small text-monday-medium">Edit</span>
            </div>
            <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', doctype.permissions.delete === 1 ? 'bg-monday-red' : 'bg-monday-light']" />
              <span class="text-small text-monday-medium">Delete</span>
            </div>
            <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', doctype.permissions.read === 1 ? 'bg-secondary-green' : 'bg-monday-light']" />
              <span class="text-small text-monday-medium">Read</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-monday-light">
            <div class="flex items-center gap-2">
              <ClockIcon class="w-4 h-4 text-monday-medium" />
              <span class="text-small text-monday-medium">{{ formatDate(doctype.updated_at) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-small text-monday-medium">{{ doctype.fields?.length || 0 }} fields</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern List View -->
      <div v-else-if="docTypes.length > 0 && viewMode === 'list'" class="monday-card">
        <div class="monday-table">
          <table class="w-full">
            <thead>
              <tr>
                <th class="monday-table-header text-left">Document</th>
                <th class="monday-table-header text-left">Module</th>
                <th class="monday-table-header text-left">Permissions</th>
                <th class="monday-table-header text-left">Fields</th>
                <th class="monday-table-header text-left">Updated</th>
                <th class="monday-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doctype in docTypes" :key="doctype.id" class="monday-table-row group">
                <td class="monday-table-cell">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gradient-to-br from-primary-green to-accent-green rounded-lg">
                      <FileIcon class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="text-label text-monday-dark">{{ doctype.name }}</div>
                      <div class="text-small text-monday-medium">{{ doctype.description || 'No description' }}</div>
                    </div>
                  </div>
                </td>
                <td class="monday-table-cell">
                  <span class="px-3 py-1 text-xs font-medium rounded-full bg-primary-green-light text-primary-green">
                    {{ doctype.module }}
                  </span>
                </td>
                <td class="monday-table-cell">
                  <div class="flex gap-1">
                    <div v-if="doctype.permissions.create === 1" class="w-2 h-2 bg-accent-green rounded-full" title="Create" />
                    <div v-if="doctype.permissions.write === 1" class="w-2 h-2 bg-monday-orange rounded-full" title="Edit" />
                    <div v-if="doctype.permissions.delete === 1" class="w-2 h-2 bg-monday-red rounded-full" title="Delete" />
                    <div v-if="doctype.permissions.read === 1" class="w-2 h-2 bg-secondary-green rounded-full" title="Read" />
                  </div>
                </td>
                <td class="monday-table-cell">
                  <span class="text-small text-monday-medium">{{ doctype.fields?.length || 0 }} fields</span>
                </td>
                <td class="monday-table-cell">
                  <div class="flex items-center gap-2">
                    <ClockIcon class="w-4 h-4 text-monday-medium" />
                    <span class="text-small text-monday-medium">{{ formatDate(doctype.updated_at) }}</span>
                  </div>
                </td>
                <td class="monday-table-cell text-right">
                  <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="router.push(`/documents/${doctype.id}/new`)"
                      v-if="doctype.permissions.create === 1"
                      class="btn-monday btn-primary btn-small"
                      title="New Submission"
                    >
                      <FilePlusIcon class="w-4 h-4 mr-1" />
                      New
                    </button>
                    <button
                      @click="viewDocuments(doctype)"
                      class="btn-monday btn-secondary btn-small"
                      title="View Records"
                    >
                      <FileTextIcon class="w-4 h-4 mr-1" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modern Empty State -->
      <div v-else class="monday-card text-center py-12">
        <div class="p-6 bg-gradient-to-br from-primary-green-light to-accent-green-light rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <FileIcon class="w-12 h-12 text-primary-green" />
        </div>
        <h3 class="text-h2 text-monday-dark mb-2">No documents found</h3>
        <p class="text-body text-monday-medium mb-6">Get started by creating your first document type or adjust your search criteria.</p>
        <div class="flex justify-center gap-3">
          <button class="btn-monday btn-primary" @click="showModal = true">
            <FilePlusIcon class="w-4 h-4 mr-2" />
            Create Document Type
          </button>
          <button class="btn-monday btn-secondary" @click="searchQuery = ''; fetchDocTypes()">
            Clear Search
          </button>
        </div>
      </div>

      <!-- Modern Pagination -->
      <div v-if="docTypes.length > 0" class="monday-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="btn-monday btn-secondary btn-small"
              >
                Previous
              </button>
              <span class="text-body text-monday-medium px-4">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="btn-monday btn-secondary btn-small"
              >
                Next
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-body text-monday-medium">Items per page:</span>
            <select
              v-model="pageSize"
              @change="fetchDocTypes(1)"
              class="form-select w-20"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { getDocTypes, createDocType, updateDocType, getRolePermissions } from '../services/erpnext';
import {
  FileIcon,
  FilePlusIcon,
  LoaderIcon,
  ClockIcon,
  FileTextIcon,
  SearchIcon,
  GridIcon,
  ListIcon
} from 'lucide-vue-next';
import LoadingSpinner from '../components/LoadingSpinner.vue';

interface DocTypeField {
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'file';
  required: boolean;
  options?: string;
}

interface DocTypePermissions {
  read: number;
  write: number;
  create: number;
  delete: number;
  submit: number;
  cancel: number;
  amend: number;
  report: number;
  export: number;
  import: number;
  share: number;
  print: number;
  email: number;
}

interface DocType {
  id: string;
  name: string;
  description: string;
  module: string;
  fields: DocTypeField[];
  updated_at: string;
  created_at: string;
  permissions: DocTypePermissions;
  linked_doctypes: string[];
}

interface ColumnWidths {
  actions: number;
  document: number;
  category: number;
  updated: number;
}

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();
const loading = ref(false);
const error = ref<string | null>(null);
const docTypes = ref<DocType[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('updated_at');
const showModal = ref(false);
const isEditing = ref(false);
const rolePermissions = ref(null);
const showPermissions = ref(false);

// Add pagination state
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(0);

// Add column resize state
const columnWidths = ref<ColumnWidths>({
  actions: 150,
  document: 300,
  category: 150,
  updated: 200
});
const isResizing = ref(false);
const resizingColumn = ref<keyof ColumnWidths | null>(null);
const startX = ref(0);
const startWidth = ref(0);

// Add debounced search
const debouncedSearch = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Add mobile detection
const mediaQueryMatches = ref(false);
const isMobile = computed(() => mediaQueryMatches.value);

// Watch for search changes
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue;
    currentPage.value = 1; // Reset to first page on search
    fetchDocTypes();
  }, 300);
});

// Add route watcher to handle module changes
watch(
  () => route.query.module,
  () => {
    currentPage.value = 1; // Reset to first page when module changes
    fetchDocTypes();
  }
);

// Watch for category changes
watch(selectedCategory, () => {
  currentPage.value = 1; // Reset to first page on category change
  fetchDocTypes();
});

const categories = [
  'HR',
  'Operations',
  'Finance',
  'IT',
  'Sales',
  'Taktec',
  'Other'
];

const docTypeData = ref<Omit<DocType, 'updated_at' | 'created_at' |  'permissions' | 'linked_doctypes'>>({
  id: '',
  name: '',
  description: '',
  module: '',
  fields: []
});

const isTaktecPortal = computed(() => route.meta.portal === 'taktec');

// Update the page title based on portal
const pageTitle = computed(() => isTaktecPortal.value ? 'Documents' : 'Documents');

const filteredDocTypes = computed(() => {
  let filtered = [...docTypes.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(doctype => 
      doctype.name.toLowerCase().includes(query) ||
      doctype.description.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(doctype => doctype.module === selectedCategory.value);
  }

  filtered.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b[sortBy.value]).getTime() - new Date(a[sortBy.value]).getTime();
    }
  });

  return filtered;
});

const fetchDocTypes = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    // console.log('Route query:', route.query);
    // console.log('Route query module:', route.query.module);
    const response = await getDocTypes(
      page, 
      pageSize.value, 
      debouncedSearch.value, 
      route.query.module as string,
      'modified',  // order_by field
      'desc'       // order direction
    );

    docTypes.value = response.data.map(docType => {
      // Safely parse fields
      let fields = [];
      try {
        if (docType.fields) {
          if (typeof docType.fields === 'string') {
            try {
              fields = JSON.parse(docType.fields);
            } catch (parseErr) {
              console.warn(`Failed to parse fields for ${docType.name}:`, parseErr);
              fields = [];
            }
          } else if (Array.isArray(docType.fields)) {
            fields = docType.fields;
          }
        }
      } catch (err) {
        console.warn(`Error processing fields for ${docType.name}:`, err);
        fields = [];
      }

      return {
        id: docType.name,
        name: docType.name,
        description: docType.description || '',
        module: docType.module || 'Other',
        fields: fields,
        updated_at: docType.modified,
        created_at: docType.creation,
        permissions: docType.permissions || {},
        linked_doctypes: docType.linked_doctypes || []
      };
    });
    totalItems.value = response.total;
    totalPages.value = response.totalPages;
    currentPage.value = response.page;
  } catch (err) {
    console.error('Error fetching document:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to fetch documents';
    
    if (err.response?.status === 403 || err.response?.data?.exc_type === 'PermissionError') {
      // router.push('/auth');
    }
  } finally {
    loading.value = false;
  }
};

const editDocType = (doctype: DocType) => {
  isEditing.value = true;
  docTypeData.value = {
    id: doctype.id,
    name: doctype.name,
    description: doctype.description || '',
    module: doctype.module || '',
    fields: doctype.fields || []
  };
  showModal.value = true;
};

const viewDocuments = (doctype: DocType) => {
  router.push(`/documents/${doctype.id}`);
};

const viewAnalytics = (doctype: DocType) => {
  router.push(`/documents/${doctype.id}/analytics`);
};

const addField = () => {
  docTypeData.value.fields.push({
    label: '',
    type: 'text',
    required: false,
    options: ''
  });
};

const removeField = (index: number) => {
  docTypeData.value.fields.splice(index, 1);
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = {
      name: docTypeData.value.name,
      description: docTypeData.value.description,
      module: docTypeData.value.module,
      fields: JSON.stringify(docTypeData.value.fields.map(field => ({
        label: field.label,
        fieldname: field.label.toLowerCase().replace(/\s+/g, '_'),
        fieldtype: field.type.toUpperCase(),
        reqd: field.required ? 1 : 0,
        options: field.options
      })))
    };

    if (isEditing.value) {
      await updateDocType(docTypeData.value.id, data);
    } else {
      await createDocType(data);
    }

    showModal.value = false;
    await fetchDocTypes();
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  try {
    // Handle ERPNext date format (YYYY-MM-DD HH:mm:ss.SSSSSS)
    const [datePart, timePart] = date.split(' ');
    if (!datePart) {
      console.warn('Invalid date format:', date);
      return 'N/A';
    }

    // Parse the date part (YYYY-MM-DD)
    const [year, month, day] = datePart.split('-').map(Number);
    
    // Parse the time part (HH:mm:ss.SSSSSS)
    let hours = 0, minutes = 0, seconds = 0;
    if (timePart) {
      const [time, microseconds] = timePart.split('.');
      const [h, m, s] = time.split(':').map(Number);
      hours = h || 0;
      minutes = m || 0;
      seconds = s || 0;
    }

    // Create date in UTC to avoid timezone issues
    const parsedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

    if (isNaN(parsedDate.getTime())) {
      console.warn('Invalid date:', date);
      return 'N/A';
    }

    // Format in Australia/Sydney timezone
    return parsedDate.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Australia/Sydney'
    });
  } catch (err) {
    console.warn('Error formatting date:', err);
    return 'N/A';
  }
};

// Add pagination controls
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDocTypes(page);
  }
};

// Add column resize functions
const startResize = (columnKey: keyof ColumnWidths, event: MouseEvent) => {
  isResizing.value = true;
  resizingColumn.value = columnKey;
  startX.value = event.clientX;
  startWidth.value = columnWidths.value[columnKey];
  
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.classList.add('table-resizing');
  event.preventDefault();
};

const handleResize = (event: MouseEvent) => {
  if (!isResizing.value || !resizingColumn.value) return;
  
  const deltaX = event.clientX - startX.value;
  const newWidth = Math.max(80, startWidth.value + deltaX); // Minimum width of 80px
  columnWidths.value[resizingColumn.value] = newWidth;
};

const stopResize = () => {
  isResizing.value = false;
  resizingColumn.value = null;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = 'default';
  document.body.classList.remove('table-resizing');
};

// Change default to grid view for better visual appeal
const viewMode = ref('grid');

// Add function to fetch role permissions
const fetchRolePermissions = async () => {
  try {
    const permissions = await getRolePermissions('Taktec User');
    rolePermissions.value = permissions;
    console.log('Taktec User permissions:', permissions);
  } catch (err) {
    console.error('Error fetching role permissions:', err);
  }
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    // router.push('/auth');
    return;
  }
  
  // Set up mobile detection
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  mediaQueryMatches.value = mediaQuery.matches;
  
  // Set default view mode based on screen size - prefer grid for modern look
  viewMode.value = mediaQuery.matches ? 'grid' : 'grid';
  
  const handleResize = (e: MediaQueryListEvent) => {
    mediaQueryMatches.value = e.matches;
    // Update view mode when screen size changes - keep grid as default
    if (e.matches && viewMode.value === 'list') {
      viewMode.value = 'grid';
    }
  };
  
  mediaQuery.addEventListener('change', handleResize);
  
  await fetchDocTypes();
  await fetchRolePermissions();
});

// Cleanup event listeners on unmount
onUnmounted(() => {
  if (isResizing.value) {
    stopResize();
  }
});
</script>

<style scoped>
@import '../styles/monday-design-system.css';

/* Modern Card Animations */
.monday-card {
  transition: all 0.3s ease;
}

.monday-hover-lift {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.monday-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* Card Grid Enhancements */
.group:hover .opacity-0 {
  opacity: 1;
}

/* Status Dots */
.w-2.h-2 {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

/* Gradient Backgrounds */
.bg-gradient-to-r {
  background: var(--gradient-green);
}

.bg-gradient-to-br {
  background: var(--gradient-secondary);
}

/* Modern Table Styling */
.monday-table tbody tr:hover {
  background-color: var(--monday-very-light);
  transition: background-color 0.2s ease;
}

/* Enhanced Search Styling */
.monday-search-input {
  padding-left: 2.5rem;
  transition: all 0.2s ease;
}

.monday-search-input:focus {
  box-shadow: 0 0 0 3px var(--primary-green-light);
  border-color: var(--primary-green);
}

/* Button Group Styling */
.bg-monday-very-light {
  background-color: var(--monday-very-light);
}

/* Line Clamp Utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.monday-card {
  animation: fadeInUp 0.4s ease-out;
}

/* Staggered Animation for Cards */
.monday-card:nth-child(1) { animation-delay: 0.1s; }
.monday-card:nth-child(2) { animation-delay: 0.2s; }
.monday-card:nth-child(3) { animation-delay: 0.3s; }
.monday-card:nth-child(4) { animation-delay: 0.4s; }
.monday-card:nth-child(5) { animation-delay: 0.5s; }
.monday-card:nth-child(6) { animation-delay: 0.6s; }

/* Loading States */
.loading-skeleton {
  background: linear-gradient(90deg, var(--monday-very-light) 25%, var(--monday-light) 50%, var(--monday-very-light) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Color Overrides for Modern Design */
.text-primary-green {
  color: var(--primary-green);
}

.text-accent-green {
  color: var(--accent-green);
}

.text-monday-orange {
  color: var(--monday-orange);
}

.text-secondary-green {
  color: var(--secondary-green);
}

.bg-primary-green-light {
  background-color: var(--primary-green-light);
}

.bg-accent-green-light {
  background-color: var(--accent-green-light);
}

/* Modern Form Elements */
.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23676879' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 36px;
}

/* Enhanced Button Styling */
.btn-small {
  padding: 4px 8px;
  font-size: 12px;
  min-height: 28px;
}

/* Modern Status Indicators */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  min-width: 60px;
  justify-content: center;
}

.status-done {
  background-color: var(--accent-green-light);
  color: var(--accent-green);
}

/* Responsive Design */
@media (max-width: 768px) {
  .monday-main-header {
    padding: var(--spacing-lg);
  }
  
  .monday-main-content {
    padding: 0 var(--spacing-lg);
  }
  
  .monday-card {
    padding: var(--spacing-lg);
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}
</style> 