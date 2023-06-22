import {
  Autocomplete,
  Badge,
  Box,
  Checkbox,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useAppSelector } from "hooks/redux";
import moment from "moment";
import React, { Dispatch, SetStateAction } from "react";
import styles from "styles/Home.module.css";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import { checkboxLabel } from "constants/index";
import { UpdateWorkerMutation } from "lib/Mutations";
import { useMutation } from "@apollo/client";
import { IHarm, IWorker } from "types/worker";
import Fuse from "fuse.js";
import { IAddWorkerCommentModal } from "pages/med";

type Props = {
  worker: IWorker;
  harms: IHarm[];
  setAddWorkerCommentModal: Dispatch<SetStateAction<IAddWorkerCommentModal>>;
};

const TableRow = ({ worker, harms, setAddWorkerCommentModal }: Props) => {
  const [
    updateWorker,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateWorkerMutation);

  const updateWorkerData = (id: number, key: string, value: any) => {
    updateWorker({
      variables: {
        id,
        [key]: value,
      },
    });
  };

  const fuse = new Fuse(harms, {
    keys: ["harm"],
    shouldSort: true,
  });

  const filterOptions = (options: IHarm[], { inputValue }: any) => {
    if (inputValue.length === 0) return options;
    const fuzzySearch = fuse.search(inputValue).map((res) => res.item);
    return fuzzySearch;
  };

  const { dateFilter } = useAppSelector((state) => state.med);

  const medDate = moment(worker.lastMed).add(335, "days");
  const medWeekDay = medDate.isoWeekday();
  const workerHarm = harms.filter((harm) => harm.position === worker.position);

  const daysFromToday = moment(dateFilter).diff(moment(), "days");

  return updateLoading ? (
    <tr>
      {[...Array(10)].map((_, index) => (
        <td key={index}>
          <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
        </td>
      ))}
    </tr>
  ) : (
    <tr>
      <td>{worker.tabNom.padStart(10, "0")}</td>
      <td>{worker.name}</td>
      <td>{worker.position}</td>
      <td>
        {worker.lastMed ? (
          moment(worker.lastMed).format("L")
        ) : (
          <>Данные отсутствуют</>
        )}
      </td>
      {worker.lastMed ? (
        <td>
          {moment().diff(worker.lastMed, "days")}{" "}
          {daysFromToday && daysFromToday !== 0 ? (
            <span style={{ color: "gray" }}>
              {daysFromToday > 0 ? "+" : null}
              {daysFromToday}
            </span>
          ) : null}
        </td>
      ) : (
        <td>---</td>
      )}

      <td>
        {worker.lastMed ? (
          medWeekDay === 1 || medWeekDay === 3 ? (
            medDate.format("DD.MM.YYYY, dddd")
          ) : medWeekDay === 2 ? (
            medDate.isoWeekday(1).format("DD.MM.YYYY, dddd")
          ) : (
            medDate.isoWeekday(3).format("DD.MM.YYYY, dddd")
          )
        ) : (
          <>Данные отсутствуют</>
        )}
        {}
      </td>
      <td>{worker.shift}</td>
      <td>
        <Autocomplete
          selectOnFocus
          id="combo-box-demo"
          options={harms}
          filterOptions={filterOptions}
          // isOptionEqualToValue={(option, value) => option.id === value.id}
          //@ts-ignore
          getOptionLabel={(option: IHarm) => option!.harm}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: true,
              }}
              label="Вредности"
            />
          )}
          value={
            worker.harm?.harm
              ? harms.filter((harm) => harm.id === worker?.harm?.id)[0]
              : workerHarm?.length
              ? workerHarm[0]
              : undefined
          }
          //@ts-ignore
          onChange={(event: any, newValue: IHarm) => {
            updateWorkerData(worker.id, "harmId", newValue?.id);
          }}
          sx={{ width: 300 }}
        />
      </td>
      <td>{worker?.harm?.harmNum}</td>
      <td>
        <Stack
          direction="row"
          spacing={2}
          m={0}
          sx={{ "span:last-child": { marginLeft: 0 } }}
        >
          <DatePicker
            label="Выберите дату"
            value={
              moment(worker.lastMed).month() === moment().month() &&
              moment(worker.lastMed).year() === moment().year()
                ? worker.lastMed
                : null
            }
            onChange={(newValue) => {
              updateWorkerData(worker.id, "lastMed", newValue);
            }}
            renderInput={({ inputRef, inputProps, InputProps }) => (
              <Box
                sx={{ display: "flex", alignItems: "center" }}
                ref={inputRef}
              >
                {InputProps?.endAdornment}
              </Box>
            )}
          />
          <span
            className={[styles.expandable, styles.icon].join(" ")}
            onClick={() =>
              setAddWorkerCommentModal({
                id: worker.id,
                name: worker.name,
                comment: worker.comment || "",
              })
            }
          >
            <Tooltip title={worker.comment || ""}>
              <Badge
                color="secondary"
                variant="dot"
                invisible={!!!worker.comment}
              >
                <NoteAltOutlinedIcon />
              </Badge>
            </Tooltip>
          </span>
          <Checkbox
            sx={{
              width: "40px",
              height: "40px",
              marginLeft: "0px",
              padding: "0px",
            }}
            {...checkboxLabel}
            checked={worker.isException}
            icon={<ErrorOutlineOutlinedIcon />}
            checkedIcon={<ErrorIcon />}
            onClick={() => {
              updateWorkerData(worker.id, "isException", !worker.isException);
            }}
          />
        </Stack>
      </td>
    </tr>
  );
};

export default TableRow;
