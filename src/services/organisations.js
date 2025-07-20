import { getErpNextApiUrl, getApiKeyAuthHeader, fetchWithErrorHandling } from '../utils/api'

/**
 * Organisations API service
 */

// Get organisation by ID
export const getOrganisation = async (id) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Organisation/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch organisation',
      id
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching organisation:', error)
    throw error
  }
}

// Update organisation
export const updateOrganisation = async (id, organisationData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Organisation/${id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(organisationData)
      },
      'update organisation',
      id
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error updating organisation:', error)
    throw error
  }
}

// Get organisation permissions
export const getOrganisationPermissions = async (organisationId) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/method/frappe.client.get_doc_permissions?doctype=Organisation&docname=${organisationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch organisation permissions',
      organisationId
    )
    
    const data = await response.json()
    
    // Extract permission flags from the response
    const permissions = data.message || {}
    return {
      read: permissions.read || false,
      write: permissions.write || false,
      create: permissions.create || false,
      delete: permissions.delete || false,
      share: permissions.share || false,
      print: permissions.print || false,
      email: permissions.email || false,
      export: permissions.export || false
    }
  } catch (error) {
    console.error('Error fetching organisation permissions:', error)
    // Return default permissions if there's an error
    return {
      read: true,
      write: false,
      create: false,
      delete: false,
      share: false,
      print: false,
      email: false,
      export: false
    }
  }
}

// Create new organisation
export const createOrganisation = async (organisationData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Organisation`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(organisationData)
      },
      'create organisation'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating organisation:', error)
    throw error
  }
}

// Delete organisation
export const deleteOrganisation = async (id) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Organisation/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'delete organisation',
      id
    )
    
    return true
  } catch (error) {
    console.error('Error deleting organisation:', error)
    throw error
  }
}

// Get all organisations (for dropdown options)
export const getOrganisations = async () => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Organisation?fields=["name","customer_name"]&limit_page_length=None`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch organisations'
    )
    
    const data = await response.json()
    return (data.data || []).map(org => ({
      value: org.name,
      label: org.customer_name || org.name
    }))
  } catch (error) {
    console.error('Error fetching organisations:', error)
    throw error
  }
}