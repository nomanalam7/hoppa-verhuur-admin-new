import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Checkbox,
} from "@mui/material";
import React, { useState } from "react";
import { getStatusBadgeStyles } from "../../utils/statusColors";
import { EllipsisVertical, Edit2, Trash2 } from "lucide-react";
import menuTableIcon from "../../assets/icons/table-menu.svg";
import moment from "moment/moment";
import CustomSwitch from "../switch";
import ActionMenu from "../actionMenu";
import TableSkeleton from "../skeleton/TableSkeleton";

export default function PaginatedTable({
  tableWidth,
  tableHeader,
  tableData,
  displayRows,
  isLoading,
  showPagination = true,
  showViewDetail = false,
  showEdit = false,
  showDownload = false,
  showMarkAsPaid = false,
  onViewDetail,
  onEdit,
  onDownload,
  showDelete = false,
  onDelete,
  onMarkAsPaid,
  showMarkasConfirmed = false,
  onMarkAsConfirmed,
  showMarkasDelivered = false,
  onMarkAsDelivered,
  showMarkAsPickup = false,
  onMarkAsPickup,
  showMarkasCompleted = false,
  onMarkAsCompleted,
  showAddStock = false,
  showInventoryDelete = false,
  onInventoryDelete,
  onAddStock,
  menuItems = [], // Optional: custom menu items
  handleAvailabilityChange,
  onSelectionChange,
  // Server-side pagination props
  paginationMode = "client", // "client" | "server"
  count = 0,
  page: propPage,
  rowsPerPage: propRowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  showCheckbox = true,
}) {
  const [localPage, setLocalPage] = useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Determine pagination values based on mode
  const isServer = paginationMode === "server";
  const page = isServer ? (propPage !== undefined ? propPage : 0) : localPage;
  const rowsPerPage = isServer
    ? propRowsPerPage !== undefined
      ? propRowsPerPage
      : 10
    : localRowsPerPage;
  const totalCount = isServer ? count : tableData?.length || 0;

  // Determine rows to display
  const visibleRows = React.useMemo(() => {
    if (isLoading) return [];
    if (isServer) return tableData || [];
    return rowsPerPage > 0
      ? tableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : tableData;
  }, [isLoading, isServer, tableData, page, rowsPerPage]);

  const getRowId = React.useCallback((row) => row?._id ?? row?.id, []);

  const handleChangePage = (event, newPage) => {
    if (isServer && onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (isServer && onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    } else {
      setLocalRowsPerPage(newRowsPerPage);
      setLocalPage(0);
    }
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const currentPageRows = visibleRows;
      setSelectedRows(currentPageRows?.map(getRowId).filter(Boolean) || []);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, rowId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedRows([...selectedRows, rowId].filter(Boolean));
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
      setSelectAll(false);
    }
  };

  // Check if all current page rows are selected
  React.useEffect(() => {
    const currentPageRows = visibleRows;
    if (currentPageRows?.length > 0) {
      const allSelected = currentPageRows.every((row) =>
        selectedRows.includes(getRowId(row))
      );
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [getRowId, selectedRows, visibleRows]);

  React.useEffect(() => {
    if (onSelectionChange) onSelectionChange(selectedRows);
  }, [onSelectionChange, selectedRows]);

  const tableStyle = {
    "&.MuiTableContainer-root": {
      backgroundColor: "transparent",
      borderRadius: "0px",
      overflow: "auto",
      boxShadow: "none",
    },
    "& .MuiTable": {
      borderCollapse: "separate",
      borderSpacing: "0 8px",
    },
    "& .MuiTableHead-root": {
      backgroundColor: "transparent",
    },
    "& .MuiTableHead-root .MuiTableCell-root": {
      backgroundColor: "transparent",
      borderBottom: "1px solid #E5E7EB",
      padding: "16px 8px",
      textAlign: "left",
      fontWeight: 600,
    },
    "& .MuiTableHead-root .MuiTableCell-root:first-of-type": {
      width: "48px",
      padding: "8px",
    },
    "& .MuiTableCell-root": {
      borderBottom: "1px solid #E5E7EB",
      padding: "12px 16px",
      textAlign: "left",
      color: "#030229",
    },
    "& .MuiTablePagination-toolbar": {
      minHeight: "60px",
      borderTop: "1px solid #eee",
    },
  };

  const renderCell = (row, val, index) => {
    switch (val) {
      case "checkbox":
        return (

      <TableCell>
            <Checkbox
              checked={selectedRows.includes(getRowId(row))}
              onChange={(e) => handleSelectRow(e, getRowId(row))}
              sx={{
                color: "#ccc",
                "&.Mui-checked": {
                  color: "#1976d2",
                },
              }}
            />
          </TableCell>
        );

      case "itemName":
        return (
          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                justifyContent: "flex-start",
              }}
            >
              {row.itemIcon && (
                <img
                  src={row.itemIcon}
                  alt={row.itemName}
                  style={{ width: 24, height: 24 }}
                />
              )}
              <Typography
                fontSize="12px"
                sx={{ color: "#030229", fontWeight: 500 }}
              >
                {row.itemName}
              </Typography>
            </Box>
          </TableCell>
        );

      case "createdAt":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {moment(row.createdAt).format("DD-MM-YYYY")}
            </Typography>
          </TableCell>
        );
      case "rentalDuration":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {row.rentalDuration}
            </Typography>
          </TableCell>
        );

      case "category":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {row.category}
            </Typography>
          </TableCell>
        );

      case "reportCustomer":
        return (
          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "left",
                flexDirection: "column",
                gap: 1.5,
                justifyContent: "flex-start",
              }}
            >
              <Typography
                fontSize="12px"
                sx={{ color: "#030229", fontWeight: 500 }}
              >
                {row.customer.name}
              </Typography>
              <Typography
                fontSize="12px"
                sx={{ color: "#030229", fontWeight: 500 }}
              >
                {row.customerId}
              </Typography>
            </Box>
          </TableCell>
        );

      case "quantity":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {row.quantity}
            </Typography>
          </TableCell>
        );

      case "price":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {row.price}
            </Typography>
          </TableCell>
        );

      case "availability":
        return (
          <TableCell>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <CustomSwitch
                checked={row.availability}
                onChange={(e) =>
                  handleAvailabilityChange(e.target.checked, row)
                }
              />
            </Box>
          </TableCell>
        );

      case "id":
        return (
          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                fontWeight: "600",
              }}
            >
              {row.id}
            </Box>
          </TableCell>
        );

      case "status":
        return (
          <TableCell>
            <Box sx={getStatusBadgeStyles("status", row.status)}>
              {row.status === "Planned"
                ? "Gepland"
                : row.status === "Overdue"
                  ? "Te laat"
                  : row.status === "Confirmed"
                    ? "Bevestigd"
                    : row.status === "Picked Up"
                      ? "Opgehaald"
                      : row.status === "Delivered"
                        ? "Afgehandeld"
                        : row.status === "Completed"
                          ? "Voltooid"
                          : row.status}
            </Box>
          </TableCell>
        );

      case "paymentStatus":
        return (
          <TableCell>
            <Box sx={getStatusBadgeStyles("paymentStatus", row.paymentStatus)}>
              {row.paymentStatus === "Unpaid"
                ? "Niet betaald"
                : row.paymentStatus === "Paid"
                  ? "Betaald"
                  : row.paymentStatus}
            </Box>
          </TableCell>
        );

      case "customerDetails":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {row.orderId.customerName}
            </Typography>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {row.orderId.orderId}
            </Typography>
          </TableCell>
        );

      case "pickupDate":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {moment(row.pickupDate).format("DD-MM-YYYY")}
            </Typography>
          </TableCell>
        );
      case "deliveryDate":
        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {moment(row.deliveryDate).format("DD-MM-YYYY")}
            </Typography>
          </TableCell>
        );
      case "actionOrder":
        return (
          <TableCell>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" onClick={() => onEdit && onEdit(row)}>
                <Edit2 size={18} color="#9fa6b2" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete && onDelete(row)}
              >
                <Trash2 size={18} color="#9fa6b2" />
              </IconButton>
            </Box>
          </TableCell>
        );
      case "actions":
        return (
          <TableCell>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <IconButton
                size="small"
                sx={{
                  color: "#666",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                  setSelectedRow(row);
                }}
              >
                <img src={menuTableIcon} alt="menu" width={24} height={24} />
              </IconButton>
            </Box>
          </TableCell>
        );

      default:
        const cellValue = row[val];
        const hasLineBreaks =
          typeof cellValue === "string" && cellValue.includes("\n");

        return (
          <TableCell>
            <Typography
              fontSize="12px"
              sx={{ color: "#030229", fontWeight: 500 }}
            >
              {hasLineBreaks
                ? cellValue.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < cellValue.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))
                : cellValue}
            </Typography>
          </TableCell>
        );
    }
  };

  return (
    <TableContainer sx={tableStyle}>
      <Table sx={{ width: tableWidth || "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">

              {showCheckbox && (
                <Checkbox
                  checked={selectAll}
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < visibleRows?.length
                  }
                  onChange={handleSelectAll}
                  sx={{
                    color: "#ccc",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
              )}
            </TableCell>
            {tableHeader?.map((header) => (
              <TableCell key={header.id} align={header.align || "left"}>
                <Typography fontWeight={600} fontSize="13px" color="#030229">
                  {header.label || header.title}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {isLoading ? (
          <TableSkeleton
            columns={(displayRows?.length || 0) + 1} // +1 checkbox column
            rows={rowsPerPage}
          />
        ) : (
          <TableBody>
            {visibleRows?.map((row, index) => (
              <TableRow
                key={getRowId(row) || index}
                hover
                sx={{
                  backgroundColor: "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f9f9ff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  },
                }}
              >
                {/* Checkbox */}
                <TableCell align="left">
                  {showCheckbox && (
                    <Checkbox
                      checked={selectedRows.includes(getRowId(row))}
                      onChange={(e) => handleSelectRow(e, getRowId(row))}
                      sx={{
                        color: "#ccc",
                        "&.Mui-checked": {
                          color: "#1976d2",
                        },
                      }}
                    />
                  )}
                </TableCell>

                {/* Dynamic cells */}
                {(displayRows || []).map((val) => renderCell(row, val, index))}
              </TableRow>
            ))}

            {/* Empty State */}
            {tableData?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={(displayRows || []).length + 1}
                  align="center"
                >
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <Typography
                      fontSize="16px"
                      fontWeight="600"
                      color="#444"
                      mb={1}
                    >

                      Geen gegevens gevonden
                    </Typography>
                    <Typography fontSize="14px" color="#777">
                      Geen gegevens beschikbaar op dit moment
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>

      {showPagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page"
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              { fontWeight: "500", color: "#666" },
          }}
        />
      )}
      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          setSelectedRow(null);
        }}
        selectedRow={selectedRow}
        showViewDetail={showViewDetail}
        showEdit={showEdit}
        showDownload={showDownload}
        showMarkAsPaid={showMarkAsPaid}
        showDelete={showDelete}
        showAddStock={showAddStock}
        showInventoryDelete={showInventoryDelete}
        onInventoryDelete={onInventoryDelete}
        onViewDetail={onViewDetail}
        onEdit={onEdit}
        onDownload={onDownload}
        onMarkAsPaid={onMarkAsPaid}
        onDelete={onDelete}
        onAddStock={onAddStock}
        showMarkasConfirmed={showMarkasConfirmed}
        onMarkAsConfirmed={onMarkAsConfirmed}
        showMarkasDelivered={showMarkasDelivered}
        onMarkAsDelivered={onMarkAsDelivered}
        showMarkAsPickup={showMarkAsPickup}
        onMarkAsPickup={onMarkAsPickup}
        showMarkasCompleted={showMarkasCompleted}
        onMarkAsCompleted={onMarkAsCompleted}
        menuItems={menuItems}
      />
    </TableContainer>
  );
}
