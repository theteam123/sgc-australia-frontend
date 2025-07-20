import { getErpNextApiUrl, getApiKeyAuthHeader, fetchWithErrorHandling } from '../utils/api'

/**
 * Document creation service for ERPNext doctypes
 */

/**
 * Create a new Sales Order
 */
export const createSalesOrder = async (projectData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    
    const salesOrderData = {
      project: projectData.project_code,
      customer: projectData.organisation,
      division: projectData.division,
      customer_purchase_order: projectData.customer_purchase_order || '',
      customer_purchase_order_date: projectData.customer_purchase_order_date || new Date().toISOString().split('T')[0],
      payment_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      items: [
        {
          item: 'Service Item',
          quantity: 1,
          rate: projectData.estimated_revenue || 0,
          tax: 10
        }
      ]
    }

    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Sales Order`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(salesOrderData)
      },
      'create sales order'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating sales order:', error)
    throw error
  }
}

/**
 * Create a new Sales Invoice
 */
export const createSalesInvoice = async (projectData, salesOrder = null) => {
  try {
    const baseUrl = getErpNextApiUrl()
    
    const salesInvoiceData = {
      sales_order: salesOrder?.name || '',
      project: projectData.project_code,
      division: projectData.division,
      customer: projectData.organisation,
      customer_purchase_order: projectData.customer_purchase_order || '',
      customer_purchase_order_date: projectData.customer_purchase_order_date || new Date().toISOString().split('T')[0],
      items: [
        {
          item: 'Service Item',
          quantity: 1,
          rate: projectData.estimated_revenue || 0,
          tax: 10
        }
      ]
    }

    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Sales Invoice`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(salesInvoiceData)
      },
      'create sales invoice'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating sales invoice:', error)
    throw error
  }
}

/**
 * Create a new Purchase Order
 */
export const createPurchaseOrder = async (projectData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    
    const purchaseOrderData = {
      project: projectData.project_code,
      customer: projectData.organisation,
      division: projectData.division,
      customer_purchase_order: projectData.customer_purchase_order || '',
      customer_purchase_order_date: projectData.customer_purchase_order_date || new Date().toISOString().split('T')[0],
      payment_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      items: [
        {
          item: 'Purchase Item',
          quantity: 1,
          rate: projectData.estimated_purchase_cost || 0,
          tax: 10
        }
      ]
    }

    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Purchase Order`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseOrderData)
      },
      'create purchase order'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating purchase order:', error)
    throw error
  }
}

/**
 * Create a new Purchase Invoice
 */
export const createPurchaseInvoice = async (projectData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    
    const purchaseInvoiceData = {
      project: projectData.project_code,
      division: projectData.division,
      customer: projectData.organisation,
      customer_purchase_order: projectData.customer_purchase_order || '',
      customer_purchase_order_date: projectData.customer_purchase_order_date || new Date().toISOString().split('T')[0],
      items: [
        {
          item: 'Purchase Item',
          quantity: 1,
          rate: projectData.estimated_purchase_cost || 0,
          tax: 10
        }
      ]
    }

    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Purchase Invoice`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseInvoiceData)
      },
      'create purchase invoice'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating purchase invoice:', error)
    throw error
  }
}

/**
 * Create a new Activity
 */
export const createActivity = async (projectData, activityName = 'New Activity') => {
  try {
    const baseUrl = getErpNextApiUrl()
    
    const activityData = {
      project: projectData.project_code,
      activity_name: activityName,
      status: 'Open',
      estimated_hours: 8,
      start_date: projectData.project_start_date || new Date().toISOString().split('T')[0],
      end_date: projectData.project_end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      completion: 0
    }

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
 * Create a new Timesheet
 */
export const createTimesheet = async (projectData, employeeName = 'Default Employee') => {
  try {
    const baseUrl = getErpNextApiUrl()
    
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000) // 7 days later
    
    const timesheetData = {
      employee: employeeName,
      employee_name: employeeName,
      timesheet_approver: employeeName,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      timesheet_entries: [
        {
          weekday: 'Monday',
          date: startDate.toISOString().split('T')[0],
          project: projectData.project_code,
          task: 'General Work',
          rate_type: 'Standard Rate',
          hours: 8,
          comment: 'Initial timesheet entry'
        }
      ]
    }

    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Timesheet`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(timesheetData)
      },
      'create timesheet'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating timesheet:', error)
    throw error
  }
}

/**
 * Create a new Staffing Plan
 */
export const createStaffingPlan = async (projectData) => {
  try {
    const baseUrl = getErpNextApiUrl()
    
    const staffingPlanData = {
      project: projectData.project_code,
      project_name: projectData.project_name,
      start_date: projectData.project_start_date || new Date().toISOString().split('T')[0],
      end_date: projectData.project_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      assignments: [
        {
          employee: 'Default Employee',
          rate_type: 'Standard Rate',
          cost_rate: 150,
          bill_rate: 200,
          start_date: projectData.project_start_date || new Date().toISOString().split('T')[0],
          end_date: projectData.project_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ]
    }

    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Staffing Plan`,
      {
        method: 'POST',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffingPlanData)
      },
      'create staffing plan'
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating staffing plan:', error)
    throw error
  }
}

/**
 * Get document by doctype and name
 */
export const getDocument = async (doctype, name) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/${doctype}/${name}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch document',
      `${doctype}/${name}`
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching document:', error)
    throw error
  }
}

/**
 * Get all documents of a specific doctype for a project
 */
export const getProjectDocuments = async (doctype, projectCode) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/${doctype}?filters=[["project","=","${projectCode}"]]`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch project documents',
      `${doctype} for ${projectCode}`
    )
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching project documents:', error)
    return []
  }
}

/**
 * Get all activities for a specific project
 */
export const getProjectActivities = async (projectCode) => {
  try {
    const baseUrl = getErpNextApiUrl()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/api/resource/Activity?filters=[["project","=","${projectCode}"]]&fields=["name","activity_name","status","start_date","end_date","completion","estimated_hours","actual_hours"]`,
      {
        method: 'GET',
        headers: {
          'Authorization': getApiKeyAuthHeader(),
          'Content-Type': 'application/json'
        }
      },
      'fetch project activities',
      `Activities for ${projectCode}`
    )
    
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching project activities:', error)
    return []
  }
}