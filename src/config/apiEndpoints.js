// Centralized API endpoint definitions

const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password'
  },

  // Enquiries
  ENQUIRIES: {
    LIST: '/enquiries',
    CREATE: '/enquiries',
    GET: (id) => `/enquiries/${id}`,
    UPDATE: (id) => `/enquiries/${id}`,
    DELETE: (id) => `/enquiries/${id}`,
    IMPORT: '/enquiries/import',
    EXPORT: '/enquiries/export',
    MERGE: '/enquiries/merge',
    FIND_DUPLICATES: '/enquiries/duplicates',
    
    ACTIVITIES: (id) => `/enquiries/${id}/activities`
  },

  // Leads
  LEADS: {
    LIST: '/leads',
    CREATE: '/leads',
    GET: (id) => `/leads/${id}`,
    UPDATE: (id) => `/leads/${id}`,
    DELETE: (id) => `/leads/${id}`,
    IMPORT: '/leads/import',
    EXPORT: '/leads/export',
    ASSIGN: (id) => `/leads/${id}/assign`,
    MERGE: '/leads/merge',
    ACTIVITIES: (id) => `/leads/${id}/activities`,
    DOCUMENTS: (id) => `/leads/${id}/documents`,
    UPLOAD_DOCUMENT: (id) => `/leads/${id}/documents`,
    DELETE_DOCUMENT: (leadId, docId) => `/leads/${leadId}/documents/${docId}`,
    CUSTOM_FIELDS: (id) => `/leads/${id}/custom-fields`
  },

  // Follow-ups
  FOLLOWUPS: {
    LIST: '/followups',
    CREATE: '/followups',
    GET: (id) => `/followups/${id}`,
    UPDATE: (id) => `/followups/${id}`,
    DELETE: (id) => `/followups/${id}`,
    DUE_TODAY: '/followups/due-today',
    SCHEDULED: '/followups/scheduled',
    OVERDUE: '/followups/overdue',
    NO_FOLLOWUPS: '/followups/none',
    BULK_UPDATE: '/followups/bulk-update'
  },

  // Conversions
  CONVERSIONS: {
    LIST: '/conversions',
    EXPORT: '/conversions/export',
    STATISTICS: '/conversions/statistics'
  },

  // Segmentation
  SEGMENTS: {
    LIST: '/segments',
    CREATE: '/segments',
    GET: (id) => `/segments/${id}`,
    UPDATE: (id) => `/segments/${id}`,
    DELETE: (id) => `/segments/${id}`,
    PREVIEW: '/segments/preview',
    LEADS: (id) => `/segments/${id}/leads`
  },

  // Call List
  CALL_LIST: {
    LIST: '/call-list',
    GENERATE_FROM_FOLLOWUPS: '/call-list/generate/followups',
    GENERATE_FROM_SEGMENT: (segmentId) => `/call-list/generate/segment/${segmentId}`,
    LOG_CALL: (id) => `/call-list/${id}/log`,
    UPDATE_STATUS: (id) => `/call-list/${id}/status`
  },

  // Tasks
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    GET: (id) => `/tasks/${id}`,
    UPDATE: (id) => `/tasks/${id}`,
    DELETE: (id) => `/tasks/${id}`,
    BULK_UPDATE: '/tasks/bulk-update',
    BY_LEAD: (leadId) => `/tasks/lead/${leadId}`
  },

  // Appointments
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    GET: (id) => `/appointments/${id}`,
    UPDATE: (id) => `/appointments/${id}`,
    DELETE: (id) => `/appointments/${id}`,
    CALENDAR: '/appointments/calendar',
    BY_LEAD: (leadId) => `/appointments/lead/${leadId}`,
    VIRTUAL: '/appointments/virtual',
    PHYSICAL: '/appointments/physical'
  },

  // Lead Activities
  ACTIVITIES: {
    LIST: '/activities',
    CREATE: '/activities',
    GET: (id) => `/activities/${id}`,
    DELETE: (id) => `/activities/${id}`,
    BY_LEAD: (leadId) => `/activities/lead/${leadId}`,
    TYPES: '/activities/types'
  },

  // Custom Events
  CUSTOM_EVENTS: {
    LIST: '/custom-events',
    CREATE: '/custom-events',
    GET: (id) => `/custom-events/${id}`,
    UPDATE: (id) => `/custom-events/${id}`,
    DELETE: (id) => `/custom-events/${id}`,
    BY_LEAD: (leadId) => `/custom-events/lead/${leadId}`,
    TIMELINE: '/custom-events/timeline'
  },

  // Pipeline / Deals
  DEALS: {
    LIST: '/deals',
    CREATE: '/deals',
    GET: (id) => `/deals/${id}`,
    UPDATE: (id) => `/deals/${id}`,
    DELETE: (id) => `/deals/${id}`,
    MOVE_STAGE: (id) => `/deals/${id}/move-stage`,
    PIPELINE: '/deals/pipeline',
    BY_LEAD: (leadId) => `/deals/lead/${leadId}`,
    STATISTICS: '/deals/statistics'
  },

  // Pipeline History
  PIPELINE_HISTORY: {
    LIST: '/pipeline-history',
    BY_DEAL: (dealId) => `/pipeline-history/deal/${dealId}`,
    EXPORT: '/pipeline-history/export'
  },

  // Quotations
  QUOTATIONS: {
    LIST: '/quotations',
    CREATE: '/quotations',
    GET: (id) => `/quotations/${id}`,
    UPDATE: (id) => `/quotations/${id}`,
    DELETE: (id) => `/quotations/${id}`,
    BY_LEAD: (leadId) => `/quotations/lead/${leadId}`,
    PDF: (id) => `/quotations/${id}/pdf`,
    SEND_EMAIL: (id) => `/quotations/${id}/send-email`,
    SEND_WHATSAPP: (id) => `/quotations/${id}/send-whatsapp`,
    CONVERT_TO_INVOICE: (id) => `/quotations/${id}/convert-to-invoice`
  },

  // Invoices
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices',
    GET: (id) => `/invoices/${id}`,
    UPDATE: (id) => `/invoices/${id}`,
    DELETE: (id) => `/invoices/${id}`,
    BY_LEAD: (leadId) => `/invoices/lead/${leadId}`,
    PDF: (id) => `/invoices/${id}/pdf`,
    SEND_EMAIL: (id) => `/invoices/${id}/send-email`,
    RECORD_PAYMENT: (id) => `/invoices/${id}/payments`,
    PAYMENTS: (id) => `/invoices/${id}/payments`,
    MARK_PAID: (id) => `/invoices/${id}/mark-paid`
  },

  // Revenue
  REVENUE: {
    DASHBOARD: '/revenue/dashboard',
    PAID: '/revenue/paid',
    PENDING: '/revenue/pending',
    OVERDUE: '/revenue/overdue',
    BY_PERIOD: '/revenue/by-period',
    BY_SOURCE: '/revenue/by-source',
    EXPORT: '/revenue/export'
  },

  // Credit Notes
  CREDIT_NOTES: {
    LIST: '/credit-notes',
    CREATE: '/credit-notes',
    GET: (id) => `/credit-notes/${id}`,
    UPDATE: (id) => `/credit-notes/${id}`,
    DELETE: (id) => `/credit-notes/${id}`,
    BY_INVOICE: (invoiceId) => `/credit-notes/invoice/${invoiceId}`,
    PDF: (id) => `/credit-notes/${id}/pdf`
  },

  // Customer Ledger
  LEDGER: {
    BY_CUSTOMER: (customerId) => `/ledger/customer/${customerId}`,
    TRANSACTIONS: '/ledger/transactions',
    SUMMARY: (customerId) => `/ledger/customer/${customerId}/summary`,
    EXPORT: (customerId) => `/ledger/customer/${customerId}/export`
  },

  // Custom Fields
  CUSTOM_FIELDS: {
    LIST: '/custom-fields',
    CREATE: '/custom-fields',
    UPDATE: (id) => `/custom-fields/${id}`,
    DELETE: (id) => `/custom-fields/${id}`,
    BY_ENTITY: (entity) => `/custom-fields/${entity}`
  },

  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    SALES_REPS: '/users/sales-reps'
  },

  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    TAX_SETTINGS: '/settings/tax',
    EMAIL_TEMPLATES: '/settings/email-templates',
    NOTIFICATION_PREFERENCES: '/settings/notifications'
  },

  // Dashboard
  DASHBOARD: {
    STATISTICS: '/dashboard/statistics',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
    CHARTS: '/dashboard/charts',
    WIDGETS: '/dashboard/widgets'
  }
};

export default API_ENDPOINTS;
