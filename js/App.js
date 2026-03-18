// ── App (корневой компонент) ──────────────────────────────
function App() {
  // Списки, задачи и активный список — три независимых куска состояния
  const [lists, setLists]               = useState(initialData.lists);
  const [tasks, setTasks]               = useState(initialData.tasks);
  const [activeListId, setActiveListId] = useState(initialData.activeListId);

  const [viewDate, setViewDate]           = useState(getToday); // выбранная дата для просмотра
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  // false = порядок добавления, true = по убыванию приоритета
  const [sortedByPriority, setSortedByPriority] = useState(false);
  const [motivMsg, setMotivMsg] = useState(null);

  const today = getToday();

  // Сохраняем все данные при любом изменении
  useEffect(() => {
    saveData({ lists, tasks, activeListId });
  }, [lists, tasks, activeListId]);

  // ── Производные списки ────────────────────────────────

  // Задачи только активного списка
  const activeTasks  = tasks.filter(t => t.listId === activeListId);
  const doneCount    = activeTasks.filter(t => t.completed).length;
  const pendingCount = activeTasks.length - doneCount;

  // Из активных задач: на сегодня, просроченные, на выбранный будущий день.
  // Если включена сортировка по приоритету — применяем её к каждому списку.
  const applySort = arr => sortedByPriority ? sortByPriority(arr) : arr;

  const todayTasks   = applySort(activeTasks.filter(t => t.dueDate === today));
  const overdueTasks = applySort(activeTasks.filter(t => t.dueDate < today));
  const futureTasks  = applySort(activeTasks.filter(t => t.dueDate === viewDate));

  // ── Обработчики задач ─────────────────────────────────

  /** Создаёт новую задачу и привязывает её к активному списку. */
  function addTask({ title, dueDate, priority }) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      priority,             // 'high' | 'medium' | 'low'
      completed: false,
      createdAt: new Date().toISOString(),
      listId: activeListId, // привязка к текущему списку
    };
    setTasks(prev => [newTask, ...prev]);
  }

  /** Переключает флаг выполнения задачи по id. */
  function toggleTask(id) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const nowCompleted = !t.completed;
        if (nowCompleted) {
          const phrase = MOTIV_PHRASES[Math.floor(Math.random() * MOTIV_PHRASES.length)];
          setMotivMsg(phrase);
          setTimeout(() => setMotivMsg(null), 3000);
        }
        return { ...t, completed: nowCompleted };
      })
    );
  }

  /** Удаляет задачу по id. */
  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  // ── Обработчики списков ───────────────────────────────

  /** Создаёт новый список и сразу переключается на него. */
  function addList(name) {
    const newList = { id: crypto.randomUUID(), name };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    setViewDate(today); // сбрасываем дату при переходе на новый список
  }

  /**
   * Удаляет список и все его задачи.
   * Переключает на первый оставшийся список.
   * Не вызывается, если список единственный (кнопка скрыта в ListTabs).
   */
  function deleteList(id) {
    const remaining = lists.filter(l => l.id !== id);
    setLists(remaining);
    setTasks(prev => prev.filter(t => t.listId !== id));
    // Если удаляем активный список — переходим на первый оставшийся
    if (activeListId === id) {
      setActiveListId(remaining[0].id);
      setViewDate(today);
    }
  }

  /** Переключает активный список и сбрасывает дату просмотра на сегодня. */
  function switchList(id) {
    setActiveListId(id);
    setViewDate(today);
  }

  // Переключает выбранную дату просмотра; запрещает выбирать прошлое
  function handleViewDateChange(e) {
    const picked = e.target.value;
    if (picked >= today) setViewDate(picked);
  }

  // ── Рендер ────────────────────────────────────────────
  const isViewingToday = viewDate === today;

  return (
    <div className="app">
      <header>
        <h1>To-Do</h1>
        <button className="add-btn" onClick={() => setShowTaskModal(true)}>
          + Добавить
        </button>
      </header>

      {/* ── Вкладки списков ── */}
      <ListTabs
        lists={lists}
        activeListId={activeListId}
        onSwitch={switchList}
        onAdd={() => setShowListModal(true)}
        onDelete={deleteList}
      />

      {/* ── Счётчик задач текущего списка ── */}
      <div className="task-counter">
        <span className="counter-done">{doneCount} выполнено</span>
        <span>·</span>
        <span className="counter-pending">{pendingCount} осталось</span>
      </div>

      {/* ── Панель навигации по датам и сортировки ── */}
      <div className="date-nav">
        {/* Пикер даты для выбора дня просмотра; min=today запрещает листать в прошлое */}
        <input
          type="date"
          value={viewDate}
          min={today}
          onChange={handleViewDateChange}
        />
        {/* Кнопка «Сегодня» появляется только когда выбрана другая дата */}
        {!isViewingToday && (
          <button className="today-btn" onClick={() => setViewDate(today)}>
            ← Сегодня
          </button>
        )}
        {/* Переключатель сортировки: по дате добавления ↔ по приоритету */}
        <button
          className={`sort-btn ${sortedByPriority ? 'active' : ''}`}
          onClick={() => setSortedByPriority(prev => !prev)}
          title="Переключить сортировку"
        >
          {sortedByPriority ? '↕ Приоритет' : '↕ По дате'}
        </button>
      </div>

      {/* ── Режим просмотра сегодняшнего дня ── */}
      {isViewingToday && (
        <>
          {/* Секция «Сегодня» */}
          <section>
            <h2>Сегодня</h2>
            {todayTasks.length === 0
              ? <p className="empty">Нет задач на сегодня</p>
              : todayTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isOverdue={false}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
            }
          </section>

          {/* Секция «Просрочено» — показывается только при наличии просроченных задач */}
          {overdueTasks.length > 0 && (
            <section className="overdue-section">
              <h2>Просрочено</h2>
              {overdueTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isOverdue={true}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </section>
          )}
        </>
      )}

      {/* ── Режим просмотра будущей даты ── */}
      {!isViewingToday && (
        <section>
          <h2>{formatDateHeading(viewDate)}</h2>
          {futureTasks.length === 0
            ? <p className="empty">Нет задач на этот день</p>
            : futureTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isOverdue={false}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
          }
        </section>
      )}

      {/* ── Модальное окно добавления задачи ── */}
      {showTaskModal && (
        <AddTaskModal
          onAdd={addTask}
          onClose={() => setShowTaskModal(false)}
          minDate={today}
        />
      )}

      {/* ── Модальное окно создания списка ── */}
      {showListModal && (
        <AddListModal
          onAdd={addList}
          onClose={() => setShowListModal(false)}
        />
      )}

      {/* ── Мотивационный тост ── */}
      {motivMsg && <div className="motiv-toast">{motivMsg}</div>}
    </div>
  );
}

// Монтируем React-приложение в #root
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
