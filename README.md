# ATLAS MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-1.0.3-green.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Beta-orange.svg)]()
[![GitHub](https://img.shields.io/github/stars/cyanheads/atlas-mcp-server?style=social)](https://github.com/cyanheads/atlas-mcp-server)

ATLAS (Adaptive Task & Logic Automation System) is a Model Context Protocol server that provides hierarchical task management capabilities to Large Language Models. This tool provides LLMs with the structure and context needed to manage complex tasks and dependencies.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Task Structure](#task-structure)
- [Tools](#tools)
- [Best Practices](#best-practices)
- [Development](#development)
- [Up Next](#up-next)
- [Contributing](#contributing)
- [License](#license)

## Overview

### Model Context Protocol Server

ATLAS implements the Model Context Protocol (MCP), created by Anthropic, which is a standardized communication protocol between LLMs and external systems. The architecture consists of:

- **Clients** (Claude Desktop, IDEs) that maintain server connections
- **Servers** that provide tools and resources to clients
- **LLMs** that interact with servers through client applications

This architecture creates a secure boundary between LLMs and external systems while enabling controlled access to functionality.

### Core Components

ATLAS is built on several robust core components organized into specialized subsystems:

#### Task Management
- **TaskManager**: Central coordinator for all task operations
- **TaskStore**: Handles persistent storage and retrieval of tasks
- **DependencyValidator**: Ensures valid task relationships and dependencies
- **StatusManager**: Manages task state transitions and propagation
- **BatchProcessor**: Handles efficient bulk task operations
- **CacheManager**: Optimizes task retrieval performance
- **IndexManager**: Maintains searchable task indices
- **TransactionManager**: Ensures ACID compliance for task operations

#### System Infrastructure
- **StorageManager**: Provides durable data persistence with SQLite integration
- **SessionManager**: Handles session lifecycle and task list management
- **ConfigManager**: Manages environment-based configuration
- **ValidationSystem**: Ensures data integrity with Zod schema integration

#### Performance & Monitoring
- **RateLimiter**: Controls request rates (600 req/min)
- **HealthMonitor**: Tracks system health with comprehensive metrics
- **MetricsCollector**: Gathers detailed performance statistics
- **RequestTracer**: Traces request flow with debugging capabilities

Through the MCP protocol, ATLAS empowers LLMs to break down complex projects into manageable tasks, track their progress, and maintain dependencies — all within an organized hierarchical structure.

## Features

### Task Organization
- Hierarchical task structures with parent-child relationships
- Dependency management and validation
- Status tracking and automatic propagation
- Bulk operations for efficient task management
- Session-based task isolation

### Content Support
- Markdown documentation with rich formatting
- Code snippets with multi-language syntax highlighting
- JSON data structures with schema validation
- Rich metadata and hierarchical tagging
- Comprehensive task reasoning documentation
- Decision-making history with context preservation
- Cross-reference support between tasks
- Version tracking for content changes

### System Features
- Rate limiting (600 requests/minute) with sliding window
- Health monitoring with comprehensive metrics
  * Memory and CPU usage tracking
  * Error rate calculation
  * Response time monitoring
  * Component-level health indicators
- Request tracing with lifecycle tracking
  * Request timing analysis
  * Error context capture
  * Event recording
  * Trace management (1000 trace limit, 1-hour TTL)
- Sophisticated error handling
  * Categorized error types
  * Detailed context preservation
  * Recovery suggestions
  * Error aggregation
- Graceful shutdown with resource cleanup
- Session management with persistence
- Comprehensive audit logging
- Automatic maintenance operations

### Performance
- Efficient task storage and retrieval
  * Caching with invalidation
  * Index-based searching
  * Query optimization
- Bulk operation support with transaction handling
- Request timeout handling (30-second default)
- Concurrent request management with isolation
- Resource cleanup and memory optimization
- Automatic performance tuning
- Statistical analysis of metrics
  * Response time percentiles (p95, p99)
  * Error rate tracking
  * Load analysis

## Installation

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/cyanheads/atlas-mcp-server.git
```

2. Navigate to the project directory:
```bash
cd atlas-mcp-server
```

3. Install dependencies:
```bash
npm install
```

4. Build the project:
```bash
npm run build
```

5. Create a storage directory for tasks:
```bash
mkdir -p ~/Documents/atlas-tasks
```

The server is now ready to be configured and used with your MCP client.

## Configuration

ATLAS requires configuration in your MCP client settings:

```json
{
  "mcpServers": {
    "atlas": {
      "command": "node",
      "args": ["/path/to/atlas-mcp-server/build/index.js"],
      "env": {
        "TASK_STORAGE_DIR": "/path/to/storage/directory"
      }
    }
  }
}
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| TASK_STORAGE_DIR | Directory for task data storage | Yes |

## Task Structure

Tasks support rich content, metadata, and reasoning documentation within a hierarchical structure (maximum 5 levels deep). All task operations are transactional with automatic validation using Zod schemas:

```typescript
{
  "name": "Implementation Task",
  "description": "Implement core functionality",
  "type": "task",
  "notes": [
    {
      "type": "markdown",
      "content": "# Requirements\n- Feature A\n- Feature B"
    },
    {
      "type": "code",
      "language": "typescript",
      "content": "interface Feature {\n  name: string;\n  enabled: boolean;\n}"
    }
  ],
  "reasoning": {
    "approach": "Modular development with focus on reusability",
    "assumptions": [
      "System supports TypeScript",
      "Features can be toggled independently"
    ],
    "alternatives": [
      "Monolithic implementation",
      "Feature flags in configuration"
    ],
    "risks": [
      "Increased complexity from modularity",
      "Performance overhead from dynamic loading"
    ],
    "tradeoffs": [
      "Flexibility vs simplicity",
      "Runtime performance vs maintainability"
    ],
    "constraints": [
      "Must maintain backward compatibility",
      "Must work in all supported browsers"
    ],
    "dependencies_rationale": [
      "Depends on core module for type definitions",
      "Requires configuration service for feature flags"
    ],
    "impact_analysis": [
      "Affects system startup time",
      "Changes how features are loaded and managed"
    ]
  },
  "metadata": {
    "context": "Core implementation phase",
    "tags": ["core", "implementation"]
  }
}
```

The reasoning field provides structured documentation of decision-making, which is indexed for efficient search and retrieval:
- **approach**: High-level implementation strategy
- **assumptions**: Key assumptions made during planning
- **alternatives**: Other approaches that were considered
- **risks**: Potential issues and challenges
- **tradeoffs**: Key decisions and their implications
- **constraints**: Technical or business limitations
- **dependencies_rationale**: Reasoning for task dependencies
- **impact_analysis**: Analysis of changes on the system

### Task Storage Features

- **Validation**: Zod schema validation for all fields
- **Caching**: Automatic caching with invalidation
- **Indexing**: Full-text search on content and metadata
- **Transactions**: ACID compliance for all operations
- **Performance**: Optimized retrieval with batch support
- **History**: Change tracking and version management

### Example Task List (Without reasoning)

The following example demonstrates a task breakdown for a personal portfolio website project, showcasing the hierarchical structure and metadata capabilities. The task list was generated from the following prompt:
> Create a comprehensive plan for a modern, responsive personal portfolio website that showcases a web developer's projects, skills, and professional experience, incorporating best practices in UI/UX design, performance optimization, and accessibility. The site should feature an elegant, minimalist design with smooth animations, dark/light mode support, and interactive project demonstrations, while ensuring cross-browser compatibility and optimal load times.

<details>
<summary><b>Portfolio Website Development Task List</b></summary>

```json
[
  {
    "id": "8b4f40b2-1941-46c6-bc9f-b68d1c1b4aa2",
    "name": "Personal Portfolio Website Development",
    "description": "Design and develop a modern personal portfolio website with strong UI/UX focus",
    "type": "group",
    "status": "pending",
    "dependencies": [],
    "subtasks": [
      {
        "id": "479251ce-6e13-446a-b650-d5a4179dcc5e",
        "name": "Project Setup and Architecture",
        "description": "Initialize project and set up development environment",
        "type": "group",
        "status": "pending",
        "dependencies": [],
        "subtasks": [
          {
            "id": "fa5751e0-6005-495a-a191-85c72eb644c5",
            "name": "Technology Stack Selection",
            "description": "Choose and document the tech stack:\n- Next.js for SSG/SSR\n- Tailwind CSS for styling\n- TypeScript for type safety\n- Framer Motion for animations\n- MDX for blog content\n- Vercel for deployment",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "479251ce-6e13-446a-b650-d5a4179dcc5e"
          },
          {
            "id": "a28016aa-1eed-44e2-93a0-a7182c5ee54b",
            "name": "Project Repository Setup",
            "description": "Initialize Git repository with proper structure and configuration files",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "479251ce-6e13-446a-b650-d5a4179dcc5e"
          },
          {
            "id": "4f60ae3d-d650-4e47-b66f-d3bf523bd00f",
            "name": "Development Environment Configuration",
            "description": "Set up ESLint, Prettier, Husky hooks, and TypeScript configuration",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "479251ce-6e13-446a-b650-d5a4179dcc5e"
          }
        ],
        "metadata": {
          "created": "2024-12-16T10:47:53.916Z",
          "updated": "2024-12-16T10:47:53.916Z",
          "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
        },
        "parentId": "8b4f40b2-1941-46c6-bc9f-b68d1c1b4aa2"
      },
      {
        "id": "6e301694-88a3-4d48-959d-9d634269250b",
        "name": "UI/UX Design",
        "description": "Design the user interface and experience",
        "type": "group",
        "status": "pending",
        "dependencies": [],
        "subtasks": [
          {
            "id": "07f398eb-f3a0-42c1-8bca-84759eae7bf2",
            "name": "Design System Creation",
            "description": "Create design tokens and system:\n- Color palette\n- Typography scale\n- Spacing system\n- Component library\n- Animation guidelines",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "6e301694-88a3-4d48-959d-9d634269250b"
          },
          {
            "id": "1e0db359-05a5-4654-b60f-adab5f9c91b2",
            "name": "Wireframing",
            "description": "Create wireframes for all pages and responsive layouts",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "6e301694-88a3-4d48-959d-9d634269250b"
          },
          {
            "id": "fcb873ae-611a-4cea-af2b-cde5bd933aa7",
            "name": "High-fidelity Design",
            "description": "Create detailed designs including dark mode variants",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "6e301694-88a3-4d48-959d-9d634269250b"
          }
        ],
        "metadata": {
          "created": "2024-12-16T10:47:53.916Z",
          "updated": "2024-12-16T10:47:53.916Z",
          "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
        },
        "parentId": "8b4f40b2-1941-46c6-bc9f-b68d1c1b4aa2"
      },
      {
        "id": "3819ed9c-cbc8-4f82-92e1-014d874bb8e1",
        "name": "Core Features Development",
        "description": "Develop main features and components",
        "type": "group",
        "status": "pending",
        "dependencies": [],
        "subtasks": [
          {
            "id": "be6de74c-6a57-470f-95aa-481e7e275566",
            "name": "Layout Components",
            "description": "Develop base layout components:\n- Header with navigation\n- Footer\n- Layout wrapper\n- Mobile menu",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "3819ed9c-cbc8-4f82-92e1-014d874bb8e1"
          },
          {
            "id": "81415232-3e47-4d42-8a67-f147ab82c94c",
            "name": "Home Page",
            "description": "Create landing page with:\n- Hero section\n- Featured projects\n- Skills showcase\n- Quick contact",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "3819ed9c-cbc8-4f82-92e1-014d874bb8e1"
          },
          {
            "id": "2cf6bd8d-6e5a-42ce-a163-3c9e18abc891",
            "name": "Projects Section",
            "description": "Build projects showcase with:\n- Project cards\n- Filtering system\n- Project detail pages\n- Live demo links",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "3819ed9c-cbc8-4f82-92e1-014d874bb8e1"
          },
          {
            "id": "379e7fbd-ce61-4d9f-b36c-87baba126b69",
            "name": "About Page",
            "description": "Develop about page with:\n- Professional summary\n- Skills and technologies\n- Work experience\n- Education",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "3819ed9c-cbc8-4f82-92e1-014d874bb8e1"
          },
          {
            "id": "1da3052c-1d09-4120-ab9d-051db6226531",
            "name": "Contact Section",
            "description": "Create contact form and social links:\n- Form validation\n- Email integration\n- Social media links\n- Resume download",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "3819ed9c-cbc8-4f82-92e1-014d874bb8e1"
          }
        ],
        "metadata": {
          "created": "2024-12-16T10:47:53.916Z",
          "updated": "2024-12-16T10:47:53.916Z",
          "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
        },
        "parentId": "8b4f40b2-1941-46c6-bc9f-b68d1c1b4aa2"
      },
      {
        "id": "edf1e5f7-d747-494d-8a0f-559b3670d4a4",
        "name": "Enhancement Features",
        "description": "Implement additional features for better UX",
        "type": "group",
        "status": "pending",
        "dependencies": [],
        "subtasks": [
          {
            "id": "f1d67821-95b4-4602-9c23-1cfdd6b1d090",
            "name": "Dark Mode Implementation",
            "description": "Add dark mode support with system preference detection",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "edf1e5f7-d747-494d-8a0f-559b3670d4a4"
          },
          {
            "id": "9fdf1798-0f7b-4bf2-85a7-55ed49c57e10",
            "name": "Animations and Transitions",
            "description": "Implement smooth animations:\n- Page transitions\n- Scroll animations\n- Hover effects\n- Loading states",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "edf1e5f7-d747-494d-8a0f-559b3670d4a4"
          },
          {
            "id": "bd466a22-5a56-434b-9f4a-d6a83c26530c",
            "name": "Blog Section",
            "description": "Set up blog functionality:\n- MDX integration\n- Blog list page\n- Article template\n- Code syntax highlighting",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "edf1e5f7-d747-494d-8a0f-559b3670d4a4"
          }
        ],
        "metadata": {
          "created": "2024-12-16T10:47:53.916Z",
          "updated": "2024-12-16T10:47:53.916Z",
          "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
        },
        "parentId": "8b4f40b2-1941-46c6-bc9f-b68d1c1b4aa2"
      },
      {
        "id": "eaf454d2-48e1-4b4b-94ce-9c3e60ed1ed8",
        "name": "Performance Optimization",
        "description": "Optimize website performance and accessibility",
        "type": "group",
        "status": "pending",
        "dependencies": [],
        "subtasks": [
          {
            "id": "c645be45-3cf2-4cd2-8117-60a66d90f186",
            "name": "Image Optimization",
            "description": "Implement image optimization:\n- Next.js Image component\n- Responsive images\n- Lazy loading\n- WebP format",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "eaf454d2-48e1-4b4b-94ce-9c3e60ed1ed8"
          },
          {
            "id": "b1d0c9a1-be60-4776-ae77-835197c84110",
            "name": "SEO Setup",
            "description": "Configure SEO:\n- Meta tags\n- Open Graph\n- Sitemap\n- Robots.txt",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "eaf454d2-48e1-4b4b-94ce-9c3e60ed1ed8"
          },
          {
            "id": "7f102e4a-8016-43ef-93e7-3123d9f774e8",
            "name": "Accessibility Improvements",
            "description": "Ensure WCAG compliance:\n- Semantic HTML\n- ARIA labels\n- Keyboard navigation\n- Color contrast",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "eaf454d2-48e1-4b4b-94ce-9c3e60ed1ed8"
          }
        ],
        "metadata": {
          "created": "2024-12-16T10:47:53.916Z",
          "updated": "2024-12-16T10:47:53.916Z",
          "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
        },
        "parentId": "8b4f40b2-1941-46c6-bc9f-b68d1c1b4aa2"
      },
      {
        "id": "89479531-17de-4964-b702-f3c0fb181417",
        "name": "Testing and Deployment",
        "description": "Test and deploy the website",
        "type": "group",
        "status": "pending",
        "dependencies": [],
        "subtasks": [
          {
            "id": "16f68998-a367-48d5-9440-213ceb86f6d3",
            "name": "Testing Implementation",
            "description": "Set up and write tests:\n- Unit tests\n- Integration tests\n- E2E tests\n- Accessibility tests",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "89479531-17de-4964-b702-f3c0fb181417"
          },
          {
            "id": "afb28769-f67a-4fef-9bc8-2d06490cb449",
            "name": "Deployment Setup",
            "description": "Configure deployment:\n- Vercel setup\n- CI/CD pipeline\n- Environment variables\n- Domain configuration",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "89479531-17de-4964-b702-f3c0fb181417"
          },
          {
            "id": "a587eca0-f28a-4ca3-8b22-751301e9243a",
            "name": "Documentation",
            "description": "Create documentation:\n- Setup instructions\n- Content management guide\n- Deployment process\n- Maintenance guidelines",
            "type": "task",
            "status": "pending",
            "dependencies": [],
            "subtasks": [],
            "metadata": {
              "created": "2024-12-16T10:47:53.916Z",
              "updated": "2024-12-16T10:47:53.916Z",
              "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
            },
            "parentId": "89479531-17de-4964-b702-f3c0fb181417"
          }
        ],
        "metadata": {
          "created": "2024-12-16T10:47:53.916Z",
          "updated": "2024-12-16T10:47:53.916Z",
          "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79"
        },
        "parentId": "8b4f40b2-1941-46c6-bc9f-b68d1c1b4aa2"
      }
    ],
    "metadata": {
      "created": "2024-12-16T10:47:53.915Z",
      "updated": "2024-12-16T10:47:53.915Z",
      "sessionId": "4bcc6aad-b123-416d-a71c-58b3788cca79",
      "context": "Web development project for creating a personal portfolio",
      "tags": [
        "web-development",
        "portfolio",
        "frontend",
        "ui-ux"
      ]
    },
    "parentId": "ROOT-4bcc6aad-b123-416d-a71c-58b3788cca79"
  }
]
```

</details>

## Tools

### Task Management

#### create_task
Creates a new task with optional subtasks.

```typescript
{
  "parentId": string | null,  // Parent task ID or null for root tasks
  "name": string,            // Task name (required)
  "description": string,     // Task description
  "notes": Note[],          // Rich content notes
  "reasoning": {            // Task reasoning documentation
    "approach": string,     // Implementation strategy
    "assumptions": string[],// Key assumptions
    "alternatives": string[],// Other approaches considered
    "risks": string[],      // Potential issues
    "tradeoffs": string[], // Key decisions and implications
    "constraints": string[],// Technical/business limitations
    "dependencies_rationale": string[], // Dependency reasoning
    "impact_analysis": string[] // System impact analysis
  },
  "type": "task" | "milestone" | "group",
  "dependencies": string[], // Task IDs this task depends on
  "metadata": {             // Additional task metadata
    "context": string,
    "tags": string[]
  }
}
```

#### bulk_create_tasks
Creates multiple tasks efficiently in a single operation. Supports:
- Batch creation under a common parent
- Automatic dependency validation
- Status propagation
- Transaction handling for consistency

```typescript
{
  "parentId": string | null,  // Parent task ID or null for root tasks
  "tasks": Array<{
    name: string,            // Task name (required)
    description?: string,    // Task description
    notes?: Note[],         // Rich content notes
    reasoning?: TaskReasoning, // Decision documentation
    type?: TaskType,        // task, milestone, or group
    dependencies?: string[], // Task dependencies
    metadata?: {            // Additional context
      context?: string,
      tags?: string[]
    },
    subtasks?: CreateTaskInput[] // Nested tasks
  }>
}
```

#### update_task
Updates an existing task with automatic status propagation and validation:
- Validates status transitions
- Updates dependent tasks
- Maintains task hierarchy
- Preserves task history

```typescript
{
  "taskId": string,         // Task ID to update
  "updates": {
    "name"?: string,        // New task name
    "description"?: string, // New description
    "notes"?: Note[],      // Updated notes
    "reasoning"?: TaskReasoning, // Updated reasoning
    "type"?: TaskType,     // New task type
    "status"?: TaskStatus, // New status
    "dependencies"?: string[], // Updated dependencies
    "metadata"?: {         // Updated metadata
      "context"?: string,
      "tags"?: string[]
    }
  }
}
```

#### delete_task
Safely removes a task and its subtasks:
- Recursive deletion of subtasks
- Dependency cleanup
- Status propagation
- Reference removal
- Transaction handling

### Task Retrieval

#### get_task
Retrieves a task by ID with full context:
- Complete task details with rich content
- Status information and history
- Dependency data and validation
- Metadata and context inheritance
- Error context if applicable
- Cache utilization for performance

#### get_subtasks
Lists all subtasks of a specified task:
- Direct child tasks with hierarchy info
- Status information and propagation
- Dependency relationships and validation
- Metadata and context inheritance
- Hierarchical structure maintenance
- Index-based retrieval optimization

#### get_task_tree
Retrieves the complete task hierarchy:
- Full task tree structure (max 5 levels)
- Status aggregation and propagation
- Dependency mapping and validation
- Metadata inheritance and merging
- Performance optimized with caching
- Batch retrieval capabilities
- Index-based search support

#### get_tasks_by_status
Filters tasks by their current status:
- Status-based filtering with validation
- Optional parent/hierarchy filtering
- Dependency context and validation
- Metadata inclusion and inheritance
- Performance optimized retrieval
- Cache utilization
- Index-based search

### Session Management

#### create_session
Creates a new session with optional metadata:
```typescript
{
  "name": string,           // Session name (required)
  "metadata": {            // Optional session metadata
    "tags": string[],      // Session categorization
    "context": string      // Additional context
  }
}
```

#### create_task_list
Creates a new task list in the current session:
```typescript
{
  "name": string,           // List name (required)
  "description": string,    // List description
  "metadata": {            // Optional metadata
    "tags": string[],      // List categorization
    "context": string      // Additional context
  },
  "persistent": boolean    // Persist across sessions
}
```

#### switch_session
Switches to a different session:
- Validates session existence
- Handles state transition
- Preserves task context
- Updates active session

#### switch_task_list
Switches to a different task list:
- Validates list existence
- Handles list transition
- Maintains session context
- Updates active list

#### list_sessions
Lists all available sessions:
- Optional archived session inclusion
- Session metadata and stats
- Creation/update timestamps
- Task list summaries

#### list_task_lists
Lists all task lists in current session:
- Optional archived list inclusion
- List metadata and context
- Task count and status
- Persistence information

### Storage Operations

#### Task Storage
- SQLite-based persistence
- Transaction support
- Automatic migrations
- Backup management
- Connection pooling
- Error recovery

#### Session Storage
- Session state persistence
- Task list management
- Active state tracking
- Cross-session relationships
- Cleanup operations

#### Maintenance
- Automatic cleanup
- Index optimization
- Cache management
- Backup rotation
- Resource monitoring

### System Features

#### Rate Limiting
- 600 requests per minute limit
- Automatic request throttling
- Queue management
- Error handling
- Client feedback

#### Health Monitoring
- System health checks
- Resource monitoring
- Error tracking
- Performance metrics
- Status reporting

#### Request Tracing
- Request lifecycle tracking
- Performance monitoring
- Error context capture
- Debug information
- Audit logging

#### Error Handling
ATLAS provides comprehensive error handling:
- Validation errors with context
- Dependency conflict detection
- Task state inconsistencies
- System resource issues
- Transaction failures
- Rate limit violations
- Request timeout handling

## Best Practices

### Task Management
- Create parent tasks before subtasks
- Use task IDs for dependencies
- Provide clear context in metadata
- Use appropriate task types
- Document reasoning and assumptions
- Handle status transitions carefully
- Monitor dependency relationships
- Maintain task hierarchy

### Content Organization
- Use appropriate note types
- Include relevant code samples
- Maintain clear documentation
- Document decision-making process
- Keep metadata current
- Tag tasks appropriately
- Structure hierarchies logically

### Performance Optimization
- Use bulk operations for multiple tasks
- Monitor rate limits
- Handle long-running operations
- Implement proper error handling
- Optimize task retrieval
- Cache frequently accessed data
- Clean up completed tasks

### Error Recovery
- Handle validation errors gracefully
- Resolve dependency conflicts
- Manage status inconsistencies
- Recover from system issues
- Maintain data integrity
- Document error contexts
- Implement retry strategies

## Development

```bash
# Build the project
npm run build

# Watch for changes
npm run watch

# Run MCP inspector
npm run inspector

# Run tests
npm test

# Check types
npm run type-check
```

## Up Next

### Session Management Improvements
- Session file consolidation
- Distributed session locking
- Improved state synchronization
- Race condition prevention
- Cross-session data consistency
- Session cleanup optimization

### Storage Layer Enhancements
- Storage abstraction simplification
- Tighter migration integration
- Version control improvements
- Storage manager coordination
- Backup strategy optimization
- Data integrity validation

### Task Core Improvements
- Task core coordinator implementation
- Cache coherency protocol
- Transaction boundary strengthening
- Subsystem coordination
- Batch operation optimization
- Index performance tuning

### System Enhancements
- Enhanced performance monitoring
- Advanced caching strategies
- Improved error recovery
- Better dependency management
- Transaction optimizations
- Resource usage tracking

### Integration Features
- Webhook support
- External system integration
- Event streaming
- Custom tool support
- Plugin architecture
- API versioning

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

For bugs and feature requests, please [create an issue](https://github.com/cyanheads/atlas-mcp-server/issues).

## License

Apache License 2.0

---

<div align="center">
Built with the Model Context Protocol
</div>
