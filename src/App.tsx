import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import { addTodo, todos, deleteTodo, updateTodo } from "./data/todos";
import { Comment, comments, addComment, updateComment } from "./data/comments";
import { useState, useCallback, useMemo } from "react";
import { Todo } from "./data/todos";
import { hasPermission } from "./types/types";

// Custom hook for modal management
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

// Reusable modal wrapper component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

// Reusable permission-aware button
const PermissionButton: React.FC<{
  onClick: () => void;
  hasPermission: boolean;
  children: React.ReactNode;
}> = ({ onClick, hasPermission, children }) => (
  <button
    onClick={onClick}
    className={`btn ${hasPermission ? 'btn-primary' : 'btn-danger'}`}
  >
    {children}
  </button>
);

export default function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    title: "",
    completed: false,
    invitedUsers: [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [todosVersion, setTodosVersion] = useState(0);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const referenceUsers = [
    "user_2onuEO8rIiWfIkfLYnk6hhVXjiq",
    "user_2onu9N2fOWIiC1tsJ79tyGj8z5i",
    "user_2onuC0ihVD6lIxzT5BC6ifc3I01",
  ].filter((userId) => userId !== user?.id);

  // Use custom hooks for modal management
  const viewModal = useModal();
  const addModal = useModal();
  const editModal = useModal();
  const permissionModal = useModal();

  // Extract permission checking logic
  const checkPermission = useCallback((resource: string, action: string, entity?: any) => {
    if (!isSignedIn || !user) return false;
    return hasPermission(
      {
        blockedBy: [],
        roles: user.publicMetadata.roles,
        id: user.id,
      },
      resource,
      action,
      entity
    );
  }, [isSignedIn, user]);

  // Extract comment management logic into custom hook
  const useComments = (todoId: string) => {
    const todoComments = useMemo(() => 
      comments.filter(comment => comment.todoId === todoId),
      [todoId]
    );

    const addNewComment = useCallback((body: string) => {
      if (!user?.id || !body.trim()) return;
      
      const comment: Comment = {
        id: `comment_${Date.now()}`,
        body,
        authorId: user.id,
        todoId,
        createdAt: new Date(),
      };
      
      addComment(comment);
    }, [todoId, user]);

    return { todoComments, addNewComment };
  };

  const ViewModal = () => {
    if (!viewModal.isOpen || !selectedTodo) return null;

    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const todoComments = comments.filter(comment => comment.todoId === selectedTodo.id);

    const handleEditClick = (comment: Comment) => {
      setEditingCommentId(comment.id);
      setEditedCommentText(comment.body);
    };

    const handleSaveEdit = (comment: Comment) => {
      if (!editedCommentText.trim()) {
        setEditedCommentText(comment.body);
        return;
      }

      updateComment({
        ...comment,
        body: editedCommentText
      });
      setEditingCommentId(null);
    };

    const handleAddComment = () => {
      if (!newComment.trim() || !user?.id) return;

      const comment: Comment = {
        id: `comment_${Date.now()}`,
        body: newComment,
        authorId: user.id,
        todoId: selectedTodo.id,
        createdAt: new Date(),
      };

      addComment(comment);
      setNewComment("");
    };

    return (
      <Modal isOpen={viewModal.isOpen} onClose={viewModal.close}>
        <div style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "400px",
          maxHeight: "80vh",
          overflow: "auto",
        }}>
          <h2>{selectedTodo.title}</h2>
          <p style={{ paddingTop: "1rem" }}>
            Status: {selectedTodo.completed ? "Completed" : "Pending"}
          </p>

          {/* Comments Section */}
          <div style={{ marginTop: "2rem" }}>
            <h3>Comments</h3>
            <div style={{ marginTop: "1rem" }}>
              {todoComments.map((comment) => (
                <div 
                  key={comment.id}
                  style={{
                    padding: "0.5rem",
                    borderBottom: "1px solid #eee",
                    marginBottom: "0.5rem"
                  }}
                >
                  <label style={{ fontSize: "0.8rem", color: "#666", display: "block", marginBottom: "0.25rem" }}>
                    User {comment.authorId.slice(-4)} • {new Date(comment.createdAt).toLocaleString()}
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={editingCommentId === comment.id ? editedCommentText : comment.body}
                      onChange={(e) => editingCommentId === comment.id && setEditedCommentText(e.target.value)}
                      disabled={editingCommentId !== comment.id}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: editingCommentId !== comment.id ? "#f9f9f9" : "white"
                      }}
                    />
                    {isSignedIn && (
                      editingCommentId === comment.id ? (
                        <button
                          onClick={() => handleSaveEdit(comment)}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if(isSignedIn &&
                              hasPermission(
                                {
                                  blockedBy: [],
                                  roles: user.publicMetadata.roles,
                                  id: user.id,
                                },
                                "comments",
                                "update",
                                comment
                              )){
                              handleEditClick(comment)
                            }
                            }
                          }
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: isSignedIn &&
                            hasPermission(
                              {
                                blockedBy: [],
                                roles: user.publicMetadata.roles,
                                id: user.id,
                              },
                              "comments",
                              "update",
                              comment
                            )
                              ? "#007bff"
                              : "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                          }}
                        >
                          Edit
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                style={{ flex: 1, padding: "0.5rem" }}
              />
              <button
                onClick={() => {
                  if (
                    isSignedIn &&
                    hasPermission(
                      {
                        blockedBy: [],
                        roles: user.publicMetadata.roles,
                        id: user.id,
                      },
                      "comments",
                      "create"
                    )
                  ) {
                    handleAddComment();
                  }
                }}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    isSignedIn &&
                    hasPermission(
                      {
                        blockedBy: [],
                        roles: user.publicMetadata.roles,
                        id: user.id,
                      },
                      "comments",
                      "create"
                    )
                      ? "#007bff"
                      : "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Add
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              viewModal.close();
              setSelectedTodo(null);
            }}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
          >
            Close
          </button>
        </div>
      </Modal>
    );
  };

  const AddTodoModal = () => {
    if (!addModal.isOpen) return null;

    const handleSubmit = () => {
      const todo: Todo = {
        id: `todo_${Date.now()}`,
        title: newTodo.title || "",
        userId: user?.id || "",
        completed: newTodo.completed || false,
        invitedUsers: newTodo.invitedUsers || [],
      };

      addTodo(todo);
      addModal.close();
      setNewTodo({ title: "", completed: false, invitedUsers: [] });
      setTodosVersion(v => v + 1);
    };

    return (
      <Modal isOpen={addModal.isOpen} onClose={addModal.close}>
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            minWidth: "400px",
          }}
        >
          <h2>Add New Todo</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                style={{ width: "100%", padding: "0.5rem" }}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
              />
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={newTodo.completed}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, completed: e.target.checked })
                  }
                />
                Completed
              </label>
            </div>

            <div>
              <label>Invite Users:</label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {referenceUsers.map((userId) => (
                  <label key={userId}>
                    <input
                      type="checkbox"
                      checked={newTodo.invitedUsers?.includes(userId)}
                      onChange={(e) => {
                        const updatedUsers = e.target.checked
                          ? [...(newTodo.invitedUsers || []), userId]
                          : newTodo.invitedUsers?.filter(
                              (id) => id !== userId
                            ) || [];
                        setNewTodo({ ...newTodo, invitedUsers: updatedUsers });
                      }}
                    />
                    User {userId.slice(-4)}
                  </label>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() => {
                  addModal.close();
                  setNewTodo({ title: "", completed: false, invitedUsers: [] });
                }}
                style={{ padding: "0.5rem 1rem" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Add Todo
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const EditTodoModal = () => {
    if (!editModal.isOpen || !selectedTodo) return null;

    const handleSubmit = () => {
      updateTodo(selectedTodo);
      editModal.close();
      setSelectedTodo(null);
      setTodosVersion(v => v + 1);
    };

    return (
      <Modal isOpen={editModal.isOpen} onClose={editModal.close}>
        <div style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "400px",
        }}>
          <h2>Edit Todo</h2>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
          }}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={selectedTodo.title}
                onChange={(e) => setSelectedTodo({...selectedTodo, title: e.target.value})}
                style={{ width: "100%", padding: "0.5rem" }}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
              />
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTodo.completed}
                  onChange={(e) => setSelectedTodo({...selectedTodo, completed: e.target.checked})}
                />
                Completed
              </label>
            </div>

            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}>
              <button
                onClick={() => {
                  editModal.close();
                  setSelectedTodo(null);
                }}
                style={{ padding: "0.5rem 1rem" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const handleDelete = (todo: Todo) => {
    if (isSignedIn && hasPermission(
      {
        blockedBy: [],
        roles: user.publicMetadata.roles,
        id: user.id,
      },
      "todos",
      "delete",
      todo
    )) {
      deleteTodo(todo.id);
      setTodosVersion(v => v + 1);
    }
  };

  const PermissionModal = () => {
    if (!permissionModal.isOpen) return null;

    const users = [
      { email: "testuser1@gmail.com", password: "Admin@001", role: "user" },
      { email: "testuser2@gmail.com", password: "Admin@001", role: "user" },
      { email: "testuser3@gmail.com", password: "Admin@001", role: "moderator" },
      { email: "naman.01798@gmail.com", password: "Admin@001", role: "admin" },
    ];

    const attributePermissions = {
      todos: {
        admin: [
          "✅ Can view all todos",
          "✅ Can create todos",
          "✅ Can update any todo",
          "✅ Can delete any todo",
          "✅ Can manage permissions",
        ],
        moderator: [
          "✅ Can view all todos",
          "✅ Can create todos",
          "✅ Can update any todo",
          "✅ Can delete completed todos only",
          "❌ Cannot manage permissions",
        ],
        user: [
          "✅ Can view all todos",
          "✅ Can create todos",
          "✅ Can update own todos",
          "✅ Can update todos where invited",
          "✅ Can delete own completed todos",
          "✅ Can delete completed todos where invited",
          "❌ Cannot update others' todos",
          "❌ Cannot delete others' todos",
          "❌ Cannot manage permissions",
        ],
      },
      comments: {
        admin: [
          "✅ Can view all comments",
          "✅ Can create comments",
          "✅ Can update any comment",
        ],
        moderator: [
          "✅ Can view all comments",
          "✅ Can create comments",
          "✅ Can update any comment",
        ],
        user: [
          "✅ Can view comments (except from blocking users)",
          "✅ Can create comments",
          "✅ Can update own comments",
          "❌ Cannot modify others' comments",
        ],
      }
    };

    return (
      <Modal isOpen={permissionModal.isOpen} onClose={permissionModal.close}>
        <div style={{
          backgroundColor: "white",
          padding: "2rem",
          paddingTop: ".5rem",
          borderRadius: "8px",
          minWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0 }}>User Accounts & Permissions</h2>
            <button
              onClick={() => permissionModal.close()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Close
            </button>
          </div>
          
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "#0066cc" }}>Test Accounts</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "2px solid #dee2e6" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "2px solid #dee2e6" }}>Password</th>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "2px solid #dee2e6" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>{user.email}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>{user.password}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #dee2e6", textTransform: "capitalize" }}>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "#0066cc" }}>Permission Matrix</h3>
            {Object.entries(attributePermissions).map(([attribute, roles]) => (
              <div key={attribute} style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h4 style={{ textTransform: "capitalize", color: "#2c3e50", marginTop: 0 }}>{attribute}</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                  {Object.entries(roles).map(([role, permissions]) => (
                    <div key={role} style={{ backgroundColor: "white", padding: "1rem", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                      <h5 style={{ textTransform: "capitalize", color: "#0066cc", marginTop: 0 }}>{role}</h5>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {permissions.map((permission, index) => (
                          <li key={index} style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>{permission}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div style={{padding: "1rem"}}>
      <h1 style={{ 
        textAlign: "center", 
        color: "#2c3e50", 
        marginBottom: "2rem",
        borderBottom: "2px solid #eee",
        paddingBottom: "1rem"
      }}>
        Attribute Based Access Control (ABAC) Demo
      </h1>

      <button
        onClick={() => permissionModal.open()}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      >
        Permissions Must be Read First
      </button>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
          <div style={{ marginLeft: '1rem', display: 'inline-block' }}>
            <span style={{ fontWeight: 'bold' }}>Role: </span>
            {isSignedIn && user?.publicMetadata?.roles}
            <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>User ID: </span>
            {isSignedIn && user.id}
          </div>
        </SignedIn>
      </header>

      <div>
        <div style={{ display: "flex", gap: ".5rem"}}>
          <PermissionButton
            onClick={() => {
              if (
                isSignedIn &&
                checkPermission("todos", "view") &&
                checkPermission("comments", "view")
              ) {
                setSelectedTodo(todos[0]);
                viewModal.open();
              }
            }}
            hasPermission={
              isSignedIn &&
              checkPermission("todos", "view") &&
              checkPermission("comments", "view")
            }
          >
            View any
          </PermissionButton>
          <PermissionButton
            onClick={() => {
              if (
                isSignedIn &&
                checkPermission("todos", "create") &&
                checkPermission("comments", "create")
              ) {
                setNewTodo({ title: "", completed: false, invitedUsers: [] });
                addModal.open();
              }
            }}
            hasPermission={
              isSignedIn &&
              checkPermission("todos", "create") &&
              checkPermission("comments", "create")
            }
          >
            Create any
          </PermissionButton>
          <PermissionButton
            onClick={() => {
              if (
                isSignedIn &&
                checkPermission("todos", "update") &&
                checkPermission("comments", "update")
              ) {
                setSelectedTodo(todos[0]);
                editModal.open();
              }
            }}
            hasPermission={
              isSignedIn &&
              checkPermission("todos", "update") &&
              checkPermission("comments", "update")
            }
          >
            Update any
          </PermissionButton>
          <PermissionButton
            onClick={() => {
              if (
                isSignedIn &&
                checkPermission("todos", "delete")
              ) {
                handleDelete(todos[0]);
              }
            }}
            hasPermission={
              isSignedIn &&
              checkPermission("todos", "delete")
            }
          >
            Delete any
          </PermissionButton>
        </div>
        <h2>All Todos</h2>
        <SignedIn>
          <PermissionButton
            onClick={() => {
              if (
                isSignedIn &&
                checkPermission("todos", "create") &&
                checkPermission("comments", "create")
              ) {
                setNewTodo({ title: "", completed: false, invitedUsers: [] });
                addModal.open();
              }
            }}
            hasPermission={
              isSignedIn &&
              checkPermission("todos", "create") &&
              checkPermission("comments", "create")
            }
          >
            Add New Todo
          </PermissionButton>
        </SignedIn>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ 
                margin: "0 0 1rem 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%"
              }}>
                {todo.title.length > 20 ? `${todo.title.substring(0, 20)}...` : todo.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <PermissionButton
                  onClick={() => {
                    if (
                      isSignedIn &&
                      checkPermission("todos", "view", todo)
                    ) {
                      setSelectedTodo(todo);
                      viewModal.open();
                    }
                  }}
                  hasPermission={
                    isSignedIn &&
                    checkPermission("todos", "view", todo)
                  }
                >
                  View
                </PermissionButton>
                <PermissionButton
                  onClick={() => {
                    if (
                      isSignedIn &&
                      checkPermission("todos", "update", todo)
                    ) {
                      setSelectedTodo(todo);
                      editModal.open();
                    }
                  }}
                  hasPermission={
                    isSignedIn &&
                    checkPermission("todos", "update", todo)
                  }
                >
                  Update
                </PermissionButton>
                <PermissionButton
                  onClick={() => handleDelete(todo)}
                  hasPermission={
                    isSignedIn &&
                    checkPermission("todos", "delete", todo)
                  }
                >
                  Delete
                </PermissionButton>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ViewModal />
      <AddTodoModal />
      <EditTodoModal />
      <PermissionModal />

      <footer style={{
        marginTop: "3rem",
        padding: "1rem",
        borderTop: "1px solid #eee",
        textAlign: "center",
        color: "#666"
      }}>
        <p>Built with React, TypeScript, and Clerk Authentication</p>
        <p>
          Made by{" "}
          <a 
            href="https://www.linkedin.com/in/naman-doshi-007/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0077b5",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Naman
          </a>
        </p>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
