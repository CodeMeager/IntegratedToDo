/**
 * Модальная форма создания новой задачи.
 * Пропсы: onAdd({ title, dueDate, priority }), onClose(), minDate (строка YYYY-MM-DD)
 *
 * minDate передаётся снаружи, чтобы запретить выбор прошедших дат.
 */
function AddTaskModal({ onAdd, onClose, minDate }) {
  const [title, setTitle]       = useState('');
  const [dueDate, setDueDate]   = useState(getToday); // по умолчанию — сегодня
  const [priority, setPriority] = useState('medium'); // по умолчанию — Средний

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), dueDate, priority });
    onClose();
  }

  // Закрываем модальное окно по клавише Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    // Клик по затемнению закрывает модальное окно
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Новая задача</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            required
          />
          {/* min запрещает выбор прошедших дат прямо в браузерном пикере */}
          <input
            type="date"
            value={dueDate}
            min={minDate}
            onChange={e => setDueDate(e.target.value)}
            required
          />
          {/* Три кнопки выбора приоритета; активная окрашивается в цвет уровня */}
          <div className="priority-selector">
            {Object.entries(PRIORITIES).map(([key, p]) => (
              <button
                key={key}
                type="button"
                className={`priority-option ${priority === key ? 'selected' : ''}`}
                style={priority === key
                  ? { background: p.color, borderColor: p.color, color: '#fff' }
                  : {}
                }
                onClick={() => setPriority(key)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn-submit">Добавить</button>
          </div>
        </form>
      </div>
    </div>
  );
}
