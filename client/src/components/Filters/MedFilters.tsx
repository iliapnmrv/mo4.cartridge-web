import { Autocomplete, Checkbox, FormControl, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import React, { useEffect } from "react";
import {
  setDateFilter,
  setDateFilterCancel,
  setShifts,
} from "store/reducers/medReducer";
import styles from "styles/Home.module.css";
import { IWorker } from "types/worker";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { checkboxLabel } from "constants/index";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

type Props = {
  workers: IWorker[] | undefined;
  shifts: string[] | undefined;
};

const MedFilters = ({ workers, shifts: shiftsAvailable }: Props) => {
  const { shifts, dateFilter, dateFilterCancel } = useAppSelector(
    (state) => state.med
  );
  const dispatch = useAppDispatch();

  const handleShiftChange = (value: string[]) => {
    dispatch(setShifts(value));
  };

  const handleDateFilterChange = (newValue: Date | null) => {
    dispatch(setDateFilter(newValue));
  };

  useEffect(() => {
    dateFilter ? dispatch(setDateFilterCancel(null)) : null;
  }, [dateFilter]);

  return (
    <div className={styles.filters}>
      <FormControl sx={{ width: 300 }}>
        <Autocomplete
          multiple
          id="shifts"
          value={shifts}
          onChange={(_: any, newValue: string[]) => {
            handleShiftChange(newValue);
          }}
          options={shiftsAvailable || []}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Смена сотрудников"
              placeholder="Смена сотрудников"
            />
          )}
        />
      </FormControl>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Checkbox
          onClick={() => {
            dispatch(setDateFilterCancel(dateFilter ? dateFilter : null));
            dispatch(setDateFilter(dateFilter ? null : dateFilterCancel));
          }}
          checked={!!dateFilterCancel}
          {...checkboxLabel}
          icon={<CancelOutlinedIcon />}
          checkedIcon={<CancelIcon />}
        />
        <DatePicker
          label="Предстоящая медкомиссия на"
          inputFormat="DD/MM/yyyy"
          value={dateFilter}
          onChange={handleDateFilterChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    </div>
  );
};

export default MedFilters;
