import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./todo_app_localstorage_drag_categories.module.scss";

const STORAGE_KEY = "localstorage_todo_app_v2";
const DEFAULT_CATEGORY = "";
const DEFAULT_LIST_LABEL = "";

function cx() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(" ");
}

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeCategoryName(name) {
  const clean = String(name || "").trim();
  return clean;
}

function categoryKey(name) {
  return normalizeCategoryName(name).toLowerCase();
}

function createMainTask(text, category = DEFAULT_CATEGORY) {
  return {
    id: uid(),
    text: text.trim(),
    category: normalizeCategoryName(category),
    completed: false,
    order: Date.now() + Math.random(),
    subtasks: [],
    createdAt: Date.now(),
  };
}

function createSubtask(text) {
  return {
    id: uid(),
    text: text.trim(),
    completed: false,
    order: Date.now() + Math.random(),
    createdAt: Date.now(),
  };
}

function sortTasksForDisplay(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const ao = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
    const bo = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return (a.createdAt ?? 0) - (b.createdAt ?? 0);
  });
}

function parseInput(inputText, existingCategories = []) {
  const lines = inputText
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  const existingMap = new Map(existingCategories.map((c) => [categoryKey(c), c]));
  const newCategories = [];
  const tasks = [];

  let currentMain = null;
  let currentCategory = existingMap.get(categoryKey(DEFAULT_CATEGORY)) || DEFAULT_CATEGORY;

  const ensureCategory = (rawName) => {
    const normalized = normalizeCategoryName(rawName);
    const key = categoryKey(normalized);
    if (existingMap.has(key)) return existingMap.get(key);
    existingMap.set(key, normalized);
    newCategories.push(normalized);
    return normalized;
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith("+")) {
      const catName = line.slice(1).trim();
      if (!catName) continue;
      currentCategory = ensureCategory(catName);
      currentMain = null;
      continue;
    }

    if (line.startsWith("-")) {
      const subText = line.slice(1).trim();
      if (!subText) continue;
      if (!currentMain) {
        currentMain = createMainTask("Untitled task", currentCategory);
        tasks.push(currentMain);
      }
      currentMain.subtasks.push(createSubtask(subText));
      continue;
    }

    currentMain = createMainTask(line, currentCategory);
    tasks.push(currentMain);
  }

  return { tasks: tasks.filter((t) => t.text), newCategories };
}

function normalizeLoaded(data) {
  const rawTasks = Array.isArray(data) ? data : Array.isArray(data?.tasks) ? data.tasks : [];
  const loadedCategories = Array.isArray(data?.categories) ? data.categories : null;

  const tasks = rawTasks
    .map((t) => ({
      id: t.id || uid(),
      text: typeof t.text === "string" ? t.text : "",
      category: normalizeCategoryName(t.category || DEFAULT_CATEGORY),
      completed: !!t.completed,
      order: typeof t.order === "number" ? t.order : Date.now() + Math.random(),
      createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
      subtasks: Array.isArray(t.subtasks)
        ? t.subtasks.map((s) => ({
            id: s.id || uid(),
            text: typeof s.text === "string" ? s.text : "",
            completed: !!s.completed,
            order: typeof s.order === "number" ? s.order : Date.now() + Math.random(),
            createdAt: typeof s.createdAt === "number" ? s.createdAt : Date.now(),
          }))
        : [],
    }))
    .filter((t) => t.text.trim().length > 0);

  let categories = [];
  if (loadedCategories && loadedCategories.length) {
    const seen = new Set();
    categories = loadedCategories
      .map(normalizeCategoryName)
      .filter((c) => c.length > 0)
      .filter((c) => {
        const k = categoryKey(c);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  }

  for (const t of tasks) {
    if (t.category && !categories.some((c) => categoryKey(c) === categoryKey(t.category))) {
      categories.push(t.category);
    }
  }

  return { tasks, categories };
}

export default function TodoApp() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [expandedIds, setExpandedIds] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [editingCategoryName, setEditingCategoryName] = useState(null);
  const [editingCategoryText, setEditingCategoryText] = useState("");
  const [showControls, setShowControls] = useState(false);
  const [showSubtaskInputIds, setShowSubtaskInputIds] = useState({});
  const [dragHover, setDragHover] = useState({ category: null, taskId: null, subtask: null });
  const dragRef = useRef(null); // { type: 'task'|'subtask'|'category', taskId?, subtaskId?, fromCategory?, categoryName? }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const normalized = normalizeLoaded(parsed);
      setTasks(normalized.tasks);
      setCategories(normalized.categories);
    } catch (e) {
      console.error("Failed to load todos", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, categories }));
    } catch (e) {
      console.error("Failed to save todos", e);
    }
  }, [tasks, categories]);

  const grouped = useMemo(() => {
    const out = Object.fromEntries(categories.map((c) => [c, []]));
    const uncategorizedLabel = DEFAULT_LIST_LABEL;

    for (const t of tasks) {
      const match = t.category ? categories.find((c) => categoryKey(c) === categoryKey(t.category)) : null;
      const bucket = match || uncategorizedLabel;
      if (!out[bucket]) out[bucket] = [];
      out[bucket].push({ ...t, category: match || "" });
    }

    if (!out[uncategorizedLabel] && tasks.some((t) => !t.category)) out[uncategorizedLabel] = [];

    for (const c of Object.keys(out)) out[c] = sortTasksForDisplay(out[c]);
    return out;
  }, [tasks, categories]);

  const orderedCategoryLabels = useMemo(() => {
    const labels = [];
    if (grouped[DEFAULT_LIST_LABEL]) labels.push(DEFAULT_LIST_LABEL);
    for (const c of categories) if (grouped[c]) labels.push(c);
    for (const k of Object.keys(grouped)) if (!labels.includes(k)) labels.push(k);
    return labels;
  }, [grouped, categories]);

  const addCategory = () => {
    const clean = normalizeCategoryName(newCategoryInput);
    if (!clean) return;
    setCategories((prev) => {
      if (prev.some((c) => categoryKey(c) === categoryKey(clean))) return prev;
      return [...prev, clean];
    });
    setNewCategoryInput("");
  };

  const addTasksFromInput = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const parsed = parseInput(trimmed, categories);
    const parsedTasks = parsed.tasks;
    const newCategories = parsed.newCategories;

    const nextCategories = [...categories];
    for (const c of newCategories) {
      if (!nextCategories.some((x) => categoryKey(x) === categoryKey(c))) nextCategories.push(c);
    }

    const now = Date.now();
    const maxOrderByCategory = Object.fromEntries(
      ["", ...nextCategories].map((c) => [
        c,
        tasks
          .filter((t) => categoryKey(t.category) === categoryKey(c) && !t.completed)
          .reduce((m, t) => Math.max(m, t.order ?? 0), 0),
      ])
    );

    const seqByCategory = {};
    const assigned = parsedTasks.map((t) => {
      const cat = t.category
        ? nextCategories.find((c) => categoryKey(c) === categoryKey(t.category)) || t.category
        : "";
      seqByCategory[cat] = (seqByCategory[cat] || 0) + 1;
      return {
        ...t,
        category: cat,
        order: (maxOrderByCategory[cat] || now) + seqByCategory[cat],
      };
    });

    setCategories(nextCategories.filter((c) => c && c.trim().length > 0));
    if (assigned.length) {
      setTasks((prev) => [...prev, ...assigned]);
      setExpandedIds((prev) => {
        const next = { ...prev };
        assigned.forEach((t) => {
          next[t.id] = true;
        });
        return next;
      });
    }
    setInput("");
  };

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextCompleted = !t.completed;
        const subtasks = nextCompleted ? t.subtasks.map((s) => ({ ...s, completed: true })) : t.subtasks;
        return { ...t, completed: nextCompleted, subtasks };
      })
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s)),
            }
          : t
      )
    );
  };

  const addSubtaskInline = (taskId, text) => {
    const clean = text.trim();
    if (!clean) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, createSubtask(clean)] } : t))
    );
    setExpandedIds((prev) => ({ ...prev, [taskId]: true }));
  };

  const deleteTask = (taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId));

  const deleteCategory = (categoryToDelete) => {
    setTasks((prev) =>
      prev.map((t) =>
        categoryKey(t.category) === categoryKey(categoryToDelete) ? { ...t, category: "" } : t
      )
    );
    setCategories((prev) => prev.filter((c) => categoryKey(c) !== categoryKey(categoryToDelete)));
  };

  const renameCategory = (oldName, newNameRaw) => {
    const newName = normalizeCategoryName(newNameRaw);
    if (!newName || categoryKey(oldName) === categoryKey(newName)) {
      setEditingCategoryName(null);
      setEditingCategoryText("");
      return;
    }

    let finalName = newName;
    setCategories((prev) => {
      const already = prev.find((c) => categoryKey(c) === categoryKey(newName));
      if (already) {
        finalName = already;
        return prev.filter((c) => categoryKey(c) !== categoryKey(oldName));
      }
      return prev.map((c) => (categoryKey(c) === categoryKey(oldName) ? newName : c));
    });

    setTasks((prev) =>
      prev.map((t) =>
        categoryKey(t.category) === categoryKey(oldName) ? { ...t, category: finalName } : t
      )
    );

    setEditingCategoryName(null);
    setEditingCategoryText("");
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const saveEditTask = (taskId) => {
    const clean = editingTaskText.trim();
    if (!clean) {
      setEditingTaskId(null);
      setEditingTaskText("");
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, text: clean } : t)));
    setEditingTaskId(null);
    setEditingTaskText("");
  };
  const deleteSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) } : t
      )
    );
  };

  const onDragStartTask = (e, task) => {
    clearDragHover();
    dragRef.current = { type: "task", taskId: task.id, fromCategory: task.category };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `task:${task.id}`);
  };

  const onDragStartCategory = (e, categoryName) => {
    clearDragHover();
    if (!categoryName || categoryName === DEFAULT_LIST_LABEL) return;
    dragRef.current = { type: "category", categoryName };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `category:${categoryName}`);
  };

  const onDragStartSubtask = (e, taskId, subtask) => {
    clearDragHover();
    // Critical: prevent the parent TaskCard dragStart from firing.
    // If that fires, dragRef gets overwritten to type:'task' and the app moves the parent todo instead.
    e.stopPropagation();
    dragRef.current = { type: "subtask", taskId, subtaskId: subtask.id };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `subtask:${subtask.id}`);
  };

  const onDropSubtaskOnSubtask = (e, targetTaskId, targetSubtaskId) => {
    clearDragHover();
    e.preventDefault();
    e.stopPropagation();
    const drag = dragRef.current;
    if (!drag || drag.type !== "subtask") return;
    if (drag.taskId === targetTaskId && drag.subtaskId === targetSubtaskId) return;

    setTasks((prev) => {
      const list = [...prev];
      const sourceTask = list.find((t) => t.id === drag.taskId);
      const targetTask = list.find((t) => t.id === targetTaskId);
      if (!sourceTask || !targetTask) return prev;

      const moved = sourceTask.subtasks.find((s) => s.id === drag.subtaskId);
      if (!moved) return prev;

      const sourceSubsBefore = [...sourceTask.subtasks];
      const targetSubsBefore = sourceTask.id === targetTask.id ? sourceSubsBefore : [...targetTask.subtasks];
      const targetIndexBefore = targetSubsBefore.findIndex((s) => s.id === targetSubtaskId);
      if (targetIndexBefore < 0) return prev;

      // Remove from source first
      const sourceWithout = sourceSubsBefore.filter((s) => s.id !== drag.subtaskId);

      if (sourceTask.id === targetTask.id) {
        // Reorder within same task
        let insertIndex = targetIndexBefore;
        const sourceIndexBefore = sourceSubsBefore.findIndex((s) => s.id === drag.subtaskId);
        if (sourceIndexBefore >= 0 && sourceIndexBefore < targetIndexBefore) {
          insertIndex -= 1;
        }
        const nextSubs = [...sourceWithout];
        nextSubs.splice(Math.max(0, insertIndex), 0, moved);
        sourceTask.subtasks = nextSubs.map((s, idx) => ({ ...s, order: idx + 1 }));
        return [...list];
      }

      // Move across tasks/categories: only move the subtask, never the parent task/category
      const targetNext = [...targetTask.subtasks];
      const targetIndex = targetNext.findIndex((s) => s.id === targetSubtaskId);
      if (targetIndex < 0) return prev;
      targetNext.splice(targetIndex, 0, moved);

      sourceTask.subtasks = sourceWithout.map((s, idx) => ({ ...s, order: idx + 1 }));
      targetTask.subtasks = targetNext.map((s, idx) => ({ ...s, order: idx + 1 }));
      return [...list];
    });
  };

  const onDropTaskOnTask = (e, targetTask, targetCategory) => {
    clearDragHover();
    e.preventDefault();
    e.stopPropagation();
    const drag = dragRef.current;
    if (!drag) return;

    if (drag.type === "subtask") {
      // Dropping a subtask on a task card transfers the subtask into that task (append to end).
      // It should NOT move the parent task/category.
      setTasks((prev) => {
        const list = [...prev];
        const sourceTask = list.find((t) => t.id === drag.taskId);
        const target = list.find((t) => t.id === targetTask.id);
        if (!sourceTask || !target) return prev;
        const moved = sourceTask.subtasks.find((s) => s.id === drag.subtaskId);
        if (!moved) return prev;

        sourceTask.subtasks = sourceTask.subtasks.filter((s) => s.id !== drag.subtaskId);

        if (sourceTask.id === target.id) {
          sourceTask.subtasks = [...sourceTask.subtasks, moved].map((s, idx) => ({ ...s, order: idx + 1 }));
          return [...list];
        }

        target.subtasks = [...target.subtasks, moved].map((s, idx) => ({ ...s, order: idx + 1 }));
        sourceTask.subtasks = sourceTask.subtasks.map((s, idx) => ({ ...s, order: idx + 1 }));
        return [...list];
      });
      return;
    }

    if (drag.type !== "task" || drag.taskId === targetTask.id) return;

    setTasks((prev) => {
      const list = [...prev];
      const source = list.find((t) => t.id === drag.taskId);
      if (!source) return prev;

      const effectiveTargetCategory = targetCategory === DEFAULT_LIST_LABEL ? "" : targetCategory;
      source.category = effectiveTargetCategory;

      const sameSection = list
        .filter((t) => categoryKey(t.category) === categoryKey(effectiveTargetCategory) && t.completed === source.completed)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const sourceIndex = sameSection.findIndex((t) => t.id === source.id);
      if (sourceIndex >= 0) sameSection.splice(sourceIndex, 1);

      if (targetTask.completed !== source.completed) {
        sameSection.push(source);
      } else {
        const targetIndex = sameSection.findIndex((t) => t.id === targetTask.id);
        sameSection.splice(targetIndex < 0 ? sameSection.length : targetIndex, 0, source);
      }

      sameSection.forEach((t, i) => {
        t.order = i + 1;
      });
      return [...list];
    });
  };

  const onDropTaskOnCategory = (e, category) => {
    clearDragHover();
    e.preventDefault();
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.type === "category") return;

    const effectiveCategory = category === DEFAULT_LIST_LABEL ? "" : category;

    if (drag.type === "subtask") {
      setTasks((prev) => {
        const next = [...prev];
        const sourceTask = next.find((t) => t.id === drag.taskId);
        if (!sourceTask) return prev;
        const moved = sourceTask.subtasks.find((s) => s.id === drag.subtaskId);
        if (!moved) return prev;

        sourceTask.subtasks = sourceTask.subtasks.filter((s) => s.id !== drag.subtaskId);
        const maxOrder = next
          .filter((t) => categoryKey(t.category) === categoryKey(effectiveCategory) && t.completed === !!moved.completed)
          .reduce((m, t) => Math.max(m, t.order ?? 0), 0);
        next.push({ ...createMainTask(moved.text, effectiveCategory), completed: moved.completed, order: maxOrder + 1 });
        return [...next];
      });
      return;
    }

    setTasks((prev) => {
      const next = [...prev];
      const source = next.find((t) => t.id === drag.taskId);
      if (!source) return prev;
      source.category = effectiveCategory;
      const maxOrder = next
        .filter((t) => categoryKey(t.category) === categoryKey(effectiveCategory) && t.completed === source.completed)
        .reduce((m, t) => Math.max(m, t.id === source.id ? m : t.order ?? 0), 0);
      source.order = maxOrder + 1;
      return next;
    });
  };

  const onDropCategoryOnCategory = (e, targetCategory) => {
    clearDragHover();
    e.preventDefault();
    const drag = dragRef.current;
    if (!drag || drag.type !== "category") return;
    const sourceCategory = drag.categoryName;
    if (!sourceCategory || sourceCategory === targetCategory) return;

    setCategories((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((c) => categoryKey(c) === categoryKey(sourceCategory));
      const to = arr.findIndex((c) => categoryKey(c) === categoryKey(targetCategory));
      if (from < 0 || to < 0) return prev;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const clearDragHover = () => setDragHover({ category: null, taskId: null, subtask: null });
  const onDragEndAny = () => {
    clearDragHover();
    dragRef.current = null;
  };

  const clearCompleted = () => setTasks((prev) => prev.filter((t) => !t.completed));

  const resetAll = () => {
    try {
      if (typeof window !== "undefined" && typeof window.confirm === "function") {
        const ok = window.confirm("Delete all tasks and reset categories?");
        if (!ok) return;
      }
    } catch (e) {}

    setTasks([]);
    setCategories([]);
    setExpandedIds({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }
  };

  const counts = useMemo(() => {
    const mainsOpen = tasks.filter((t) => !t.completed).length;
    const mainsDone = tasks.filter((t) => t.completed).length;
    const subtasksOpen = tasks.flatMap((t) => t.subtasks).filter((s) => !s.completed).length;
    const subtasksDone = tasks.flatMap((t) => t.subtasks).filter((s) => s.completed).length;
    return { mainsOpen, mainsDone, subtasksOpen, subtasksDone };
  }, [tasks]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Todo Board</h1>
          <p className={styles.subtitle}>
            Starts with one default list. Use <code>+</code> for category headers and <code>-</code> for subtasks.
          </p>
        </div>

        <div className={styles.controlsPanel}>
          <div className={styles.controlsHeader}>
            <div className={styles.controlsTitle}>Controls</div>
            <button
              onClick={() => setShowControls((v) => !v)}
              className={styles.secondaryButton}
            >
              {showControls ? "Hide" : "Show"}
            </button>
          </div>

          {showControls && (
            <>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Examples:
+Work
Ship release
- run QA
- write notes
+Personal
Workout
Call mom`}
                className={styles.textarea}
              />
              <div className={styles.buttonRow}>
                <button onClick={addTasksFromInput} className={styles.primaryButton}>
                  Add task(s)
                </button>
                <button onClick={() => setInput("")} className={styles.secondaryButton}>
                  Clear input
                </button>
                <button onClick={clearCompleted} className={styles.secondaryButton}>
                  Remove completed mains
                </button>
                <button onClick={resetAll} className={cx(styles.secondaryButton, styles.dangerButton)}>
                  Reset all
                </button>
              </div>

              <div className={styles.categoryAddRow}>
                <input
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                  placeholder="Add category (e.g. Work)"
                  className={styles.input}
                />
                <button onClick={addCategory} className={styles.secondaryButton}>
                  Add category
                </button>
              </div>
            </>
          )}

          <div className={styles.countRow}>
            <span>Main open: {counts.mainsOpen}</span>
            <span>Main done: {counts.mainsDone}</span>
            <span>Sub open: {counts.subtasksOpen}</span>
            <span>Sub done: {counts.subtasksDone}</span>
            <span>Categories: {categories.length}</span>
          </div>
        </div>

        <div className={cx(styles.categoryGrid, orderedCategoryLabels.length <= 1 ? styles.singleColumn : "")}>
          {orderedCategoryLabels.map((category) => (
            <CategoryColumn
              key={category || "__uncategorized__"}
              category={category}
              tasks={grouped[category] || []}
              onDragOver={onDragOver}
              onDropCategory={onDropTaskOnCategory}
              onDropTask={onDropTaskOnTask}
              onDragStartCategory={onDragStartCategory}
              onDropCategoryOnCategory={onDropCategoryOnCategory}
              onDragStartTask={onDragStartTask}
              onDragStartSubtask={onDragStartSubtask}
              onDropSubtaskOnSubtask={onDropSubtaskOnSubtask}
              onToggleTask={toggleTask}
              onToggleSubtask={toggleSubtask}
              onDeleteTask={deleteTask}
              onDeleteSubtask={deleteSubtask}
              onDeleteCategory={deleteCategory}
              onRenameCategory={renameCategory}
              onStartEditCategory={(name) => {
                if (!name) return;
                setEditingCategoryName(name);
                setEditingCategoryText(name);
              }}
              editingCategoryName={editingCategoryName}
              editingCategoryText={editingCategoryText}
              setEditingCategoryText={setEditingCategoryText}
              onAddSubtask={addSubtaskInline}
              expandedIds={expandedIds}
              setExpandedIds={setExpandedIds}
              editingTaskId={editingTaskId}
              editingTaskText={editingTaskText}
              setEditingTaskText={setEditingTaskText}
              onStartEditTask={startEditTask}
              onSaveEditTask={saveEditTask}
              onCancelEditTask={() => {
                setEditingTaskId(null);
                setEditingTaskText("");
              }}
              showSubtaskInputIds={showSubtaskInputIds}
              setShowSubtaskInputIds={setShowSubtaskInputIds}
              dragRef={dragRef}
              dragHover={dragHover}
              setDragHover={setDragHover}
              onDragEndAny={onDragEndAny}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryColumn({
  category,
  tasks,
  onDragOver,
  onDropCategory,
  onDropTask,
  onDragStartCategory,
  onDropCategoryOnCategory,
  onDragStartTask,
  onDragStartSubtask,
  onDropSubtaskOnSubtask,
  onToggleTask,
  onToggleSubtask,
  onDeleteTask,
  onDeleteSubtask,
  onDeleteCategory,
  onRenameCategory,
  onStartEditCategory,
  editingCategoryName,
  editingCategoryText,
  setEditingCategoryText,
  onAddSubtask,
  expandedIds,
  setExpandedIds,
  editingTaskId,
  editingTaskText,
  setEditingTaskText,
  onStartEditTask,
  onSaveEditTask,
  onCancelEditTask,
  showSubtaskInputIds,
  setShowSubtaskInputIds,
  dragRef,
  dragHover,
  setDragHover,
  onDragEndAny,
}) {
  const incompleteCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const isCategoryDropActive = dragHover.category === (category || DEFAULT_LIST_LABEL);

  return (
    <div
      className={cx(styles.categoryColumn, isCategoryDropActive ? styles.dropActive : "")}
      onDragOver={(e) => {
        onDragOver(e);
        if (dragRef.current?.type !== "category") {
          setDragHover((prev) => ({ ...prev, category: category || DEFAULT_LIST_LABEL }));
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) {
          setDragHover((prev) => ({ ...prev, category: prev.category === (category || DEFAULT_LIST_LABEL) ? null : prev.category }));
        }
      }}
      onDrop={(e) => onDropCategory(e, category || DEFAULT_LIST_LABEL)}
    >
      <div
        className={styles.categoryHeader}
        draggable={!!category && category !== DEFAULT_LIST_LABEL}
        onDragStart={(e) => onDragStartCategory && category && onDragStartCategory(e, category)}
        onDragOver={category && category !== DEFAULT_LIST_LABEL ? onDragOver : undefined}
        onDrop={category && category !== DEFAULT_LIST_LABEL ? (e) => onDropCategoryOnCategory && onDropCategoryOnCategory(e, category) : undefined}
      >
        <div className={styles.categoryTitleWrap}>
          {!!category && editingCategoryName === category ? (
            <input
              autoFocus
              value={editingCategoryText}
              onChange={(e) => setEditingCategoryText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onRenameCategory(category, editingCategoryText);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setEditingCategoryText("");
                }
              }}
              onBlur={() => onRenameCategory(category, editingCategoryText)}
              className={styles.categoryNameInput}
            />
          ) : (
            <button
              className={styles.categoryName}
              onDoubleClick={() => category && category !== DEFAULT_LIST_LABEL && onStartEditCategory(category)}
              title={category && category !== DEFAULT_LIST_LABEL ? "Double-click to rename" : undefined}
            >
              {category || "Uncategorized"}
            </button>
          )}
          {!!category && category !== DEFAULT_LIST_LABEL && (
            <>
              <button
                onClick={() => onStartEditCategory(category)}
                className={styles.tinyButton}
                title="Rename category"
              >
                Rename
              </button>
              <button
                onClick={() => onDeleteCategory(category)}
                className={cx(styles.tinyButton, styles.tinyDangerButton)}
                title="Delete category (moves tasks to uncategorized)"
              >
                Delete
              </button>
            </>
          )}
        </div>
        <div className={styles.categoryCounts}>{incompleteCount} open · {completedCount} done</div>
      </div>

      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            category={category}
            onDragOver={onDragOver}
            onDropTask={onDropTask}
            onDragStartTask={onDragStartTask}
            onDragStartSubtask={onDragStartSubtask}
            onDropSubtaskOnSubtask={onDropSubtaskOnSubtask}
            onToggleTask={onToggleTask}
            onToggleSubtask={onToggleSubtask}
            onDeleteTask={onDeleteTask}
            onDeleteSubtask={onDeleteSubtask}
            onAddSubtask={onAddSubtask}
            expanded={Object.prototype.hasOwnProperty.call(expandedIds, task.id) ? !!expandedIds[task.id] : true}
            setExpanded={(value) => setExpandedIds((prev) => ({ ...prev, [task.id]: value }))}
            editingTaskId={editingTaskId}
            editingTaskText={editingTaskText}
            setEditingTaskText={setEditingTaskText}
            onStartEditTask={onStartEditTask}
            onSaveEditTask={onSaveEditTask}
            onCancelEditTask={onCancelEditTask}
            showSubtaskInput={!!showSubtaskInputIds[task.id]}
            setShowSubtaskInput={(value) =>
              setShowSubtaskInputIds((prev) => ({ ...prev, [task.id]: value }))
            }
            dragRef={dragRef}
            dragHover={dragHover}
            setDragHover={setDragHover}
            onDragEndAny={onDragEndAny}
          />
        ))}
        {tasks.length === 0 && <div className={styles.emptyCategory}>Drop tasks here</div>}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  category,
  onDragOver,
  onDropTask,
  onDragStartTask,
  onDragStartSubtask,
  onDropSubtaskOnSubtask,
  onToggleTask,
  onToggleSubtask,
  onDeleteTask,
  onDeleteSubtask,
  onAddSubtask,
  expanded,
  setExpanded,
  editingTaskId,
  editingTaskText,
  setEditingTaskText,
  onStartEditTask,
  onSaveEditTask,
  onCancelEditTask,
  showSubtaskInput,
  setShowSubtaskInput,
  dragRef,
  dragHover,
  setDragHover,
  onDragEndAny,
}) {
  const [subInput, setSubInput] = useState("");
  const sortedSubs = [...task.subtasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const ao = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
    const bo = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return (a.createdAt ?? 0) - (b.createdAt ?? 0);
  });

  const isTaskDropActive = dragHover.taskId === task.id && !dragHover.subtask;

  return (
    <div
      draggable={true}
      onDragStart={(e) => onDragStartTask(e, task)}
      onDragEnd={onDragEndAny}
      onDragOver={(e) => {
        onDragOver(e);
        const dt = dragRef.current?.type;
        if (dt === "task") {
          setDragHover((prev) => ({ ...prev, taskId: task.id, subtask: null }));
        } else if (dt === "subtask") {
          setDragHover((prev) => ({ ...prev, taskId: task.id }));
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) {
          setDragHover((prev) => ({ ...prev, taskId: prev.taskId === task.id ? null : prev.taskId }));
        }
      }}
      onDrop={(e) => onDropTask(e, task, category)}
      className={cx(styles.taskCard, isTaskDropActive ? styles.dropActive : "", task.completed ? styles.taskCompleted : "")}
    >
      <div className={styles.taskHeaderRow}>
        <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} className={styles.taskCheckbox} />
        <div className={styles.taskMain}>
          {editingTaskId === task.id ? (
            <input
              autoFocus
              value={editingTaskText}
              onChange={(e) => setEditingTaskText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSaveEditTask(task.id);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  onCancelEditTask();
                }
              }}
              onBlur={() => onSaveEditTask(task.id)}
              className={styles.taskEditInput}
            />
          ) : (
            <button type="button" onClick={() => setExpanded(!expanded)} className={styles.expandButton} title="Expand/collapse">
              <div className={styles.expandRow}>
                <span className={styles.expandIcon} aria-hidden="true">
                  {expanded ? "▾" : "▸"}
                </span>
                <div className={cx(styles.taskText, task.completed ? styles.taskTextCompleted : "")}>{task.text}</div>
              </div>
              {task.subtasks.length > 0 && (
                <div className={styles.subtaskSummary}>{task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks done</div>
              )}
            </button>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEditTask(task);
          }}
          className={styles.tinyButton}
          title="Edit task"
        >
          Edit
        </button>
        <button
          onClick={() => setShowSubtaskInput(!showSubtaskInput)}
          className={styles.tinyButton}
          title="Toggle subtask input"
        >
          + subtask
        </button>
        <button onClick={() => onDeleteTask(task.id)} className={styles.tinyButton} title="Delete task">
          ✕
        </button>
      </div>

      {expanded && (
        <div className={styles.subtasksPanel}>
          <div className={styles.subtaskList}>
            {sortedSubs.map((s) => (
              <div
                key={s.id}
                className={cx(styles.subtaskRow, dragHover.subtask?.taskId === task.id && dragHover.subtask?.subtaskId === s.id ? styles.subtaskDropActive : "")}
                draggable={true}
                onDragStart={(e) => onDragStartSubtask(e, task.id, s)}
                onDragEnd={onDragEndAny}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = "move";
                  if (dragRef.current?.type === "subtask") {
                    setDragHover((prev) => ({ ...prev, taskId: task.id, subtask: { taskId: task.id, subtaskId: s.id } }));
                  }
                }}
                onDrop={(e) => onDropSubtaskOnSubtask(e, task.id, s.id)}
                title="Drag to reorder or move"
              >
                <input
                  type="checkbox"
                  checked={s.completed}
                  onChange={() => onToggleSubtask(task.id, s.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={cx(styles.subtaskText, s.completed ? styles.taskTextCompleted : "")}>{s.text}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSubtask(task.id, s.id);
                  }}
                  className={styles.tinyButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {showSubtaskInput && (
            <div className={styles.subtaskInputRow}>
              <input
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddSubtask(task.id, subInput);
                    setSubInput("");
                  }
                }}
                placeholder="Add subtask"
                className={styles.input}
              />
              <button
                onClick={() => {
                  onAddSubtask(task.id, subInput);
                  setSubInput("");
                }}
                className={styles.secondaryButton}
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
