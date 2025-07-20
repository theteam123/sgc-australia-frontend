<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-dialog modal-lg" @click.stop>
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="fill-width flex title-section">
            <span class="indicator" :class="{ hidden: !hasChanges }"></span>
            <h4 class="modal-title">Send SMS</h4>
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
          <form @submit.prevent="sendSms">
            <!-- From Mobile and Recipient Section -->
            <div class="form-section recipient-section">
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label required">From Mobile</label>
                  <div class="control-wrapper">
                    <select v-model="smsForm.fromMobile" class="form-control" required>
                      <option value="">Select mobile number...</option>
                      <option value="recruitment">Recruitment</option>
                      <option value="main">Main Office</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                </div>
                <div class="form-field">
                  <label class="control-label required">Recipient</label>
                  <div class="control-wrapper">
                    <input 
                      type="text" 
                      v-model="smsForm.recipient" 
                      class="form-control"
                      placeholder="Contact name or select..."
                      required
                    >
                  </div>
                </div>
                <div class="form-field">
                  <label class="control-label required">Mobile Number</label>
                  <div class="control-wrapper">
                    <input 
                      type="tel" 
                      v-model="smsForm.mobileNumber" 
                      class="form-control"
                      placeholder="+61 xxx xxx xxx"
                      pattern="[\+]?[0-9\s\-\(\)]+"
                      required
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Section -->
            <div class="form-section message-section">
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label required">Message Title</label>
                  <div class="control-wrapper">
                    <input 
                      type="text" 
                      v-model="smsForm.messageTitle" 
                      class="form-control"
                      placeholder="SMS title..."
                      maxlength="140"
                      required
                    >
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label required">Message</label>
                  <div class="control-wrapper">
                    <div class="message-container">
                      <textarea 
                        v-model="smsForm.message" 
                        class="form-control message-input"
                        placeholder="Type your SMS message..."
                        rows="6"
                        :maxlength="maxSmsLength"
                        required
                      ></textarea>
                      <div class="message-counter">
                        <span :class="{ 'warning': characterCount > 160, 'danger': characterCount > maxSmsLength }">
                          {{ characterCount }}/{{ maxSmsLength }}
                        </span>
                        <span class="message-parts" v-if="messageSegments > 1">
                          ({{ messageSegments }} SMS{{ messageSegments > 1 ? 's' : '' }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SMS Templates Section -->
            <div class="form-section template-section">
              <div class="form-row">
                <div class="form-field">
                  <label class="control-label">SMS Template</label>
                  <div class="control-wrapper">
                    <select v-model="smsForm.template" class="form-control">
                      <option value="">Select template...</option>
                      <option value="reminder">Appointment Reminder</option>
                      <option value="confirmation">Confirmation</option>
                      <option value="update">Project Update</option>
                      <option value="payment">Payment Reminder</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-row" v-if="smsForm.template">
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

            <!-- Options Section -->
            <div class="form-section options-section">
              <div class="form-row">
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="smsForm.sendLater">
                    <span class="checkmark"></span>
                    Schedule SMS
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="smsForm.saveTemplate">
                    <span class="checkmark"></span>
                    Save as Template
                  </label>
                </div>
              </div>
              <div v-if="smsForm.sendLater" class="form-row">
                <div class="form-field">
                  <label class="control-label">Send At</label>
                  <div class="control-wrapper">
                    <input 
                      type="datetime-local" 
                      v-model="smsForm.sendAt" 
                      class="form-control"
                    >
                    <div class="help-text">Australia/Perth</div>
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
            <button type="button" class="btn btn-secondary btn-sm" @click="discardSms">
              Discard
            </button>
            <button 
              type="button" 
              class="btn btn-primary btn-sm" 
              @click="sendSms"
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
const isSending = ref(false)
const hasChanges = ref(false)
const maxSmsLength = ref(320) // Allow for 2 SMS segments

const smsForm = ref({
  fromMobile: '',
  recipient: '',
  mobileNumber: '',
  messageTitle: `SMS: ${props.doctype} ${props.docname}`,
  message: '',
  template: '',
  sendLater: false,
  sendAt: '',
  saveTemplate: false
})

// Computed
const canSend = computed(() => {
  return smsForm.value.fromMobile.trim() && 
         smsForm.value.recipient.trim() && 
         smsForm.value.mobileNumber.trim() && 
         smsForm.value.messageTitle.trim() && 
         smsForm.value.message.trim()
})

const characterCount = computed(() => {
  return smsForm.value.message.length
})

const messageSegments = computed(() => {
  const length = characterCount.value
  if (length <= 160) return 1
  return Math.ceil(length / 153) // SMS segments after first are 153 chars
})

// Watch for changes
watch(smsForm, () => {
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

const discardSms = () => {
  if (confirm('Are you sure you want to discard this SMS?')) {
    resetForm()
    emit('close')
  }
}

const resetForm = () => {
  smsForm.value = {
    fromMobile: '',
    recipient: '',
    mobileNumber: '',
    messageTitle: `SMS: ${props.doctype} ${props.docname}`,
    message: '',
    template: '',
    sendLater: false,
    sendAt: '',
    saveTemplate: false
  }
  hasChanges.value = false
}

const sendSms = async () => {
  if (!canSend.value || isSending.value) return
  
  isSending.value = true
  
  try {
    const token = await getCurrentToken()
    
    // Prepare SMS data
    const smsData = {
      from_mobile: smsForm.value.fromMobile,
      recipient: smsForm.value.recipient,
      mobile_number: smsForm.value.mobileNumber,
      message_title: smsForm.value.messageTitle,
      message: smsForm.value.message,
      reference_doctype: props.doctype,
      reference_name: props.docname,
      send_after: smsForm.value.sendLater ? smsForm.value.sendAt : null,
      save_as_template: smsForm.value.saveTemplate
    }
    
    const response = await fetch('/api/method/frappe.core.doctype.sms_settings.sms_settings.send_sms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(smsData)
    })
    
    if (response.ok) {
      emit('sent', smsData)
      resetForm()
      emit('close')
    } else {
      throw new Error('Failed to send SMS')
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    alert('Failed to send SMS. Please try again.')
  } finally {
    isSending.value = false
  }
}

const addTemplate = () => {
  const templates = {
    'reminder': 'Hi [Name], this is a reminder about your appointment on [Date]. Please confirm your attendance.',
    'confirmation': 'Your request has been confirmed. Reference: [Reference]. We will contact you soon.',
    'update': 'Project update: [Project] status has been updated. Please check the latest details.',
    'payment': 'Payment reminder: Your payment for [Invoice] is due on [Date]. Please arrange payment.'
  }
  
  const template = templates[smsForm.value.template]
  if (template) {
    smsForm.value.message = template + '\n\n' + smsForm.value.message
  }
}

const clearAndAddTemplate = () => {
  const templates = {
    'reminder': 'Hi [Name], this is a reminder about your appointment on [Date]. Please confirm your attendance.',
    'confirmation': 'Your request has been confirmed. Reference: [Reference]. We will contact you soon.',
    'update': 'Project update: [Project] status has been updated. Please check the latest details.',
    'payment': 'Payment reminder: Your payment for [Invoice] is due on [Date]. Please arrange payment.'
  }
  
  const template = templates[smsForm.value.template]
  if (template) {
    smsForm.value.message = template
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
  max-width: 700px;
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

.recipient-section .form-row {
  flex-wrap: wrap;
}

.recipient-section .form-field {
  flex: 1;
  min-width: 200px;
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

.help-text {
  font-size: var(--text-xs);
  color: var(--monday-medium);
  margin-top: 4px;
}

/* Message Section */
.message-container {
  position: relative;
}

.message-input {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.message-counter {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: var(--text-xs);
  color: var(--monday-medium);
  background: var(--monday-white);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--monday-very-light);
}

.message-counter .warning {
  color: var(--monday-orange);
}

.message-counter .danger {
  color: var(--monday-red);
}

.message-parts {
  margin-left: var(--spacing-xs);
  font-style: italic;
}

/* Template Actions */
.template-actions {
  display: flex;
  gap: var(--spacing-sm);
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

/* Responsive */
@media (max-width: 768px) {
  .recipient-section .form-row {
    flex-direction: column;
  }
  
  .recipient-section .form-field {
    min-width: auto;
  }
}
</style>