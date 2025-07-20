import { defineStore } from 'pinia';
import { getAuthorizationUrl, getCurrentToken, logout as oauthLogout } from '../services/oauth';
import { getErpNextApiUrl } from '../utils/api';

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Try to get persisted state from localStorage
    const persistedState = localStorage.getItem('authState');
    const initialState = {
      user: null,
      loading: false,
      error: null,
      isLoggedIn: false,
      isSystemManager: false,
      isInitialized: false
    };

    return persistedState ? { ...JSON.parse(persistedState), isInitialized: false } : initialState;
  },

  getters: {
    isAuthenticated: (state) => {
      return state.isLoggedIn && state.isInitialized;
    }
  },

  actions: {
    async initialize() {
      if (this.isInitialized) return;
      
      try {
        const token = await getCurrentToken();
        if (!token) {
          this.resetState();
          return;
        }

        // Validate token by getting user info
        const response = await fetch(`/api/method/frappe.auth.get_logged_user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const userData = await response.json();
        
        // If we have a valid token and user data, restore the session
        if (userData.message) {
          await this.setToken(token);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        this.resetState();
      } finally {
        this.isInitialized = true;
      }
    },

    async signIn() {
      this.loading = true;
      this.error = null;
      
      try {
        // Redirect to OAuth authorization page
        window.location.href = getAuthorizationUrl();
      } catch (error) {
        console.error('Error during sign in:', error);
        this.error = error.message || 'Failed to authenticate';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async setToken(token) {
      console.log('Auth Store - setToken called with token:', token ? 'Present' : 'Missing');
      
      try {
        // Store token in localStorage first
        localStorage.setItem('oauth_token', token);
        // Set expiry to 1 hour (same as OAuth token)
        localStorage.setItem('oauth_token_expiry', Date.now() + (60 * 60 * 1000));
        
        console.log('Auth Store - Token stored in localStorage');
        
        const apiUrl = getErpNextApiUrl();
        console.log('Auth Store - API URL:', apiUrl);
        
        // Just get basic user info - minimal validation
        const response = await fetch(`/api/method/frappe.auth.get_logged_user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Auth Store - API response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Auth Store - API error:', errorData);
          throw new Error(`Failed to get user info: ${errorData}`);
        }

        const userData = await response.json();
        console.log('Auth Store - User data received:', userData);

        if (!userData.message) {
          throw new Error('Invalid user data received from server');
        }

        // Set basic user info without additional API calls
        this.user = {
          name: userData.message,
          email: userData.message,
          roles: ['System Manager'], // Assume admin role since OAuth worked
          profile: {
            full_name: userData.message.split('@')[0] || 'User',
            email: userData.message,
            user_id: userData.message,
            enabled: true
          }
        };
        
        this.isLoggedIn = true;
        this.isSystemManager = true; // Since OAuth worked, assume admin
        this.error = null;
        
        console.log('Auth Store - Successfully set token for user:', userData.message);
        
        // Get actual user roles
        try {
          await this.checkSystemManagerRole();
        } catch (error) {
          console.warn('Could not fetch user roles, using defaults');
        }
        
        // Persist state
        this.persistState();
        
        console.log('Auth Store - State persisted, returning true');
        return true;
      } catch (error) {
        console.error('Auth Store - Error setting token:', error);
        this.error = error.message;
        // Clear token on error
        localStorage.removeItem('oauth_token');
        localStorage.removeItem('oauth_token_expiry');
        console.log('Auth Store - Returning false due to error');
        return false;
      }
    },

    async checkSystemManagerRole() {
      try {
        const token = await getCurrentToken();
        if (!token) {
          this.isSystemManager = false;
          return false;
        }

        const response = await fetch(`/api/method/frappe.core.doctype.user.user.get_roles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: this.user?.name || 'Administrator'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get user roles');
        }

        const data = await response.json();
        console.log('User roles:', data.message);
        
        this.isSystemManager = data.message.includes('System Manager');
        
        // Update user roles in state
        if (this.user) {
          this.user.roles = data.message || [];
        }
        
        this.persistState();
        return this.isSystemManager;
      } catch (error) {
        console.error('Error checking System Manager role:', error);
        this.isSystemManager = false;
        return false;
      }
    },

    async signOut() {
      this.loading = true;
      try {
        await oauthLogout();
        this.resetState();
      } catch (error) {
        console.error('Error during sign out:', error);
      } finally {
        this.loading = false;
      }
    },

    resetState() {
      this.user = null;
      this.error = null;
      this.isLoggedIn = false;
      this.isSystemManager = false;
      this.isInitialized = true;
      localStorage.removeItem('authState');
      localStorage.removeItem('oauth_token');
      localStorage.removeItem('oauth_token_expiry');
      localStorage.removeItem('oauth_refresh_token');
    },

    clearError() {
      this.error = null;
    },

    persistState() {
      const stateToPersist = {
        user: this.user,
        isLoggedIn: this.isLoggedIn,
        isSystemManager: this.isSystemManager
      };
      localStorage.setItem('authState', JSON.stringify(stateToPersist));
    },

    async updateUserDetails(updatedData) {
      try {
        const token = await getCurrentToken();
        if (!token) throw new Error('No authentication token found');

        const apiUrl = getErpNextApiUrl();

        // Format the data according to ERPNext's expectations
        const formattedData = {
          first_name: updatedData.first_name,
          middle_name: updatedData.middle_name,
          last_name: updatedData.last_name,
          language: updatedData.language,
          time_zone: updatedData.time_zone
        };

        // Update user details
        const response = await fetch(`${apiUrl}/api/resource/User/${this.user.name}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update user details');
        }

        const updatedUserData = await response.json();
        
        // Update local state with the response data
        if (updatedUserData.data) {
          this.user = {
            ...this.user,
            name: updatedUserData.data.name,
            email: updatedUserData.data.email,
            profile: {
              ...this.user.profile,
              full_name: updatedUserData.data.full_name,
              email: updatedUserData.data.email,
              language: updatedUserData.data.language,
              first_name: updatedUserData.data.first_name,
              middle_name: updatedUserData.data.middle_name,
              last_name: updatedUserData.data.last_name,
              time_zone: updatedUserData.data.time_zone,
              user_id: updatedUserData.data.name,
              enabled: updatedUserData.data.enabled
            },
            details: updatedUserData.data
          };
        }

        // Persist updated state
        this.persistState();
        
        return true;
      } catch (error) {
        console.error('Error updating user details:', error);
        throw error;
      }
    }
  }
});