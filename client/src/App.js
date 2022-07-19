import { useState, useEffect } from 'react';
import io from 'socket.io-client';
const serverURL = 'http://localhost:8000/';

const App = () => {
  const [socket] = useState(io(serverURL));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.on('updateData', (tasks) => {
      setTasks(tasks);
    });

    socket.on('removeTask', (tasks) => {
      setTasks(tasks);
    });
  }, []);

  const removeTask = (taskId) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    socket.emit('removeTask', taskId);
  };

  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((task) => (
            <li key={task.id} className='task'>
              {task.name}{' '}
              <button
                onClick={() => removeTask(task.id)}
                className='btn btn--red'
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id='add-task-form'>
          <input
            className='text-input'
            autoComplete='off'
            type='text'
            placeholder='Type your description'
            id='task-name'
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
