import { useState } from "react";
import { Edit3, Trash2, Save, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoCardProps {
  todo: Todo;
  onUpdate: (id: string, title: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoCard({ todo, onUpdate, onToggle, onDelete }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Card className={`group hover:shadow-card transition-all duration-200 border-border/50 ${
      todo.completed ? "opacity-75" : ""
    }`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="flex items-center gap-3">
            <Checkbox checked={todo.completed} disabled />
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                className="border-none bg-transparent px-0 focus-visible:ring-0 text-base"
                placeholder="Task title..."
                autoFocus
              />
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8"
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSave}
                  className="h-8 w-8 bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              className="data-[state=checked]:bg-gradient-success data-[state=checked]:border-success"
            />
            <div className="flex-1 flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className={`text-base ${
                  todo.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}>
                  {todo.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(todo.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(todo.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 hover:bg-secondary"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(todo.id)}
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}