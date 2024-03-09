import { useEffect, useState } from "react";
import "./App.css";
import RouterComponent from "./routers";
import { useSearchParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getUser } from "./api/user.api";
import { customLocalStorage } from "./services/utils/localStorage";
import { PARAMS_TYPE, getRecords } from "./api/record.api";

export type USER_TYPE = {
  name: string;
  username: string;
};

export type RECORD_TYPE = {
  name: string;
  userEmail: string;
  userPhone: string;
  slug: string;
};

export const sidebarOptions: { label: string; value: string }[] = [
  { label: "Database 1", value: "DATABASE_1" },
  { label: "Database 2", value: "DATABASE_2" },
  { label: "Database 3", value: "DATABASE_3" },
];

export type USER_STATE_TYPE = null | USER_TYPE;

type FN_TYPE = (database: string, params: PARAMS_TYPE) => void;

const App = () => {
  const [user, setUser] = useState<USER_STATE_TYPE>(null);
  const [selectedOption, setSelectedOption] = useState<string>(
    sidebarOptions[0].value
  );
  const [searchParams, setSearchParams] = useSearchParams({});
  const [records, setRecords] = useState<RECORD_TYPE[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const onLoad = async () => {
    if (customLocalStorage.getData("token")) {
      try {
        const res = await getUser();
        setUser(res.user);
        const recordRes = await getRecords(selectedOption);
        setRecords(recordRes.records);
        setTotalCount(Number(recordRes.totalCount));
      } catch (error) {
        setUser(null);
      }
    }
  };

  const handleGetRecords: FN_TYPE = async (
    database,
    { page, searchValue, sortBy, sortOrder, limit }
  ) => {
    let params: any = { page, searchValue, sortBy, sortOrder, limit };
    params = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => {
        return value !== null && value !== undefined;
      })
    );
    const res = await getRecords(database, params);
    setRecords(res.records);
    setTotalCount(Number(res.totalCount));
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <RouterComponent
        user={user}
        setUser={setUser}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        records={records}
        totalCount={totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleGetRecords={handleGetRecords}
        sortOrder={sortOrder}
        sortBy={sortBy}
        setSortOrder={setSortOrder}
        setSortBy={setSortBy}
      />
      <Toaster />
    </>
  );
};

export default App;
