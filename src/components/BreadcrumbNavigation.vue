<template>
  <div class="breadcrumb">
    <!-- Always start with Projects -->
    <router-link to="/projects" class="breadcrumb-link">Projects</router-link>
    
    <!-- Project context if available -->
    <template v-if="projectBreadcrumb">
      <span class="breadcrumb-separator">›</span>
      <router-link :to="projectBreadcrumb.to" class="breadcrumb-link">
        {{ projectBreadcrumb.label }}
      </router-link>
    </template>
    
    <!-- Organisation context if available -->
    <template v-if="organisationBreadcrumb">
      <span class="breadcrumb-separator">›</span>
      <router-link :to="organisationBreadcrumb.to" class="breadcrumb-link">
        {{ organisationBreadcrumb.label }}
      </router-link>
    </template>
    
    <!-- Current page -->
    <span class="breadcrumb-separator">›</span>
    <span class="breadcrumb-current">{{ currentPageTitle }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBreadcrumbContext } from '../composables/useBreadcrumbContext'

interface Props {
  currentPageTitle: string
}

const props = defineProps<Props>()

const { getProjectBreadcrumb, getOrganisationBreadcrumb } = useBreadcrumbContext()

const projectBreadcrumb = computed(() => getProjectBreadcrumb())
const organisationBreadcrumb = computed(() => getOrganisationBreadcrumb())
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.breadcrumb-link {
  color: var(--primary-green);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--primary-green-hover);
}

.breadcrumb-separator {
  color: var(--monday-medium);
  font-weight: normal;
}

.breadcrumb-current {
  color: var(--monday-dark);
  font-weight: 600;
}
</style>