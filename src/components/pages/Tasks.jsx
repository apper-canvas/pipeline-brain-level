import React, { useEffect, useState } from "react";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";
import * as companyService from "@/services/api/companyService";
import * as quoteService from "@/services/api/quoteService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import AddTaskModal from "@/components/organisms/AddTaskModal";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import SearchBar from "@/components/molecules/SearchBar";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
      setError(null);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

const handleSuccess = async () => {
    await loadTasks();
    setShowAddModal(false);
    setSelectedTask(null);
    setIsEditing(false);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await taskService.update(taskId, taskData);
      await loadTasks();
      setSelectedTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };
const filterTasks = () => {
    let filtered = [...tasks];
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status_c === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority_c === priorityFilter);
    }
    
    setFilteredTasks(filtered);
  };
  function handleSearch(query) {
    setSearchQuery(query);
  }

  function handleAddTask() {
    setSelectedTask(null);
    setIsEditing(false);
    setShowAddModal(true);
  }

  function handleEditTask(task) {
    setSelectedTask(task);
    setIsEditing(true);
    setShowAddModal(true);
  }

  function handleViewTask(task) {
    setSelectedTask(task);
    setShowDetailModal(true);
  }

const handleDeleteTaskAsync = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskService.delete(taskId);
      await loadTasks();
      setSelectedTask(null);
      setShowDetailModal(false);
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      default: return 'success';
    }
};

  const isTaskOverdue = (task) => {
    if (!task.due_date_c || task.status_c === 'Completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.due_date_c < today;
  };

  function formatDate(dateString) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadTasks} />;
  }

return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
        
        <Button onClick={handleAddTask} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-card">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search tasks..."
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="w-full sm:w-40"
              >
                <option value="all">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
                className="w-full sm:w-40"
              >
                <option value="all">All Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredTasks.length === 0 ? (
            <Empty
              title="No tasks found"
              description={searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first task."
              }
              action={
                <Button onClick={handleAddTask}>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.Id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    isTaskOverdue(task) ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleViewTask(task)}
                >
                  <div className="flex items-start justify-between mb-3">
<div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {task.title_c}
                        {isTaskOverdue(task) && (
                          <span className="ml-2 text-red-600 text-sm font-normal">(Overdue)</span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {task.description || 'No description'}
                      </p>
                    </div>
                    
<div className="flex items-center gap-2 ml-4">
                      <Badge variant={getStatusBadgeVariant(task.status_c)}>
                        {task.status_c}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(task.priority_c)}>
                        {task.priority_c}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span className={isTaskOverdue(task) ? 'text-red-600' : ''}>
                          {formatDate(task.due_date_c)}
                        </span>
                      </div>
{task.assigned_to_c && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="User" className="w-4 h-4" />
                          <span>{task.assigned_to_c}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddTaskModal
          task={selectedTask}
          isEditing={isEditing}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            handleEditTask(selectedTask);
}}
          onDelete={() => handleDeleteTaskAsync(selectedTask.Id)}
        />
)}
    </div>
  );
};

export default Tasks;