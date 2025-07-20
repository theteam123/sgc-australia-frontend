import { getErpNextApiUrl, getApiKeyAuthHeader, fetchWithErrorHandling } from '../utils/api.js';

const baseUrl = getErpNextApiUrl();

/**
 * Create new activity
 */
export const createActivity = async (activityData) => {
  try {
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
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
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity/${activityName}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
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
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity/${activityName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
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
  console.log('activities.js - getProjectActivities called with:', projectCode);
  try {
    const baseUrl = getErpNextApiUrl();
    
    // First, let's try to get all activities to see if the API is working
    console.log('activities.js - Testing API access by fetching all activities...');
    const testUrl = `${baseUrl}/api/resource/Activity?limit=5`;
    console.log('activities.js - Test URL:', testUrl);
    
    const testResponse = await fetchWithErrorHandling(
      testUrl,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'test fetch activities',
      'all activities'
    );
    
    const testResult = await testResponse.json();
    console.log('activities.js - Test API response (all activities):', testResult);
    
    // Now try the filtered request
    const url = `${baseUrl}/api/resource/Activity?filters=[["project","=","${projectCode}"]]&fields=["name","activity_name","status","start_date","end_date","completion","estimated_hours","burnt_hours","remaining_hours"]&order_by=creation desc`;
    console.log('activities.js - Filtered API URL:', url);
    
    const response = await fetchWithErrorHandling(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch project activities',
      `Activities for ${projectCode}`
    );

    const result = await response.json();
    console.log('activities.js - Filtered API response:', result);
    console.log('activities.js - Returning data:', result.data || []);
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
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity/${activityName}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
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
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/method/frappe.client.get_doc_permissions?doctype=Activity&docname=${activityName}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      'fetch activity permissions',
      activityName
    );

    const result = await response.json();
    return result.message || { read: true, write: false, delete: false };
  } catch (error) {
    console.error('Error fetching activity permissions:', error);
    // Return default permissions if there's an error
    return { read: true, write: false, delete: false };
  }
};
