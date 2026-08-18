"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  ListTodo,
  Moon,
  Pencil,
  Plus,
  Sun,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTodos, type Todo } from "@/hooks/use-todos";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "completed";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export function TodoApp() {
  const { todos, hydrated, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted } =
    useTodos();

  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Todo | null>(null);
  const [editText, setEditText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
  };

  const filtered = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed,
  );
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  const openEdit = (todo: Todo) => {
    setEditing(todo);
    setEditText(todo.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(title);
    setTitle("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/40 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
              <ListTodo className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Todo List</h1>
              <p className="text-sm text-muted-foreground">
                {hydrated ? `${activeCount} task${activeCount === 1 ? "" : "s"} left` : "Loading…"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </header>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new task…"
                className="h-10"
                aria-label="New task"
              />
              <Button type="submit" disabled={!title.trim()}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </form>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                      filter === f.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  Clear completed
                </button>
              )}
            </div>

            {!hydrated ? (
              <div className="space-y-2 py-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  {filter === "completed" ? (
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <ListTodo className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {todos.length === 0
                    ? "No tasks yet. Add your first one above!"
                    : filter === "completed"
                      ? "No completed tasks."
                      : "No active tasks."}
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {filtered.map((todo) => (
                  <li
                    key={todo.id}
                    className="group flex items-center gap-3 py-2.5"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      aria-label={`Mark "${todo.title}" as ${
                        todo.completed ? "active" : "completed"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => openEdit(todo)}
                      className="min-w-0 flex-1 text-left"
                      title="Click to edit"
                    >
                      <span
                        className={cn(
                          "block truncate text-sm transition-colors",
                          todo.completed &&
                            "text-muted-foreground line-through",
                        )}
                      >
                        {todo.title}
                      </span>
                    </button>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(todo)}
                        aria-label={`Edit "${todo.title}"`}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => deleteTodo(todo.id)}
                        aria-label={`Delete "${todo.title}"`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Data is saved locally in your browser.
        </p>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editing) {
                editTodo(editing.id, editText);
                setEditing(null);
              }
            }}
          >
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Task title"
              autoFocus
              aria-label="Task title"
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!editText.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
