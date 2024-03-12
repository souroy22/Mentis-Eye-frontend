import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sidebarOptions } from "../../services/constants";

export type SIDEBAR_OPTION_TYPE = {
  label: string;
  value: string;
};

type GlobalStateType = {
  selectedOption: SIDEBAR_OPTION_TYPE;
  searchValue: string;
  sortOrder: "asc" | "desc" | null;
  sortBy: string | null;
  currentPage: number;
  loading: boolean;
};

const initialState: GlobalStateType = {
  selectedOption: sidebarOptions[0],
  searchValue: "",
  sortOrder: null,
  sortBy: null,
  currentPage: 1,
  loading: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSelectedOption: (state, action: PayloadAction<SIDEBAR_OPTION_TYPE>) => {
      return {
        ...state,
        selectedOption: action.payload,
      };
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        searchValue: action.payload,
      };
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc" | null>) => {
      return {
        ...state,
        sortOrder: action.payload,
      };
    },
    setSortBy: (state, action: PayloadAction<string | null>) => {
      return {
        ...state,
        sortBy: action.payload,
      };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
});

export const {
  setSelectedOption,
  setSearchValue,
  setSortOrder,
  setSortBy,
  setCurrentPage,
  setLoading,
} = globalSlice.actions;
export default globalSlice.reducer;
