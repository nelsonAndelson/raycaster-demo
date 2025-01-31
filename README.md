# Raycaster Demo

Dear Levi and Anthony,

Thank you for considering my application for the internship position at Raycaster.ai. I've created this demo project to showcase my technical skills and demonstrate my understanding of Raycaster's mission in revolutionizing AI-powered sales insights.

This full-stack application demonstrates my implementation of a simplified version of Raycaster's core functionality - analyzing company websites to generate actionable insights. Built with modern web technologies, it features real-time collaboration, AI-powered analysis, and robust architecture that I believe aligns well with Raycaster's technical standards.

🔗 **Live Demo**: [https://raycaster-demo.vercel.app/](https://raycaster-demo.vercel.app/)

I encourage you to clone the repository and try it out - I've focused on creating a clean, maintainable codebase that showcases both technical proficiency and attention to user experience. The project demonstrates my ability to work with AI integrations, real-time features, and modern web development practices that could contribute to Raycaster's continued growth.

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: Supabase with real-time capabilities
- **AI Integration**: LangChain with OpenAI
- **State Management**: React Hook Form
- **Package Manager**: pnpm
- **Form Validation**: Zod

## Key Features

- Real-time task management and collaboration
- AI-powered insight generation and analysis
- Modern, responsive UI with shadcn/ui components
- Type-safe database operations with Supabase
- Secure authentication and authorization
- Real-time updates and notifications
- Advanced form handling and validation

## Project Structure

```
├── app/                  # Next.js App Router pages and API routes
│   ├── api/             # API endpoints
│   ├── db/              # Database utilities
│   └── insights/        # Insights feature pages
├── components/          
│   ├── ui/             # shadcn/ui components
│   └── [feature]/      # Feature-specific components
├── types/               # TypeScript type definitions
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
├── providers/           # React context providers
└── supabase/           # Database migrations and types
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```
   Copy .env.example to .env and fill in your credentials
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Key Implementation Details

### Real-time Features
- Implemented using Supabase's real-time subscriptions
- Instant updates for task assignments and modifications
- Live collaboration features

### AI Integration
- LangChain integration for advanced text analysis
- OpenAI-powered insight generation
- Custom AI workflows using LangGraph

### Component Architecture
- Modular component design using shadcn/ui
- Custom hooks for reusable logic
- Type-safe props and state management
- Responsive and accessible UI components

### Database Design
- Structured Supabase schema with proper relationships
- Real-time enabled tables for collaborative features
- Type-safe database queries and mutations

## Performance Optimizations

- Next.js App Router for optimal routing and caching
- Image optimization with Next.js Image component
- Lazy loading for non-critical components
- Efficient state management practices

## Security Features

- Secure API routes with proper authentication
- Input sanitization and validation
- Environment variable protection
- Type-safe database operations

