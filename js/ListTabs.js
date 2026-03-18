/**
 * Горизонтальная полоса вкладок списков.
 * Пропсы: lists, activeListId, onSwitch(id), onAdd(), onDelete(id)
 */
function ListTabs({ lists, activeListId, onSwitch, onAdd, onDelete }) {
  return (
    <div className="list-tabs">
      {lists.map(list => (
        <div
          key={list.id}
          className={`list-tab ${list.id === activeListId ? 'active' : ''}`}
          onClick={() => onSwitch(list.id)}
          title={list.name}
        >
          <span>{list.name}</span>
          {/* Кнопка удаления скрыта, если список единственный */}
          {lists.length > 1 && (
            <button
              className="tab-delete"
              onClick={e => { e.stopPropagation(); onDelete(list.id); }}
              aria-label={`Удалить список "${list.name}"`}
              title="Удалить список"
            >×</button>
          )}
        </div>
      ))}
      {/* Кнопка создания нового списка */}
      <button className="tab-add" onClick={onAdd} title="Новый список">+</button>
    </div>
  );
}
