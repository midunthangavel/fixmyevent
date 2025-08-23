// Workflow & Collaboration Service
// This service manages team collaboration, task tracking, and approval workflows

import { 
  TeamMember, 
  TeamRole, 
  Permission, 
  Task, 
  TaskComment, 
  ApprovalWorkflow, 
 
  EventTemplate 
} from '@/types/productivity';

export interface CreateTeamRequest {
  eventId: string;
  members: {
    userId: string;
    role: TeamRole;
    permissions?: Permission[];
  }[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  eventId: string;
  assigneeId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  estimatedHours: number;
  dependencies?: string[];
}

export interface CreateApprovalWorkflowRequest {
  eventId: string;
  type: 'vendor' | 'budget' | 'timeline' | 'custom';
  steps: {
    title: string;
    description: string;
    approverId: string;
    order: number;
  }[];
}

export interface CreateEventTemplateRequest {
  name: string;
  description: string;
  category: string;
  eventType: string;
  estimatedDuration: string;
  estimatedBudget: number;
  checklist: any[];
  timeline: any[];
  vendorCategories: string[];
  tags: string[];
  isPublic?: boolean;
}

export interface TaskFilter {
  eventId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  dueDateRange?: { start: Date; end: Date };
}

export interface TeamFilter {
  eventId?: string;
  role?: TeamRole;
  isActive?: boolean;
}

export class WorkflowCollaborationService {
  private teams: Map<string, TeamMember[]> = new Map();
  private tasks: Map<string, Task> = new Map();
  private approvalWorkflows: Map<string, ApprovalWorkflow> = new Map();
  private eventTemplates: Map<string, EventTemplate> = new Map();

  // ===== TEAM MANAGEMENT =====

  async createTeam(request: CreateTeamRequest): Promise<TeamMember[]> {
    try {
      const teamMembers: TeamMember[] = request.members.map(member => ({
        id: `member_${Date.now()}_${Math.random()}`,
        userId: member.userId,
        eventId: request.eventId,
        role: member.role,
        permissions: member.permissions || this.getDefaultPermissions(member.role),
        assignedTasks: [],
        joinDate: new Date(),
        isActive: true
      }));

      this.teams.set(request.eventId, teamMembers);
      return teamMembers;
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team');
    }
  }

  async getTeam(eventId: string): Promise<TeamMember[]> {
    try {
      return this.teams.get(eventId) || [];
    } catch (error) {
      console.error('Error getting team:', error);
      return [];
    }
  }

  async addTeamMember(eventId: string, member: Omit<TeamMember, 'id' | 'joinDate'>): Promise<TeamMember> {
    try {
      const team = this.teams.get(eventId) || [];
      const newMember: TeamMember = {
        ...member,
        id: `member_${Date.now()}_${Math.random()}`,
        joinDate: new Date()
      };

      team.push(newMember);
      this.teams.set(eventId, team);
      return newMember;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw new Error('Failed to add team member');
    }
  }

  async updateTeamMemberRole(eventId: string, memberId: string, newRole: TeamRole): Promise<TeamMember | null> {
    try {
      const team = this.teams.get(eventId);
      if (!team) return null;

      const member = team.find(m => m.id === memberId);
      if (!member) return null;

      member.role = newRole;
      member.permissions = this.getDefaultPermissions(newRole);
      
      this.teams.set(eventId, team);
      return member;
    } catch (error) {
      console.error('Error updating team member role:', error);
      return null;
    }
  }

  async removeTeamMember(eventId: string, memberId: string): Promise<boolean> {
    try {
      const team = this.teams.get(eventId);
      if (!team) return false;

      const updatedTeam = team.filter(m => m.id !== memberId);
      this.teams.set(eventId, updatedTeam);
      return true;
    } catch (error) {
      console.error('Error removing team member:', error);
      return false;
    }
  }

  async getTeamMembersByRole(eventId: string, role: TeamRole): Promise<TeamMember[]> {
    try {
      const team = this.teams.get(eventId) || [];
      return team.filter(member => member.role === role && member.isActive);
    } catch (error) {
      console.error('Error getting team members by role:', error);
      return [];
    }
  }

  // ===== TASK MANAGEMENT =====

  async createTask(request: CreateTaskRequest): Promise<Task> {
    try {
      const task: Task = {
        id: `task_${Date.now()}_${Math.random()}`,
        title: request.title,
        description: request.description,
        eventId: request.eventId,
        assigneeId: request.assigneeId,
        assigneeName: request.assigneeId ? await this.getUserName(request.assigneeId) : undefined,
        status: 'pending',
        priority: request.priority,
        dueDate: request.dueDate,
        estimatedHours: request.estimatedHours,
        dependencies: request.dependencies || [],
        attachments: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.tasks.set(task.id, task);
      
      // Update team member's assigned tasks
      if (request.assigneeId) {
        await this.assignTaskToMember(request.assigneeId, task.id);
      }

      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async getTask(taskId: string): Promise<Task | null> {
    try {
      return this.tasks.get(taskId) || null;
    } catch (error) {
      console.error('Error getting task:', error);
      return null;
    }
  }

  async getTasks(filter: TaskFilter): Promise<Task[]> {
    try {
      let tasks = Array.from(this.tasks.values());

      if (filter.eventId) {
        tasks = tasks.filter(task => task.eventId === filter.eventId);
      }

      if (filter.assigneeId) {
        tasks = tasks.filter(task => task.assigneeId === filter.assigneeId);
      }

      if (filter.status) {
        tasks = tasks.filter(task => task.status === filter.status);
      }

      if (filter.priority) {
        tasks = tasks.filter(task => task.priority === filter.priority);
      }

      if (filter.dueDateRange) {
        tasks = tasks.filter(task => 
          task.dueDate >= filter.dueDateRange!.start && 
          task.dueDate <= filter.dueDateRange!.end
        );
      }

      return tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const task = this.tasks.get(taskId);
      if (!task) return null;

      const updatedTask = { ...task, ...updates, updatedAt: new Date() };
      this.tasks.set(taskId, updatedTask);
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task | null> {
    try {
      return await this.updateTask(taskId, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
      return null;
    }
  }

  async assignTask(taskId: string, assigneeId: string): Promise<Task | null> {
    try {
      const task = await this.updateTask(taskId, { 
        assigneeId, 
        assigneeName: await this.getUserName(assigneeId) 
      });

      if (task) {
        await this.assignTaskToMember(assigneeId, taskId);
      }

      return task;
    } catch (error) {
      console.error('Error assigning task:', error);
      return null;
    }
  }

  async addTaskComment(taskId: string, userId: string, message: string): Promise<TaskComment | null> {
    try {
      const task = this.tasks.get(taskId);
      if (!task) return null;

      const comment: TaskComment = {
        id: `comment_${Date.now()}_${Math.random()}`,
        userId,
        userName: await this.getUserName(userId),
        message,
        timestamp: new Date()
      };

      task.comments.push(comment);
      task.updatedAt = new Date();
      
      this.tasks.set(taskId, task);
      return comment;
    } catch (error) {
      console.error('Error adding task comment:', error);
      return null;
    }
  }

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const task = this.tasks.get(taskId);
      if (!task) return false;

      // Remove task from team member's assigned tasks
      if (task.assigneeId) {
        await this.removeTaskFromMember(task.assigneeId, taskId);
      }

      this.tasks.delete(taskId);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  // ===== APPROVAL WORKFLOWS =====

  async createApprovalWorkflow(request: CreateApprovalWorkflowRequest): Promise<ApprovalWorkflow> {
    try {
      const workflow: ApprovalWorkflow = {
        id: `workflow_${Date.now()}_${Math.random()}`,
        eventId: request.eventId,
        type: request.type,
        steps: await Promise.all(request.steps.map(async step => ({
          id: `step_${Date.now()}_${Math.random()}`,
          title: step.title,
          description: step.description,
          approverId: step.approverId,
          approverName: await this.getUserName(step.approverId),
          order: step.order,
          status: 'pending'
        }))),
        currentStep: 0,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.approvalWorkflows.set(workflow.id, workflow);
      return workflow;
    } catch (error) {
      console.error('Error creating approval workflow:', error);
      throw new Error('Failed to create approval workflow');
    }
  }

  async getApprovalWorkflow(workflowId: string): Promise<ApprovalWorkflow | null> {
    try {
      return this.approvalWorkflows.get(workflowId) || null;
    } catch (error) {
      console.error('Error getting approval workflow:', error);
      return null;
    }
  }

  async getApprovalWorkflowsByEvent(eventId: string): Promise<ApprovalWorkflow[]> {
    try {
      return Array.from(this.approvalWorkflows.values())
        .filter(workflow => workflow.eventId === eventId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } catch (error) {
      console.error('Error getting approval workflows by event:', error);
      return [];
    }
  }

  async approveStep(workflowId: string, stepId: string, comments?: string): Promise<ApprovalWorkflow | null> {
    try {
      const workflow = this.approvalWorkflows.get(workflowId);
      if (!workflow) return null;

      const step = workflow.steps.find(s => s.id === stepId);
      if (!step) return null;

      step.status = 'approved';
      step.comments = comments;
      step.timestamp = new Date();

      // Move to next step or complete workflow
      if (workflow.currentStep < workflow.steps.length - 1) {
        workflow.currentStep++;
        workflow.status = 'in_progress';
      } else {
        workflow.status = 'approved';
      }

      workflow.updatedAt = new Date();
      this.approvalWorkflows.set(workflowId, workflow);
      return workflow;
    } catch (error) {
      console.error('Error approving step:', error);
      return null;
    }
  }

  async rejectStep(workflowId: string, stepId: string, comments: string): Promise<ApprovalWorkflow | null> {
    try {
      const workflow = this.approvalWorkflows.get(workflowId);
      if (!workflow) return null;

      const step = workflow.steps.find(s => s.id === stepId);
      if (!step) return null;

      step.status = 'rejected';
      step.comments = comments;
      step.timestamp = new Date();

      workflow.status = 'rejected';
      workflow.updatedAt = new Date();
      
      this.approvalWorkflows.set(workflowId, workflow);
      return workflow;
    } catch (error) {
      console.error('Error rejecting step:', error);
      return null;
    }
  }

  async resetWorkflow(workflowId: string): Promise<ApprovalWorkflow | null> {
    try {
      const workflow = this.approvalWorkflows.get(workflowId);
      if (!workflow) return null;

      workflow.steps.forEach(step => {
        step.status = 'pending';
        step.comments = undefined;
        step.timestamp = undefined;
      });

      workflow.currentStep = 0;
      workflow.status = 'pending';
      workflow.updatedAt = new Date();

      this.approvalWorkflows.set(workflowId, workflow);
      return workflow;
    } catch (error) {
      console.error('Error resetting workflow:', error);
      return null;
    }
  }

  // ===== EVENT TEMPLATES =====

  async createEventTemplate(request: CreateEventTemplateRequest): Promise<EventTemplate> {
    try {
      const template: EventTemplate = {
        id: `template_${Date.now()}_${Math.random()}`,
        name: request.name,
        description: request.description,
        category: request.category,
        eventType: request.eventType,
        estimatedDuration: request.estimatedDuration,
        estimatedBudget: request.estimatedBudget,
        checklist: request.checklist,
        timeline: request.timeline,
        vendorCategories: request.vendorCategories,
        tags: request.tags,
        isPublic: request.isPublic || false,
        createdBy: 'current_user_id', // This should come from auth context
        usageCount: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.eventTemplates.set(template.id, template);
      return template;
    } catch (error) {
      console.error('Error creating event template:', error);
      throw new Error('Failed to create event template');
    }
  }

  async getEventTemplate(templateId: string): Promise<EventTemplate | null> {
    try {
      return this.eventTemplates.get(templateId) || null;
    } catch (error) {
      console.error('Error getting event template:', error);
      return null;
    }
  }

  async getEventTemplates(filter?: {
    category?: string;
    eventType?: string;
    isPublic?: boolean;
    tags?: string[];
  }): Promise<EventTemplate[]> {
    try {
      let templates = Array.from(this.eventTemplates.values());

      if (filter?.category) {
        templates = templates.filter(t => t.category === filter.category);
      }

      if (filter?.eventType) {
        templates = templates.filter(t => t.eventType === filter.eventType);
      }

      if (filter?.isPublic !== undefined) {
        templates = templates.filter(t => t.isPublic === filter.isPublic);
      }

      if (filter?.tags && filter.tags.length > 0) {
        templates = templates.filter(t => 
          filter.tags!.some(tag => t.tags.includes(tag))
        );
      }

      return templates.sort((a, b) => b.usageCount - a.usageCount);
    } catch (error) {
      console.error('Error getting event templates:', error);
      return [];
    }
  }

  async updateEventTemplate(templateId: string, updates: Partial<EventTemplate>): Promise<EventTemplate | null> {
    try {
      const template = this.eventTemplates.get(templateId);
      if (!template) return null;

      const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
      this.eventTemplates.set(templateId, updatedTemplate);
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating event template:', error);
      return null;
    }
  }

  async useEventTemplate(templateId: string): Promise<EventTemplate | null> {
    try {
      const template = this.eventTemplates.get(templateId);
      if (!template) return null;

      template.usageCount++;
      template.updatedAt = new Date();
      
      this.eventTemplates.set(templateId, template);
      return template;
    } catch (error) {
      console.error('Error using event template:', error);
      return null;
    }
  }

  async rateEventTemplate(templateId: string, rating: number): Promise<EventTemplate | null> {
    try {
      const template = this.eventTemplates.get(templateId);
      if (!template) return null;

      // Update average rating
      const totalRating = template.rating * template.usageCount + rating;
      template.usageCount++;
      template.rating = totalRating / template.usageCount;
      template.updatedAt = new Date();

      this.eventTemplates.set(templateId, template);
      return template;
    } catch (error) {
      console.error('Error rating event template:', error);
      return null;
    }
  }

  async deleteEventTemplate(templateId: string): Promise<boolean> {
    try {
      return this.eventTemplates.delete(templateId);
    } catch (error) {
      console.error('Error deleting event template:', error);
      return false;
    }
  }

  // ===== HELPER METHODS =====

  private getDefaultPermissions(role: TeamRole): Permission[] {
    const permissions: Record<TeamRole, Permission[]> = {
      owner: [
        { resource: '*', action: '*' },
      ],
      planner: [
        { resource: 'event', action: 'read' },
        { resource: 'event', action: 'update' },
        { resource: 'task', action: '*' },
        { resource: 'vendor', action: 'read' },
        { resource: 'vendor', action: 'update' },
        { resource: 'budget', action: 'read' },
        { resource: 'budget', action: 'update' },
      ],
      coordinator: [
        { resource: 'event', action: 'read' },
        { resource: 'task', action: 'read' },
        { resource: 'task', action: 'update' },
        { resource: 'vendor', action: 'read' },
        { resource: 'vendor', action: 'update' },
        { resource: 'budget', action: 'read' },
      ],
      vendor: [
        { resource: 'event', action: 'read' },
        { resource: 'task', action: 'read' },
        { resource: 'task', action: 'update' },
        { resource: 'vendor', action: 'read' },
        { resource: 'vendor', action: 'update' },
      ],
      viewer: [
        { resource: 'event', action: 'read' },
        { resource: 'task', action: 'read' },
        { resource: 'vendor', action: 'read' },
        { resource: 'budget', action: 'read' },
      ],
    };

    return permissions[role] || [];
  }

  private async getUserName(userId: string): Promise<string> {
    // This should integrate with your user service
    // For now, return a placeholder
    return `User ${userId}`;
  }

  private async assignTaskToMember(userId: string, taskId: string): Promise<void> {
    try {
      // Find all teams where this user is a member
      for (const [eventId, team] of this.teams.entries()) {
        const member = team.find(m => m.userId === userId);
        if (member) {
          member.assignedTasks.push(taskId);
          this.teams.set(eventId, team);
          break;
        }
      }
    } catch (error) {
      console.error('Error assigning task to member:', error);
    }
  }

  private async removeTaskFromMember(userId: string, taskId: string): Promise<void> {
    try {
      // Find all teams where this user is a member
      for (const [eventId, team] of this.teams.entries()) {
        const member = team.find(m => m.userId === userId);
        if (member) {
          member.assignedTasks = member.assignedTasks.filter(id => id !== taskId);
          this.teams.set(eventId, team);
          break;
        }
      }
    } catch (error) {
      console.error('Error removing task from member:', error);
    }
  }

  // ===== UTILITY METHODS =====

  async getTaskDependencies(taskId: string): Promise<Task[]> {
    try {
      const task = this.tasks.get(taskId);
      if (!task || !task.dependencies.length) return [];

      const dependencies: Task[] = [];
      for (const depId of task.dependencies) {
        const depTask = this.tasks.get(depId);
        if (depTask) {
          dependencies.push(depTask);
        }
      }

      return dependencies;
    } catch (error) {
      console.error('Error getting task dependencies:', error);
      return [];
    }
  }

  async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    try {
      return Array.from(this.tasks.values())
        .filter(task => task.assigneeId === assigneeId)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    } catch (error) {
      console.error('Error getting tasks by assignee:', error);
      return [];
    }
  }

  async getOverdueTasks(): Promise<Task[]> {
    try {
      const now = new Date();
      return Array.from(this.tasks.values())
        .filter(task => task.dueDate < now && task.status !== 'completed')
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    } catch (error) {
      console.error('Error getting overdue tasks:', error);
      return [];
    }
  }

  async getTasksDueSoon(hours: number = 24): Promise<Task[]> {
    try {
      const now = new Date();
      const dueSoon = new Date(now.getTime() + hours * 60 * 60 * 1000);
      
      return Array.from(this.tasks.values())
        .filter(task => 
          task.dueDate >= now && 
          task.dueDate <= dueSoon && 
          task.status !== 'completed'
        )
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    } catch (error) {
      console.error('Error getting tasks due soon:', error);
      return [];
    }
  }

  async getTeamWorkload(eventId: string): Promise<Record<string, number>> {
    try {
      const team = this.teams.get(eventId) || [];
      const workload: Record<string, number> = {};

      for (const member of team) {
        const memberTasks = this.tasks.get(member.userId);
        if (Array.isArray(memberTasks)) {
          workload[member.userId] = memberTasks.length;
        } else {
          workload[member.userId] = 0;
        }
      }

      return workload;
    } catch (error) {
      console.error('Error getting team workload:', error);
      return {};
    }
  }

  async getApprovalWorkflowProgress(workflowId: string): Promise<{
    currentStep: number;
    totalSteps: number;
    completedSteps: number;
    progress: number;
  }> {
    try {
      const workflow = this.approvalWorkflows.get(workflowId);
      if (!workflow) {
        return { currentStep: 0, totalSteps: 0, completedSteps: 0, progress: 0 };
      }

      const completedSteps = workflow.steps.filter(step => step.status === 'approved').length;
      const progress = (completedSteps / workflow.steps.length) * 100;

      return {
        currentStep: workflow.currentStep,
        totalSteps: workflow.steps.length,
        completedSteps,
        progress
      };
    } catch (error) {
      console.error('Error getting approval workflow progress:', error);
      return { currentStep: 0, totalSteps: 0, completedSteps: 0, progress: 0 };
    }
  }
}

// Export service instance
export const workflowCollaborationService = new WorkflowCollaborationService();
