import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  IconButton,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Importing Edit icon

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(null);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: input.trim(), completed: false },
      ]);
      setInput("");
    }
  };

  const startEditing = (id) => {
    setEditing(id);
  };

  const stopEditing = (id, newText) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditing(null);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <TextField
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        label="Add Todo"
        variant="outlined"
        sx={{ marginBottom: "20px" }}
      />
      <Button variant="contained" color="primary" onClick={addTodo}>
        Add
      </Button>

      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {editing === todo.id ? (
              <TextField
                defaultValue={todo.text}
                onBlur={(e) => stopEditing(todo.id, e.target.value)}
                autoFocus
                size="small"
                sx={{ width: "100%" }}
              />
            ) : (
              <ListItemText
                primary={todo.text}
                sx={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              />
            )}
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => startEditing(todo.id)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => deleteTodo(todo.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoList;
