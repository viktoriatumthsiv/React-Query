import { useMutation, useQueryClient } from '@tanstack/react-query';
import './Post.css';

export default function Posts({ task }) {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      return { id, status: nextStatus };
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['todos'], (oldTasks) =>
        oldTasks.map((t) => (t.id === updated.id ? { ...t, status: updated.status } : t))
      );
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['todos'], (oldTasks) =>
        oldTasks.filter((t) => t.id !== deletedId)
      );
    }
  });

  const getNextStatus = (current) => {
    if (current === 'backlog') return 'inprogress';
    if (current === 'inprogress') return 'done';
    return 'done';
  };

  return (
    <div className="task-card">
      <div className="task-info">
        <h4>{task.title}</h4>
        <span className="author">{task.author || 'Roma'}</span>
      </div>
      <div className="actions">
        {task.status !== 'done' && (
          <button
            onClick={() => updateStatusMutation.mutate({ id: task.id, nextStatus: getNextStatus(task.status) })}
            className="btn-move"
          >
            →
          </button>
        )}
        <button onClick={() => deleteTaskMutation.mutate(task.id)} className="btn-delete">
          ×
        </button>
      </div>
    </div>
  );
}