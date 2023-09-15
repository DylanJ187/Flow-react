import { configureStore } from "@reduxjs/toolkit";
import subjectReducer from "./scenes/profile/subjectSlice";

const store = configureStore({
  reducer: {
    subjects: subjectReducer,
  },
});

export default store;
