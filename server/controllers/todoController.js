import Todo from '../models/todoModel.js';

// Get all todos for a user
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ position: 1, createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  const { text, category, priority, dueDate, notes } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    // Find the highest position value for the user's todos
    const highestPositionTodo = await Todo.findOne({ user: req.user.id }).sort({ position: -1 });
    const position = highestPositionTodo ? highestPositionTodo.position + 1 : 0;
    
    const todo = new Todo({
      user: req.user.id,
      text,
      category: category || 'personal',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      notes: notes || '',
      position
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
};

// Update a todo
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, completed, category, priority, dueDate, notes } = req.body;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Only update fields that are provided
    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;
    if (category !== undefined) todo.category = category;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (notes !== undefined) todo.notes = notes;
    
    todo.updatedAt = Date.now();

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
};

// Update positions of multiple todos (for drag and drop)
export const updatePositions = async (req, res) => {
  const { todos } = req.body;
  
  if (!Array.isArray(todos)) {
    return res.status(400).json({ message: 'Invalid todos array' });
  }
  
  try {
    // Validate that all todos belong to the user
    const todoIds = todos.map(todo => todo.id);
    const foundTodos = await Todo.find({ 
      _id: { $in: todoIds },
      user: req.user.id 
    });
    
    if (foundTodos.length !== todoIds.length) {
      return res.status(403).json({ message: 'Unauthorized access to one or more todos' });
    }
    
    // Update positions
    const updateOperations = todos.map(todo => ({
      updateOne: {
        filter: { _id: todo.id },
        update: { position: todo.position }
      }
    }));
    
    await Todo.bulkWrite(updateOperations);
    
    res.status(200).json({ message: 'Todo positions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo positions', error: error.message });
  }
};

// Clear completed todos
export const clearCompleted = async (req, res) => {
  try {
    const result = await Todo.deleteMany({ 
      user: req.user.id,
      completed: true
    });
    
    res.status(200).json({ 
      message: 'Completed todos cleared successfully',
      count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear completed todos', error: error.message });
  }
};

// Get todos by category
export const getTodosByCategory = async (req, res) => {
  const { category } = req.params;
  
  try {
    const query = { user: req.user.id };
    if (category !== 'all') {
      query.category = category;
    }
    
    const todos = await Todo.find(query).sort({ position: 1, createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos by category', error: error.message });
  }
};

// Get productivity stats
export const getProductivityStats = async (req, res) => {
  const { timeframe } = req.query; // 'day', 'week', 'month', 'year'
  
  try {
    let startDate = new Date();
    
    // Calculate start date based on timeframe
    if (timeframe === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      // Default to all time if no valid timeframe
      startDate = new Date(0);
    }
    
    // Query for todos within the timeframe
    const todos = await Todo.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    });
    
    // Calculate basic stats
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const productivityRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Group todos by category
    const categoryCounts = {};
    todos.forEach(todo => {
      if (!categoryCounts[todo.category]) {
        categoryCounts[todo.category] = { total: 0, completed: 0 };
      }
      categoryCounts[todo.category].total++;
      if (todo.completed) {
        categoryCounts[todo.category].completed++;
      }
    });
    
    // Group todos by day for timeline analysis
    const todosByDate = todos.reduce((acc, todo) => {
      const date = todo.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { total: 0, completed: 0 };
      }
      acc[date].total++;
      if (todo.completed) {
        acc[date].completed++;
      }
      return acc;
    }, {});
    
    res.status(200).json({
      timeframe,
      stats: {
        totalTasks,
        completedTasks,
        productivityRate: Math.round(productivityRate * 100) / 100,
        categoryCounts,
        todosByDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch productivity stats', error: error.message });
  }
};