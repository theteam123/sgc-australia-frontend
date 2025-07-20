<template>
  <div class="timeline-container">
    <!-- Action Buttons -->
    <div class="action-buttons-top">
      <button class="action-btn" @click="showEmailModal = true">
        <svg class="icon" width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        New Email
      </button>
      <button class="action-btn" @click="showSmsModal = true">
        <svg class="icon" width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
        New SMS
      </button>
    </div>

    <!-- Comments Section -->
    <div class="comments-section">
      <div class="section-header">
        <div class="header-left">
          <h4 class="section-title">Comments</h4>
          <span class="comment-count">({{ comments.length }})</span>
        </div>
        <div class="header-right">
          <div class="show-all-toggle">
            <span class="toggle-label">Show all activity</span>
            <label class="modern-switch">
              <input type="checkbox" v-model="showAllActivity" @change="loadTimelineData">
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Add Comment -->
      <div class="add-comment-section">
        <div class="comment-input-container">
          <div class="user-avatar">
            <div class="avatar-circle">
              {{ currentUser?.charAt(0)?.toUpperCase() || 'A' }}
            </div>
          </div>
          <div class="input-wrapper">
            <textarea 
              class="comment-input" 
              placeholder="Add a comment..."
              v-model="newComment"
              @keydown.ctrl.enter="submitComment"
              rows="2">
            </textarea>
            <button 
              class="btn-submit" 
              @click="submitComment"
              :disabled="!newComment.trim()"
              :class="{ 'disabled': !newComment.trim() }">
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Loading activity...</span>
    </div>

    <!-- Timeline -->
    <div v-else class="timeline-section">

      <div class="timeline-items">
        <div v-for="item in filteredTimelineItems" 
             :key="item.id || item.timestamp"
             class="timeline-item">
          
          <!-- Timeline indicator -->
          <div class="timeline-indicator">
            <div v-if="item.doctype === 'Comment'" class="indicator-icon comment">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div v-else-if="item.doctype === 'Communication'" class="indicator-icon email">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div v-else class="indicator-dot"></div>
          </div>

          <!-- Timeline content -->
          <div class="timeline-content">
            <div class="timeline-card" v-if="item.doctype">
              <div class="card-header">
                <div class="user-info">
                  <div class="user-avatar small">
                    {{ (item.sender_name || item.sender || 'U')?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="user-details">
                    <span class="user-name">{{ item.sender_name || item.sender || 'Unknown User' }}</span>
                    <span class="action-type">{{ getActionText(item) }}</span>
                    <span class="timestamp">{{ formatTimestamp(item.timestamp) }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <button class="action-menu-btn" @click="showMoreActions(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="card-content">
                <div v-if="item.subject" class="content-subject">{{ item.subject }}</div>
                <div class="content-body" v-html="formatContent(item.content)"></div>
              </div>
            </div>
            
            <!-- Simple activity item -->
            <div v-else class="simple-activity">
              <span class="activity-text">{{ item.content }}</span>
              <span class="activity-time">{{ formatTimestamp(item.timestamp) }}</span>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredTimelineItems.length === 0" class="empty-state">
          <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <p class="empty-message">No activity yet</p>
          <p class="empty-submessage">Comments and communications will appear here</p>
        </div>
      </div>
    </div>

    <!-- Email Modal -->
    <EmailModal 
      :isVisible="showEmailModal" 
      :doctype="props.doctype" 
      :docname="props.docname"
      @close="showEmailModal = false"
      @sent="handleEmailSent"
    />

    <!-- SMS Modal -->
    <SmsModal 
      :isVisible="showSmsModal" 
      :doctype="props.doctype" 
      :docname="props.docname"
      @close="showSmsModal = false"
      @sent="handleSmsSent"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCurrentToken } from '../services/oauth'
import { getCombinedTimelineData, addComment } from '../services/timeline'
import EmailModal from './EmailModal.vue'
import SmsModal from './SmsModal.vue'

// Props
const props = defineProps({
  doctype: {
    type: String,
    required: true
  },
  docname: {
    type: String,
    required: true
  }
})

// Reactive data
const timelineItems = ref([])
const comments = ref([])
const showAllActivity = ref(false)
const newComment = ref('')
const loading = ref(false)
const currentUser = ref('Administrator')
const showEmailModal = ref(false)
const showSmsModal = ref(false)

// Computed
const filteredTimelineItems = computed(() => {
  if (showAllActivity.value) {
    return timelineItems.value
  }
  // Show only comments and communications by default
  return timelineItems.value.filter(item => 
    ['Comment', 'Communication'].includes(item.doctype) || !item.doctype
  )
})

// Methods
const loadTimelineData = async () => {
  loading.value = true
  try {
    console.log('Loading timeline data for:', props.doctype, props.docname)
    
    // Fetch timeline data directly from Frappe API
    const token = await getCurrentToken()
    
    // Get comments
    const commentsResponse = await fetch(`/api/resource/Comment?filters=[["reference_doctype","=","${props.doctype}"],["reference_name","=","${props.docname}"]]&fields=["*"]`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    let fetchedComments = []
    if (commentsResponse.ok) {
      const commentsData = await commentsResponse.json()
      fetchedComments = commentsData.data || []
    }
    
    // Get communications  
    const communicationsResponse = await fetch(`/api/resource/Communication?filters=[["reference_doctype","=","${props.doctype}"],["reference_name","=","${props.docname}"]]&fields=["*"]`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    let fetchedCommunications = []
    if (communicationsResponse.ok) {
      const communicationsData = await communicationsResponse.json()
      fetchedCommunications = communicationsData.data || []
    }
    
    // Combine all timeline items
    const allItems = []
    
    // Add comments
    fetchedComments.forEach(comment => {
      allItems.push({
        id: comment.name,
        timestamp: comment.creation,
        doctype: 'Comment',
        name: comment.name,
        content: comment.content,
        sender: comment.owner,
        sender_name: comment.comment_by || comment.owner,
        action: 'commented'
      })
    })
    
    // Add communications
    fetchedCommunications.forEach(comm => {
      allItems.push({
        id: comm.name,
        timestamp: comm.creation,
        doctype: 'Communication',
        name: comm.name,
        content: comm.content,
        sender: comm.sender,
        sender_name: comm.sender_full_name || comm.sender,
        subject: comm.subject,
        action: 'sent email'
      })
    })
    
    // Add a creation entry
    allItems.push({
      id: 'creation',
      timestamp: new Date().toISOString(),
      content: 'You created this project',
      action: 'created'
    })
    
    // Sort by timestamp (newest first)
    timelineItems.value = allItems.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
    
    comments.value = fetchedComments
    
    console.log('Timeline data loaded:', {
      comments: fetchedComments.length,
      communications: fetchedCommunications.length,
      total: allItems.length
    })
    
  } catch (error) {
    console.error('Error loading timeline data:', error)
    timelineItems.value = []
    comments.value = []
  } finally {
    loading.value = false
  }
}


const formatTimelineAction = (item) => {
  if (item.action === 'create') return 'You created this'
  if (item.action === 'update') return 'You last edited this'
  return item.action || 'Activity occurred'
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    const token = await getCurrentToken()
    
    const response = await fetch(`/api/method/frappe.desk.form.utils.add_comment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        reference_doctype: props.doctype,
        reference_name: props.docname,
        content: newComment.value,
        comment_email: currentUser.value,
        comment_by: currentUser.value
      })
    })

    if (response.ok) {
      newComment.value = ''
      await loadTimelineData() // Refresh timeline
    } else {
      throw new Error('Failed to add comment')
    }
  } catch (error) {
    console.error('Error submitting comment:', error)
  }
}

const getActionText = (item) => {
  if (item.doctype === 'Comment') return 'commented'
  if (item.doctype === 'Communication') return 'sent email'
  return item.action || 'made changes'
}

const formatContent = (content) => {
  if (!content) return ''
  // Basic HTML sanitization and formatting
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

const editComment = (comment) => {
  // Implementation for editing comments
  console.log('Edit comment:', comment)
}

const replyToEmail = (communication) => {
  // Implementation for replying to emails
  console.log('Reply to email:', communication)
}

const showMoreActions = (item) => {
  // Implementation for more actions dropdown
  console.log('More actions for:', item)
}

const handleEmailSent = (emailData) => {
  console.log('Email sent:', emailData)
  // Refresh timeline to show the new email communication
  loadTimelineData()
}

const handleSmsSent = (smsData) => {
  console.log('SMS sent:', smsData)
  // Refresh timeline to show the new SMS communication
  loadTimelineData()
}

// Lifecycle
onMounted(() => {
  loadTimelineData()
})
</script>

<style scoped>
@import '../styles/monday-design-system.css';

.timeline-container {
  padding: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

/* Action Buttons at Top */
.action-buttons-top {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--monday-white);
  border: 1px solid var(--monday-light);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Comments Section */
.comments-section {
  background: var(--monday-white);
  border: 1px solid var(--monday-light);
  border-radius: 12px;
  margin-bottom: var(--spacing-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--monday-very-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.comment-count {
  background: var(--monday-very-light);
  color: var(--monday-medium-dark);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--text-sm);
  font-weight: 500;
}

.show-all-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.toggle-label {
  font-size: var(--text-sm);
  color: var(--monday-medium);
  font-weight: 500;
}

.modern-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.modern-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--monday-light);
  transition: 0.3s ease;
  border-radius: 24px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: var(--monday-white);
  transition: 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input:checked + .switch-slider {
  background-color: var(--primary-green);
}

input:checked + .switch-slider:before {
  transform: translateX(20px);
}

/* Add Comment Section */
.add-comment-section {
  padding: var(--spacing-lg) var(--spacing-xl);
}

.comment-input-container {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-green);
  color: var(--monday-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-base);
}

.input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.comment-input {
  width: 100%;
  min-height: 80px;
  padding: var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: 8px;
  font-family: inherit;
  font-size: var(--text-base);
  resize: vertical;
  transition: border-color 0.2s ease;
}

.comment-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(63, 217, 33, 0.1);
}

.btn-submit {
  align-self: flex-end;
  background: var(--primary-green);
  color: var(--monday-white);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover:not(.disabled) {
  background: var(--primary-green-hover);
  transform: translateY(-1px);
}

.btn-submit.disabled {
  background: var(--monday-light);
  color: var(--monday-medium);
  cursor: not-allowed;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xxl);
  gap: var(--spacing-md);
  color: var(--monday-medium);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--monday-very-light);
  border-top: 2px solid var(--primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Timeline Section */
.timeline-section {
  background: var(--monday-white);
  border: 1px solid var(--monday-light);
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--monday-very-light);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--monday-background);
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  color: var(--monday-medium-dark);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--monday-very-light);
  border-color: var(--monday-medium);
}

.timeline-items {
  position: relative;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 17px;
  top: 36px;
  bottom: 0;
  width: 2px;
  background: var(--monday-very-light);
}

.timeline-indicator {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.indicator-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--monday-white);
}

.indicator-icon.comment {
  background: var(--primary-green);
}

.indicator-icon.email {
  background: var(--monday-orange);
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--monday-medium);
  margin: 12px;
}

.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-card {
  background: var(--monday-background);
  border: 1px solid var(--monday-light);
  border-radius: 8px;
  padding: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.user-info {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.user-avatar.small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-green);
  color: var(--monday-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  color: var(--monday-dark);
  font-size: var(--text-sm);
}

.action-type {
  color: var(--monday-medium);
  font-size: var(--text-xs);
}

.timestamp {
  color: var(--monday-medium);
  font-size: var(--text-xs);
}

.action-menu-btn {
  background: none;
  border: none;
  color: var(--monday-medium);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-menu-btn:hover {
  background: var(--monday-very-light);
  color: var(--monday-dark);
}

.card-content {
  margin-top: var(--spacing-sm);
}

.content-subject {
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: var(--spacing-xs);
  font-size: var(--text-sm);
}

.content-body {
  color: var(--monday-medium-dark);
  line-height: 1.5;
  font-size: var(--text-sm);
}

.simple-activity {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}

.activity-text {
  color: var(--monday-medium-dark);
  font-size: var(--text-sm);
}

.activity-time {
  color: var(--monday-medium);
  font-size: var(--text-xs);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xxl);
  text-align: center;
  color: var(--monday-medium);
}

.empty-icon {
  opacity: 0.3;
  margin-bottom: var(--spacing-md);
}

.empty-message {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--monday-medium-dark);
  margin: 0 0 var(--spacing-xs) 0;
}

.empty-submessage {
  font-size: var(--text-sm);
  margin: 0;
}
</style>