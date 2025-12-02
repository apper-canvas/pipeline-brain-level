import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

export default function TaskDetailModal({ task, onClose, onEdit, onDelete }) {
  function getPriorityBadgeVariant(priority) {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  }

function getStatusBadgeVariant(status) {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  }

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {task.title_c || task.title}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(task.status_c || task.status)}>
                  {task.status_c || task.status}
                </Badge>
                <Badge variant={getPriorityBadgeVariant(task.priority_c || task.priority)}>
                  {task.priority_c || task.priority}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {task.description_c || task.description || 'No description available'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Task Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {task.due_date_c 
                        ? new Date(task.due_date_c).toLocaleDateString()
                        : task.dueDate 
                        ? new Date(task.dueDate).toLocaleDateString()
                        : 'No due date'
                      }
                    </span>
                  </div>
                  
                  {(task.assigned_to_c || task.assignee) && (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Assigned To:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {task.assigned_to_c || task.assignee}
                      </span>
                    </div>
                  )}

                  {task.dealId && (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Link" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Deal ID:</span>
                      <span className="text-sm font-medium text-gray-900">#{task.dealId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Timestamps</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">
                      {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Updated:</span>
                    <span className="text-sm text-gray-900">
                      {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => onDelete && onDelete(task.Id || task.id)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}