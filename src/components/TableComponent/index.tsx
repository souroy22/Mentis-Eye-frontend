import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setLoading,
  setSortBy,
  setSortOrder,
} from "../../store/global/globalReducer";
import "./style.css";
import { getRecords } from "../../api/record.api";
import { setRecords } from "../../store/record/recordReducer";

const columns: { label: string; value: "name" | "userEmail" | "userPhone" }[] =
  [
    { label: "Name", value: "name" },
    { label: "Email ID", value: "userEmail" },
    { label: "Phone No.", value: "userPhone" },
  ];

const TableComponent = () => {
  const dispatch = useDispatch();

  const { searchValue, sortBy, sortOrder, selectedOption, currentPage } =
    useSelector((state: RootState) => state.globalReducer);

  const { records } = useSelector((state: RootState) => state.recordReducer);

  const handleSort = async (value: string) => {
    dispatch(setLoading(true));
    const order = !sortOrder ? "asc" : sortOrder === "asc" ? "desc" : "asc";
    dispatch(setSortBy(value));
    dispatch(setSortOrder(order));
    const res = await getRecords(selectedOption.value, {
      page: currentPage,
      sortBy: value,
      sortOrder: order,
      searchValue,
    });
    dispatch(
      setRecords({
        records: res.records,
        totalCount: Number(res.totalCount),
      })
    );
    dispatch(setLoading(false));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} className="table-paper">
      <TableContainer sx={{ maxHeight: "100%" }} className="table-section">
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ tableLayout: "fixed" }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.value} width="33%">
                  <Box className="table-heading">
                    <Box className="label">{column.label}</Box>
                    <ArrowUpwardIcon
                      className={`arrow-icon ${
                        sortBy === column.value ? "active" : ""
                      } ${
                        sortOrder === "desc" && sortBy === column.value
                          ? "rotate-icon"
                          : ""
                      }`}
                      onClick={() => handleSort(column.value)}
                    />
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
                    <TableCell
                      // size="small"
                      width="33%"
                      key={`${record.slug}-${column.value}`}
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {record[column.value]}
                    </TableCell>
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
