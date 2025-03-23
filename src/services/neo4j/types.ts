/**
 * Common type definitions for the Neo4j service
 */

import {
  PriorityLevel,
  ProjectStatus,
  TaskStatus
} from '../../types/mcp.js';

/**
 * Neo4j entity base interface
 * Common properties for all Neo4j entities
 */
export interface Neo4jEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project entity in Neo4j
 */
export interface Neo4jProject extends Neo4jEntity {
  name: string;
  description: string;
  status: typeof ProjectStatus[keyof typeof ProjectStatus];
  urls?: Array<{ title: string; url: string }>;
  completionRequirements: string;
  outputFormat: string;
  taskType: string;
}

/**
 * Task entity in Neo4j
 */
export interface Neo4jTask extends Neo4jEntity {
  projectId: string;
  title: string;
  description: string;
  priority: typeof PriorityLevel[keyof typeof PriorityLevel];
  status: typeof TaskStatus[keyof typeof TaskStatus];
  assignedTo?: string;
  urls?: Array<{ title: string; url: string }>;
  tags?: string[];
  completionRequirements: string;
  outputFormat: string;
  taskType: string;
}

/**
 * Knowledge entity in Neo4j
 */
export interface Neo4jKnowledge extends Neo4jEntity {
  projectId: string;
  text: string;
  tags?: string[];
  domain: string;
  citations?: string[];
}

/**
 * User entity in Neo4j
 */
export interface Neo4jUser extends Neo4jEntity {
  username: string;
  displayName: string;
  email?: string;
}

/**
 * TaskType entity in Neo4j
 */
export interface Neo4jTaskType {
  name: string;
  description?: string;
}

/**
 * Domain entity in Neo4j
 */
export interface Neo4jDomain {
  name: string;
  description?: string;
}

/**
 * Citation entity in Neo4j
 */
export interface Neo4jCitation extends Neo4jEntity {
  source: string;
  title?: string;
  author?: string;
  date?: string;
}

/**
 * Relationship types used in the Neo4j database
 */
export enum RelationshipTypes {
  CONTAINS_TASK = 'CONTAINS_TASK',
  CONTAINS_KNOWLEDGE = 'CONTAINS_KNOWLEDGE',
  DEPENDS_ON = 'DEPENDS_ON',
  ASSIGNED_TO = 'ASSIGNED_TO',
  CITES = 'CITES',
  RELATED_TO = 'RELATED_TO',
  HAS_TYPE = 'HAS_TYPE',
  BELONGS_TO_DOMAIN = 'BELONGS_TO_DOMAIN',
  BELONGS_TO_PROJECT = 'BELONGS_TO_PROJECT'
}

/**
 * Node labels used in the Neo4j database
 */
export enum NodeLabels {
  Project = 'Project',
  Task = 'Task',
  Knowledge = 'Knowledge',
  User = 'User',
  TaskType = 'TaskType',
  Domain = 'Domain',
  Citation = 'Citation'
}

/**
 * Pagination options for querying Neo4j
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Result with pagination metadata
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Filter options for Project queries
 */
export interface ProjectFilterOptions extends PaginationOptions {
  status?: 'active' | 'pending' | 'completed' | 'archived' | ('active' | 'pending' | 'completed' | 'archived')[];
  taskType?: string;
  searchTerm?: string;
}

/**
 * Filter options for Task queries
 */
export interface TaskFilterOptions extends PaginationOptions {
  projectId: string;
  status?: 'backlog' | 'todo' | 'in_progress' | 'completed' | ('backlog' | 'todo' | 'in_progress' | 'completed')[];
  priority?: 'low' | 'medium' | 'high' | 'critical' | ('low' | 'medium' | 'high' | 'critical')[];
  assignedTo?: string;
  tags?: string[];
  taskType?: string;
  sortBy?: 'priority' | 'createdAt' | 'status';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Filter options for Knowledge queries
 */
export interface KnowledgeFilterOptions extends PaginationOptions {
  projectId: string;
  tags?: string[];
  domain?: string;
  search?: string;
}

/**
 * Project dependency relationship type
 */
export interface ProjectDependency {
  sourceProjectId: string;
  targetProjectId: string;
  type: 'requires' | 'extends' | 'implements' | 'references';
  description: string;
}

/**
 * Search options for unified search
 */
export interface SearchOptions extends PaginationOptions {
  property?: string;
  value: string;
  entityTypes?: ('project' | 'task' | 'knowledge')[];
  caseInsensitive?: boolean;
  fuzzy?: boolean;
  taskType?: string;
}
