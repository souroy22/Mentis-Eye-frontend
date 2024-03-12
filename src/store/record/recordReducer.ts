import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RECORD_TYPE = {
  name: string;
  userEmail: string;
  userPhone: string;
  slug: string;
};

type RecordStateType = {
  records: RECORD_TYPE[];
  totalCount: number;
};

const initialState: RecordStateType = {
  records: [],
  totalCount: 0,
};

export const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    setRecords: (
      state,
      action: PayloadAction<{ records: RECORD_TYPE[]; totalCount: number }>
    ) => {
      return {
        ...state,
        records: action.payload.records,
        totalCount: action.payload.totalCount,
      };
    },
  },
});

export const { setRecords } = recordSlice.actions;
export default recordSlice.reducer;
