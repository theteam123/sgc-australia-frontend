import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Auth from './pages/Auth.vue'
import Forms from './pages/Forms.vue'
import PublicFormSubmit from './pages/PublicFormSubmit.vue'
import Documents from './pages/Documents.vue'
import DocType from './pages/DocType.vue'
import DocTypeSubmissions from './pages/DocTypeSubmissions.vue'
import DocTypeForm from './pages/DocTypeForm.vue'
import DocTypeDocumentEdit from './pages/DocTypeDocumentEdit.vue'
import DocTypeImages from './pages/DocTypeImages.vue'
import DocTypeGenerator from './pages/DocTypeGenerator.vue'
import VoiceAssistant from './views/VoiceAssistant.vue'
import ApiTester from './pages/ApiTester.vue'
import Projects from './pages/Projects.vue'
import ProjectDetail from './pages/ProjectDetail.vue'
import NewProject from './pages/NewProject.vue'
import ActivityEdit from './pages/ActivityEdit.vue'
import NewActivity from './pages/NewActivity.vue'
import Organisation from './pages/Organisation.vue'
import { useAuthStore } from './stores/auth'
import { useErrorStore } from './stores/error'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
    meta: { requiresAuth: false }
  },
  {
    path: '/oauth-callback',
    name: 'oauth-callback',
    component: () => import('./pages/OAuthCallback.vue'),
    meta: { 
      requiresAuth: false,
      isOAuthCallback: true
    }
  },
  {
    path: '/documents',
    name: 'documents',
    component: Documents,
    meta: { requiresAuth: true }
  },
  {
    path: '/forms',
    name: 'forms',
    component: Forms,
    meta: { requiresAuth: true }
  },
  {
    path: '/voice-assistant',
    name: 'voice-assistant',
    component: VoiceAssistant,
    meta: { 
      requiresAuth: true,
      requiredRoles: ['Dizza', 'Admin', 'Manager']
    }
  },
  {
    path: '/documents',
    name: 'documents',
    component: DocType,
    meta: { 
      requiresAuth: true,
      // requiredRoles: ['Taktec User', 'Taktec Admin', 'System Manager', 'Technician']
    }
  },
  {
    path: '/documents/taktec-portal',
    name: 'taktec-documents',
    component: DocType,
    meta: { 
      requiresAuth: true,
      // requiredRoles: ['Taktec User', 'Taktec Admin', 'System Manager', 'Technician'],
      portal: 'taktec'
    }
  },
  {
    path: '/documents/:id',
    name: 'document-submissions',
    component: DocTypeSubmissions,
    meta: { 
      requiresAuth: true,
      // requiredRoles: ['Taktec User', 'Taktec Admin', 'System Manager', 'Technician']
    }
  },
  {
    path: '/documents/:id/new',
    name: 'document-form',
    component: DocTypeForm,
    meta: { 
      requiresAuth: true,
      // requiredRoles: ['Taktec User', 'Taktec Admin', 'System Manager', 'Technician']
    }
  },
  {
    path: '/documents/:id/:documentId/edit',
    name: 'document-document-edit',
    component: DocTypeDocumentEdit,
    meta: { 
      requiresAuth: true,
      // requiredRoles: ['Taktec User', 'Taktec Admin', 'System Manager', 'Technician']
    }
  },
  {
    path: '/documents/:id/:documentId/images',
    name: 'document-images',
    component: DocTypeImages,
    meta: { 
      requiresAuth: true,
      // requiredRoles: ['Taktec User', 'Taktec Admin', 'System Manager', 'Technician']
    }
  },
  {
    path: '/documents/:id/:documentId/image/:fieldname',
    name: 'document-single-image',
    component: () => import('./pages/DocTypeSingleImage.vue'),
    meta: { 
      requiresAuth: true,
      // requiredRoles: ['Taktec User', 'Taktec Admin', 'System Manager', 'Technician' ]
    }
  },
  {
    path: '/forms/:id/submissions',
    name: 'form-submissions',
    component: () => import('./pages/FormSubmissions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:formId/submissions/:submissionId/edit',
    name: 'form-submission-edit',
    component: () => import('./pages/FormSubmissionEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:id/submit',
    name: 'form-submit',
    component: () => import('./pages/FormSubmit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:id/new',
    name: 'form-new',
    component: () => import('./pages/FormNew.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/public/forms/:id',
    name: 'public-form-submit',
    component: PublicFormSubmit,
    meta: { requiresAuth: false }
  },
  {
    path: '/form/:id',
    name: 'public-doctype-form',
    component: () => import('./pages/PublicDocTypeForm.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: { 
      requiresAuth: true
      // Remove role restrictions for now to test the page
    }
  },
  {
    path: '/projects/new',
    name: 'new-project',
    component: NewProject,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: ProjectDetail,
    meta: { 
      requiresAuth: true
      // Remove role restrictions for now to test the page
    }
  },
  {
    path: '/projects/:projectId/activity/:activityId/edit',
    name: 'ActivityEdit',
    component: ActivityEdit,
    meta: { 
      requiresAuth: true
      // Remove role restrictions for now to test the page
    }
  },
  {
    path: '/organisation/:id',
    name: 'organisation-detail',
    component: Organisation,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/activity/new',
    name: 'new-activity',
    component: NewActivity,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/projects/:projectId/sales-orders',
    name: 'project-sales-orders',
    component: () => import('./pages/SalesOrder.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/sales-order/new-sales-order-:formId',
    name: 'new-sales-order',
    component: () => import('./pages/DocTypeForm.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/projects/:projectId/sales-invoices',
    name: 'project-sales-invoices',
    component: () => import('./pages/SalesInvoice.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/sales-invoice/new-sales-invoice-:formId',
    name: 'new-sales-invoice',
    component: () => import('./pages/DocTypeForm.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/projects/:projectId/purchase-orders',
    name: 'project-purchase-orders',
    component: () => import('./pages/PurchaseOrder.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/purchase-order/new-purchase-order-:formId',
    name: 'new-purchase-order',
    component: () => import('./pages/DocTypeForm.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/projects/:projectId/purchase-invoices',
    name: 'project-purchase-invoices',
    component: () => import('./pages/PurchaseInvoice.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/purchase-invoice/new-purchase-invoice-:formId',
    name: 'new-purchase-invoice',
    component: () => import('./pages/DocTypeForm.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/projects/:projectId/timesheets',
    name: 'project-timesheets',
    component: () => import('./pages/Timesheet.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/timesheet/new-timesheet-:formId',
    name: 'new-timesheet',
    component: () => import('./pages/DocTypeForm.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/projects/:projectId/staffing-plans',
    name: 'project-staffing-plans',
    component: () => import('./pages/StaffingPlan.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/staffing-plan/new-staffing-plan-:formId',
    name: 'new-staffing-plan',
    component: () => import('./pages/DocTypeForm.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/test-api',
    name: 'test-api',
    component: ApiTester,
    meta: { 
      requiresAuth: true,
      requiredRoles: ['Admin', 'Developer','System Manager', 'Taktec User', 'Taktec Admin']
    }
  },
  {
    path: '/doctype-generator',
    name: 'doctype-generator',
    component: DocTypeGenerator,
    meta: { 
      requiresAuth: true,
      requiredRoles: ['System Manager', 'Admin', 'Developer']
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
})

// Add debug logging
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const errorStore = useErrorStore()

  // Always allow OAuth callback
  if (to.path === '/oauth-callback') {
    next();
    return;
  }

  // Initialize auth state if not already initialized
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      const message = 'Please log in to access this page';
      errorStore.$patch({ message, type: 'error' });
      next({ name: 'auth' });
      return;
    }

    // Check for required roles
    if (to.meta.requiredRoles) {
      const hasRequiredRole = to.meta.requiredRoles.some(role => 
        authStore.user?.roles?.includes(role)
      );
      
      if (!hasRequiredRole) {
        const message = 'Access denied: You do not have the required permissions to view this page';
        errorStore.$patch({ message, type: 'error' });
        next({ name: 'home' });
        return;
      }
    }
  }

  next()
})

export default router 