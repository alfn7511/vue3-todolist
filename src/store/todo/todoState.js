const state = () => ({
  todoList: [
    {
      id: Math.random().toString(36).substring(2, 16),
      title: 'vuex를 이용한 상태관리 해보기',
      body: '멋진 프론트엔드 개발자로 성장하기 🌱',
      isDone: false,
    },
    {
      id: Math.random().toString(36).substring(2, 16),
      title: 'Vue.js',
      body: '완료한 내용으로 잘 보이나요?',
      isDone: true,
    },
  ],
})

export default state
