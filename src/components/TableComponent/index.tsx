import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { RECORD_TYPE } from "../../App";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./style.css";
import { Box } from "@mui/material";
import { PARAMS_TYPE } from "../../api/record.api";

type PROP_TYPE = {
  records: RECORD_TYPE[];
  currentPage: number;
  handleGetRecords: (database: string, params: PARAMS_TYPE) => void;
  sortOrder: "asc" | "desc" | null;
  sortBy: string | null;
  setSortOrder: (val: "asc" | "desc" | null) => void;
  setSortBy: (val: string | null) => void;
  searchValue: string;
  selectedOption: string;
};

const columns: { label: string; value: "name" | "userEmail" | "userPhone" }[] =
  [
    { label: "Name", value: "name" },
    { label: "Email ID", value: "userEmail" },
    { label: "Phone No.", value: "userPhone" },
  ];

const TableComponent = ({
  records,
  currentPage,
  handleGetRecords,
  sortOrder,
  sortBy,
  setSortOrder,
  setSortBy,
  searchValue,
  selectedOption,
}: PROP_TYPE) => {
  const handleSort = (value: string) => {
    const order = !sortOrder ? "asc" : sortOrder === "asc" ? "desc" : "asc";
    setSortBy(value);
    setSortOrder(order);
    handleGetRecords(selectedOption, {
      page: currentPage,
      sortBy: value,
      sortOrder: order,
      searchValue,
    });
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", height: "70%" }}>
      <TableContainer sx={{ maxHeight: "100%" }} className="table-section">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell>
                  <Box className="table-heading">
                    <Box className="label">{column.label}</Box>
                    {!sortBy || sortBy !== column.value ? (
                      <ArrowUpwardIcon
                        className="arrow-icon"
                        onClick={() => handleSort(column.value)}
                      />
                    ) : sortOrder === "asc" ? (
                      <ArrowUpwardIcon
                        className="arrow-icon"
                        onClick={() => handleSort(column.value)}
                      />
                    ) : (
                      <ArrowDownwardIcon
                        className="arrow-icon"
                        onClick={() => handleSort(column.value)}
                      />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!records.length ? (
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                    height: "350px",
                  },
                }}
              >
                <TableCell colSpan={3}>
                  <Box className="no-data-found-text">No data found</Box>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow
                  key={record.slug}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column) => (
                    <TableCell>{record[column.value]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TableComponent;
