import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
  useMemo,
} from "react";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

const ThemeContext = createContext("");

const MOCK_TODOS = [
  { id: 1, text: "Купить молоко" },
  { id: 2, text: "Прогулка" },
];

export default function App2() {
  const [theme, setTheme] = useState("light");
  return (
    <>
      <BrowserRouter>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <div className={theme}>
            <nav>
              <br />
              <Link to="/">Дом</Link>
              <br />
              <Link to="/About">О Приложении</Link>
              <br />
              <Link to="/registration">Регистрация</Link>
              <br />
              <Link to="/ToDo">Задачи</Link>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/ToDo" element={<TodoList />} />
            </Routes>
          </div>
        </ThemeContext.Provider>
      </BrowserRouter>
    </>
  );
}

// --------------------------------------------------------
async function fetchTodos() {
  return new Promise((result) => {
    setTimeout(() => {
      result(MOCK_TODOS);
    }, 2000);
  });
}
// --------------------------------------------------------
function todoReducer(state, action) {
  switch (action.type) {
    case "APP_TODO": {
      return [...state, action.payload];
    }
    case "SET_TODOS": {
      return action.payload;
    }
    case "DELETE_TODO": {
      return state.filter((todo) => todo.id !== action.id);
    }
    case "CLEAR_ALL": {
      return [];
    }

    default: {
      return state;
    }
  }
}
// --------------------------------------------------------
function About() {
  return <h1>О Нас</h1>;
}
// --------------------------------------------------------
function Home() {
  return <h1>Дом</h1>;
}
// --------------------------------------------------------
function useTodos(initialTodos = []) {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("loading");
    fetchTodos()
      .then((date) => {
        dispatch({ type: "SET_TODOS", payload: date });
        setStatus("success");
      })
      .catch((err) => {
        setError((p) => (p = "Ошибка загрузки!"));
        setStatus("error");
      });
  }, []);

  const addToDo = (text) => {
    if (text.trim() === "") return;
    dispatch({
      type: "APP_TODO",
      payload: { id: Date.now(), text },
    });
  };

  function deleteTodo(id) {
    dispatch({ type: "DELETE_TODO", id });
  }

  function deleteAll() {
    dispatch({ type: "CLEAR_ALL" });
  }

  return { todos, addToDo, deleteTodo, deleteAll, status, error };
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

function TuDoLength() {
  return <p>Список задач пуст!</p>;
}

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
  const statusText = useMemo(
    () => (inputValue === "" ? "Начните вводить" : "Готово для добавления"),
    [inputValue],
  );

  function createButtonAr() {
    if (items.length >= 5) {
      return <button>Архив</button>;
    }
    return null;
  }

  const countLength = useMemo(() => inputValue.length, [inputValue]);
  return (
    <>
      <button onClick={() => deleteAll()}>Очистить Все</button>
      {createButtonAr()}
      <p>{statusText}</p>
      <p>Символов: {countLength}</p>
    </>
  );
}
// --------------------------------------------------------

// --------------------------------------------------------

function TodoList() {
  const [inputValue, setInputValue] = useState("");

  const { todos, addToDo, deleteTodo, deleteAll, status, error, todos2 } =
    useTodos(MOCK_TODOS);

  const counterToDoLength = useMemo(() => {
    return todos.reduce((sum, todo) => sum + todo.text.length, 0);
  }, [todos]);

  useEffect(() => {
    const resX = todos.length;
    console.log(inputValue);
    console.log(`веденно Значений: ${(document.title = resX)}`);
  }, [todos, inputValue]);

  function setItem(e) {
    setInputValue(e.target.value);
  }

  function keyDown(e) {
    if (e.key === "Enter") {
      addToDo(inputValue);
      setInputValue("");
    }
  }

  if (status === "loading") return <div>⏳ Загрузка...</div>;
  if (status === "error") return <div>❌ {error}</div>;
  if (status === "idle")
    return (
      <button onClick={() => window.location.reload()}>Загрузить задачи</button>
    );
  if (status !== "success") return null;
  return (
    <div id="containerToDo">
      <h1>ToDo 2</h1>
      <TodoStats
        items={todos}
        inputValue={inputValue}
        deleteAll={() => deleteAll()}
      />
      <ThemeToggle />
      <TodoInput
        value={inputValue}
        onChange={setItem}
        onAdd={() => {
          (addToDo(inputValue), setInputValue(""));
        }}
        onKeyDown={keyDown}
      />
      <h1>item: {counterToDoLength}</h1>
      <ul>
        {todos.length !== 0 ? (
          todos.map((to) => (
            <TodoItem
              todo={to}
              onDelete={() => deleteTodo(to.id)}
              key={to.id}
            />
          ))
        ) : (
          <TuDoLength />
        )}
      </ul>
    </div>
  );
}

//------------------------------------------------------------------------------------------

function Registration() {
  return (
    <div>
      <InputReg />
    </div>
  );
}

function InputReg() {
  const [value, setValue] = useState("");
  const [resValue, setResValue] = useState({
    name: "",
    email: "",
    password: "",
    subscribe: false,
  });

  const heidiCheng = (e) => {
    const { name, value, type } = e.target;
    const check = () => {
      if (
        resValue.name.trim().length > 2 &&
        resValue.email.length > 1 &&
        resValue.email.includes("@") &&
        resValue.password.length > 6
      ) {
        return true;
      } else {
        return false;
      }
    };
    setResValue((p) => ({
      ...p,
      [name]: type === "checkbox" ? check() : value,
    }));
    console.log(resValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValue([...value, resValue]);
    console.log("Form submitted:", resValue);
    console.log("Form submitted value:", value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={resValue.name}
        onChange={heidiCheng}
      />
      <br />
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={resValue.email}
        onChange={heidiCheng}
      />
      <br />
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={resValue.password}
        onChange={heidiCheng}
      />
      <br />
      <label>Subscription</label>
      <input
        type="checkbox"
        name="subscribe"
        value={resValue.subscribe}
        onChange={heidiCheng}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
