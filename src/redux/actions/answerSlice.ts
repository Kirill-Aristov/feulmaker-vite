import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAnswerState } from "../../constants/types/reduxInterfase";



const initialState: IAnswerState = {
  statusAnswer: false,
  tableData: null,
  answer: {
    sectionOne: {
      humidity: 0,
      ash: 0,
      heat: 0,
    },
    sectionTwo: {
      rdf: {
        humidity: 0,
        ash: 0,
        heat: 0,
      },
      tails: {
        humidity: 0,
        ash: 0,
        heat: 0,
      },
      preparedData: [],
    },
  },
};

export const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    changeStatusAnswer: (state, action: PayloadAction<[boolean, any]>) => {
      state.statusAnswer = action.payload[0];
      state.tableData = action.payload[1];
    },
    updateAnswer: (state, action) => {
      state.answer = action.payload.answer;
    },
  },
});

export const { changeStatusAnswer, updateAnswer, } = answerSlice.actions;

export default answerSlice.reducer;