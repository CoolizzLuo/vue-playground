import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../module/LocalStorage'

Vue.use(Vuex)

const STORE = new LocalStorage('todo-vue')

export default new Vuex.Store({
  state: {
    todos: [{ content: 123, done: false }, { content: 456, done: false }, { content: 789, done: false }]
  },
  getters: {
    list (state) {
      return state.todos.map((todo, tId) => {
        return {
          tId,
          todo
        }
      })
    },
    filterList (state, getters) {
      return function (filter) {
        let status = null
        switch (filter) {
          case 'all':
            return getters.list
          case 'active':
            status = false
            break
          case 'done':
            status = true
            break
        }
        return getters.list.filter(todoObj => todoObj.todo.done === status)
      }
    }
    // filterList1 (state) {
    //   return function (filter) {

    //   }
    // },
    // filterList2: (state) => (filter) => {

    // }
  },
  mutations: {
    SET_TODOS (state, todos) {
      state.todos = todos
    }
  },
  actions: {
    CREATE_TODO ({ commit }, { todo }) {
      // 1. POST // axios.post
      const todos = STORE.load()
      todos.push(todo)
      STORE.save(todos)
      // 2. commit mutations
      commit('SET_TODOS', todos)
      // 3. return
      return {
        tId: todos.length - 1,
        todo
      }
    },
    READ_TODOS ({ commit }) {
      // 1. GET
      const todos = STORE.load()
      // 2. commit mutations
      commit('SET_TODOS', todos)
      // 3. return
      return {
        todos
      }
    },
    // UPDATE_TODO ({ commit }, { tId, content }) {
    //   // 1. PATCH // axios.patch()
    //   const todos = STORE.load()
    //   todos[tId].content = content
    //   STORE.save(todos)
    //   // 2. commit mutations
    //   commit('SET_TODOS', todos)
    //   // 3. return
    //   return {
    //     tId,
    //     todo: todos[tId]
    //   }
    // },
    UPDATE_TODO ({ commit }, { tId, todo }) {
      // 1. PATCH // axios.patch()
      const todos = STORE.load()
      todos.splice(tId, 1, todo)
      STORE.save(todos)
      // 2. commit mutations
      commit('SET_TODOS', todos)
      // 3. return
      return {
        tId,
        todo
      }
    },
    DELETE_TODO ({ commit }, { tId }) {
      // 1. DELETE // axios.delete()
      const todos = STORE.load()
      const todo = todos.splice(tId, 1)[0]
      STORE.save(todos)
      // 2. commit mutations
      commit('SET_TODOS', todos)
      // 3. return
      return {
        tId: null,
        todo
      }
    },
    CLEAR_TODOS ({ commit }) {
      const todos = []
      STORE.save(todos)
      commit('SET_TODOS', todos)
      return {
        todos
      }
    }
  }
})
