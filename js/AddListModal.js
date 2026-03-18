/**
 * Модальное окно создания нового списка задач.
 * Пропсы: onAdd(name), onClose()
 */
function AddListModal({ onAdd, onClose }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
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
        <h2>Новый список</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название списка"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            required
          />
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn-submit">Создать</button>
          </div>
        </form>
      </div>
    </div>
  );
}
