export default {
  setTodoList(state, todoList) {
    state.todoList = todoList
  },
  // todo 여러게 추가
  addTodoRows(state, newTodoRows) {
    console.log('addTodoRows', newTodoRows)
    newTodoRows.forEach((item) => {
      // 신규추가
      if (item.id.includes('temp_')) {
        item.id = Math.random().toString(36).substring(2, 16)
        state.todoList.push(item)
      } else {
        const editItem = state.todoList.find((todo) => todo.id === item.id)
        console.log('editItem', editItem)
        if (editItem) {
          editItem.title = item.title
          editItem.body = item.body
          editItem.isDone = item.isDone
        }
      }
    })
  },
  delTodoRows(state, ids) {
    console.log('delTodoRows', ids)
    state.todoList = state.todoList.filter((todo) => !ids.includes(todo.id))
  },
  // todo 추가
  addTodo(state, newTodo) {
    state.todoList.push(newTodo)
  },

  // todo 제거
  removeTodo(state, todoId) {
    state.todoList = state.todoList.filter((todo) => todo.id !== todoId)
  },

  // todo 상태 변경
  switchTodo(state, todoId) {
    const todo = state.todoList.find((todo) => todo.id === todoId)
    if (todo) {
      todo.isDone = !todo.isDone
    }
  },
}
