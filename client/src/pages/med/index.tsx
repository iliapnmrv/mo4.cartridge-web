import { NetworkStatus, useQuery } from "@apollo/client";
import Search from "components/Search/Search";
import {
  AllHarmsQuery,
  AllShiftsQuery,
  AllWorkersQuery,
  HarmsData,
  ShiftsData,
  WorkersData,
} from "lib/Queries";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styles from "styles/Home.module.css";
import AddWorkerCommentModal from "components/Modal/AddWorkerCommentModal";
import ExportWorkers from "components/ExportWorkers/ExportWorkers";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import MedFilters from "components/Filters/MedFilters";
import MedLoading from "components/Loading/MedLoading";
import TableRow from "components/Table/TableRow";
import TableHead from "components/Table/TableHead";
import { IWorker } from "types/worker";
import { Paper, Stack, Typography } from "@mui/material";

type Props = {};

export interface IAddWorkerCommentModal {
  id: number;
  name: string;
  comment: string;
}

const Med = (props: Props) => {
  const { data: harmsData } = useQuery<HarmsData>(AllHarmsQuery);
  const {
    data: workersData,
    loading,
    refetch,
    networkStatus,
  } = useQuery<WorkersData>(AllWorkersQuery, {
    variables: {
      name: "",
      shifts: [],
    },
    // notifyOnNetworkStatusChange: true,
  });
  const { data: shiftsData } = useQuery<ShiftsData>(AllShiftsQuery);

  const { dateFilter, shifts } = useAppSelector((state) => state.med);

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<string>("А");
  const [addWorkerCommentModal, setAddWorkerCommentModal] =
    useState<IAddWorkerCommentModal>({ id: 0, name: "", comment: "" });

  useEffect(() => {
    filterWorkers();
  }, [shifts, dateFilter]);

  console.log(workersData?.workers.length);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      filterWorkers();
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const filterWorkers = () => {
    refetch({ shifts, date: dateFilter, name: search });
    if (workersData?.workers.length) {
      const { name } = workersData.workers[0];
      setPage(
        search ? Array.from(search)[0].toLocaleUpperCase() : Array.from(name)[0]
      );
    }
  };

  const paginationLetters = workersData?.workers.reduce(
    (letters: string[], worker: IWorker) => {
      const firstLetter = Array.from(worker.name)[0];
      return letters.includes(firstLetter)
        ? [...letters]
        : [...letters, firstLetter];
    },
    []
  );

  return (
    <div className={styles.container}>
      <h1>Медкомиссия</h1>

      <AddWorkerCommentModal
        addWorkerCommentModal={addWorkerCommentModal}
        setAddWorkerCommentModal={setAddWorkerCommentModal}
      />

      <MedFilters
        workers={workersData?.workers}
        shifts={shiftsData?.shifts.map((shift) => shift.shift)}
      />

      <Search
        value={search}
        setValue={setSearch}
        placeholder="Поиск по ФИО..."
        search={filterWorkers}
      />

      {dateFilter ? (
        <ExportWorkers
          data={
            workersData?.workers
              ? workersData?.workers.map(
                  ({ tabNom, name, lastMed, harm, position }) => {
                    const medDate = moment(lastMed).add(335, "days");
                    const medWeekDay = medDate.isoWeekday();
                    return {
                      "Табельный номер": tabNom.padStart(10, "0"),
                      ФИО: name,
                      Должность: position,
                      "Предыдущее прохождение медкомиссии":
                        moment(lastMed).format("L"),
                      "Предполагаемое прохождение":
                        medWeekDay === 1 || medWeekDay === 3
                          ? medDate.format("L")
                          : medWeekDay === 2
                          ? medDate.isoWeekday(1).format("L")
                          : medDate.isoWeekday(3).format("L"),
                      "Вредные и (или) опасные производственные факторы и виды работ":
                        harm?.harm,
                      "№ пукнта": harm?.harmNum,
                    };
                  }
                )
              : []
          }
        />
      ) : null}
      <>
        {loading ? (
          <MedLoading />
        ) : workersData?.workers.length ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <Stack direction="row" spacing={2}>
                {paginationLetters?.map((letter, index) => (
                  <Paper
                    sx={{
                      cursor: "pointer",
                      px: "10px",
                      py: "5px",
                      color:
                        letter === page && !(workersData!.workers.length < 10)
                          ? "white"
                          : "inherit",
                      backgroundColor:
                        letter === page && !(workersData!.workers.length < 10)
                          ? "rgb(25, 118, 210)"
                          : "inherit",
                      borderRadius: 50,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    key={index}
                    onClick={() => setPage(letter)}
                  >
                    {letter}
                  </Paper>
                ))}
              </Stack>
            </div>

            <table>
              <TableHead />
              <tbody>
                {workersData?.workers
                  .filter((worker) =>
                    workersData.workers.length < 10
                      ? true
                      : Array.from(worker.name)[0] === page
                  )
                  .map((worker, index) => (
                    <TableRow
                      key={index}
                      worker={worker}
                      harms={harmsData?.harms ? harmsData?.harms : []}
                      setAddWorkerCommentModal={setAddWorkerCommentModal}
                    />
                  ))}
              </tbody>
            </table>
          </>
        ) : (
          <>Сотрудники не найдены</>
        )}
      </>
    </div>
  );
};

export default Med;
