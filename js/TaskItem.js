/**
 * Строка одной задачи.
 * Пропсы: task, isOverdue, onToggle(id), onDelete(id)
 */
function TaskItem({ task, isOverdue, onToggle, onDelete }) {
  // Формируем строку CSS-классов в зависимости от состояния задачи
  const classes = [
    'task-item',
    isOverdue ? 'overdue' : '',
    task.completed ? 'completed' : '',
  ].filter(Boolean).join(' ');

  // Берём данные приоритета; задачи без поля считаются «Средним»
  const priority = PRIORITIES[task.priority ?? 'medium'];

  return (
    <div className={classes}>
      {/* Чекбокс переключает статус выполнения */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Отметить "${task.title}"`}
      />
      {/* Цветная точка — визуальный индикатор приоритета */}
      <span
        className="priority-dot"
        style={{ background: priority.color }}
        title={priority.label}
      />
      <span className="task-title">{task.title}</span>
      <span className="task-date">{task.dueDate}</span>
      {/* Кнопка удаления */}
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="Удалить задачу"
        title="Удалить"
      >×</button>
    </div>
  );
}
