/**
 * Сортирует задачи по приоритету: Высокий → Средний → Низкий.
 * Задачи без поля priority считаются «Средним» (обратная совместимость).
 */
function sortByPriority(arr) {
  return [...arr].sort(
    (a, b) =>
      (PRIORITIES[a.priority ?? 'medium'].order) -
      (PRIORITIES[b.priority ?? 'medium'].order)
  );
}

/** Возвращает сегодняшнюю дату в формате YYYY-MM-DD (локальный часовой пояс). */
function getToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Форматирует дату YYYY-MM-DD в читаемый вид для заголовка секции.
 * Например: "2025-03-20" → "20 марта 2025"
 */
function formatDateHeading(dateStr) {
  const [yyyy, mm, dd] = dateStr.split('-');
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Загружает данные приложения из LocalStorage.
 * При первом запуске (или если данных нет) создаёт дефолтный список
 * и мигрирует задачи из формата V1 (ключ 'todo-tasks'), если они есть.
 */
function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

function buildDefaultData(legacyTasks) {
  return {
    lists: [{ id: DEFAULT_LIST_ID, name: 'Мои задачи' }],
    // Привязываем старые задачи к дефолтному списку
    tasks: legacyTasks.map(t => ({ ...t, listId: DEFAULT_LIST_ID })),
    activeListId: DEFAULT_LIST_ID,
  };
}

function loadData() {
  const saved = loadFromStorage(STORAGE_KEY);
  if (saved && Array.isArray(saved.lists)) return saved;

  // Миграция задач из старого формата V1
  const legacyTasks = loadFromStorage(LEGACY_KEY) || [];
  return buildDefaultData(legacyTasks);
}

/** Сохраняет все данные приложения в LocalStorage одним объектом. */
function saveData({ lists, tasks, activeListId }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lists, tasks, activeListId }));
}

// Загружаем данные один раз при старте приложения
const initialData = loadData();
