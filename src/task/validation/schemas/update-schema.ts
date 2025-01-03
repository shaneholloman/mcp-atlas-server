import { z } from 'zod';
import { taskMetadataSchema } from './metadata-schema.js';
import { TaskType, TaskStatus } from '../../../types/task.js';

/**
 * Schema for task update input
 */
export const updateTaskSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  type: z.nativeEnum(TaskType).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  notes: z.array(z.string().max(1000)).max(100).optional(),
  reasoning: z.string().max(2000).optional(),
  dependencies: z.array(z.string()).max(50).optional(),
  metadata: taskMetadataSchema.optional(),
  // Add new fields
  statusMetadata: z
    .object({
      assignee: z.string().optional(),
      progress_indicators: z.array(z.string()).optional(),
      completedBy: z.string().optional(),
      verificationStatus: z.enum(['passed', 'failed']).optional(),
      completionChecks: z.array(z.string()).optional(),
      errorType: z.string().optional(),
      errorDetails: z.string().optional(),
      recoveryAttempts: z.number().optional(),
      blockedBy: z.array(z.string()).optional(),
      blockedReason: z.string().optional(),
    })
    .optional(),
  planningNotes: z.array(z.string().max(2000)).max(25).optional(),
  progressNotes: z.array(z.string().max(2000)).max(25).optional(),
  completionNotes: z.array(z.string().max(2000)).max(25).optional(),
  troubleshootingNotes: z.array(z.string().max(2000)).max(25).optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
