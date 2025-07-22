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
    // Fetch all fields for the individual activity
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
    console.log('📋 Fetched activity with all fields:', result.data);
    console.log('📋 Available fields:', result.data ? Object.keys(result.data) : 'No data');
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
    
    // Fetch ALL fields from the Activity doctype
    const url = `${baseUrl}/api/resource/Activity?filters=[["project","=","${projectCode}"]]&fields=["*"]&order_by=creation desc`;
    
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
 * Check if a project has activities with the specified status
 */
export const projectHasActivitiesWithStatus = async (projectName, activityStatus) => {
  try {
    const activities = await getProjectActivities(projectName);
    return activities.some(activity => activity.status === activityStatus);
  } catch (error) {
    console.error(`Error checking activities for project ${projectName}:`, error);
    return false;
  }
};

/**
 * Filter projects that have activities with the specified status
 */
export const filterProjectsByActivityStatus = async (projects, activityStatus) => {
  try {
    console.log(`🔍 Filtering ${projects.length} projects for activities with status: ${activityStatus}`);
    
    // Check each project for activities with the specified status
    const results = await Promise.all(
      projects.map(async (project) => {
        try {
          const hasMatchingActivities = await projectHasActivitiesWithStatus(project.name, activityStatus);
          console.log(`Project "${project.project_name}" (${project.name}) has activities with status "${activityStatus}": ${hasMatchingActivities}`);
          return hasMatchingActivities ? project : null;
        } catch (error) {
          console.error(`Error checking project ${project.project_name}:`, error);
          return null;
        }
      })
    );
    
    // Filter out null values (projects without matching activities)
    const filteredProjects = results.filter(project => project !== null);
    console.log(`✅ Found ${filteredProjects.length} projects with activities having status "${activityStatus}"`);
    
    return filteredProjects;
  } catch (error) {
    console.error('Error filtering projects by activity status:', error);
    return projects; // Return original list if filtering fails
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
