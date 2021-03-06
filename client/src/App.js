import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

const serverURL = 'http://localhost:8000';

const App = () => {
  const [socket] = useState(
    io(serverURL, {
      withCredentials: true,
    })
  );
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    socket.on('updateData', (tasks) => {
      updateTasks(tasks);
    });

    // socket.on('connection', (tasks) => {
    // //   socket.emit('updateData');
    // //   updateTasks(tasks);
    // // });

    socket.on('removeTask', (taskId) => {
      removeTask(taskId, false);
      console.log(taskId);
    });

    socket.on('addTask', ({ id, name }) => {
      addTask({ id, name });
    });
  }, []);

  const updateTasks = (tasks) => {
    setTasks(tasks);
  };

  const removeTask = (taskId, isLocal) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    console.log(taskId);
    if (isLocal) {
      socket.emit('removeTask', taskId);
    }
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
    console.log(tasks);
    setTaskName('');
  };

  console.log(tasks);

  const submitForm = (e) => {
    e.preventDefault();
    const newTask = { id: shortid.generate(), name: taskName };
    addTask(newTask);
    socket.emit('addTask', newTask);
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
              {task.name}
              <button
                onClick={() => removeTask(task.id, true)}
                className='btn btn--red'
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id='add-task-form' onSubmit={submitForm}>
          <input
            className='text-input'
            autoComplete='off'
            type='text'
            placeholder='Type your description'
            id='task-name'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
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
