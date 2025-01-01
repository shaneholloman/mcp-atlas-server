import { Logger } from '../../../logging/index.js';
import { Task, TaskStatus, UpdateTaskInput } from '../../../types/task.js';
import { TaskStorage } from '../../../types/storage.js';
import { TaskErrorFactory } from '../../../errors/task-error.js';
import { StorageError } from '../../../errors/storage-error.js';

export interface StatusTransitionResult {
  status: TaskStatus;
  autoTransition?: boolean;
}

export interface StatusValidationOperations {
  validateUpdate: () => Promise<void>;
  handleDependencyUpdates?: () => Promise<void>;
  handleStatusPropagation?: () => Promise<void>;
  validateStatusTransition?: () => Promise<StatusTransitionResult>;
  validateParentChildStatus?: () => Promise<{
    parentUpdate?: { path: string; status: TaskStatus };
  }>;
  emitEvents: (updatedTask: Task) => Promise<void>;
  updateCache: (updatedTask: Task) => void;
}

/**
 * Manages task-specific transactions ensuring proper coordination
 * and preventing nested transaction issues
 */
export class TaskTransactionManager {
  private readonly logger: Logger;

  constructor(private readonly storage: TaskStorage) {
    this.logger = Logger.getInstance().child({ component: 'TaskTransactionManager' });
  }

  /**
   * Execute a task update within a transaction
   */
  async executeUpdate(
    task: Task,
    updates: UpdateTaskInput,
    operations: StatusValidationOperations
  ): Promise<Task> {
    return this.storage.executeInTransaction(async () => {
      try {
        // Validate updates first
        await operations.validateUpdate();

        // Handle dependency updates if needed
        if (updates.dependencies && operations.handleDependencyUpdates) {
          await operations.handleDependencyUpdates();
        }

        // Handle status updates
        if (updates.status !== undefined && updates.status !== task.status) {
          if (operations.handleStatusPropagation) {
            await operations.handleStatusPropagation();
          }

          if (operations.validateStatusTransition) {
            const statusResult = await operations.validateStatusTransition();
            // Update the status if auto-transition occurred
            if (statusResult.autoTransition) {
              updates = {
                ...updates,
                status: statusResult.status,
              };
            }
          }

          if (operations.validateParentChildStatus) {
            const parentResult = await operations.validateParentChildStatus();

            // Update task first
            const updatedTask = await this.executeTaskUpdate(task.path, updates);

            // Handle parent updates if needed
            if (parentResult.parentUpdate) {
              await this.executeTaskUpdate(parentResult.parentUpdate.path, {
                status: parentResult.parentUpdate.status,
              });
            }

            // Update cache and emit events
            operations.updateCache(updatedTask);
            await operations.emitEvents(updatedTask);

            return updatedTask;
          }
        }

        // Handle non-status updates
        const updatedTask = await this.executeTaskUpdate(task.path, updates);
        operations.updateCache(updatedTask);
        await operations.emitEvents(updatedTask);

        return updatedTask;
      } catch (error) {
        this.logger.error('Failed to execute task update transaction', {
          error,
          taskPath: task.path,
          updates,
        });

        if (error instanceof Error) {
          throw StorageError.transaction(
            task.path,
            'TaskTransactionManager.executeUpdate',
            error.message,
            { error, updates }
          );
        }
        throw error;
      }
    });
  }

  /**
   * Execute a single task update
   */
  private async executeTaskUpdate(path: string, updates: UpdateTaskInput): Promise<Task> {
    try {
      return await this.storage.updateTask(path, updates);
    } catch (error) {
      throw TaskErrorFactory.createTaskOperationError(
        'TaskTransactionManager.executeTaskUpdate',
        'Failed to update task',
        { error, path, updates }
      );
    }
  }

  /**
   * Get storage metrics
   */
  async getMetrics(): Promise<{
    storage: {
      totalSize: number;
      pageSize: number;
      pageCount: number;
      walSize: number;
    };
  }> {
    const metrics = await this.storage.getMetrics();
    return {
      storage: metrics.storage,
    };
  }
}