import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentExam: null,
  questions: [],
  answers: {},
  currentQuestionIndex: 0,
  timeRemaining: 0,
  isExamStarted: false,
  isExamSubmitted: false,
  result: null,
  isLoading: false,
  error: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
      state.answers = {};
      state.currentQuestionIndex = 0;
    },
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    startExam: (state) => {
      state.isExamStarted = true;
      state.isExamSubmitted = false;
    },
    submitExam: (state) => {
      state.isExamSubmitted = true;
      state.isExamStarted = false;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
    resetExam: (state) => {
      state.currentExam = null;
      state.questions = [];
      state.answers = {};
      state.currentQuestionIndex = 0;
      state.timeRemaining = 0;
      state.isExamStarted = false;
      state.isExamSubmitted = false;
      state.result = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentExam,
  setQuestions,
  setAnswer,
  setCurrentQuestionIndex,
  setTimeRemaining,
  startExam,
  submitExam,
  setResult,
  resetExam,
  setLoading,
  setError,
} = examSlice.actions;

export default examSlice.reducer;

