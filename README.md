# SGC Australia Frontend - Vue.js Business Management Platform

A modern Vue.js frontend application styled with SGC Australia branding and green color theme, designed to work with ERPNext backend systems.

## 🎨 Design Features

- **SGC Australia Branding**: Custom logo and green color palette (#3fd921)
- **Monday.com Inspired UI**: Clean, modern interface with SGC styling
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Advanced Components**: Tables, forms, modals, navigation with SGC theme

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- ERPNext backend server (for API integration)

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd sgc-australia-frontend

# Install dependencies
npm install

# Create environment configuration
cp env.example .env.local

# Configure your ERPNext backend URL in .env.local
# VITE_ERPNEXT_API_URL=https://your-erpnext-server.com

# Start development server
npm run dev
```

The application will be available at `http://localhost:3002`

## 🔧 Configuration

### Environment Variables (.env.local)
```bash
# ERPNext API Configuration
VITE_ERPNEXT_API_URL=https://ops.sgcloud.com.au
VITE_ERPNEXT_SGCLOUD_API_URL=https://ops.sgcloud.com.au

# OAuth Configuration (get from ERPNext admin)
VITE_OAUTH_CLIENT_ID=your_oauth_client_id
VITE_OAUTH_CLIENT_SECRET=your_oauth_client_secret
VITE_OAUTH_REDIRECT_URI=http://localhost:3002/oauth-callback

# Development Settings
NODE_ENV=development
VITE_DEV_MODE=true
```

### Domain Configuration
The app automatically detects the domain and applies SGC Australia branding. Configuration is in `src/config/domains.js`.

## 🎯 Key Features

### Authentication
- OAuth integration with ERPNext
- Secure token management
- Auto-redirect to login when needed

### Business Management
- **Companies**: Manage business contacts and information
- **Contacts**: Individual contact management
- **Leads**: Sales lead tracking and management
- **Opportunities**: Sales pipeline management
- **Activities**: Task and activity tracking

### Advanced UI Components
- **Smart Tables**: Sortable, filterable data tables
- **Form Builder**: Dynamic form generation from ERPNext DocTypes
- **Search**: Global search across all modules
- **Navigation**: Context-aware sidebar navigation

## 🎨 SGC Australia Styling

### Color Palette
- Primary Green: `#3fd921`
- Secondary Green: `#4ade80` 
- Accent Green: `#22c55e`
- Neutral Grays: Standard Monday.com palette

### Components Styled
- Buttons and interactive elements
- Forms and input fields
- Navigation and sidebar
- Tables and data displays
- Modals and overlays
- Status badges and indicators

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
├── pages/              # Page-level components
├── stores/             # Pinia state management
├── services/           # API service layers
├── styles/             # SGC design system CSS
├── config/             # Domain and app configuration
├── utils/              # Helper utilities
└── routes.js           # Vue Router configuration
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Building for Production
```bash
npm run build
```
Builds the app for production to the `dist` folder.

## 🌐 ERPNext Integration

### OAuth Setup
1. In ERPNext, go to: **Settings > Integrations > OAuth Client**
2. Create new OAuth Client with:
   - **App Name**: SGC Australia Frontend
   - **Client ID**: Generate or use custom
   - **Redirect URI**: `http://localhost:3002/oauth-callback` (development)
3. Update `.env.local` with the Client ID and Secret

### API Endpoints
The app integrates with standard ERPNext API endpoints:
- `/api/resource/[DocType]` - CRUD operations
- `/api/method/[method]` - Custom API methods
- `/oauth/authorize` - OAuth authentication

## 📱 Demo Features

The repository includes a functional HTML mockup (`monday-frontend-mockup.html`) demonstrating:
- Complete SGC Australia styling
- Interactive data tables
- Filtering and sorting
- Sample Australian business data
- Responsive design

## 🚀 Deployment

### Production Environment
1. Build the application: `npm run build`
2. Configure production environment variables
3. Deploy `dist` folder to your web server
4. Update OAuth redirect URIs for production domain

### Environment Variables for Production
```bash
VITE_ERPNEXT_API_URL=https://ops.sgcloud.com.au
VITE_OAUTH_REDIRECT_URI=https://yourdomain.com/oauth-callback
```

## 🔍 Troubleshooting

### Common Issues

**OAuth Login Fails**
- Check OAuth client configuration in ERPNext
- Verify redirect URI matches exactly
- Ensure ERPNext server is accessible

**API Errors**
- Verify ERPNext server URL in environment
- Check CORS settings on ERPNext server
- Confirm user permissions in ERPNext

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For technical support or questions about the SGC Australia integration, please contact the development team.

## 📄 License

This project is configured for SGC Australia's business management platform.

---

**Note**: This is the SGC Australia branded version of the frontend. The original styling and branding have been replaced with SGC's green color palette and logo.