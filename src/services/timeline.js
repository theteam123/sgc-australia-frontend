import { getCurrentToken } from './oauth';

/**
 * Get timeline data for a document from Frappe
 * @param {string} doctype - The document type (e.g., 'Project')
 * @param {string} docname - The document name/ID
 * @returns {Promise<Object>} Timeline data from Frappe
 */
export const getTimelineData = async (doctype, docname) => {
  try {
    const token = await getCurrentToken();
    
    const response = await fetch(`/api/method/frappe.desk.form.load.get_timeline_data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        doctype: doctype,
        name: docname,
        with_comments: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch timeline data: ${response.status}`);
    }

    const data = await response.json();
    return data.message || {};
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    throw error;
  }
};

/**
 * Get comments for a document
 * @param {string} doctype - The document type
 * @param {string} docname - The document name/ID
 * @returns {Promise<Array>} Array of comments
 */
export const getComments = async (doctype, docname) => {
  try {
    const token = await getCurrentToken();
    
    const response = await fetch(`/api/resource/Comment`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter comments for this document
    const comments = data.data?.filter(comment => 
      comment.reference_doctype === doctype && 
      comment.reference_name === docname
    ) || [];

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

/**
 * Get communications for a document
 * @param {string} doctype - The document type
 * @param {string} docname - The document name/ID
 * @returns {Promise<Array>} Array of communications
 */
export const getCommunications = async (doctype, docname) => {
  try {
    const token = await getCurrentToken();
    
    const response = await fetch(`/api/resource/Communication`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch communications: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter communications for this document
    const communications = data.data?.filter(comm => 
      comm.reference_doctype === doctype && 
      comm.reference_name === docname
    ) || [];

    return communications;
  } catch (error) {
    console.error('Error fetching communications:', error);
    return [];
  }
};

/**
 * Add a comment to a document
 * @param {string} doctype - The document type
 * @param {string} docname - The document name/ID
 * @param {string} content - The comment content
 * @returns {Promise<Object>} Comment creation response
 */
export const addComment = async (doctype, docname, content) => {
  try {
    const token = await getCurrentToken();
    
    const response = await fetch(`/api/method/frappe.desk.form.utils.add_comment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        reference_doctype: doctype,
        reference_name: docname,
        content: content,
        comment_email: 'Administrator', // This should be the current user's email
        comment_by: 'Administrator' // This should be the current user's name
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get document versions/history
 * @param {string} doctype - The document type
 * @param {string} docname - The document name/ID
 * @returns {Promise<Array>} Array of document versions
 */
export const getDocumentVersions = async (doctype, docname) => {
  try {
    const token = await getCurrentToken();
    
    const response = await fetch(`/api/resource/Version`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch document versions: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter versions for this document
    const versions = data.data?.filter(version => 
      version.ref_doctype === doctype && 
      version.docname === docname
    ) || [];

    return versions;
  } catch (error) {
    console.error('Error fetching document versions:', error);
    return [];
  }
};

/**
 * Process and combine timeline data from different sources
 * @param {string} doctype - The document type
 * @param {string} docname - The document name/ID
 * @returns {Promise<Array>} Combined and sorted timeline items
 */
export const getCombinedTimelineData = async (doctype, docname) => {
  try {
    // Fetch data from multiple sources in parallel
    const [comments, communications, versions] = await Promise.all([
      getComments(doctype, docname),
      getCommunications(doctype, docname),
      getDocumentVersions(doctype, docname)
    ]);

    const timelineItems = [];

    // Process comments
    comments.forEach(comment => {
      timelineItems.push({
        timestamp: comment.creation,
        doctype: 'Comment',
        name: comment.name,
        content: comment.content,
        sender: comment.owner,
        sender_name: comment.owner,
        action: 'commented'
      });
    });

    // Process communications
    communications.forEach(comm => {
      timelineItems.push({
        timestamp: comm.creation,
        doctype: 'Communication',
        name: comm.name,
        content: comm.content,
        sender: comm.sender,
        sender_name: comm.sender_full_name || comm.sender,
        subject: comm.subject,
        action: 'sent email'
      });
    });

    // Process versions (document changes)
    versions.forEach(version => {
      timelineItems.push({
        timestamp: version.creation,
        doctype: 'Version',
        name: version.name,
        content: `Document was ${version.action || 'modified'}`,
        sender: version.owner,
        sender_name: version.owner,
        action: version.action || 'modified'
      });
    });

    // Add creation entry (this would typically come from the document itself)
    timelineItems.push({
      timestamp: new Date().toISOString(), // This should be the document creation time
      content: 'You created this',
      action: 'created'
    });

    // Sort by timestamp (newest first)
    return timelineItems.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error('Error getting combined timeline data:', error);
    throw error;
  }
};