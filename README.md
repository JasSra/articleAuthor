# Error Club

A full-stack article management system built with Next.js 14 and the Consolidated API. Write, review, and publish articles with MSAL authentication and TipTap editor.

## Features

- 🔐 **MSAL Authentication** - Secure login with Microsoft Azure AD
- ✍️ **Rich Text Editor** - TipTap editor with image upload support
- 📝 **Article Management** - Draft, submit, review, and publish workflow
- 👥 **Role-Based Access** - Contributor, Editor, Publisher, and Admin roles
- 🔄 **Workflow Engine** - Automated state transitions and approvals
- 📊 **Content Management** - Lookups, content slots, and forms
- 🚀 **Modern Stack** - Next.js 14, TypeScript, Tailwind CSS
- 🐳 **Docker Ready** - Containerized deployment

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd error-club
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.local.template .env.local
   # Edit .env.local with your values
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Visit setup wizard:**
   Open http://localhost:3000/setup and complete the configuration

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:5229
CONSOLIDATED_API_KEY=your-api-key-here

# MSAL Configuration
NEXT_PUBLIC_CLIENT_ID=your-msal-client-id
NEXT_PUBLIC_TENANT_ID=your-azure-tenant-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_POST_LOGOUT_URI=http://localhost:3000/

# Optional: Custom app URL for redirects
# APP_URL=http://localhost:3000
```

### Required Configuration

1. **Consolidated API**: Your backend API endpoint with swagger at `/swagger/v1/swagger.json`
2. **API Key**: Authentication key for the Consolidated API
3. **MSAL App**: Azure AD application registration with appropriate permissions

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run gen:api` | Generate API client from swagger |
| `npm run seed:all` | Run all seed scripts |
| `npm run seed:lookups` | Seed lookup data |
| `npm run seed:content` | Seed content slots |
| `npm run seed:forms` | Seed form definitions |
| `npm run seed:workflows` | Seed workflow definitions |

## Architecture

### Frontend (Next.js 14)
- **App Router**: Modern Next.js routing with app directory
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework
- **TipTap Editor**: Rich text editing with image support
- **MSAL React**: Microsoft authentication library

### Authentication Flow
1. User logs in via MSAL (Microsoft Azure AD)
2. Frontend exchanges MSAL token for Consolidated API JWT
3. JWT stored in httpOnly cookie for security
4. All API calls include JWT + API key + correlation ID

### API Integration
- Generated TypeScript client from Swagger
- Automatic retry logic with exponential backoff
- Consistent error handling with OperationResult<T>
- Request/response correlation tracking

## User Roles

| Role | Permissions |
|------|-------------|
| **Contributor** | Create/edit own drafts, submit for review |
| **Editor** | Review queue, approve/reject articles with notes |
| **Publisher** | Schedule/publish articles, manage issues |
| **Admin** | Manage lookups, content, workflows, and users |

## Workflow States

```
Draft → Submitted → Approved → Scheduled → Published
  ↓         ↓
Save     Reject → Draft
```

## API Controllers Used

- **DataController**: CRUD operations for articles and approvals
- **UserController**: Authentication and user management
- **LookupController**: Reference data (tags, months, etc.)
- **ContentController**: Dynamic content slots
- **FormController**: Form definitions and submissions
- **WorkflowController**: State machine definitions

## Development Workflow

1. **Setup**: Run the setup wizard at `/setup` to configure API connection and seed data
2. **Development**: Use `npm run dev` for hot reloading
3. **API Changes**: Run `npm run gen:api` to regenerate client after API updates
4. **Testing**: Create test articles and verify workflow transitions

## Deployment

### Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   cp .env.local .env
   docker-compose up --build
   ```

2. **Or build Docker image separately:**
   ```bash
   docker build -t error-club .
   docker run -p 3000:3000 error-club
   ```

### Production Checklist

- [ ] Configure production API endpoint
- [ ] Set secure API keys
- [ ] Configure MSAL for production domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS on API server
- [ ] Run database migrations (if applicable)
- [ ] Test authentication flow
- [ ] Verify image upload functionality

## Pages Structure

```
/                    # Landing page
/login              # MSAL authentication
/logout             # Sign out
/setup              # First-run configuration wizard
/account            # User profile and settings
/submit             # Create/edit articles
/articles           # Article list with filters
/review             # Editor review queue
/schedule           # Publisher scheduling
/issues/[yyyy-mm]   # Published issues by month
/article/[slug]     # Public article view
/admin/*            # Admin management pages
```

## Component Library

- **ArticleForm**: TipTap editor with image upload
- **ApprovalPanel**: Review interface for editors
- **StatusBadge**: Article status indicators
- **Guard**: Role-based access control wrapper
- **ToastProvider**: Notification system

## Troubleshooting

### Common Issues

1. **API Generation Fails**
   - Ensure your API is running and accessible
   - Check the swagger endpoint is available
   - Verify CORS configuration allows requests

2. **Authentication Issues**
   - Verify MSAL configuration in Azure AD
   - Check redirect URIs match your environment
   - Ensure API accepts the JWT format

3. **Image Upload Fails**
   - Verify upload form is properly seeded
   - Check API key permissions
   - Ensure file size limits are appropriate

### Debug Mode

Set `NODE_ENV=development` and check browser console for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository
4. Contact the development team

---

**Error Club** - Write. Review. Publish.
