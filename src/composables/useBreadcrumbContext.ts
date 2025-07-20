import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Composable for managing breadcrumb context navigation
 * Provides a consistent way to extract and use navigation context
 * across different pages in the application
 */
export function useBreadcrumbContext() {
  // Navigation context from query parameters
  const fromProject = ref<string | null>(null)
  const fromProjectName = ref<string | null>(null)
  const fromProjectCode = ref<string | null>(null)
  const fromOrganisation = ref<string | null>(null)
  const fromOrganisationName = ref<string | null>(null)
  
  const route = useRoute()

  /**
   * Extract navigation context from route query parameters
   */
  const extractContext = () => {
    fromProject.value = route.query.fromProject as string || null
    fromProjectName.value = route.query.fromProjectName as string || null
    fromProjectCode.value = route.query.fromProjectCode as string || null
    fromOrganisation.value = route.query.fromOrganisation as string || null
    fromOrganisationName.value = route.query.fromOrganisationName as string || null
  }

  /**
   * Create project context query parameters
   */
  const createProjectContext = (project: any) => {
    return {
      fromProject: project.name || project.id,
      fromProjectName: project.project_name,
      fromProjectCode: project.project_code
    }
  }

  /**
   * Create organisation context query parameters
   */
  const createOrganisationContext = (organisation: any) => {
    return {
      fromOrganisation: organisation.name || organisation.id,
      fromOrganisationName: organisation.customer_name
    }
  }

  /**
   * Check if we have project context
   */
  const hasProjectContext = () => {
    return fromProject.value && fromProjectName.value
  }

  /**
   * Check if we have organisation context
   */
  const hasOrganisationContext = () => {
    return fromOrganisation.value && fromOrganisationName.value
  }

  /**
   * Get project breadcrumb info
   */
  const getProjectBreadcrumb = () => {
    if (!hasProjectContext()) return null
    
    return {
      label: `#${fromProjectCode.value} ${fromProjectName.value}`,
      to: `/projects/${fromProject.value}`
    }
  }

  /**
   * Get organisation breadcrumb info
   */
  const getOrganisationBreadcrumb = () => {
    if (!hasOrganisationContext()) return null
    
    return {
      label: fromOrganisationName.value,
      to: `/organisation/${fromOrganisation.value}`
    }
  }

  // Initialize on mount
  onMounted(() => {
    extractContext()
  })

  return {
    // Reactive refs
    fromProject,
    fromProjectName,
    fromProjectCode,
    fromOrganisation,
    fromOrganisationName,
    
    // Methods
    extractContext,
    createProjectContext,
    createOrganisationContext,
    hasProjectContext,
    hasOrganisationContext,
    getProjectBreadcrumb,
    getOrganisationBreadcrumb
  }
}

/**
 * Navigation helper to add context to router.push
 */
export function addNavigationContext(baseRoute: any, context: any = {}) {
  return {
    ...baseRoute,
    query: {
      ...baseRoute.query,
      ...context
    }
  }
}