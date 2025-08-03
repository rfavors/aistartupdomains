# AI Startup Domains - Marketplace Platform

A modern React-based marketplace platform for buying and selling AI startup domains and websites. Built with TypeScript, Tailwind CSS, and Vite.

## Features

- **Domain & Website Marketplace**: Browse and list domains and websites for sale
- **User Authentication**: Secure login and registration system
- **Seller Dashboard**: Manage listings, view analytics, and track sales
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Search & Filtering**: Advanced search capabilities with multiple filters
- **Real-time Updates**: Dynamic content updates and notifications

## Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Build Tool**: Vite 7.0.4
- **Icons**: Heroicons & Lucide React
- **Routing**: React Router DOM 7.7.1
- **HTTP Client**: Axios 1.11.0
- **UI Components**: Headless UI 2.2.6

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aistartupdomains
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Deployment on Coolify

### Method 1: Git Repository Deployment (Recommended)

1. **Push your code to a Git repository** (GitHub, GitLab, etc.)

2. **Create a new project in Coolify**
   - Log into your Coolify dashboard
   - Click "New Project"
   - Select "Git Repository"
   - Connect your repository

3. **Configure build settings**
   ```yaml
   # Build Configuration
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node Version: 18
   ```

4. **Environment Variables** (if needed)
   ```bash
   NODE_ENV=production
   VITE_API_URL=https://your-api-domain.com
   ```

5. **Deploy**
   - Click "Deploy" in Coolify
   - Coolify will automatically build and deploy your application

### Method 2: Docker Deployment

1. **Create a Dockerfile** (create this file in your project root):
   ```dockerfile
   # Build stage
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   
   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf** (create this file in your project root):
   ```nginx
   events {
     worker_connections 1024;
   }
   
   http {
     include /etc/nginx/mime.types;
     default_type application/octet-stream;
     
     server {
       listen 80;
       server_name _;
       root /usr/share/nginx/html;
       index index.html;
       
       location / {
         try_files $uri $uri/ /index.html;
       }
       
       location /assets/ {
         expires 1y;
         add_header Cache-Control "public, immutable";
       }
     }
   }
   ```

3. **Deploy with Coolify**
   - Create new project in Coolify
   - Select "Docker"
   - Point to your repository
   - Coolify will build and deploy using Docker

### Method 3: Static Site Deployment

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Upload dist folder**
   - Create a new "Static Site" project in Coolify
   - Upload the contents of the `dist` folder
   - Configure the web server (Nginx recommended)

## Environment Configuration

### Production Environment Variables

```bash
# API Configuration
VITE_API_URL=https://your-api-domain.com
VITE_API_VERSION=v1

# Authentication
VITE_AUTH_DOMAIN=your-auth-domain.com

# Analytics (optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true
```

## Domain Configuration

1. **Custom Domain Setup**
   - In Coolify, go to your project settings
   - Add your custom domain
   - Configure DNS records:
     ```
     Type: CNAME
     Name: www (or @)
     Value: your-coolify-domain.com
     ```

2. **SSL Certificate**
   - Coolify automatically provisions SSL certificates
   - Ensure your domain is properly configured

## Performance Optimization

### Build Optimizations
- Code splitting is enabled by default with Vite
- Assets are automatically optimized and compressed
- CSS is purged and minified with Tailwind CSS

### Recommended Nginx Configuration
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## Monitoring and Maintenance

### Health Checks
- Coolify automatically monitors your application
- Set up custom health check endpoint if needed

### Logs
- Access logs through Coolify dashboard
- Monitor build and runtime logs

### Updates
1. Push changes to your Git repository
2. Coolify will automatically trigger a new deployment
3. Zero-downtime deployments are supported

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors: `npm run lint`

2. **Routing Issues**
   - Ensure your web server is configured for SPA routing
   - All routes should fallback to `index.html`

3. **Environment Variables**
   - Ensure all `VITE_` prefixed variables are set
   - Restart deployment after changing environment variables

### Support

For deployment issues:
1. Check Coolify documentation
2. Review build logs in Coolify dashboard
3. Verify all environment variables are set correctly

## Security Considerations

- All sensitive data should be handled server-side
- Use HTTPS in production (automatically handled by Coolify)
- Implement proper CORS policies
- Regular security updates for dependencies

## Testing

All features have been tested and verified:
- ✅ Build process works correctly
- ✅ All TypeScript errors resolved
- ✅ Linting passes without issues
- ✅ Production build generates optimized assets
- ✅ Preview server runs successfully
- ✅ All components render properly
- ✅ Responsive design works across devices
- ✅ Navigation and routing function correctly

## License

This project is licensed under the MIT License.
