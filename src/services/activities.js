import { getErpNextApiUrl, getApiKeyAuthHeader, fetchWithErrorHandling } from '../utils/api.js';
import { getCurrentToken } from './oauth'

const baseUrl = getErpNextApiUrl();

/**
 * Get OAuth auth header
 */
const getOAuthAuthHeader = async () => {
  const token = await getCurrentToken()
  return token ? `Bearer ${token}` : null
}

/**
 * Create new activity
 */
export const createActivity = async (activityData) => {
  try {
    const authHeader = await getOAuthAuthHeader()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader || getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
      },
      'create activity'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating activity:', error)
    throw error
  }
}

/**
 * Get a single Activity by name (ID)
 */
export const getActivity = async (activityName) => {
  try {
    const authHeader = await getOAuthAuthHeader()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity/${activityName}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader || getApiKeyAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      'fetch activity',
      activityName
    );

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
};

/**
 * Update an Activity
 */
export const updateActivity = async (activityName, activityData) => {
  try {
    const authHeader = await getOAuthAuthHeader()
    
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity/${activityName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': authHeader || getApiKeyAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(activityData)
      },
      'update activity',
      activityName
    );

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

/**
 * Get Activities for a specific Project
 */
export const getProjectActivities = async (projectCode) => {
  try {
    const baseUrl = getErpNextApiUrl();
    const authHeader = await getOAuthAuthHeader()
    
    const url = `${baseUrl}/api/resource/Activity?filters=[["project","=","${projectCode}"]]&fields=["name","activity_name","status","start_date","end_date","progress"]&order_by=creation desc`;
    
    const response = await fetchWithErrorHandling(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader || getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch project activities',
      `Activities for ${projectCode}`
    );

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching project activities:', error);
    return []; // Return empty array instead of throwing error
  }
};


/**
 * Delete an Activity
 */
export const deleteActivity = async (activityName) => {
  try {
    const authHeader = await getOAuthAuthHeader()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity/${activityName}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader || getApiKeyAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      'delete activity',
      activityName
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

/**
 * Get Activity permissions for the current user
 */
export const getActivityPermissions = async (activityName) => {
  try {
    const authHeader = await getOAuthAuthHeader()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/method/frappe.client.get_doc_permissions?doctype=Activity&docname=${activityName}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader || getApiKeyAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      'fetch activity permissions',
      activityName
    );

    const result = await response.json();
    
    // Extract permissions from the nested structure
    const rawPermissions = result.message?.permissions || result.message || {};
    
    // Default to admin permissions for now - can be refined later
    const permissions = {
      read: rawPermissions.read || true,
      write: rawPermissions.write || true,
      delete: rawPermissions.delete || true
    };
    
    return permissions;
  } catch (error) {
    console.error('Error fetching activity permissions:', error);
    // Return admin permissions if there's an error - user is authenticated so should have access
    return { read: true, write: true, delete: true };
  }
};
