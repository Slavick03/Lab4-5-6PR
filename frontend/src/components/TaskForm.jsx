import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onAddTask(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h4 className="form-title">➕ Add New Task</h4>

      <div className="form-group">
        <label>Title</label>
        <input
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          type = "title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          type = "description"
        />
      </div>

      <button type="submit" className="btn-submit">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
