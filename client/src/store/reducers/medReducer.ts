import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHarm, IWorker } from "types/worker";

interface MedState {
  shifts: string[];
  search: string;
  dateFilter: Date | null;
  dateFilterCancel: Date | null;
}

const initialState: MedState = {
  shifts: [],
  search: "",
  dateFilter: null,
  dateFilterCancel: new Date(),
};

export const medSlice = createSlice({
  name: "med",
  initialState,
  reducers: {
    setShifts: (state: MedState, action: PayloadAction<string[]>) => {
      state.shifts = action.payload;
    },
    setDateFilter: (state: MedState, action: PayloadAction<Date | null>) => {
      state.dateFilter = action.payload;
    },
    setDateFilterCancel: (
      state: MedState,
      action: PayloadAction<Date | null>
    ) => {
      state.dateFilterCancel = action.payload;
    },
  },
});

export const { setShifts, setDateFilter, setDateFilterCancel } =
  medSlice.actions;

export default medSlice.reducer;
