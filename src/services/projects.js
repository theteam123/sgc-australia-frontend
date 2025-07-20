import { getErpNextApiUrl, getApiKeyAuthHeader, fetchWithErrorHandling } from '../utils/api'

/**
 * Projects API service
 */

/**
 * Fetch linked document name
 */
const getLinkedDocumentName = async (doctype, id) => {
  if (!id) return '';
  
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/${encodeURIComponent(doctype)}/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch linked document',
      `${doctype}/${id}`
    )
    
    const data = await response.json()
    const doc = data.data
    
    // Map different doctypes to their name fields
    switch (doctype) {
      case 'Organisation':
        return doc.customer_name || doc.name
      case 'Division':
        return doc.division || doc.name
      case 'Project Type':
        return doc.project_type || doc.name
      case 'Work Type':
        return doc.work_type || doc.name
      case 'Industry Sector':
        return doc.industry_sector || doc.name
      default:
        return doc.name
    }
  } catch (error) {
    console.error(`Error fetching ${doctype} ${id}:`, error)
    return id // Return the ID if we can't fetch the name
  }
}

/**
 * Map ERPNext project fields to frontend expected fields
 */
const mapProjectFields = async (erpProject) => {
  // Fetch linked document names
  const [organisationName, divisionName, projectTypeName, workTypeName, industrySectorName] = await Promise.all([
    getLinkedDocumentName('Organisation', erpProject.organisation),
    getLinkedDocumentName('Division', erpProject.division),
    getLinkedDocumentName('Project Type', erpProject.project_type),
    getLinkedDocumentName('Work Type', erpProject.work_type),
    getLinkedDocumentName('Industry Sector', erpProject.industry_sector)
  ])

  return {
    id: erpProject.name,
    name: erpProject.name,
    organisation: organisationName,
    organisation_id: erpProject.organisation,
    contact: '', // Not available in current structure
    project_code: erpProject.project_code,
    project_name: erpProject.project_name,
    project: erpProject.project,
    division: divisionName,
    division_id: erpProject.division,
    project_type: projectTypeName,
    project_type_id: erpProject.project_type,
    status: erpProject.status,
    work_type: workTypeName,
    work_type_id: erpProject.work_type,
    industry_sector: industrySectorName,
    industry_sector_id: erpProject.industry_sector,
    description: erpProject.description || 'No description available.',
    priority: 'Medium', // Default value
    estimate_opening_date: erpProject.estimate_opening_date,
    estimate_closing_date: erpProject.estimate_closing_date,
    project_start_date: erpProject.project_start_date,
    project_end_date: erpProject.project_end_date,
    reputation: erpProject.reputation,
    relationship: erpProject.relationship,
    client_positioning: erpProject.client_positioning,
    estimate_type: erpProject.estimate_type,
    project_value: erpProject.project_value || 0,
    probability: erpProject.probability || 0,
    tender_documentation: erpProject.tender_documentation,
    tender_timeframe: erpProject.tender_timeframe,
    project_timeframe: erpProject.project_timeframe,
    pva_score: erpProject.pva_score || 0,
    estimated_revenue: erpProject.estimated_revenue || erpProject.project_value || 0,
    estimated_total_cost: erpProject.estimated_total_cost || 0,
    estimated_purchase_cost: erpProject.estimated_purchase_cost || 0,
    estimated_margin: erpProject.estimated_margin || 0,
    estimated_labour_cost: erpProject.estimated_labour_cost || 0,
    estimated_margin_percent: erpProject.estimated_margin_percent || 0,
    purchase_order_value: erpProject.purchase_order_value || 0,
    purchase_invoice_value: erpProject.purchase_invoice_value || 0,
    sales_order_value: erpProject.sales_order_value || 0,
    sales_invoice_value: erpProject.sales_invoice_value || 0,
    labour_hours: erpProject.labour_hours || 0,
    labour_cost: erpProject.labour_cost || 0,
    sub_contractor_cost: erpProject.sub_contractor_cost || 0,
    estimated_hours: erpProject.estimated_hours || 0,
    // Add widget counts (these would need to be calculated from related documents)
    sales_order_count: 0,
    sales_invoice_count: 0,
    purchase_order_count: 0,
    purchase_invoice_count: 0,
    activity_count: 0,
    timesheet_count: 0,
    staffing_plan_count: 0
  }
}

// Get all projects with filtering and pagination
export const getProjects = async (page = 1, pageSize = 20, search = '', status = '', sector = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(sector && { sector })
    })

    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Project?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch projects'
    )
    
    const data = await response.json()
    
    // Fetch full details for each project
    const projectsWithDetails = await Promise.all(
      (data.data || []).map(async (project) => {
        try {
          const fullProject = await getProject(project.name)
          return mapProjectFields(fullProject)
        } catch (error) {
          console.error(`Error fetching project ${project.name}:`, error)
          return null
        }
      })
    )
    
    return {
      data: projectsWithDetails.filter(p => p !== null),
      total: data.total || 0,
      page: data.page || 1,
      totalPages: Math.ceil((data.total || 0) / pageSize)
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

// Get project by ID
export const getProject = async (id) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Project/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch project',
      id
    )
    
    const data = await response.json()
    return mapProjectFields(data.data)
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}

// Create new project
export const createProject = async (projectData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Project`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      },
      'create project'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

// Update project
export const updateProject = async (id, projectData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Project/${id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      },
      'update project',
      id
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

// Delete project
export const deleteProject = async (id) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Project/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'delete project',
      id
    )
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

// Get project statistics
export const getProjectStats = async () => {
  try {
    const projects = await getProjects(1, 1000) // Get all projects
    const projectData = projects.data
    
    return {
      total: projectData.length,
      active: projectData.filter(p => p.status === 'Active').length,
      completed: projectData.filter(p => p.status === 'Completed').length,
      planning: projectData.filter(p => p.status === 'Planning').length
    }
  } catch (error) {
    console.error('Error fetching project stats:', error)
    throw error
  }
}

// Get projects by status
export const getProjectsByStatus = async (status) => {
  try {
    const projects = await getProjects(1, 1000, '', status)
    return projects.data
  } catch (error) {
    console.error('Error fetching projects by status:', error)
    throw error
  }
}

// Get projects by industry sector
export const getProjectsBySector = async (sector) => {
  try {
    const projects = await getProjects(1, 1000, '', '', sector)
    return projects.data
  } catch (error) {
    console.error('Error fetching projects by sector:', error)
    throw error
  }
}

// Search projects
export const searchProjects = async (query) => {
  try {
    const projects = await getProjects(1, 1000, query)
    return projects.data
  } catch (error) {
    console.error('Error searching projects:', error)
    throw error
  }
}

/**
 * Get dropdown options for linked fields
 */
export const getDropdownOptions = async (doctype) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/${encodeURIComponent(doctype)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch dropdown options',
      doctype
    )
    
    const data = await response.json()
    
    // Fetch full details for each option to get display names
    const optionsWithNames = await Promise.all(
      (data.data || []).map(async (item) => {
        try {
          const fullDoc = await getLinkedDocumentName(doctype, item.name)
          return {
            value: item.name,
            label: fullDoc
          }
        } catch (error) {
          return {
            value: item.name,
            label: item.name
          }
        }
      })
    )
    
    return optionsWithNames
  } catch (error) {
    console.error(`Error fetching ${doctype} options:`, error)
    return []
  }
}

/**
 * Check if user has permission to edit project
 */
export const getProjectPermissions = async (projectId) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/method/frappe.client.get_doc_permissions?doctype=Project&docname=${projectId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch project permissions',
      projectId
    )
    
    const data = await response.json()
    return data.message?.permissions || {}
  } catch (error) {
    console.error('Error fetching project permissions:', error)
    return { write: false }
  }
}

