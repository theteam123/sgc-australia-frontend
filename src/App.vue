<template>
  <div class="monday-layout">
    <ErrorMessage />
    <div v-if="authStore.isAuthenticated" class="flex h-screen">
      <!-- Sidebar -->
      <aside 
        ref="sidebarRef"
        class="monday-sidebar transition-all duration-300" 
        :class="isSidebarCollapsed ? '-translate-x-full' : 'open'"
      >
        <!-- Logo -->
        <div class="monday-sidebar-header">
          <div class="flex items-center">
            <router-link to="/">
              <img 
                v-if="!isSidebarCollapsed" 
                src="https://i.ibb.co/bMvJc3rm/SGCAustralia-Logo.png" 
                alt="SGC Australia" 
                class="h-10" 
              />
            </router-link>
          </div>
          <button 
            v-if="!isSidebarCollapsed"
            @click="toggleSidebar" 
            class="btn-icon"
          >
            <ChevronLeftIcon class="nav-item-icon" />
          </button>
        </div>
        
        <!-- Search Bar -->
        <div v-if="!isSidebarCollapsed" class="px-4 py-3 border-b border-gray-200">
          <div class="monday-search">
            <SearchIcon class="monday-search-icon" />
            <DocTypeSearch 
              placeholder="Search..."
              :inputClass="'monday-search-input'"
              @resultClick="handleSearchResultClick"
            />
          </div>
        </div>
        
        <!-- Navigation -->
        <nav v-if="!isSidebarCollapsed" class="monday-sidebar-nav monday-scrollbar">
          <div class="space-y-1">
            <router-link 
              to="/" 
              class="nav-item"
              :class="{ 'active': $route.path === '/' }"
            >
              <HomeIcon class="nav-item-icon" />
              <span v-if="!isSidebarCollapsed">Home</span>
            </router-link>

            <!-- Document Management Section -->
            <div class="pt-4">
              <!-- System Modules -->
              <div v-if="modules.length > 0" class="space-y-1 max-h-[calc(100vh-24rem)] overflow-y-auto">
                
                <router-link 
                  v-for="module in modules" 
                  :key="module.value"
                  :to="`/documents/?module=${module.value}`"
                  class="nav-item"
                  :class="{ 
                    'active': $route.path === `/documents/${module.value}`
                  }"
                >
                  <FolderIcon class="nav-item-icon" />
                  <span v-if="!isSidebarCollapsed">{{ module.value }}</span>
                </router-link>
              </div>

              <!-- Other Document Items -->
              <router-link 
                v-for="item in filteredDocumentItems" 
                :key="item.path"
                :to="item.path"
                class="nav-item"
                :class="{ 
                  'active': $route.path === item.path
                }"
                @click="handleDocumentClick(item)"
                :title="isSidebarCollapsed ? item.name : ''"
              >
                <component 
                  :is="item.icon" 
                  class="nav-item-icon"
                />
                <span v-if="!isSidebarCollapsed">{{ item.name }}</span>
              </router-link>
            </div>

            <!-- Admin Settings -->
            <div v-if="authStore.isSystemManager" class="border-t border-gray-200 pt-4 mt-4">
              <a 
                :href="`${getErpNextApiUrl()}/app/build`"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-item"
              >
                <SettingsIcon class="nav-item-icon" />
                Admin Settings
              </a>
            </div>
          </div>
        </nav>

        <!-- User Menu -->
        <div v-if="!isSidebarCollapsed" class="monday-sidebar-footer">
          <div class="flex items-center cursor-pointer" @click="showUserModal = true">
            <div class="flex-shrink-0">
              <img
                :src="authStore.user?.profile?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'"
                class="h-8 w-8 rounded-full"
                alt=""
              />
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ authStore.user?.profile?.full_name }}
              </p>
              <button
                @click.stop="handleSignOut"
                class="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- User Profile Modal -->
      <div v-if="showUserModal" class="monday-modal-overlay">
        <div class="monday-modal max-w-2xl w-full mx-4">
          <!-- Modal Header -->
          <div class="monday-modal-header">
            <h3 class="monday-modal-title">User Profile</h3>
            <button @click="showUserModal = false" class="btn-icon">
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="monday-modal-body">
            <div v-if="loading" class="flex justify-center py-8">
              <LoaderIcon class="monday-loading" />
            </div>
            <div v-else-if="error" class="monday-text-danger p-4 bg-red-50 rounded-lg">
              {{ error }}
            </div>
            <div v-else class="space-y-6">
              <!-- Profile Header -->
              <div class="flex items-center space-x-4">
                <img
                  :src="authStore.user?.profile?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'"
                  class="h-16 w-16 rounded-full"
                  alt=""
                />
                <div>
                  <h4 class="text-h2">{{ authStore.user?.profile?.full_name }}</h4>
                  <p class="text-small">{{ authStore.user?.profile?.email }}</p>
                </div>
              </div>

              <!-- User Details -->
              <div class="space-y-6">
                <!-- Basic Information -->
                <div>
                  <div class="flex justify-between items-center mb-4">
                    <h5 class="text-label">Basic Information</h5>
                    <button
                      @click="isEditing = !isEditing"
                      class="btn-tertiary btn-small"
                    >
                      {{ isEditing ? 'Cancel' : 'Edit' }}
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 class="form-label">Email</h6>
                      <p class="text-body">{{ authStore.user?.profile?.email || 'Not specified' }}</p>
                    </div>
                    <div>
                      <h6 class="text-xs font-medium text-gray-400">Full Name</h6>
                      <p class="mt-1 text-sm text-gray-900">{{ authStore.user?.profile?.full_name || 'Not specified' }}</p>
                    </div>
                    <div>
                      <h6 class="text-xs font-medium text-gray-400">Username</h6>
                      <p class="mt-1 text-sm text-gray-900">{{ authStore.user?.name || 'Not specified' }}</p>
                    </div>
                    <div>
                      <h6 class="text-xs font-medium text-gray-400">Language</h6>
                      <select
                        v-if="isEditing"
                        v-model="editForm.language"
                        class="form-select"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                      <p v-else class="mt-1 text-sm text-gray-900">{{ authStore.user?.profile?.language || 'Not specified' }}</p>
                    </div>
                    <div>
                      <h6 class="text-xs font-medium text-gray-400">First Name</h6>
                      <input
                        v-if="isEditing"
                        v-model="editForm.first_name"
                        type="text"
                        class="form-select"
                      />
                      <p v-else class="mt-1 text-sm text-gray-900">{{ authStore.user?.profile?.first_name || 'Not specified' }}</p>
                    </div>
                    <div>
                      <h6 class="text-xs font-medium text-gray-400">Middle Name</h6>
                      <input
                        v-if="isEditing"
                        v-model="editForm.middle_name"
                        type="text"
                        class="form-select"
                      />
                      <p v-else class="mt-1 text-sm text-gray-900">{{ authStore.user?.profile?.middle_name || 'Not specified' }}</p>
                    </div>
                    <div>
                      <h6 class="text-xs font-medium text-gray-400">Last Name</h6>
                      <input
                        v-if="isEditing"
                        v-model="editForm.last_name"
                        type="text"
                        class="form-select"
                      />
                      <p v-else class="mt-1 text-sm text-gray-900">{{ authStore.user?.profile?.last_name || 'Not specified' }}</p>
                    </div>
                    <div>
                      <h6 class="text-xs font-medium text-gray-400">Timezone</h6>
                      <select
                        v-if="isEditing"
                        v-model="editForm.time_zone"
                        class="form-select"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Australia/Sydney">Sydney</option>
                        <option value="Australia/Melbourne">Melbourne</option>
                        <option value="Australia/Perth">Perth</option>
                      </select>
                      <p v-else class="mt-1 text-sm text-gray-900">{{ authStore.user?.profile?.time_zone || 'Not specified' }}</p>
                    </div>
                  </div>
                  
                </div>

                <!-- Save Button -->
                <div v-if="isEditing" class="flex justify-end space-x-3">
                  <button
                    @click="isEditing = false"
                    class="btn-monday btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    @click="handleSaveProfile"
                    :disabled="isSaving"
                    class="btn-monday btn-primary"
                  >
                    <LoaderIcon v-if="isSaving" class="w-4 h-4 animate-spin inline-block mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="monday-modal-footer">
            <button
              @click="showUserModal = false"
              class="btn-monday btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Support Modal -->
      <div v-if="showSupportModal" class="monday-modal-overlay p-4" @click="showSupportModal = false">
        <div class="monday-modal w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          <!-- Modal Header -->
          <div class="monday-modal-header flex-shrink-0">
            <h3 class="monday-modal-title">Support</h3>
            <button @click="showSupportModal = false" class="btn-icon">
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="monday-modal-body overflow-y-auto flex-1">
            <!-- Loading State -->
            <div v-if="supportLoading" class="flex justify-center items-center py-8">
              <LoaderIcon class="monday-loading" />
            </div>

            <!-- Error State -->
            <div v-else-if="supportError" class="monday-bg-danger monday-text-danger p-4 rounded-lg mb-6">
              {{ supportError }}
            </div>

            <!-- Form -->
            <form v-else-if="supportForm" @submit.prevent="handleSupportSubmit" class="max-w-full">
              <div class="space-y-4 sm:space-y-6">
                <!-- Tabs -->
                <div v-if="supportProcessedSections.hasTabs" class="border-b border-gray-200">
                  <nav class="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                    <button
                      v-for="tab in supportProcessedSections.tabs"
                      :key="tab.id"
                      type="button"
                      @click="currentSupportTab = tab.id"
                      :class="[
                        currentSupportTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm flex-shrink-0'
                      ]"
                    >
                      {{ tab.label }}
                    </button>
                  </nav>
                </div>

                <!-- Tab Content -->
                <template v-if="supportProcessedSections.hasTabs">
                  <div
                    v-for="tab in supportProcessedSections.tabs"
                    :key="tab.id"
                    v-show="currentSupportTab === tab.id"
                    class="space-y-4 sm:space-y-6"
                  >
                    <div 
                      v-for="(section, sectionIndex) in tab.sections" 
                      :key="sectionIndex"
                      :class="[
                        'transition-all duration-200 ease-in-out',
                        { 'opacity-0 h-0 overflow-hidden': section.hidden }
                      ]"
                    >
                      <!-- Section Title -->
                      <div v-if="section.title" class="mb-3 sm:mb-4 border-b border-gray-200 pb-2">
                        <span class="text-base sm:text-lg font-semibold text-gray-700">{{ section.title }}</span>
                      </div>
                      
                      <!-- Fields Grid -->
                      <div>
                        <!-- Column Labels -->
                        <div v-if="section.columnLabels.length > 0" :class="{
                          'grid gap-4 sm:gap-6 mb-3 sm:mb-4': true,
                          'grid-cols-1': section.columnCount <= 1 || isMobile,
                          'grid-cols-2': section.columnCount === 2 && !isMobile
                        }">
                          <div v-for="(label, idx) in section.columnLabels" :key="idx" class="text-sm font-medium text-gray-700">
                            {{ label }}
                          </div>
                        </div>
                        
                        <!-- Fields -->
                        <div :class="{
                          'grid gap-4 sm:gap-6': true,
                          'grid-cols-1': section.columnCount <= 1 || isMobile,
                          'grid-cols-2': section.columnCount === 2 && !isMobile
                        }">
                          <FormField
                            v-for="field in section.fields"
                            :key="field.fieldname"
                            :ref="(el) => { if (el) supportFormFieldRefs[field.fieldname] = el }"
                            :field="field"
                            v-model="supportFormData[field.fieldname]"
                            :formData="supportFormData"
                            parentDocName="support-request"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Non-tabbed content -->
                <template v-else>
                  <div 
                    v-for="(section, sectionIndex) in supportProcessedSections.sections" 
                    :key="sectionIndex"
                    :class="[
                      'transition-all duration-200 ease-in-out',
                      { 'opacity-0 h-0 overflow-hidden': section.hidden }
                    ]"
                  >
                    <!-- Section Title -->
                    <div v-if="section.title" class="mb-3 sm:mb-4 border-b border-gray-200 pb-2">
                      <span class="text-base sm:text-lg font-semibold text-gray-700">{{ section.title }}</span>
                    </div>
                    
                    <!-- Fields Grid -->
                    <div>
                      <!-- Column Labels -->
                      <div v-if="section.columnLabels.length > 0" :class="{
                        'grid gap-4 sm:gap-6 mb-3 sm:mb-4': true,
                        'grid-cols-1': section.columnCount <= 1 || isMobile,
                        'grid-cols-2': section.columnCount === 2 && !isMobile
                      }">
                        <div v-for="(label, idx) in section.columnLabels" :key="idx" class="text-sm font-medium text-gray-700">
                          {{ label }}
                        </div>
                      </div>
                      
                      <!-- Fields -->
                      <div :class="{
                        'grid gap-4 sm:gap-6': true,
                        'grid-cols-1': section.columnCount <= 1 || isMobile,
                        'grid-cols-2': section.columnCount === 2 && !isMobile
                      }">
                        <FormField
                          v-for="field in section.fields"
                          :key="field.fieldname"
                          :ref="(el) => { if (el) supportFormFieldRefs[field.fieldname] = el }"
                          :field="field"
                          v-model="supportFormData[field.fieldname]"
                          :formData="supportFormData"
                          parentDocName="support-request"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </form>

            <!-- Placeholder for empty state -->
            <div v-else class="text-center py-8 sm:py-12">
              <HelpCircleIcon class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
              <h4 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">How can we help you?</h4>
              <p class="text-gray-500">Loading support form...</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="monday-modal-footer flex-shrink-0">
            <button
              @click="showSupportModal = false"
              type="button"
              class="btn-monday btn-secondary"
            >
              Cancel
            </button>
            <button
              v-if="supportForm && !supportLoading && !supportError"
              @click="handleSupportSubmit"
              type="button"
              class="btn-monday btn-primary"
              :disabled="supportSubmitting"
            >
              {{ supportSubmitting ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Support Success Modal -->
      <div v-if="showSupportSuccessModal" class="monday-modal-overlay" @click="showSupportSuccessModal = false">
        <div class="monday-modal max-w-lg w-full flex flex-col items-center" @click.stop>
          <div class="monday-modal-body text-center">
            <div class="w-16 h-16 rounded-full monday-bg-success flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-h1 mb-2">Request Submitted</h2>
            <p class="text-body mb-6">Thank you for your support request. Our team will get back to you soon.</p>
          </div>
          <div class="monday-modal-footer">
            <button @click="resetSupportForm" class="btn-monday btn-secondary">Submit another request</button>
            <button @click="showSupportSuccessModal = false" class="btn-monday btn-primary">Close</button>
          </div>
        </div>
      </div>

      <div class="monday-main">
        <!-- Top Navigation Bar -->
        <div class="monday-header">
          <!-- Toggle Button -->
          <button 
            @click="toggleSidebar"
            class="btn-icon"
          >
            <MenuIcon class="w-5 h-5 text-gray-600" />
          </button>

          <!-- Center Logo -->
          <div 
            v-if="route.path !== '/'" 
            class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <router-link to="/">
              <img 
                src="https://i.ibb.co/bMvJc3rm/SGCAustralia-Logo.png" 
                alt="SGC Australia" 
                class="h-8" 
              />
            </router-link>
          </div>

          <!-- Support Button -->
          <button
            @click="handleSupportClick"
            class="btn-monday btn-primary"
          >
            <HelpCircleIcon class="w-5 h-5" />
            <span class="hidden sm:inline ml-2">Support</span>
          </button>
        </div>

        <!-- Main Content with adjusted padding for fixed header -->
        <main class="monday-main-content flex-1 overflow-auto">
          <router-view></router-view>
        </main>

        <!-- Footer -->
        <footer class="py-4 px-8 border-t border-gray-200 bg-white">
          <div class="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
            Powered by <a href="https://sgcloud.com.au" target="_blank" rel="noopener noreferrer" class="monday-text-primary hover:text-green-700 inline-flex items-center">
              <img 
                src="https://i.ibb.co/bMvJc3rm/SGCAustralia-Logo.png" 
                alt="SGC Australia" 
                class="h-4" 
              />
            </a>
          </div>
        </footer>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { getErpNextApiUrl } from './utils/api';
import { getLogo, getDocumentItems } from './config/domains';
import { getModules } from './services/deskApi';
import { getFormData, createForm, getDocTypeData, getSupportDocTypeData, createSupportForm } from './services/erpnext';
import axios from 'axios';
import CompanySelectionDropdown from './components/CompanySelectionDropdown.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import DocTypeSearch from './components/DocTypeSearch.vue';
import FormField from './components/FormField.vue';
import { useFormSections } from './composables/useFormSections';
import { errorCapture } from './utils/errorCapture';
import { 
  HomeIcon, 
  FileTextIcon, 
  ClipboardIcon,
  BookIcon,
  FileIcon,
  FileBoxIcon,
  VideoIcon,
  SettingsIcon,
  UsersIcon,
  BuildingIcon,
  ShieldIcon,
  FileEditIcon,
  TagIcon,
  FolderIcon,
  ChevronDownIcon,
  SearchIcon,
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HelpCircleIcon,
  XIcon,
  LoaderIcon,
  MicIcon,
  UserIcon,
  FileCodeIcon,
  Building2Icon as BuildingOfficeIcon // Alias for BuildingOfficeIcon
} from 'lucide-vue-next';

interface SearchResult {
  id: string;
  type: string;
  name: string;
}

interface Module {
  value: string;
  description: string;
}

interface FormField {
  fieldname: string;
  label: string;
  fieldtype: string;
  reqd: number;
  options?: string;
  hidden?: number;
  depends_on?: string;
}

interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

interface RawFormField {
  fieldname: string;
  label: string;
  fieldtype: string;
  reqd: number;
  options?: string;
  hidden?: number;
  depends_on?: string;
  default?: string;
}

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const logo = computed(() => getLogo());
const modules = ref<Module[]>([]);

const isSidebarCollapsed = ref(true);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const showSearchResults = ref(false);
const searchResults = ref<SearchResult[]>([]);
const showUserModal = ref(false);
const showSupportModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const userData = ref(null);
const sidebarRef = ref<HTMLElement | null>(null);

// Support form related state
const supportForm = ref<Form | null>(null);
const supportFormData = ref<Record<string, any>>({});
const supportLoading = ref(false);
const supportSubmitting = ref(false);
const supportError = ref<string | null>(null);
const showSupportSuccessModal = ref(false);
const currentSupportTab = ref<string>('');

// Add refs to store FormField component references for support form
const supportFormFieldRefs = ref<Record<string, any>>({});

const documentItems = computed(() => {
  const items = getDocumentItems();
  // Map string icon names to actual icon components
  return items.map(item => ({
    ...item,
    icon: iconMap[item.icon] || FileTextIcon // Default to FileTextIcon if icon not found
  }));
});

// Add icon mapping object with all required icons
const iconMap = {
  'FileTextIcon': FileTextIcon,
  'MicIcon': MicIcon,
  'ClipboardIcon': ClipboardIcon,
  'BuildingOfficeIcon': BuildingOfficeIcon,
  'UserIcon': UserIcon,
  'HomeIcon': HomeIcon,
  'BookIcon': BookIcon,
  'FileIcon': FileIcon,
  'FileBoxIcon': FileBoxIcon,
  'VideoIcon': VideoIcon,
  'SettingsIcon': SettingsIcon,
  'UsersIcon': UsersIcon,
  'BuildingIcon': BuildingIcon,
  'ShieldIcon': ShieldIcon,
  'FileEditIcon': FileEditIcon,
  'TagIcon': TagIcon,
  'FolderIcon': FolderIcon,
  'FileCodeIcon': FileCodeIcon
};

const filteredDocumentItems = computed(() => {
  return documentItems.value.filter(item => {
    // If no requiredRoles is specified, show the item
    if (!item.requiredRoles) return true;
    
    // Check if user has any of the required roles
    return item.requiredRoles.some(role => authStore.user?.roles?.includes(role));
  });
});

const allMenuItems = computed(() => [...filteredDocumentItems.value]);

const currentPageTitle = computed(() => {
  if (route.path === '/') return 'Welcome';
  const allItems = [...documentItems.value];
  const currentItem = allItems.find(item => item.path === route.path);
  return currentItem?.name || 'TheTeam';
});

const currentPageDescription = computed(() => {
  if (route.path === '/') return 'Your one-stop location for managing forms, records, users, and companies';
  const allItems = [...documentItems.value];
  const currentItem = allItems.find(item => item.path === route.path);
  return currentItem?.description || '';
});

const filteredMenuItems = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return allMenuItems.value.filter(item => 
    item.name.toLowerCase().includes(query)
  );
});

const handleSearchBlur = () => {
  // Delay hiding results to allow clicking them
  setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

const handleMenuItemClick = (item) => {
  router.push(item.path);
  searchQuery.value = '';
  showSearchResults.value = false;
};

const handleSearchResultClick = (result) => {
  router.push(`/documents/${result.id}`);
};

const getContentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'document':
      return FileTextIcon;
    case 'form':
      return ClipboardIcon;
    case 'policy':
      return BookIcon;
    default:
      return FileIcon;
  }
};

const handleSignOut = async () => {
  try {
    // TODO: Replace with your new backend implementation
    await authStore.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

const handleDocumentClick = (item) => {
  router.push(item.path);
};

const handleSupportClick = async () => {
  showSupportModal.value = true;
  if (!supportForm.value) {
    await fetchSupportFormData();
  } else {
    // Update page URL field with current route if form is already loaded
    updatePageUrlField();
  }
};

// Function to update page URL field with current route
const updatePageUrlField = () => {
  if (supportForm.value) {
    // Find any field with [page-url] in the label
    const pageUrlField = supportForm.value.fields.find(field => 
      field.label?.includes('[page-url]')
    );
    
    if (pageUrlField) {
      // Update the form data with current page URL
      const currentUrl = window.location.origin + route.fullPath;
      supportFormData.value[pageUrlField.fieldname] = currentUrl;
    }
  }
};

// Support form functions
const fetchSupportFormData = async () => {
  supportLoading.value = true;
  supportError.value = null;
  
  try {
    const response2 = await getSupportDocTypeData('Support Request');

    // Get the fields from the web form's web_form_fields property
    let fields: RawFormField[] = [];
    try {
      if (response2.docs[0].fields) {
        fields = response2.docs[0].fields;
      }
    } catch (err) {
      console.error('Error parsing fields:', err);
      fields = [];
    }


    supportForm.value = {
      id: 'support-request',
      title: 'Support Request Form',
      description: '',
      fields: fields.map((field: RawFormField) => ({
        fieldname: field.fieldname,
        label: field.label,
        fieldtype: field.fieldtype,
        default: field.default,
        reqd: field.reqd || 0,
        options: field.options || '',
        depends_on: field.depends_on,
        hidden: field.hidden || 0
      }))
    };
    
    // Initialize form data with empty values
    supportFormData.value = {};
    supportForm.value.fields.forEach((field: FormField) => {
      if (!['Section Break', 'Column Break'].includes(field.fieldtype)) {
        supportFormData.value[field.fieldname] = '';
      }
    });

  } catch (err: any) {
    console.error('Error fetching support form data:', err);
    supportError.value = err.message || 'Failed to load support form data';
  } finally {
    supportLoading.value = false;
  }
};

const handleSupportSubmit = async () => {
  supportSubmitting.value = true;
  supportError.value = null;

  try {
    // Save all signature fields before submission using refs
    const signatureFields = supportForm.value?.fields.filter(field => field.fieldtype === 'Signature') || [];
    for (const field of signatureFields) {
      const fieldRef = supportFormFieldRefs.value[field.fieldname];
      if (fieldRef && typeof fieldRef.saveCurrentSignature === 'function') {
        fieldRef.saveCurrentSignature();
      }
    }

    // Validate form data before submission
    const formDataToSubmit = { ...supportFormData.value };
    
    // Ensure all required fields are present
    if (supportForm.value) {
      const requiredFields = supportForm.value.fields.filter(field => field.reqd === 1);
      for (const field of requiredFields) {
        if (!formDataToSubmit[field.fieldname] || formDataToSubmit[field.fieldname].toString().trim() === '') {
          throw new Error(`Please fill in the required field: ${field.label}`);
        }
      }
      
      // Validate JSON fields
      for (const field of supportForm.value.fields) {
        if (field.fieldtype === 'JSON' && formDataToSubmit[field.fieldname]) {
          try {
            const value = typeof formDataToSubmit[field.fieldname] === 'string' 
              ? JSON.parse(formDataToSubmit[field.fieldname])
              : formDataToSubmit[field.fieldname];
            // Store as compact JSON string
            formDataToSubmit[field.fieldname] = JSON.stringify(value);
          } catch (e) {
            throw new Error(`Invalid JSON format in field "${field.label}": ${e.message}`);
          }
        }
      }
    }
    
    // Clean the data before submission
    Object.keys(formDataToSubmit).forEach(key => {
      if (typeof formDataToSubmit[key] === 'string') {
        formDataToSubmit[key] = formDataToSubmit[key].trim();
      }
    });

    await createSupportForm(formDataToSubmit);
    showSupportSuccessModal.value = true;
    showSupportModal.value = false;
  } catch (err: any) {
    console.error('Support form submission error:', err);
    supportError.value = err.message || 'Failed to submit support request';
  } finally {
    supportSubmitting.value = false;
  }
};

const resetSupportForm = () => {
  showSupportSuccessModal.value = false;
  supportFormData.value = {};
  // Re-initialize form fields
  if (supportForm.value) {
    supportForm.value.fields.forEach((field: FormField) => {
      if (!['Section Break', 'Column Break'].includes(field.fieldtype) ) {
        supportFormData.value[field.fieldname] = '';
      }
    });
  }
};

// Add computed for form sections
const { processedSections: supportProcessedSections } = useFormSections(computed(() => supportForm.value?.fields));

// Set initial tab when form loads
watch(() => supportProcessedSections.value, (newValue) => {
  if (newValue.hasTabs && newValue.tabs.length > 0 && !currentSupportTab.value) {
    currentSupportTab.value = newValue.tabs[0].id;
  }
}, { immediate: true });

// Add new refs and methods
const editForm = ref({
  language: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  time_zone: ''
});

// Add window width tracking for responsive design
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

// Computed property for responsive grid columns
const isMobile = computed(() => windowWidth.value < 640);

// Window resize handler
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Watch for modal opening
watch(showUserModal, (newValue) => {
  if (newValue) {
    // Initialize edit form with current values
    editForm.value = {
      language: authStore.user?.profile?.language || '',
      first_name: authStore.user?.profile?.first_name || '',
      middle_name: authStore.user?.profile?.middle_name || '',
      last_name: authStore.user?.profile?.last_name || '',
      time_zone: authStore.user?.profile?.time_zone || ''
    };

    // Get user data from auth store
    userData.value = authStore.user?.details || null;
  } else {
    isEditing.value = false;
    userData.value = null;
  }
});

const handleSaveProfile = async () => {
  isSaving.value = true;
  try {
    await authStore.updateUserDetails(editForm.value);
    isEditing.value = false;
  } catch (error) {
    console.error('Error saving profile:', error);
    // You might want to show an error message to the user here
  } finally {
    isSaving.value = false;
  }
};

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    !isSidebarCollapsed.value && 
    sidebarRef.value && 
    !sidebarRef.value.contains(event.target as Node) &&
    !(event.target as Element).closest('button')
  ) {
    isSidebarCollapsed.value = true;
  }
};

// Add and remove event listeners
onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  
  // Add window resize listener
  window.addEventListener('resize', handleResize);
  
  // Initialize error capture (access the singleton to ensure it's initialized)
  console.log('Error capture initialized. Current error count:', errorCapture.getErrorCount());
  
  // Only fetch modules if user is authenticated
  if (authStore.isAuthenticated) {
    try {
      const modulesResponse = await getModules();
      modules.value = modulesResponse.message || [];
    } catch (error) {
      // console.error('❌ Error fetching modules:', error);
    }
  }
});

// Watch for authentication changes
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    try {
      const modulesResponse = await getModules();
      modules.value = modulesResponse.message || [];
    } catch (error) {
      // console.error('❌ Error fetching modules:', error);
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<style>
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

/* Add smooth transition for sidebar */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>