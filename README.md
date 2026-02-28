# Lead Management System - React + Next.js

A modern lead management system built with React, Next.js 14+, TypeScript, and Tailwind CSS. This project replicates the functionality of the Angular-based aidan-frontend application.

## Features

- 🔐 **Authentication** - Login, register, password reset, email verification, magic links
- 📊 **Dashboard** - Overview with stats and quick actions
- 💬 **AI Chat** - Real-time streaming chat with AI assistant (SSE)
- 👥 **Leads Management** - CRUD operations, bulk CSV upload, filtering, search
- 📢 **Campaigns** - Create and manage outreach campaigns
- 📝 **Prompts Library** - Manage prompt templates
- 🔑 **Credentials** - OAuth integration management
- 🎨 **Modern UI** - Built with shadcn/ui components
- 📱 **Responsive** - Mobile-first design

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner
- **Streaming:** Server-Sent Events (SSE)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/geanfrancovolpe/leads-management-react.git
cd leads-management-react
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:
```
NEXT_PUBLIC_API_URL=https://api.workairs.co
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard routes
│   │   ├── chat/         # AI chat interface
│   │   ├── leads/        # Leads management
│   │   ├── campaigns/    # Campaigns management
│   │   ├── prompts/      # Prompts library
│   │   └── credentials/  # OAuth credentials
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, Header)
│   ├── shared/           # Shared components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and services
│   ├── services/         # API services
│   └── api-client.ts     # Axios instance with CSRF
├── hooks/                 # Custom React hooks
│   └── use-auth.tsx      # Authentication context
└── types/                 # TypeScript types/interfaces
    ├── lead.ts
    ├── prompt.ts
    └── index.ts
```

## API Integration

The application connects to the backend API at `https://api.workairs.co` with:

- **Authentication:** Token-based (Django REST Framework style)
- **CSRF Protection:** Automatic CSRF token initialization and injection
- **withCredentials:** true (for cookies)

### Key Services

- `authService` - Login, register, password reset, email verification
- `leadsService` - CRUD operations, bulk upload, status updates
- `campaignsService` - Campaign management
- `promptsService` - Prompt library CRUD
- `chatService` - AI chat with SSE streaming
- `credentialsService` - OAuth credential management

## Key Features Implementation

### CSRF Protection
- Initializes CSRF token on app load: `GET /api/csrf/`
- Reads `csrftoken` from cookie
- Sends `X-CSRFToken` header on POST/PUT/PATCH/DELETE
- Refreshes CSRF after login/register

### Chat Streaming (SSE)
Handles these event types from `/api/agent/chat/stream/`:
- `start` - Stream started
- `token` - New token (append to message)
- `function_call` - Tool execution started (show 🔧 icon)
- `function_result` - Tool completed (show ✅/❌ icons)
- `done` - Stream completed
- `error` - Error occurred

### File Upload (Leads)
- Accepts CSV/XLSX files via `/api/leads/upload/`
- Shows upload progress
- Displays results (created, skipped, errors)
- Error handling with detailed messages

### Protected Routes
- Checks authentication on page load
- Redirects to `/login` if not authenticated
- Auto-logout on 401 responses

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: https://api.workairs.co)

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Vercel

The easiest way to deploy is with Vercel:

```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Differences from Angular Version

This React/Next.js version maintains feature parity with the Angular application while leveraging:

- Next.js App Router for improved performance
- Server components where applicable
- Modern React patterns (hooks, context)
- Simplified state management
- Native fetch with SSE for streaming

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and confidential.

## Support

For issues or questions, please contact the development team.
