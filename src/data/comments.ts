export type Comment = {
  id: string;
  body: string;
  authorId: string;
  todoId: string;
  createdAt: Date;
};

const initialComments: Comment[] = [
  {
    id: "1",
    body: "Great progress on this task!",
    authorId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    todoId: "todo_1",
    createdAt: new Date("2024-03-15T10:00:00Z"),
  },
  {
    id: "2",
    body: "Need help with this one",
    authorId: "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    todoId: "todo_2",
    createdAt: new Date("2024-03-15T11:30:00Z"),
  },
  {
    id: "3",
    body: "Almost done with the implementation",
    authorId: "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    todoId: "todo_3",
    createdAt: new Date("2024-03-15T12:15:00Z"),
  },
  {
    id: "4",
    body: "Let's discuss this in the next meeting",
    authorId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    todoId: "todo_4",
    createdAt: new Date("2024-03-15T13:45:00Z"),
  },
  {
    id: "5",
    body: "Updated the documentation",
    authorId: "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    todoId: "todo_1",
    createdAt: new Date("2024-03-15T14:20:00Z"),
  },
  {
    id: "6",
    body: "Found a bug in this task",
    authorId: "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    todoId: "5",
    createdAt: new Date("2024-03-15T15:00:00Z"),
  },
  {
    id: "7",
    body: "Added new test cases",
    authorId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    todoId: "todo_4",
    createdAt: new Date("2024-03-15T16:30:00Z"),
  },
  {
    id: "8",
    body: "Ready for review",
    authorId: "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    todoId: "todo_3",
    createdAt: new Date("2024-03-15T17:45:00Z"),
  },
  {
    id: "9",
    body: "Need more clarification",
    authorId: "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
    todoId: "todo_2",
    createdAt: new Date("2024-03-15T18:20:00Z"),
  },
  {
    id: "10",
    body: "Fixed the requested changes",
    authorId: "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    todoId: "todo_5",
    createdAt: new Date("2024-03-15T19:00:00Z"),
  },
];

// Load comments from localStorage or use initial data
export let comments: Comment[] = (() => {
  const savedComments = localStorage.getItem('comments');
  return savedComments ? JSON.parse(savedComments) : initialComments;
})();

// Update localStorage whenever comments change
const updateLocalStorage = () => {
  localStorage.setItem('comments', JSON.stringify(comments));
};

export const addComment = (comment: Comment) => {
  comments = [...comments, comment];
  updateLocalStorage();
  return comments;
};

export const updateComment = (updatedComment: Comment) => {
  comments = comments.map((comment) => 
    comment.id === updatedComment.id ? updatedComment : comment
  );
  updateLocalStorage();
  return comments;
};
