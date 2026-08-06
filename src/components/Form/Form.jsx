import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Form() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['todos'], (oldTasks) => [
        { ...data, id: Date.now(), status: 'backlog' },
        ...oldTasks
      ]);
      setTitle('');
      setDesc('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTaskMutation.mutate({
      title,
      status: 'backlog',
      author: 'Vika'
    });
  };

  return (
    <div className="work-board">
      <h2>WORK-BOARD</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Завдання"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Опис завдання"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit">Додати</button>
      </form>
    </div>
  );
}