import { useQuery } from '@tanstack/react-query';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export default function App() {
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}?_limit=6`);
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      
      const authors = ['Roma', 'Vika', 'DEN'];
      return data.map((task, index) => ({
        ...task,
        status: task.completed ? 'done' : index % 2 === 0 ? 'backlog' : 'inprogress',
        author: authors[index % authors.length]
      }));
    }
  });

  if (isLoading) return <div className="loading">Завантаження...</div>;
  if (isError) return <div className="error">Помилка.</div>;

  const backlogTasks = tasks.filter((t) => t.status === 'backlog');
  const inProgressTasks = tasks.filter((t) => t.status === 'inprogress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="container">
      <Form />

      <div className="board">
        <div className="column backlog">
          <h3>BACKLOG</h3>
          <div className="task-list">
            {backlogTasks.map((task) => (
              <Posts key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="column in-progress">
          <h3>INPROGRESS</h3>
          <div className="task-list">
            {inProgressTasks.map((task) => (
              <Posts key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="column done">
          <h3>DONE</h3>
          <div className="task-list">
            {doneTasks.map((task) => (
              <Posts key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}