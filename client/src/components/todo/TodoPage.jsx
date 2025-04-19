import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [taskCategory, setTaskCategory] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories
  const categories = [
    { id: 'personal', name: 'Personal', color: 'bg-purple-100', icon: '👤' },
    { id: 'work', name: 'Work', color: 'bg-blue-100', icon: '💼' },
    { id: 'health', name: 'Health', color: 'bg-green-100', icon: '🍎' },
    { id: 'education', name: 'Education', color: 'bg-amber-100', icon: '📚' },
    { id: 'leisure', name: 'Leisure', color: 'bg-pink-100', icon: '🎮' }
  ];

  // Priorities with their respective colors
  const priorities = {
    high: { name: 'High', color: 'bg-red-100 border-red-300 text-red-800' },
    medium: { name: 'Medium', color: 'bg-amber-100 border-amber-300 text-amber-800' },
    low: { name: 'Low', color: 'bg-green-100 border-green-300 text-green-800' }
  };

  // Fetch todos from the API
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/todos');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Updated handler for filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    // When switching to completed view, set category to 'all' to show all completed tasks
    if (newFilter === 'completed') {
      setTaskCategory('all');
    }
  };

  // Filter tasks based on filter, search, and category
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const matchesSearch = 
      searchQuery === '' || 
      task.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Only apply category filter if not in completed view
    const matchesCategory = 
      filter === 'completed' ? true : // Ignore category filter for completed tasks
      taskCategory === 'all' || 
      task.category === taskCategory;
    
    return matchesFilter && matchesSearch && matchesCategory;
  });

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    try {
      const response = await api.post('/todos', {
        text: newTask.trim(),
        category: taskCategory,
        priority: selectedPriority
      });
      
      setTasks([...tasks, response.data]);
      setNewTask('');
      toast.success('Task added successfully!');
    } catch (err) {
      toast.error('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (id) => {
    const task = tasks.find(task => task._id === id);
    if (!task) return;
    
    // Optimistically update UI first
    setTasks(tasks.map(t => 
      t._id === id ? { ...t, completed: !t.completed } : t
    ));
    
    try {
      const response = await api.put(`/todos/${id}`, {
        completed: !task.completed
      });
      
      setTasks(tasks.map(t => 
        t._id === id ? response.data : t
      ));
      
      // Show success toast
      const actionText = task.completed ? 'marked as active' : 'marked as completed';
      toast.success(`Task ${actionText}`);
    } catch (err) {
      // Revert the optimistic update
      setTasks(tasks.map(t => 
        t._id === id ? task : t
      ));
      
      toast.error('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditText(task.text);
  };

  // Save edited task
  const saveEdit = async () => {
    if (editText.trim() === '') return;
    
    try {
      const response = await api.put(`/todos/${editingTask}`, {
        text: editText.trim()
      });
      
      setTasks(tasks.map(task => 
        task._id === editingTask ? response.data : task
      ));
      
      setEditingTask(null);
      setEditText('');
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  // Handle drag and drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update local state immediately for responsiveness
    setTasks(items);
    
    // Update positions in the database
    try {
      const updatedPositions = items.map((item, index) => ({
        id: item._id,
        position: index
      }));
      
      await api.post('/todos/positions', { todos: updatedPositions });
    } catch (err) {
      toast.error('Failed to save task order. Please refresh and try again.');
      console.error('Error updating task positions:', err);
      // Refetch tasks to restore order if API call fails
      fetchTodos();
    }
  };

  // Clear all completed tasks
  const clearCompleted = async () => {
    try {
      await api.delete('/todos/completed');
      setTasks(tasks.filter(task => !task.completed));
      toast.success('Completed tasks cleared successfully!');
    } catch (err) {
      toast.error('Failed to clear completed tasks. Please try again.');
      console.error('Error clearing completed tasks:', err);
    }
  };

  // Task category icon
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white py-12">
      <ToastContainer position="bottom-right" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900">Task Manager</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Organize your day, boost your productivity
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main tasks column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task inputs */}
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-6">
                  <form onSubmit={handleAddTask}>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <div className="flex gap-2">
                        <select
                          value={selectedPriority}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block sm:text-sm border-gray-300 rounded-md"
                        >
                          {Object.entries(priorities).map(([key, value]) => (
                            <option key={key} value={key}>{value.name}</option>
                          ))}
                        </select>

                        <select
                          value={taskCategory}
                          onChange={(e) => setTaskCategory(e.target.value)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block sm:text-sm border-gray-300 rounded-md"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>

                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>

              {/* Task filters */}
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleFilterChange('all')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          filter === 'all' 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => handleFilterChange('active')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          filter === 'active' 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Active
                      </button>
                      <button 
                        onClick={() => handleFilterChange('completed')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          filter === 'completed' 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                    <div className="w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tasks list */}
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-blue-500">
                  <h2 className="text-xl font-bold text-white">
                    {filter === 'completed' ? 'Completed Tasks' : 'Your Tasks'}
                  </h2>
                </div>
                
                <div className="p-4">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="tasksList">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-3"
                        >
                          <AnimatePresence>
                            {filteredTasks.length === 0 ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10 text-gray-500"
                              >
                                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="mt-2 text-lg">No tasks found</p>
                                <p className="mt-1">Add a task or adjust your filters</p>
                              </motion.div>
                            ) : (
                              filteredTasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                  {(provided) => (
                                    <motion.div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ duration: 0.2 }}
                                      className={`flex items-center justify-between p-4 border ${
                                        task.completed ? 'bg-gray-50' : 'bg-white'
                                      } rounded-lg shadow-sm`}
                                    >
                                      {editingTask === task._id ? (
                                        <div className="flex-1 flex items-center">
                                          <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="flex-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            autoFocus
                                          />
                                          <div className="ml-2 space-x-2">
                                            <button
                                              onClick={saveEdit}
                                              className="text-green-500 hover:text-green-700"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={cancelEdit}
                                              className="text-gray-500 hover:text-gray-700"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="flex items-center flex-1 min-w-0">
                                            <input
                                              type="checkbox"
                                              checked={task.completed}
                                              onChange={() => toggleComplete(task._id)}
                                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors cursor-pointer"
                                            />
                                            
                                            <div className="ml-3 flex items-center space-x-2">
                                              <span className="text-xl">{getCategoryIcon(task.category)}</span>
                                              <span 
                                                className={`${
                                                  task.completed 
                                                    ? 'line-through text-gray-400' 
                                                    : 'text-gray-800'
                                                } transition-all duration-300 truncate`}
                                              >
                                                {task.text}
                                              </span>
                                              
                                              {/* Priority badge */}
                                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorities[task.priority]?.color}`}>
                                                {priorities[task.priority]?.name}
                                              </span>
                                              
                                              {/* Category badge (only show in completed view) */}
                                              {filter === 'completed' && taskCategory === 'all' && (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800`}>
                                                  {categories.find(cat => cat.id === task.category)?.name || 'Unknown'}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <div className="flex space-x-2 ml-2">
                                            <button
                                              onClick={() => startEdit(task)}
                                              className="text-blue-500 hover:text-blue-700 transition-colors"
                                              title="Edit"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={() => deleteTask(task._id)}
                                              className="text-red-500 hover:text-red-700 transition-colors"
                                              title="Delete"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))
                            )}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {filteredTasks.length > 0 && (
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <span>{filteredTasks.length} item(s) shown</span>
                      {filter === 'completed' && completedTasks > 0 && (
                        <button 
                          onClick={clearCompleted}
                          className="text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          Clear completed
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Stats */}
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-indigo-500">
                  <h2 className="text-xl font-bold text-white">Task Stats</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-amber-600">{activeTasks}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="text-2xl font-bold text-purple-600">{progress}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-500">
                  <h2 className="text-xl font-bold text-white">Categories</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <button
                      onClick={() => setTaskCategory('all')}
                      disabled={filter === 'completed'} // Disable category selection when in completed view
                      className={`w-full flex items-center p-2 rounded-md ${
                        taskCategory === 'all' 
                          ? 'bg-primary-100 text-primary-700' 
                          : filter === 'completed'
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl mr-2">📋</span>
                      <span className="font-medium">All Categories</span>
                    </button>
                    
                    {categories.map((category) => {
                      const categoryCount = tasks.filter(task => task.category === category.id).length;
                      const completedCount = tasks.filter(task => task.category === category.id && task.completed).length;
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => setTaskCategory(category.id)}
                          disabled={filter === 'completed'} // Disable category selection when in completed view
                          className={`w-full flex items-center justify-between p-2 rounded-md ${
                            taskCategory === category.id 
                              ? `${category.color} bg-opacity-50` 
                              : filter === 'completed'
                              ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex space-x-2">
                            {filter === 'completed' && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                {completedCount}
                              </span>
                            )}
                            <span className="bg-white bg-opacity-50 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                              {categoryCount}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Productivity Tips */}
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-500">
                  <h2 className="text-xl font-bold text-white">Productivity Tips</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-2 mr-3">
                        <span className="text-lg">⚡</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Eat the Frog</h3>
                        <p className="text-sm text-gray-600">Start your day by tackling the most challenging task first.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <span className="text-lg">⏰</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Pomodoro Technique</h3>
                        <p className="text-sm text-gray-600">Work for 25 minutes, then take a 5-minute break.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <span className="text-lg">📝</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">2-Minute Rule</h3>
                        <p className="text-sm text-gray-600">If a task takes less than 2 minutes, do it immediately.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;