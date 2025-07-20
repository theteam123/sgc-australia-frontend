import { getErpNextApiUrl, getApiKeyAuthHeader, fetchWithErrorHandling } from '../utils/api'

/**
 * Projects API service
 */

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
    return {
      data: data.data || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: Math.ceil((data.total || 0) / pageSize)
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    // Return sample data for development
    return {
      data: getSampleProjects(),
      total: 3,
      page: 1,
      totalPages: 1
    }
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
    return data.data
  } catch (error) {
    console.error('Error fetching project:', error)
    // Return sample data for development
    const sampleProjects = getSampleProjects()
    return sampleProjects.find(p => p.id === id) || sampleProjects[0]
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

// Simplified API functions that return sample data for development
// These can be replaced with actual API calls later

// Get project statistics
export const getProjectStats = async () => {
  // Return calculated stats from sample data
  const projects = getSampleProjects()
  return {
    total: projects.length,
    active: projects.filter(p => p.status === 'Active').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    planning: projects.filter(p => p.status === 'Planning').length
  }
}

// Get projects by status
export const getProjectsByStatus = async (status) => {
  const projects = getSampleProjects()
  return projects.filter(p => p.status === status)
}

// Get projects by industry sector
export const getProjectsBySector = async (sector) => {
  const projects = getSampleProjects()
  return projects.filter(p => p.industry_sector === sector)
}

// Get project timeline data
export const getProjectTimeline = async () => {
  const projects = getSampleProjects()
  const now = new Date()
  
  return {
    startingSoon: projects.filter(p => {
      const start = new Date(p.project_start_date)
      return start > now && start <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    }).length,
    inProgress: projects.filter(p => p.status === 'Active').length,
    overdue: projects.filter(p => {
      const end = new Date(p.project_end_date)
      return end < now && p.status !== 'Completed'
    }).length,
    completed: projects.filter(p => p.status === 'Completed').length
  }
}

// Get financial overview
export const getFinancialOverview = async () => {
  const projects = getSampleProjects()
  return {
    totalValue: projects.reduce((sum, p) => sum + p.project_value, 0),
    totalRevenue: projects.reduce((sum, p) => sum + p.estimated_revenue, 0),
    totalCost: projects.reduce((sum, p) => sum + p.estimated_total_cost, 0),
    totalMargin: projects.reduce((sum, p) => sum + p.estimated_margin, 0),
    avgMarginPercent: projects.reduce((sum, p) => sum + p.estimated_margin_percent, 0) / projects.length
  }
}

// Export projects data
export const exportProjects = async (format = 'csv') => {
  const projects = getSampleProjects()
  // Simple CSV export for development
  const csv = projects.map(p => Object.values(p).join(',')).join('\n')
  return new Blob([csv], { type: 'text/csv' })
}

// Search projects
export const searchProjects = async (query) => {
  const projects = getSampleProjects()
  const searchTerm = query.toLowerCase()
  return projects.filter(p => 
    p.project_name.toLowerCase().includes(searchTerm) ||
    p.organisation.toLowerCase().includes(searchTerm) ||
    p.project_code.toLowerCase().includes(searchTerm)
  )
}

// Get project KPIs
export const getProjectKPIs = async () => {
  const projects = getSampleProjects()
  return {
    avgPVAScore: projects.reduce((sum, p) => sum + p.pva_score, 0) / projects.length,
    highProbability: projects.filter(p => p.probability >= 80).length,
    labourUtilization: (projects.reduce((sum, p) => sum + p.labour_hours, 0) / projects.reduce((sum, p) => sum + p.estimated_hours, 0)) * 100
  }
}

// Get client relationship data
export const getClientRelationships = async () => {
  const projects = getSampleProjects()
  return {
    excellent: projects.filter(p => p.relationship === 'Strong').length,
    good: projects.filter(p => p.relationship === 'Good').length,
    neutral: projects.filter(p => p.relationship === 'Neutral').length
  }
}

// Get industry analysis
export const getIndustryAnalysis = async () => {
  const projects = getSampleProjects()
  const analysis = {}
  
  projects.forEach(p => {
    if (!analysis[p.industry_sector]) {
      analysis[p.industry_sector] = { count: 0, value: 0 }
    }
    analysis[p.industry_sector].count++
    analysis[p.industry_sector].value += p.project_value
  })
  
  return analysis
}

// Get project performance metrics
export const getPerformanceMetrics = async () => {
  const projects = getSampleProjects()
  return {
    avgProjectValue: projects.reduce((sum, p) => sum + p.project_value, 0) / projects.length,
    avgDuration: 6, // months
    successRate: (projects.filter(p => p.status === 'Completed').length / projects.length) * 100,
    avgProfitMargin: projects.reduce((sum, p) => sum + p.estimated_margin_percent, 0) / projects.length
  }
}

// Sample data for development/testing
export const getSampleProjects = () => {
  return [
    {
      id: 'PRJ-2024-001',
      organisation: 'Mining Corp Australia',
      contact: 'Sarah Johnson',
      project_code: 'MCA-2024-001',
      project_name: 'Queensland Mining Expansion',
      division: 'Mining',
      project_type: 'Infrastructure',
      position: 'Prime Contractor',
      mobile: '+61 400 123 456',
      office_phone: '+61 7 3000 1234',
      email: 'sarah.johnson@miningcorp.com.au',
      project: 'Queensland Mining Expansion',
      site: 'Bowen Basin, QLD',
      status: 'Active',
      work_type: 'Construction',
      industry_sector: 'Mining',
      estimate_opening_date: '2024-01-01',
      estimate_closing_date: '2024-12-31',
      project_award_date: '2024-01-15',
      project_start_date: '2024-01-15',
      project_end_date: '2024-12-31',
      reputation: 'Excellent',
      relationship: 'Strong',
      client_positioning: 'Preferred',
      estimate_type: 'Detailed',
      commercial_model: 'Lump Sum',
      estimated_hours: 5000,
      project_value: 2500000,
      probability: 85,
      tender_documentation: 'Complete',
      tender_timeframe: '6 months',
      project_timeframe: '12 months',
      likelyhood_of_works: 90,
      pva_score: 8.5,
      estimated_revenue: 2200000,
      estimated_total_cost: 1800000,
      estimated_purchase_cost: 1200000,
      estimated_margin: 400000,
      estimated_labour_cost: 600000,
      estimated_margin_percent: 18,
      purchase_order_value: 0,
      purchase_invoice_value: 0,
      sales_order_value: 0,
      sales_invoice_value: 0,
      labour_hours: 3500,
      labour_cost: 525000,
      sub_contractor_cost: 250000
    },
    {
      id: 'PRJ-2024-002',
      organisation: 'Tech Solutions Pty',
      contact: 'Michael Chen',
      project_code: 'TSP-2024-002',
      project_name: 'Digital Infrastructure Upgrade',
      division: 'Technology',
      project_type: 'Software',
      position: 'Subcontractor',
      mobile: '+61 400 234 567',
      office_phone: '+61 2 8000 2345',
      email: 'michael.chen@techsolutions.com',
      project: 'Digital Infrastructure Upgrade',
      site: 'Sydney, NSW',
      status: 'Planning',
      work_type: 'Development',
      industry_sector: 'Technology',
      estimate_opening_date: '2024-03-01',
      estimate_closing_date: '2024-08-15',
      project_award_date: '2024-03-01',
      project_start_date: '2024-03-01',
      project_end_date: '2024-08-15',
      reputation: 'Good',
      relationship: 'Good',
      client_positioning: 'Competitive',
      estimate_type: 'Preliminary',
      commercial_model: 'Time & Materials',
      estimated_hours: 2000,
      project_value: 750000,
      probability: 65,
      tender_documentation: 'In Progress',
      tender_timeframe: '3 months',
      project_timeframe: '6 months',
      likelyhood_of_works: 70,
      pva_score: 7.2,
      estimated_revenue: 680000,
      estimated_total_cost: 550000,
      estimated_purchase_cost: 300000,
      estimated_margin: 130000,
      estimated_labour_cost: 250000,
      estimated_margin_percent: 19,
      purchase_order_value: 0,
      purchase_invoice_value: 0,
      sales_order_value: 0,
      sales_invoice_value: 0,
      labour_hours: 1200,
      labour_cost: 180000,
      sub_contractor_cost: 100000
    },
    {
      id: 'PRJ-2024-003',
      organisation: 'Green Energy Ltd',
      contact: 'Emma Wilson',
      project_code: 'GEL-2024-003',
      project_name: 'Solar Farm Development',
      division: 'Energy',
      project_type: 'Infrastructure',
      position: 'Prime Contractor',
      mobile: '+61 400 345 678',
      office_phone: '+61 8 9000 3456',
      email: 'emma.wilson@greenenergy.com',
      project: 'Solar Farm Development',
      site: 'Wheatbelt, WA',
      status: 'Completed',
      work_type: 'Construction',
      industry_sector: 'Energy',
      estimate_opening_date: '2023-06-01',
      estimate_closing_date: '2024-02-28',
      project_award_date: '2023-06-01',
      project_start_date: '2023-06-01',
      project_end_date: '2024-02-28',
      reputation: 'Excellent',
      relationship: 'Strong',
      client_positioning: 'Preferred',
      estimate_type: 'Detailed',
      commercial_model: 'Lump Sum',
      estimated_hours: 4500,
      project_value: 1800000,
      probability: 100,
      tender_documentation: 'Complete',
      tender_timeframe: '8 months',
      project_timeframe: '8 months',
      likelyhood_of_works: 100,
      pva_score: 9.1,
      estimated_revenue: 1620000,
      estimated_total_cost: 1350000,
      estimated_purchase_cost: 900000,
      estimated_margin: 270000,
      estimated_labour_cost: 450000,
      estimated_margin_percent: 17,
      purchase_order_value: 900000,
      purchase_invoice_value: 900000,
      sales_order_value: 1620000,
      sales_invoice_value: 1620000,
      labour_hours: 4500,
      labour_cost: 450000,
      sub_contractor_cost: 150000
    }
  ]
}