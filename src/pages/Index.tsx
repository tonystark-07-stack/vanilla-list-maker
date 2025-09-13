import { useState } from "react";
import { Plus, StickyNote, CheckSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { NoteCard, Note } from "@/components/note-card";
import { TodoCard, Todo } from "@/components/todo-card";
import { useLocalStorage } from "@/hooks/use-local-storage";

const Index = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes-app-notes", []);
  const [todos, setTodos] = useLocalStorage<Todo[]>("notes-app-todos", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // Note functions
  const addNote = () => {
    if (newNoteTitle.trim() || newNoteContent.trim()) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes([newNote, ...notes]);
      setNewNoteTitle("");
      setNewNoteContent("");
    }
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, title, content, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Todo functions
  const addTodo = () => {
    if (newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: newTodoTitle.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTodos([newTodo, ...todos]);
      setNewTodoTitle("");
    }
  };

  const updateTodo = (id: string, title: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, title, updatedAt: new Date() }
        : todo
    ));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filter functions
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTodos = filteredTodos.filter(todo => todo.completed);
  const pendingTodos = filteredTodos.filter(todo => !todo.completed);

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Notes & Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              Keep your thoughts organized and tasks on track
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes and tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-card shadow-soft border-border/50"
          />
        </div>

        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-11 bg-card shadow-soft">
            <TabsTrigger value="notes" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <StickyNote className="h-4 w-4 mr-2" />
              Notes ({filteredNotes.length})
            </TabsTrigger>
            <TabsTrigger value="todos" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks ({pendingTodos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-6">
            {/* Add Note */}
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create a new note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, addNote)}
                  className="text-lg font-medium"
                />
                <Textarea
                  placeholder="What's on your mind?"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, addNote)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={addNote}
                    disabled={!newNoteTitle.trim() && !newNoteContent.trim()}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes Grid */}
            {filteredNotes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No notes found matching your search." : "No notes yet. Create your first note above!"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="todos" className="space-y-6">
            {/* Add Todo */}
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add a new task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="What needs to be done?"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addTodo}
                    disabled={!newTodoTitle.trim()}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Todo Stats */}
            {todos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-soft border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{todos.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
                <Card className="shadow-soft border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-warning">{pendingTodos.length}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
                <Card className="shadow-soft border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">{completedTodos.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </CardContent>
                </Card>
                <Card className="shadow-soft border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">
                      {todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Pending Todos */}
            {pendingTodos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-warning" />
                  Pending Tasks ({pendingTodos.length})
                </h3>
                <div className="space-y-3">
                  {pendingTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onUpdate={updateTodo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-success" />
                  Completed Tasks ({completedTodos.length})
                </h3>
                <div className="space-y-3">
                  {completedTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onUpdate={updateTodo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredTodos.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No tasks found matching your search." : "No tasks yet. Add your first task above!"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
