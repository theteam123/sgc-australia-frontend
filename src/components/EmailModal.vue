<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-dialog modal-lg" @click.stop>
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="fill-width flex title-section">
            <span class="indicator" :class="{ hidden: !hasChanges }"></span>
            <h4 class="modal-title">New Email</h4>
          </div>
          <div class="modal-actions">
            <button class="btn btn-modal-minimize btn-link" @click="minimizeModal">
              <svg class="icon icon-sm" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            <button class="btn btn-modal-close btn-link" @click="closeModal">
              <svg class="icon icon-sm" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="sendEmail">
            <!-- Recipients Section -->
            <div class="form-section to-section">
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label required">To</label>
                  <div class="control-wrapper">
                    <input 
                      type="email" 
                      v-model="emailForm.recipients" 
                      class="form-control recipients-input"
                      placeholder="Enter email addresses..."
                      multiple
                      required
                    >
                  </div>
                </div>
                <button 
                  type="button" 
                  class="btn btn-xs btn-toggle" 
                  @click="showMoreOptions = !showMoreOptions"
                  :title="showMoreOptions ? 'Hide options' : 'Show more options'"
                >
                  <svg class="icon icon-xs" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="currentColor" :d="showMoreOptions ? 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' : 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z'"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- More Options (CC, BCC, Schedule) -->
            <div v-if="showMoreOptions" class="form-section more-options">
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label">CC</label>
                  <div class="control-wrapper">
                    <input 
                      type="email" 
                      v-model="emailForm.cc" 
                      class="form-control"
                      placeholder="Carbon copy..."
                      multiple
                    >
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label">BCC</label>
                  <div class="control-wrapper">
                    <input 
                      type="email" 
                      v-model="emailForm.bcc" 
                      class="form-control"
                      placeholder="Blind carbon copy..."
                      multiple
                    >
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label">Schedule Send At</label>
                  <div class="control-wrapper">
                    <input 
                      type="datetime-local" 
                      v-model="emailForm.sendAfter" 
                      class="form-control"
                    >
                    <div class="help-text">Australia/Perth</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Email Template Section -->
            <div v-if="showMoreOptions" class="form-section template-section">
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label">Email Template</label>
                  <div class="control-wrapper">
                    <select v-model="emailForm.emailTemplate" class="form-control">
                      <option value="">Select template...</option>
                      <option value="project-update">Project Update</option>
                      <option value="meeting-invite">Meeting Invitation</option>
                      <option value="status-report">Status Report</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-row" v-if="emailForm.emailTemplate">
                <div class="template-actions">
                  <button type="button" class="btn btn-sm btn-secondary" @click="addTemplate">
                    Add Template
                  </button>
                  <button type="button" class="btn btn-sm btn-secondary" @click="clearAndAddTemplate">
                    Clear & Add Template
                  </button>
                </div>
              </div>
            </div>

            <!-- Subject and Message -->
            <div class="form-section content-section">
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label required">Subject</label>
                  <div class="control-wrapper">
                    <input 
                      type="text" 
                      v-model="emailForm.subject" 
                      class="form-control subject-input"
                      placeholder="Email subject..."
                      required
                    >
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label">Message</label>
                  <div class="control-wrapper">
                    <div class="editor-toolbar">
                      <button type="button" class="editor-btn" @click="formatText('bold')" title="Bold">
                        <strong>B</strong>
                      </button>
                      <button type="button" class="editor-btn" @click="formatText('italic')" title="Italic">
                        <em>I</em>
                      </button>
                      <button type="button" class="editor-btn" @click="formatText('underline')" title="Underline">
                        <u>U</u>
                      </button>
                      <button type="button" class="editor-btn" @click="insertLink" title="Insert Link">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </svg>
                      </button>
                    </div>
                    <textarea 
                      ref="messageEditor"
                      v-model="emailForm.content" 
                      class="form-control message-editor"
                      placeholder="Type your message..."
                      rows="8"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Options and Attachments -->
            <div class="form-section options-section">
              <div class="form-row">
                <div class="form-col">
                  <div class="checkbox-group">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="emailForm.sendMeCopy">
                      <span class="checkmark"></span>
                      Send me a copy
                    </label>
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="emailForm.sendReadReceipt">
                      <span class="checkmark"></span>
                      Send Read Receipt
                    </label>
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="emailForm.attachDocumentPrint" @change="togglePrintFormat">
                      <span class="checkmark"></span>
                      Attach Document Print
                    </label>
                  </div>
                  <div v-if="emailForm.attachDocumentPrint" class="print-format-section">
                    <label class="control-label">Select Print Format</label>
                    <select v-model="emailForm.printFormat" class="form-control">
                      <option value="Standard">Standard</option>
                      <option value="Detailed">Detailed</option>
                      <option value="Summary">Summary</option>
                    </select>
                  </div>
                </div>
                <div class="form-col">
                  <div class="attachments-section">
                    <label class="control-label">Select Attachments</label>
                    <div class="attach-list">
                      <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
                        <span class="attachment-name">{{ file.name }}</span>
                        <button type="button" class="btn-remove" @click="removeAttachment(index)">
                          <svg width="12" height="12" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button type="button" class="btn btn-xs btn-add-attachment" @click="addAttachment">
                      <svg class="icon icon-xs" width="14" height="14" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Add Attachment
                    </button>
                    <input ref="fileInput" type="file" multiple style="display: none" @change="handleFileSelect">
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="custom-actions">
            <!-- Custom action buttons can go here -->
          </div>
          <div class="standard-actions">
            <button type="button" class="btn btn-secondary btn-sm" @click="discardEmail">
              Discard
            </button>
            <button 
              type="button" 
              class="btn btn-primary btn-sm" 
              @click="sendEmail"
              :disabled="!canSend || isSending"
            >
              <span v-if="isSending">Sending...</span>
              <span v-else>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getCurrentToken } from '../services/oauth'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  doctype: {
    type: String,
    required: true
  },
  docname: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'sent'])

// Reactive data
const showMoreOptions = ref(false)
const isSending = ref(false)
const hasChanges = ref(false)
const attachments = ref([])

const emailForm = ref({
  recipients: '',
  cc: '',
  bcc: '',
  subject: `Re: ${props.doctype} ${props.docname}`,
  content: '',
  sendAfter: '',
  emailTemplate: '',
  sendMeCopy: false,
  sendReadReceipt: false,
  attachDocumentPrint: false,
  printFormat: 'Standard'
})

// File input ref
const fileInput = ref(null)
const messageEditor = ref(null)

// Computed
const canSend = computed(() => {
  return emailForm.value.recipients.trim() && 
         emailForm.value.subject.trim() && 
         emailForm.value.content.trim()
})

// Watch for changes
watch(emailForm, () => {
  hasChanges.value = true
}, { deep: true })

// Methods
const closeModal = () => {
  if (hasChanges.value) {
    if (confirm('You have unsaved changes. Are you sure you want to close?')) {
      resetForm()
      emit('close')
    }
  } else {
    emit('close')
  }
}

const minimizeModal = () => {
  // Implement minimize functionality if needed
  console.log('Minimize modal')
}

const discardEmail = () => {
  if (confirm('Are you sure you want to discard this email?')) {
    resetForm()
    emit('close')
  }
}

const resetForm = () => {
  emailForm.value = {
    recipients: '',
    cc: '',
    bcc: '',
    subject: `Re: ${props.doctype} ${props.docname}`,
    content: '',
    sendAfter: '',
    emailTemplate: '',
    sendMeCopy: false,
    sendReadReceipt: false,
    attachDocumentPrint: false,
    printFormat: 'Standard'
  }
  attachments.value = []
  hasChanges.value = false
  showMoreOptions.value = false
}

const sendEmail = async () => {
  if (!canSend.value || isSending.value) return
  
  isSending.value = true
  
  try {
    const token = await getCurrentToken()
    
    // Prepare email data
    const emailData = {
      recipients: emailForm.value.recipients.split(',').map(email => email.trim()),
      cc: emailForm.value.cc ? emailForm.value.cc.split(',').map(email => email.trim()) : [],
      bcc: emailForm.value.bcc ? emailForm.value.bcc.split(',').map(email => email.trim()) : [],
      subject: emailForm.value.subject,
      content: emailForm.value.content,
      reference_doctype: props.doctype,
      reference_name: props.docname,
      send_after: emailForm.value.sendAfter || null,
      send_me_a_copy: emailForm.value.sendMeCopy,
      send_read_receipt: emailForm.value.sendReadReceipt,
      attach_document_print: emailForm.value.attachDocumentPrint,
      print_format: emailForm.value.printFormat
    }
    
    const response = await fetch('/api/method/frappe.email.queue.send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailData)
    })
    
    if (response.ok) {
      emit('sent', emailData)
      resetForm()
      emit('close')
    } else {
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
    alert('Failed to send email. Please try again.')
  } finally {
    isSending.value = false
  }
}

const addTemplate = () => {
  const templates = {
    'project-update': 'Hi,\n\nHere is an update on the project progress:\n\n',
    'meeting-invite': 'Hi,\n\nYou are invited to a meeting regarding this project.\n\n',
    'status-report': 'Hi,\n\nPlease find the latest status report below:\n\n'
  }
  
  const template = templates[emailForm.value.emailTemplate]
  if (template) {
    emailForm.value.content = template + emailForm.value.content
  }
}

const clearAndAddTemplate = () => {
  const templates = {
    'project-update': 'Hi,\n\nHere is an update on the project progress:\n\n',
    'meeting-invite': 'Hi,\n\nYou are invited to a meeting regarding this project.\n\n',
    'status-report': 'Hi,\n\nPlease find the latest status report below:\n\n'
  }
  
  const template = templates[emailForm.value.emailTemplate]
  if (template) {
    emailForm.value.content = template
  }
}

const togglePrintFormat = () => {
  // Additional logic for print format toggle if needed
}

const addAttachment = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    attachments.value.push({
      name: file.name,
      size: file.size,
      file: file
    })
  })
  
  // Reset the input
  event.target.value = ''
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const formatText = (command) => {
  document.execCommand(command, false, null)
  messageEditor.value?.focus()
}

const insertLink = () => {
  const url = prompt('Enter URL:')
  if (url) {
    document.execCommand('createLink', false, url)
    messageEditor.value?.focus()
  }
}
</script>

<style scoped>
@import '../styles/monday-design-system.css';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(4px);
}

.modal-dialog {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-content {
  background: var(--monday-white);
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--monday-light);
  background: var(--monday-background);
}

.title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--monday-orange);
}

.indicator.hidden {
  display: none;
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--monday-dark);
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-modal-minimize,
.btn-modal-close {
  background: none;
  border: none;
  color: var(--monday-medium);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-modal-minimize:hover,
.btn-modal-close:hover {
  background: var(--monday-very-light);
  color: var(--monday-dark);
}

/* Modal Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg) var(--spacing-xl);
}

/* Form Sections */
.form-section {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  align-items: flex-start;
}

.form-field {
  flex: 1;
}

.control-label {
  display: block;
  font-weight: 600;
  color: var(--monday-dark);
  margin-bottom: var(--spacing-xs);
  font-size: var(--text-sm);
}

.control-label.required::after {
  content: '*';
  color: var(--monday-red);
  margin-left: 4px;
}

.control-wrapper {
  position: relative;
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  font-size: var(--text-base);
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(63, 217, 33, 0.1);
}

.btn-toggle {
  background: var(--monday-background);
  border: 1px solid var(--monday-light);
  color: var(--monday-medium-dark);
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 24px;
}

.btn-toggle:hover {
  background: var(--monday-very-light);
  border-color: var(--monday-medium);
}

.help-text {
  font-size: var(--text-xs);
  color: var(--monday-medium);
  margin-top: 4px;
}

/* Template Actions */
.template-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Editor */
.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: var(--spacing-xs);
  border: 1px solid var(--monday-light);
  border-bottom: none;
  background: var(--monday-background);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.editor-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--monday-medium-dark);
  font-size: var(--text-sm);
  transition: all 0.2s ease;
}

.editor-btn:hover {
  background: var(--monday-very-light);
  color: var(--monday-dark);
}

.message-editor {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
}

/* Checkboxes */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--monday-dark);
}

.checkbox-label input[type="checkbox"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid var(--monday-light);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-label input[type="checkbox"]:checked {
  background: var(--primary-green);
  border-color: var(--primary-green);
}

.checkbox-label input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* Two Column Layout */
.form-col {
  flex: 1;
}

/* Attachments */
.attachments-section {
  border: 1px solid var(--monday-light);
  border-radius: 6px;
  padding: var(--spacing-md);
}

.attach-list {
  margin-bottom: var(--spacing-sm);
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs);
  background: var(--monday-very-light);
  border-radius: 4px;
  margin-bottom: var(--spacing-xs);
}

.attachment-name {
  font-size: var(--text-sm);
  color: var(--monday-dark);
}

.btn-remove {
  background: none;
  border: none;
  color: var(--monday-medium);
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: var(--monday-light);
  color: var(--monday-red);
}

.btn-add-attachment {
  background: var(--monday-background);
  border: 1px solid var(--monday-light);
  color: var(--monday-medium-dark);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
}

.btn-add-attachment:hover {
  background: var(--monday-very-light);
  border-color: var(--monday-medium);
}

.print-format-section {
  margin-top: var(--spacing-sm);
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-top: 1px solid var(--monday-light);
  background: var(--monday-background);
}

.standard-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: var(--text-sm);
}

.btn-secondary {
  background: var(--monday-background);
  color: var(--monday-medium-dark);
  border: 1px solid var(--monday-light);
}

.btn-secondary:hover {
  background: var(--monday-very-light);
  border-color: var(--monday-medium);
}

.btn-primary {
  background: var(--primary-green);
  color: var(--monday-white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-green-hover);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: var(--monday-light);
  color: var(--monday-medium);
  cursor: not-allowed;
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--text-sm);
}
</style>