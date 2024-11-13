import { comments } from './comments';

export type Todo = {
  id: string;
  title: string;
  userId: string;
  completed: boolean;
  invitedUsers: string[];
};

// Initial todos data
const initialTodos: Todo[] = [
  {
    id: "todo_1",
    title: "Complete project presentation",
    userId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    completed: false,
    invitedUsers: [],
    // invitedUsers: [
    //   "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    //   "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    // ],
  },
  {
    id: "todo_2",
    title: "Review code changes",
    userId: "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    completed: true,
    invitedUsers: [],
    // invitedUsers: ["user_2onuEO8rIiWfIkfLYnk6hhVXjiq"],
  },
  {
    id: "todo_3",
    title: "Plan team meeting",
    userId: "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    completed: false,
    invitedUsers: [],
    // invitedUsers: [
    //   "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    //   "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    // ],
  },
  {
    id: "todo_4",
    title: "Update documentation",
    userId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    completed: true,
    invitedUsers: [],
    // invitedUsers: ["user_2onuC0ihVD6lIxzT5BC6ifc3I01"],
  },
  {
    id: "todo_5",
    title: "Prepare sprint demo",
    userId: "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    completed: false,
    invitedUsers: [],
    // invitedUsers: [
    //   "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    //   "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    // ],
  },
  {
    id: "todo_6",
    title: "Fix reported bugs",
    userId: "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    completed: true,
    invitedUsers: [],
  },
  {
    id: "todo_7",
    title: "Design new features",
    userId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    completed: false,
    invitedUsers: [],
    // invitedUsers: ["user_2onu9N2fOWIiC1tsJ79tyGj8z5i"],
  },
  {
    id: "todo_8",
    title: "Setup development environment",
    userId: "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    completed: true,
    invitedUsers: [],
    // invitedUsers: ["user_2onuC0ihVD6lIxzT5BC6ifc3I01"],
  },
  {
    id: "todo_9",
    title: "Write unit tests",
    userId: "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    completed: false,
    invitedUsers: [],
    // invitedUsers: [
    //   "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    //   "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    // ],
  },
  {
    id: "todo_10",
    title: "Deploy to production",
    userId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    completed: false,
    invitedUsers: [],
    // invitedUsers: [
    //   "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    //   "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    // ],
  },
];

// Load todos from localStorage or use initial data
export let todos: Todo[] = (() => {
  const savedTodos = localStorage.getItem('todos');
  return savedTodos ? JSON.parse(savedTodos) : initialTodos;
})();

// Update localStorage whenever todos change
const updateLocalStorage = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const addTodo = (todo: Todo) => {
  todos = [...todos, todo];
  updateLocalStorage();
  return todos;
};

export const deleteTodo = (todoId: string) => {
  todos = todos.filter((todo) => todo.id !== todoId);
  const comment = comments.filter((comment) => comment.todoId !== todoId);
  localStorage.setItem('comments', JSON.stringify(comment));
  updateLocalStorage();
  return todos;
};

export const updateTodo = (updatedTodo: Todo) => {
  todos = todos.map((todo) => 
    todo.id === updatedTodo.id ? updatedTodo : todo
  );
  updateLocalStorage();
  return todos;
};
