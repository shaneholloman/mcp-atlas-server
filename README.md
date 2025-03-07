# ATLAS MCP Server 2.0

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-1.6.1-green.svg)](https://modelcontextprotocol.io/)
[![Version](https://img.shields.io/badge/Version-2.0.7-blue.svg)]()
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Stable-blue.svg)]()
[![GitHub](https://img.shields.io/github/stars/cyanheads/atlas-mcp-server?style=social)](https://github.com/cyanheads/atlas-mcp-server)

ATLAS (Adaptive Task & Logic Automation System) is a Model Context Protocol server designed for LLMs to manage complex projects. Built with TypeScript and featuring
Neo4j graph database integration, efficient project management, and collaborative features, ATLAS provides LLM Agents project management capabilities through a clean, flexible tool interface.

> **Important Version Note**: [Version 1.5.4](https://github.com/cyanheads/atlas-mcp-server/releases/tag/v1.5.4) is the last version that uses SQLite as the database. Version 2.0 and onwards has been completely rewritten to use Neo4j, which requires either:
> - Self-hosting using Docker (docker-compose included in repository)
> - Using Neo4j AuraDB cloud service: https://neo4j.com/product/auradb/

## Table of Contents

- [Overview](#overview)
  - [Architecture & Components](#architecture--components)
- [Features](#features)
  - [Project Management](#project-management)
  - [Collaboration Features](#collaboration-features)
  - [Whiteboard System](#whiteboard-system)
  - [Graph Database Integration](#graph-database-integration)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Tools](#tools)
  - [Project Operations](#project-operations)
  - [Member Management](#member-management)
  - [Dependency Management](#dependency-management)
  - [Whiteboard Operations](#whiteboard-operations)
  - [Database Operations](#database-operations)
- [Resources](#resources)
  - [Project Resources](#project-resources)
- [Best Practices](#best-practices)
  - [Project Organization](#project-organization)
  - [Performance Optimization](#performance-optimization)
  - [Error Prevention](#error-prevention)
- [Contributing](#contributing)
- [License](#license)

## Overview

ATLAS implements the Model Context Protocol (MCP), enabling standardized communication between LLMs and external systems through:

- **Clients**: Claude Desktop, IDEs, and other MCP-compatible clients
- **Servers**: Tools and resources for project management and collaboration
- **LLM Agents**: AI models that leverage the server's project management capabilities

Key capabilities:

- **Project Management**: Comprehensive project lifecycle management with metadata and status tracking
- **Collaboration Tools**: Member management, dependencies, and resource linking
- **Whiteboard System**: Real-time collaborative whiteboards with version history
- **Graph Database**: Neo4j-powered relationship management and querying
- **Performance Focus**: Optimized caching, batch operations, and health monitoring
- **Graceful Shutdown**: Robust error handling and graceful shutdown mechanisms

### Architecture & Components

Core system architecture:

```mermaid
flowchart TB
    subgraph API["API Layer"]
        direction LR
        MCP["MCP Protocol"]
        Val["Validation"]
        Rate["Rate Limiting"]

        MCP --> Val --> Rate
    end

    subgraph Core["Core Services"]
        direction LR
        Project["Project Store"]
        Whiteboard["Whiteboard System"]
        Member["Member Management"]

        Project <--> Member
        Member <--> Whiteboard
        Project <-.-> Whiteboard
    end

    subgraph Storage["Storage Layer"]
        direction LR
        Neo4j["Neo4j Graph DB"]
        Cache["Cache Layer"]

        Neo4j <--> Cache
    end

    Rate --> Project
    Rate --> Whiteboard
    Project --> Neo4j
    Whiteboard --> Neo4j

    classDef layer fill:#2d3748,stroke:#4299e1,stroke-width:3px,rx:5,color:#fff
    classDef component fill:#1a202c,stroke:#a0aec0,stroke-width:2px,rx:3,color:#fff
    classDef api fill:#3182ce,stroke:#90cdf4,stroke-width:2px,rx:3,color:#fff
    classDef core fill:#319795,stroke:#81e6d9,stroke-width:2px,rx:3,color:#fff
    classDef storage fill:#2f855a,stroke:#9ae6b4,stroke-width:2px,rx:3,color:#fff

    class API,Core,Storage layer
    class MCP,Val,Rate api
    class Project,Whiteboard,Member core
    class Neo4j,Cache storage
```

Core Components:

- **Storage Layer**: Neo4j graph database with caching layer
- **Project Layer**: Project management, relationships, and dependency tracking
- **Member System**: Role-based access control and collaboration
- **Whiteboard Engine**: Real-time collaboration and version control
- **Error Handling**: Comprehensive error handling and logging system

## Features

### Project Management
- **Comprehensive Tracking:** Manage project metadata, statuses, and rich content (notes, links, etc.) with built-in support for bulk operations.
- **Dependency & Relationship Handling:** Automatically validate and track inter-project dependencies.

### Collaboration
- **Member & Role Management:** Enable team collaboration with role-based permissions (owner, admin, member, viewer).
- **Resource Sharing & Activity Tracking:** Seamlessly share links and monitor project updates in real-time.

### Whiteboard System
- **Real-Time Collaboration:** Use shared whiteboard workspaces with version control and schema validation, seamlessly integrated with projects.

### Graph Database Integration
- **Native Relationship Management:** Leverage Neo4j’s ACID-compliant transactions and optimized queries for robust data integrity.
- **Advanced Search & Scalability:** Perform property-based searches with fuzzy matching and wildcards while maintaining high performance.

## Installation

### Option 1: Install via npm

```bash
npm install atlas-mcp-server
```

### Option 2: Install from source

1. Clone the repository:
```bash
git clone https://github.com/cyanheads/atlas-mcp-server.git
cd atlas-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure Neo4j:
```bash
# Start Neo4j using Docker
docker-compose up -d
```

4. Build the project:
```bash
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password2

# Application Configuration
LOG_LEVEL=info # debug, info, warn, error
NODE_ENV=development # development, production
```

### MCP Client Settings

Add to your MCP client settings:

```json
{
  "mcpServers": {
    "atlas": {
      "command": "node",
      "args": ["/path/to/atlas-mcp-server/dist/index.js"],
      "env": {
        "NEO4J_URI": "bolt://localhost:7687",
        "NEO4J_USER": "neo4j",
        "NEO4J_PASSWORD": "password2",
        "LOG_LEVEL": "info",
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Project Structure

The codebase follows a modular structure:

```
src/
├── config/          # Configuration management
├── mcp/            # MCP server implementation
│   ├── resources/  # MCP resources
│   └── tools/      # MCP tools
├── scripts/        # Build and maintenance scripts
├── logs/           # Application logs
├── output/         # Generated output files
├── neo4j/         # Neo4j database services
│   └── projectService/ # Project-related operations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Tools

ATLAS 2.0 provides comprehensive tools for project management:

### Project Operations

| Tool | Description |
|------|-------------|
| `project_create` | Create projects with unique names and optional descriptions. Supports both single project creation and bulk operations for multiple projects. |
| `project_update` | Update existing project properties including name, description, and status. Supports both single project updates and bulk operations. |
| `project_delete` | Delete projects and their associated data from the system. Supports both single project deletion and bulk operations for multiple projects. |
| `project_note_add` | Add notes to projects for documentation and tracking. Supports both single note creation and bulk operations with optional categorization tags. |
| `project_link_add` | Add links to external resources like documentation, designs, or repositories. Supports both single link creation and bulk operations with optional categorization. |
| `project_link_update` | Update existing project link properties including title, URL, description, and category. Supports both single and bulk update operations. |
| `project_link_delete` | Delete links from projects permanently. Supports both single link deletion and bulk operations for multiple links. |

### Member Management

| Tool | Description |
|------|-------------|
| `project_member_add` | Add users to projects with role-based access control. Supports both single member addition and bulk operations with different permission levels. |
| `project_member_remove` | Remove members from projects permanently. Supports both single member removal and bulk operations for multiple members. |
| `project_member_list` | List all members of a project with their roles and join dates, ordered by join time with owners listed first. |

### Dependency Management

| Tool | Description |
|------|-------------|
| `project_dependency_add` | Define relationships between projects with specific dependency types. Supports both single dependency creation and bulk operations with detailed descriptions. |
| `project_dependency_remove` | Remove dependency relationships between projects. Supports both single dependency removal and bulk operations for multiple dependencies. |
| `project_dependency_list` | List all dependencies and dependents for a project, showing both projects it depends on and projects that depend on it. |

### Whiteboard Operations

| Tool | Description |
|------|-------------|
| `whiteboard_create` | Create a new whiteboard workspace with optional initial data and schema validation. Can be linked to projects for organization. |
| `whiteboard_update` | Update whiteboard data by merging or replacing content. Supports partial updates to specific fields or complete data replacement. |
| `whiteboard_get` | Retrieve whiteboard data with version control. Access either the latest version or a specific historical version by number. |
| `whiteboard_delete` | Delete a whiteboard and its entire version history permanently. This operation cannot be undone. |

### Database Operations

| Tool | Description |
|------|-------------|
| `neo4j_search` | Search the database for nodes with specific property values. Supports case-insensitive, wildcard, and fuzzy matching with pagination options. |
| `database_clean` | Clean the database by removing all nodes and relationships, then reinitialize the schema. This operation cannot be undone. |

## Resources

ATLAS 2.0 exposes system resources through standard MCP endpoints:

### Project Resources

| Resource | Description |
|----------|-------------|
| `atlas-project://list-all` | Lists all projects with pagination support.<br>• Projects are ordered by creation date (newest first)<br>• Paginate results with customizable page size<br>• Returns an array of projects along with total count, current page info, and applied filters |
| `atlas-project://{projectId}` | Fetches detailed information about a specific project.<br>• Supports including related data like notes, links, dependencies, and members |
| `atlas-project://{projectId}/notes` | Fetches notes associated with a specific project.<br>• Supports filtering by tags, time range, and sorting options<br>• Returns both note data and metadata about tags and timestamps |
| `atlas-project://{projectId}/links` | Fetches links associated with a specific project.<br>• Supports filtering by category, search terms, and sorting options<br>• Returns both link data and metadata about categories and domains |
| `atlas-project://{projectId}/dependencies` | Lists all dependencies and dependents for a project.<br>• Dependencies are projects that this project depends on<br>• Dependents are projects that depend on this project<br>• Results are grouped by relationship type |
| `atlas-project://{projectId}/members` | Lists all members of a project along with their roles and join dates.<br>• Results are ordered by join date, with project owners listed first<br>• Supports filtering by role and user ID |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

For bugs and feature requests, please create an issue.

## License

Apache License 2.0

---

<div align="center">
Built with the Model Context Protocol
</div>