"use client";

import { useEffect, useState } from "react";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "openclaw0408.todos";

function load(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTodos(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // storage unavailable — ignore
    }
  }, [todos, hydrated]);

  const addTodo = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const editTodo = (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)),
    );
  };

  const deleteTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.completed));

  return { todos, hydrated, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted };
}
