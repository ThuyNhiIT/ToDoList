import storage from "./util/storage.js";

const init = {
  // todos: [
  //   {
  //     title: "Learn JavaScript",
  //     completed: false,
  //   },
  //   {
  //     title: "Learn HTML, CSS",
  //     completed: true,
  //   },
  // ],
  todos: storage.get(),
  filter: "all",
  filters: {
    all: () => true,
    active: (todo) => !todo.completed,
    completed: (todo) => todo.completed,
  },

  editIndex: null,
};

// const actions = {
// add(state, title) {
//   return {
//     ...state,
//     todos: [...state.todos, { title, completed: false }],
//   };
// },
// };
const actions = {
  add({ todos }, title) {
    if (title) {
      // Prevent empty stringn from being added
      todos.push({ title, completed: false });
      storage.set(todos);
    }
  },

  toggle({ todos }, index) {
    const todo = todos[index];
    todo.completed = !todo.completed;
    storage.set(todos);
  },

  toggleAll({ todos }, checked) {
    todos.forEach((todo) => {
      todo.completed = checked;
    });
    storage.set(todos);
  },

  destroy({ todos }, index) {
    todos.splice(index, 1);
    storage.set(todos);
  },

  switchFilter(state, filter) {
    state.filter = filter;
  },

  clearCompleted(state) {
    state.todos = state.todos.filter(state.filters.active);
    storage.set(state.todos);
  },

  startEdit(state, index) {
    state.editIndex = index;
  },

  endEdit(state, title) {
    if (state.editIndex !== null) {
      if (title) {
        state.todos[state.editIndex].title = title;
      } else {
        state.todos.splice(state.editIndex, 1);
        state.editIndex = null;
      }
      storage.set(state.todos);
    }
  },

  cancelEdit(state) {
    state.editIndex = null;
  },
};
export default function reducer(state = init, action, args) {
  actions[action] && actions[action](state, ...args);
  return state;
}
