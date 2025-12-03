import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  attendance: [],
  fees: [],
  exams: [],
  results: [],
  isLoading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
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
    setResults: (state, action) => {
      state.results = action.payload;
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
  setProfile,
  setAttendance,
  setFees,
  setExams,
  setResults,
  setLoading,
  setError,
  clearError,
} = studentSlice.actions;

export default studentSlice.reducer;

