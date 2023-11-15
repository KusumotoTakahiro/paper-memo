import { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// データ型を定義
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface ElectronWindow extends Window {
  db: {
    loadTodoList: () => Promise<Array<Todo> | null>;
    storeTodoList: (todoList: Array<Todo>) => Promise<void>;
  };
}

declare const window: ElectronWindow;

// データ操作
// ToDoリストを読み込み
const loadTodoList = async (): Promise<Array<Todo> | null> => {
  const todoList = await window.db.loadTodoList();
  return todoList;
};

// ToDoリストを保存
const storeTodoList = async (todoList: Array<Todo>): Promise<void> => {
  await window.db.storeTodoList(todoList);
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

const HomeScreen = () => {
  // stateを定義
  const [text, setText] = useState<string>('');
  const [todoList, setTodoList] = useState<Array<Todo>>([]);

  useEffect(() => {
    loadTodoList().then((todoList) => {
      if (todoList) {
        setTodoList(todoList);
        console.log(todoList);
      }
    });
  }, []);

  const onSubmit = () => {
    // ボタンクリック時にtodoListに新しいToDoを追加
    if (text !== '') {
      const newTodoList: Array<Todo> = [
        {
          id: new Date().getTime(),
          text: text,
          completed: false,
        },
        ...todoList,
      ];
      setTodoList(newTodoList);
      storeTodoList(newTodoList);

      // テキストフィールドを空にする
      setText('');
    }
  };

  const onCheck = (newTodo: Todo) => {
    // チェック時にcompletedの値を書き換える
    const newTodoList = todoList.map((todo) => {
      return todo.id == newTodo.id
        ? { ...newTodo, completed: !newTodo.completed }
        : todo;
    });
    setTodoList(newTodoList);
    storeTodoList(newTodoList);
  };

  return (
    <div>
      <div className="container">
        <div className="input-field">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={onSubmit} className="add-todo-button">
            追加
          </button>
        </div>

        <ul className="todo-list">
          {todoList?.map((todo) => {
            return <Todo key={todo.id} todo={todo} onCheck={onCheck} />;
          })}
        </ul>
      </div>
    </div>
  );
};

const Todo = (props: { todo: Todo; onCheck: Function }) => {
  const { todo, onCheck } = props;
  const onCheckHandler = () => {
    onCheck(todo);
  };
  return (
    <li className={todo.completed ? 'checked' : ''}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onCheckHandler}
        ></input>
        <span>{todo.text}</span>
      </label>
    </li>
  );
};
