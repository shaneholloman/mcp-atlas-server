import { TaskType, TaskStatus, Task, UpdateTaskInput } from '../../../types/task.js';
import { ToolFactory, ToolImplementation } from './shared/types.js';
import { formatResponse } from './shared/response-formatter.js';
import { ErrorCodes, createError } from '../../../errors/index.js';

/**
 * Update task tool implementation
 */
export const updateTaskTool: ToolFactory = (context): ToolImplementation => ({
  definition: {
    name: 'update_task',
    description: `Update an existing task's properties and status.

When to Use:
- Tracking task progress
- Modifying task details or requirements
- Updating dependencies or relationships
- Documenting progress and decisions

Best Practices:
- Update status to reflect current progress
- Document changes in metadata
- Maintain accurate dependencies
- Preserve task hierarchy
- Include reasoning for significant changes

Example:
{
  "path": "project/backend/auth",
  "updates": {
    "status": "IN_PROGRESS",
    "metadata": {
      "progress_indicators": [
        "Database schema updated",
        "JWT library integrated",
        "Basic token generation implemented"
      ],
      "reasoning": "Moving to IN_PROGRESS as database dependencies are completed and core JWT implementation has begun. Token refresh mechanism still pending.",
      "technical_notes": [
        "Using jsonwebtoken library for JWT operations",
        "Token expiry set to 1 hour with refresh window"
      ]
    }
  }
}`,
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path of task to update',
        },
        updates: {
          type: 'object',
          description: `Changes to apply to the task. Available fields:
- title: Update task name to reflect current focus
- description: Update details with latest findings/requirements
- type: Change task classification (TASK/MILESTONE)
- status: Update execution state with automatic dependency checks
- parentPath: Move task in hierarchy
- dependencies: Add/remove task dependencies
- metadata: Update task tracking information

Status changes trigger:
- Automatic dependency validation
- Status propagation to parent tasks
- Dependent task blocking
- Child task status updates`,
          properties: {
            title: {
              type: 'string',
              description: 'New task title reflecting current focus',
            },
            description: {
              type: 'string',
              description: 'Updated task details including progress and findings',
            },
            type: {
              type: 'string',
              enum: ['TASK', 'MILESTONE'],
              description: 'Task classification (TASK/MILESTONE)',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED'],
              description: `Task execution state:
- PENDING: Not started
- IN_PROGRESS: Actively being worked on
- COMPLETED: Successfully finished
- BLOCKED: Waiting on dependencies
- CANCELLED: No longer needed`,
            },
            parentPath: {
              type: 'string',
              description: 'New parent task for hierarchy changes',
            },
            dependencies: {
              type: 'array',
              items: { type: 'string' },
              description: 'Updated list of required tasks',
            },
            metadata: {
              type: 'object',
              description: `Task tracking information:
- progress_indicators: Completed components
- technical_notes: Implementation details
- blockers: Current obstacles
- next_steps: Planned actions`,
            },
          },
        },
      },
      required: ['path', 'updates'],
    },
  },
  handler: async (args: Record<string, unknown>) => {
    const { path, updates } = args as { path: string; updates: Record<string, unknown> };

    // First fetch the existing task to preserve required fields
    const existingTask: Task | null = await context.taskManager.getTask(path);
    if (!existingTask) {
      throw createError(
        ErrorCodes.TASK_NOT_FOUND,
        `Task not found at path: ${path}`,
        'update_task'
      );
    }

    // Create update object starting with existing required fields
    const updateData: UpdateTaskInput = {
      name: existingTask.name,
      type: existingTask.type,
      description: existingTask.description,
      dependencies: existingTask.dependencies,
      metadata: { ...existingTask.metadata },
      statusMetadata: { ...existingTask.statusMetadata },
    };

    // Apply updates only if they are provided
    if (typeof updates.title === 'string') {
      updateData.name = updates.title;
    }
    if (updates.type) {
      updateData.type = (updates.type as string).toUpperCase() as TaskType;
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description as string;
    }
    if (updates.status !== undefined) {
      updateData.status = updates.status as TaskStatus;
    }
    if (Array.isArray(updates.dependencies)) {
      updateData.dependencies = updates.dependencies as string[];
    }
    if (updates.metadata) {
      updateData.metadata = {
        ...updateData.metadata,
        ...(updates.metadata as Record<string, unknown>),
      };
    }
    if (updates.statusMetadata) {
      updateData.statusMetadata = {
        ...updateData.statusMetadata,
        ...(updates.statusMetadata as Record<string, unknown>),
      };
    }

    // Update the task with merged data
    const result: Task = await context.taskManager.updateTask(path, updateData);
    return formatResponse(result, context.logger);
  },
});