import React, { useState, useEffect } from 'react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost/todo-api/tasks.php');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch('http://localhost/todo-api/tasks.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });
      if (response.ok) {
        setNewTask('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost/todo-api/tasks.php?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (id) => {
    try {
      const response = await fetch(`http://localhost/todo-api/tasks.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title: editText }),
      });
      if (response.ok) {
        setEditingTask(null);
        setEditText('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold text-center mb-8">Task Manager</h1>
                
                {/* Add Task Form */}
                <form onSubmit={addTask} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 border p-2"
                    placeholder="Add new task..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </form>

                {/* Tasks List */}
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 p-2 border rounded-lg">
                      {editingTask === task.id ? (
                        <>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 rounded-lg border-gray-300 border p-2"
                          />
                          <button
                            onClick={() => updateTask(task.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTask(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{task.title}</span>
                          <button
                            onClick={() => {
                              setEditingTask(task.id);
                              setEditText(task.title);
                            }}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;