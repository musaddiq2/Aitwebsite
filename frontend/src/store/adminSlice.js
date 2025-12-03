import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: {
    stats: {},
    charts: {},
  },
  students: [],
  courses: [],
  attendance: [],
  fees: [],
  exams: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setAttendance: (state, action) => {
      state.attendance = action.payload;
    },
    setFees: (state, action) => {
      state.fees = action.payload;
    },
    setExams: (state, action) => {
      state.exams = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setDashboard,
  setStudents,
  setCourses,
  setAttendance,
  setFees,
  setExams,
  setLoading,
  setError,
  clearError,
} = adminSlice.actions;

export default adminSlice.reducer;

