import { createSlice } from "@reduxjs/toolkit";

const subjectSlice = createSlice({
  name: "subjects",
  initialState: [],
  reducers: {
    setSubjects: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;
