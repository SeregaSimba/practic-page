import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";

const ThemeContext = createContext("");

export default function App() {
  const [theme, setTheme] = useState("light");
  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={theme}>
          <h1>ToDo 1 </h1>
          <TodoList />
        </div>
      </ThemeContext.Provider>
    </>
  );
}

// --------------------------------------------------------
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  function thameTem() {
    setTheme((e) => (e === "light" ? "dark" : "light"));
  }

  return (
    <>
      <button onClick={() => thameTem()}>Тема</button>
      {theme === "light" ? "🌙 Темная" : "☀️ Светлая"}
    </>
  );
}
// --------------------------------------------------------

// --------------------------------------------------------
function TodoItem({ todo, onDelete }) {
  function createSpanLi(p) {
    if (p.length > 20) {
      return (
        <span style={{ color: "green" }}>
          {p}: <span style={{ color: "red" }}>"Длинная"</span>
        </span>
      );
    }
    return <span style={{ color: "green" }}>{p}</span>;
  }

  if (todo.length === 0) {
    return <p>Список задач пуст!</p>;
  }
  return (
    <li onDoubleClick={() => onDelete(todo.id)}>
      {createSpanLi(todo.text)}
      <button onClick={() => onDelete(todo.id)}>X</button>;
    </li>
  );
}
// --------------------------------------------------------

// --------------------------------------------------------
function TodoInput({ value, onChange, onAdd, onKeyDown }) {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button onClick={onAdd}>Add</button>
    </>
  );
}
// --------------------------------------------------------

// --------------------------------------------------------
function TodoStats({ items, inputValue, deleteAll }) {
  function counterLengthText() {
    if (inputValue === "") {
      return <>"Начните вводить"</>;
    }
    return <>"Готово для добавления"</>;
  }

  function createButtonAr() {
    if (items.length >= 5) {
      return <button>Архив</button>;
    }
    return;
  }

  function counterLength() {
    return inputValue.length;
  }

  return (
    <>
      <button onClick={() => deleteAll()}>Очистить Все</button>
      {createButtonAr()}
      <p>{counterLengthText()}</p>
      <p>Символов: {counterLength()}</p>
    </>
  );
}
// --------------------------------------------------------

function TodoList() {
  const [items, setItems] = useState([
    { id: 1, text: "Купить молоко" },
    { id: 2, text: "Прогулка" },
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const resX = items.length;
    console.log(inputValue);
    console.log(`веденно Значений: ${(document.title = resX)}`);
  }, [items, inputValue]);

  function setItem(e) {
    const value = e.target.value;
    setInputValue((p) => (p = value));
  }

  function addToDo() {
    if (inputValue.trim() === "") return;
    const newToDo = {
      id: Date.now(),
      text: inputValue,
    };
    setItems([...items, newToDo]);
    setInputValue("");
  }

  function keyDown(e) {
    if (e.key === "Enter") addToDo();
  }

  function deleteTodo(id) {
    setItems(items.filter((todos) => todos.id !== id));
  }

  function deleteAll() {
    setItems([]);
  }

  return (
    <div id="containerToDo">
      <TodoStats
        items={items}
        inputValue={inputValue}
        deleteAll={() => deleteAll()}
      />
      <ThemeToggle />
      <TodoInput
        value={inputValue}
        onChange={setItem}
        onAdd={addToDo}
        onKeyDown={keyDown}
      />
      <h1>item: </h1>
      <ul>
        {items.map((to) => (
          <TodoItem todo={to} onDelete={() => deleteTodo(to.id)} key={to.id} />
        ))}
      </ul>
    </div>
  );
}
