import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import {
    CloseRounded,
    DeleteOutlineRounded,
    Inventory2Outlined,
    RefreshRounded,
    SearchRounded,
    VisibilityOutlined,
} from "@mui/icons-material";

const API_URL = "http://localhost:5000";

const gold = "#D4AF37";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("all");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [deleteDialog, setDeleteDialog] =
        useState({
            open: false,
            order: null,
        });

    const [deleting, setDeleting] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });

    // =========================================================
    // FETCH ORDERS
    // =========================================================

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/api/orders`
            );

            const data =
                response.data?.orders ??
                response.data ??
                [];

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(err);

            setError(
                "دریافت سفارشات با خطا مواجه شد."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // =========================================================
    // HELPERS
    // =========================================================

    const getOrderId = (order) => {
        return (
            order.order_number ||
            order.orderNumber ||
            order.uuid ||
            order.id ||
            "—"
        );
    };

    const getCustomerName = (order) => {
        if (order.user?.first_name) {
            return `${order.user.first_name} ${
                order.user.last_name || ""
            }`.trim();
        }

        if (order.customer?.first_name) {
            return `${order.customer.first_name} ${
                order.customer.last_name || ""
            }`.trim();
        }

        if (order.user?.name) {
            return order.user.name;
        }

        if (order.customer?.name) {
            return order.customer.name;
        }

        if (order.customer_name) {
            return order.customer_name;
        }

        if (order.name) {
            return order.name;
        }

        return "کاربر مهمان";
    };

    const getCustomerPhone = (order) => {
        return (
            order.user?.phone ||
            order.customer?.phone ||
            order.phone ||
            "—"
        );
    };

    const getOrderDate = (order) => {
        return (
            order.createdAt ||
            order.created_at ||
            order.date ||
            order.order_date ||
            null
        );
    };

    const formatDate = (date) => {
        if (!date) return "—";

        try {
            const parsedDate = new Date(date);

            if (Number.isNaN(parsedDate.getTime())) {
                return "—";
            }

            return new Intl.DateTimeFormat(
                "fa-IR",
                {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }
            ).format(parsedDate);
        } catch {
            return "—";
        }
    };

    const getTotalPrice = (order) => {
        return Number(
            order.total_price ??
                order.totalPrice ??
                order.total ??
                order.amount ??
                order.final_price ??
                0
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat(
            "fa-IR"
        ).format(Number(price) || 0);
    };

    const getPaymentStatus = (order) => {
        const status = String(
            order.payment_status ??
                order.paymentStatus ??
                ""
        ).toLowerCase();

        if (
            [
                "paid",
                "success",
                "successful",
                "completed",
            ].includes(status)
        ) {
            return {
                label: "پرداخت شده",
                color: "success",
            };
        }

        if (
            [
                "pending",
                "waiting",
                "unpaid",
            ].includes(status)
        ) {
            return {
                label: "در انتظار پرداخت",
                color: "warning",
            };
        }

        if (
            [
                "failed",
                "error",
                "rejected",
            ].includes(status)
        ) {
            return {
                label: "ناموفق",
                color: "error",
            };
        }

        return {
            label: "نامشخص",
            color: "default",
        };
    };

    const getOrderStatus = (order) => {
        const status = String(
            order.status ??
                order.order_status ??
                order.orderStatus ??
                ""
        ).toLowerCase();

        if (
            [
                "pending",
                "waiting",
                "awaiting",
            ].includes(status)
        ) {
            return {
                key: "pending",
                label: "در انتظار",
                color: "warning",
            };
        }

        if (
            [
                "processing",
                "preparing",
            ].includes(status)
        ) {
            return {
                key: "processing",
                label: "در حال پردازش",
                color: "info",
            };
        }

        if (
            [
                "shipped",
                "shipping",
                "sent",
            ].includes(status)
        ) {
            return {
                key: "shipped",
                label: "ارسال شده",
                color: "primary",
            };
        }

        if (
            [
                "delivered",
                "completed",
                "complete",
            ].includes(status)
        ) {
            return {
                key: "completed",
                label: "تکمیل شده",
                color: "success",
            };
        }

        if (
            [
                "cancelled",
                "canceled",
                "cancel",
            ].includes(status)
        ) {
            return {
                key: "cancelled",
                label: "لغو شده",
                color: "error",
            };
        }

        return {
            key: "unknown",
            label: "نامشخص",
            color: "default",
        };
    };

    // =========================================================
    // FILTER
    // =========================================================

    const filteredOrders = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return orders.filter((order) => {
            const orderId = String(
                getOrderId(order)
            ).toLowerCase();

            const customer = String(
                getCustomerName(order)
            ).toLowerCase();

            const phone = String(
                getCustomerPhone(order)
            ).toLowerCase();

            const matchesSearch =
                !query ||
                orderId.includes(query) ||
                customer.includes(query) ||
                phone.includes(query);

            const status =
                getOrderStatus(order);

            const matchesStatus =
                statusFilter === "all" ||
                status.key === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        orders,
        search,
        statusFilter,
    ]);

    const paginatedOrders =
        filteredOrders.slice(
            page * rowsPerPage,
            page * rowsPerPage +
                rowsPerPage
        );

    // =========================================================
    // EVENTS
    // =========================================================

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(
            event.target.value
        );
        setPage(0);
    };

    const handleChangePage = (
        _event,
        newPage
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event
    ) => {
        setRowsPerPage(
            Number(event.target.value)
        );
        setPage(0);
    };

    const openOrder = (order) => {
        setSelectedOrder(order);
    };

    const closeOrder = () => {
        setSelectedOrder(null);
    };

    const openDeleteDialog = (order) => {
        setDeleteDialog({
            open: true,
            order,
        });
    };

    const closeDeleteDialog = () => {
        if (deleting) return;

        setDeleteDialog({
            open: false,
            order: null,
        });
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async () => {
        const order =
            deleteDialog.order;

        if (!order) return;

        const orderId =
            order.uuid || order.id;

        if (!orderId) {
            setSnackbar({
                open: true,
                message:
                    "شناسه سفارش پیدا نشد.",
                severity: "error",
            });

            return;
        }

        try {
            setDeleting(true);

            await axios.delete(
                `${API_URL}/api/orders/${orderId}`
            );

            setOrders((prev) =>
                prev.filter(
                    (item) =>
                        (
                            item.uuid ||
                            item.id
                        ) !== orderId
                )
            );

            setSnackbar({
                open: true,
                message:
                    "سفارش با موفقیت حذف شد.",
                severity: "success",
            });

            setDeleteDialog({
                open: false,
                order: null,
            });
        } catch (err) {
            console.error(err);

            setSnackbar({
                open: true,
                message:
                    "حذف سفارش با خطا مواجه شد.",
                severity: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
                direction: "ltr",
                minWidth: 0,
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    width: "100%",
                    mb: 2.5,
                    display: "flex",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    justifyContent:
                        "space-between",
                    gap: 2,
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                }}
            >
                {/* Title */}

                <Box
                    sx={{
                        minWidth: 0,
                        textAlign: "left",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 21,
                                sm: 24,
                            },
                            fontWeight: 800,
                            color: "#111",
                            lineHeight: 1.4,
                            textAlign: "left",
                        }}
                    >
                        سفارشات
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: 12,
                            color: "#888",
                            textAlign: "left",
                        }}
                    >
                        مدیریت و بررسی سفارش‌های فروشگاه
                    </Typography>
                </Box>

                {/* Refresh */}

                <Button
                    variant="outlined"
                    startIcon={
                        <RefreshRounded />
                    }
                    onClick={fetchOrders}
                    disabled={loading}
                    sx={{
                        minHeight: 42,
                        px: 2,
                        borderRadius: 2,
                        borderColor:
                            "#dedede",
                        color: "#555",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,

                        "&:hover": {
                            borderColor:
                                gold,
                            color: gold,
                            bgcolor:
                                "rgba(212,175,55,0.04)",
                        },

                        "& .MuiButton-startIcon":
                            {
                                marginLeft: 0.5,
                                marginRight: 0,
                            },
                    }}
                >
                    بروزرسانی
                </Button>
            </Box>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* =================================================
                FILTERS
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    mb: 2,
                    border:
                        "1px solid #e6e6e6",
                    borderRadius: 2.5,
                    bgcolor: "#fff",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    {/* Search */}

                    <TextField
                        value={search}
                        onChange={
                            handleSearchChange
                        }
                        placeholder="جستجوی شماره سفارش، مشتری یا موبایل..."
                        size="small"
                        sx={{
                            flex: 1,
                            minWidth: {
                                xs: "100%",
                                sm: 280,
                            },

                            "& .MuiOutlinedInput-root":
                                {
                                    height: 40,
                                    borderRadius: 1.5,
                                    bgcolor:
                                        "#fafafa",

                                    "& fieldset": {
                                        borderColor:
                                            "#e5e5e5",
                                    },

                                    "&:hover fieldset":
                                        {
                                            borderColor:
                                                "#d5d5d5",
                                        },

                                    "&.Mui-focused fieldset":
                                        {
                                            borderColor:
                                                gold,
                                        },
                                },

                            "& input": {
                                fontSize: 12,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRounded
                                        sx={{
                                            color: "#aaa",
                                            fontSize: 19,
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Status */}

                    <Select
                        value={
                            statusFilter
                        }
                        onChange={
                            handleStatusChange
                        }
                        size="small"
                        displayEmpty
                        sx={{
                            height: 40,
                            minWidth: {
                                xs: "100%",
                                sm: 165,
                            },
                            borderRadius: 1.5,
                            bgcolor:
                                "#fafafa",
                            fontSize: 12,

                            "& .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor:
                                        "#e5e5e5",
                                },

                            "&:hover .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor:
                                        "#d5d5d5",
                                },

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor:
                                        gold,
                                },
                        }}
                    >
                        <MenuItem value="all">
                            همه سفارشات
                        </MenuItem>

                        <MenuItem value="pending">
                            در انتظار
                        </MenuItem>

                        <MenuItem value="processing">
                            در حال پردازش
                        </MenuItem>

                        <MenuItem value="shipped">
                            ارسال شده
                        </MenuItem>

                        <MenuItem value="completed">
                            تکمیل شده
                        </MenuItem>

                        <MenuItem value="cancelled">
                            لغو شده
                        </MenuItem>
                    </Select>

                    {/* Refresh icon */}

                    <IconButton
                        onClick={
                            fetchOrders
                        }
                        disabled={
                            loading
                        }
                        sx={{
                            width: 40,
                            height: 40,
                            border:
                                "1px solid #e5e5e5",
                            borderRadius: 1.5,
                            color: "#666",
                            flexShrink: 0,

                            "&:hover": {
                                color: gold,
                                borderColor:
                                    gold,
                                bgcolor:
                                    "rgba(212,175,55,0.04)",
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress
                                size={17}
                            />
                        ) : (
                            <RefreshRounded
                                fontSize="small"
                            />
                        )}
                    </IconButton>
                </Box>
            </Paper>

            {/* =================================================
                ORDERS TABLE
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    border:
                        "1px solid #e6e6e6",
                    borderRadius: 2.5,
                    bgcolor: "#fff",
                    overflow: "hidden",
                }}
            >
                {/* Table Header */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                        },
                        py: 1.7,
                        borderBottom:
                            "1px solid #eeeeee",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#222",
                                textAlign:
                                    "left",
                            }}
                        >
                            لیست سفارشات
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: 10,
                                color: "#999",
                                textAlign:
                                    "left",
                            }}
                        >
                            {filteredOrders.length.toLocaleString(
                                "fa-IR"
                            )}{" "}
                            سفارش
                        </Typography>
                    </Box>
                </Box>

                {/* Loading */}

                {loading ? (
                    <Box
                        sx={{
                            height: 360,
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                        }}
                    >
                        <CircularProgress
                            size={28}
                            sx={{
                                color: gold,
                            }}
                        />
                    </Box>
                ) : filteredOrders.length ===
                  0 ? (
                    /* Empty */

                    <Box
                        sx={{
                            height: 320,
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                        }}
                    >
                        <Inventory2Outlined
                            sx={{
                                fontSize: 45,
                                color: "#ddd",
                                mb: 1,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#555",
                            }}
                        >
                            سفارشی پیدا نشد
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.4,
                                fontSize: 10,
                                color: "#aaa",
                            }}
                        >
                            عبارت جستجو یا فیلتر را تغییر دهید.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer
                            sx={{
                                width: "100%",
                                overflowX:
                                    "auto",
                            }}
                        >
                            <Table
                                sx={{
                                    minWidth: 900,
                                    tableLayout:
                                        "fixed",
                                }}
                            >
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            bgcolor:
                                                "#fafafa",
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                width: "18%",
                                                py: 1.5,
                                                px: 2.5,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                                whiteSpace:
                                                    "nowrap",
                                                textAlign:
                                                    "left",
                                            }}
                                        >
                                            شماره سفارش
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "23%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                                textAlign:
                                                    "left",
                                            }}
                                        >
                                            مشتری
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "14%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                                textAlign:
                                                    "left",
                                            }}
                                        >
                                            تاریخ
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "16%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                                textAlign:
                                                    "left",
                                            }}
                                        >
                                            مبلغ
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "13%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                                textAlign:
                                                    "left",
                                            }}
                                        >
                                            وضعیت
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                width: "16%",
                                                py: 1.5,
                                                px: 1,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                            }}
                                        >
                                            عملیات
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedOrders.map(
                                        (
                                            order,
                                            index
                                        ) => {
                                            const status =
                                                getOrderStatus(
                                                    order
                                                );

                                            const payment =
                                                getPaymentStatus(
                                                    order
                                                );

                                            return (
                                                <TableRow
                                                    key={
                                                        order.uuid ||
                                                        order.id ||
                                                        index
                                                    }
                                                    hover
                                                    sx={{
                                                        height: 76,

                                                        "&:last-child td":
                                                            {
                                                                borderBottom:
                                                                    "none",
                                                            },

                                                        "&:hover":
                                                            {
                                                                bgcolor:
                                                                    "#fffdf7",
                                                            },
                                                    }}
                                                >
                                                    {/* Order ID */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2.5,
                                                            py: 1,
                                                            textAlign:
                                                                "left",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 11,
                                                                fontWeight: 800,
                                                                color: "#222",
                                                                direction:
                                                                    "ltr",
                                                                textAlign:
                                                                    "left",
                                                                maxWidth: 150,
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            #
                                                            {
                                                                getOrderId(
                                                                    order
                                                                )
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.35,
                                                                fontSize: 9,
                                                                color: "#aaa",
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {
                                                                payment.label
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Customer */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
                                                            textAlign:
                                                                "left",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                color: "#333",
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {getCustomerName(
                                                                order
                                                            )}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.3,
                                                                fontSize: 9,
                                                                color: "#999",
                                                                direction:
                                                                    "ltr",
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {
                                                                getCustomerPhone(
                                                                    order
                                                                )
                                                            }
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Date */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
                                                            textAlign:
                                                                "left",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 11,
                                                                color: "#555",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {formatDate(
                                                                getOrderDate(
                                                                    order
                                                                )
                                                            )}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Price */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
                                                            textAlign:
                                                                "left",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "baseline",
                                                                gap: 0.5,
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12,
                                                                    fontWeight: 800,
                                                                    color: "#222",
                                                                }}
                                                            >
                                                                {formatPrice(
                                                                    getTotalPrice(
                                                                        order
                                                                    )
                                                                )}
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: 9,
                                                                    color: "#999",
                                                                }}
                                                            >
                                                                تومان
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>

                                                    {/* Status */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
                                                            textAlign:
                                                                "left",
                                                        }}
                                                    >
                                                        <Chip
                                                            label={
                                                                status.label
                                                            }
                                                            color={
                                                                status.color
                                                            }
                                                            size="small"
                                                            sx={{
                                                                height: 25,
                                                                minWidth: 68,
                                                                fontSize: 9,
                                                                fontWeight: 700,
                                                            }}
                                                        />
                                                    </TableCell>

                                                    {/* Actions */}

                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            px: 1,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                gap: 0.3,
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                title="مشاهده سفارش"
                                                                onClick={() =>
                                                                    openOrder(
                                                                        order
                                                                    )
                                                                }
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    color: "#777",

                                                                    "&:hover":
                                                                        {
                                                                            color: gold,
                                                                            bgcolor:
                                                                                "rgba(212,175,55,0.08)",
                                                                        },
                                                                }}
                                                            >
                                                                <VisibilityOutlined
                                                                    sx={{
                                                                        fontSize: 18,
                                                                    }}
                                                                />
                                                            </IconButton>

                                                            <IconButton
                                                                size="small"
                                                                title="حذف سفارش"
                                                                onClick={() =>
                                                                    openDeleteDialog(
                                                                        order
                                                                    )
                                                                }
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    color: "#777",

                                                                    "&:hover":
                                                                        {
                                                                            color: "#d32f2f",
                                                                            bgcolor:
                                                                                "rgba(211,47,47,0.08)",
                                                                        },
                                                                }}
                                                            >
                                                                <DeleteOutlineRounded
                                                                    sx={{
                                                                        fontSize: 18,
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}

                        <TablePagination
                            component="div"
                            count={
                                filteredOrders.length
                            }
                            page={page}
                            onPageChange={
                                handleChangePage
                            }
                            rowsPerPage={
                                rowsPerPage
                            }
                            onRowsPerPageChange={
                                handleChangeRowsPerPage
                            }
                            rowsPerPageOptions={[
                                5,
                                10,
                                25,
                                50,
                            ]}
                            labelRowsPerPage="تعداد:"
                            labelDisplayedRows={({
                                from,
                                to,
                                count,
                            }) =>
                                `${from}–${to} از ${count}`
                            }
                            sx={{
                                borderTop:
                                    "1px solid #eeeeee",
                                direction:
                                    "ltr",

                                "& .MuiTablePagination-toolbar":
                                    {
                                        minHeight: 52,
                                        px: 2,
                                        direction:
                                            "ltr",
                                    },

                                "& .MuiTablePagination-selectLabel":
                                    {
                                        fontSize: 10,
                                        color: "#888",
                                    },

                                "& .MuiTablePagination-displayedRows":
                                    {
                                        fontSize: 10,
                                        color: "#888",
                                    },

                                "& .MuiTablePagination-select":
                                    {
                                        fontSize: 11,
                                    },
                            }}
                        />
                    </>
                )}
            </Paper>

            {/* =================================================
                ORDER DETAILS DIALOG
            ================================================= */}

            <Dialog
                open={
                    Boolean(
                        selectedOrder
                    )
                }
                onClose={
                    closeOrder
                }
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        direction: "ltr",
                    },
                }}
            >
                {selectedOrder && (
                    <>
                        <DialogTitle
                            sx={{
                                px: 3,
                                py: 2,
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign:
                                        "left",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 17,
                                        fontWeight: 800,
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    جزئیات سفارش
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.3,
                                        fontSize: 10,
                                        color: "#999",
                                        direction:
                                            "ltr",
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    #
                                    {
                                        getOrderId(
                                            selectedOrder
                                        )
                                    }
                                </Typography>
                            </Box>

                            <IconButton
                                onClick={
                                    closeOrder
                                }
                                size="small"
                            >
                                <CloseRounded />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent
                            dividers
                            sx={{
                                px: 3,
                            }}
                        >
                            {/* Customer */}

                            <Box
                                sx={{
                                    mb: 2,
                                }}
                            >
                                <Typography
                                    sx={{
                                        mb: 1,
                                        fontSize: 11,
                                        fontWeight: 800,
                                        color: "#888",
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    اطلاعات مشتری
                                </Typography>

                                <Box
                                    sx={{
                                        p: 1.5,
                                        border:
                                            "1px solid #eee",
                                        borderRadius: 2,
                                        bgcolor:
                                            "#fafafa",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        {getCustomerName(
                                            selectedOrder
                                        )}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontSize: 10,
                                            color: "#777",
                                            direction:
                                                "ltr",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        {getCustomerPhone(
                                            selectedOrder
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider
                                sx={{
                                    mb: 2,
                                }}
                            />

                            {/* Order Information */}

                            <Box
                                sx={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                        },
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        border:
                                            "1px solid #eee",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            color: "#999",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        تاریخ سفارش
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.4,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        {formatDate(
                                            getOrderDate(
                                                selectedOrder
                                            )
                                        )}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        p: 1.5,
                                        border:
                                            "1px solid #eee",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            color: "#999",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        مبلغ کل
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.4,
                                            fontSize: 12,
                                            fontWeight: 800,
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        {formatPrice(
                                            getTotalPrice(
                                                selectedOrder
                                            )
                                        )}{" "}
                                        تومان
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        p: 1.5,
                                        border:
                                            "1px solid #eee",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            color: "#999",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        پرداخت
                                    </Typography>

                                    <Box
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        <Chip
                                            label={
                                                getPaymentStatus(
                                                    selectedOrder
                                                ).label
                                            }
                                            color={
                                                getPaymentStatus(
                                                    selectedOrder
                                                ).color
                                            }
                                            size="small"
                                            sx={{
                                                height: 24,
                                                fontSize: 9,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        p: 1.5,
                                        border:
                                            "1px solid #eee",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            color: "#999",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        وضعیت سفارش
                                    </Typography>

                                    <Box
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        <Chip
                                            label={
                                                getOrderStatus(
                                                    selectedOrder
                                                ).label
                                            }
                                            color={
                                                getOrderStatus(
                                                    selectedOrder
                                                ).color
                                            }
                                            size="small"
                                            sx={{
                                                height: 24,
                                                fontSize: 9,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Products */}

                            {Array.isArray(
                                selectedOrder.items
                            ) &&
                                selectedOrder
                                    .items
                                    .length >
                                    0 && (
                                    <>
                                        <Divider
                                            sx={{
                                                my: 2,
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                mb: 1,
                                                fontSize: 11,
                                                fontWeight: 800,
                                                color: "#888",
                                                textAlign:
                                                    "left",
                                            }}
                                        >
                                            محصولات سفارش
                                        </Typography>

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                gap: 1,
                                            }}
                                        >
                                            {selectedOrder.items.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <Box
                                                        key={
                                                            item.uuid ||
                                                            item.id ||
                                                            index
                                                        }
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "space-between",
                                                            gap: 2,
                                                            p: 1.5,
                                                            border:
                                                                "1px solid #eee",
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                minWidth:
                                                                    0,
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 11,
                                                                    fontWeight: 700,
                                                                    textAlign:
                                                                        "left",
                                                                }}
                                                            >
                                                                {item.product
                                                                    ?.name ||
                                                                    item.product_name ||
                                                                    item.name ||
                                                                    "محصول"}
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    mt: 0.3,
                                                                    fontSize: 9,
                                                                    color: "#999",
                                                                    textAlign:
                                                                        "left",
                                                                }}
                                                            >
                                                                تعداد:{" "}
                                                                {Number(
                                                                    item.quantity ??
                                                                        1
                                                                ).toLocaleString(
                                                                    "fa-IR"
                                                                )}
                                                            </Typography>
                                                        </Box>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                whiteSpace:
                                                                    "nowrap",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                Number(
                                                                    item.price ??
                                                                        item.total_price ??
                                                                        0
                                                                )
                                                            )}{" "}
                                                            تومان
                                                        </Typography>
                                                    </Box>
                                                )
                                            )}
                                        </Box>
                                    </>
                                )}
                        </DialogContent>

                        <DialogActions
                            sx={{
                                px: 3,
                                py: 2,
                            }}
                        >
                            <Button
                                onClick={
                                    closeOrder
                                }
                                sx={{
                                    color: "#666",
                                    fontSize: 12,
                                }}
                            >
                                بستن
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <Dialog
                open={
                    deleteDialog.open
                }
                onClose={
                    closeDeleteDialog
                }
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        direction: "ltr",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: 17,
                        fontWeight: 800,
                        textAlign: "left",
                    }}
                >
                    حذف سفارش
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#666",
                            lineHeight: 2,
                            textAlign: "left",
                        }}
                    >
                        آیا مطمئن هستید که می‌خواهید سفارش{" "}
                        <strong>
                            #
                            {getOrderId(
                                deleteDialog.order ||
                                    {}
                            )}
                        </strong>{" "}
                        را حذف کنید؟
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 11,
                            color: "#d32f2f",
                            textAlign: "left",
                        }}
                    >
                        این عملیات قابل بازگشت نیست.
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={
                            closeDeleteDialog
                        }
                        disabled={
                            deleting
                        }
                        sx={{
                            color: "#666",
                            fontSize: 12,
                        }}
                    >
                        انصراف
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={
                            handleDelete
                        }
                        disabled={
                            deleting
                        }
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    size={16}
                                    color="inherit"
                                />
                            ) : (
                                <DeleteOutlineRounded />
                            )
                        }
                        sx={{
                            borderRadius: 2,
                            fontSize: 12,
                        }}
                    >
                        {deleting
                            ? "در حال حذف..."
                            : "حذف سفارش"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    3500
                }
                onClose={() =>
                    setSnackbar(
                        (prev) => ({
                            ...prev,
                            open: false,
                        })
                    )
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={() =>
                        setSnackbar(
                            (prev) => ({
                                ...prev,
                                open: false,
                            })
                        )
                    }
                    sx={{
                        borderRadius: 2,
                    }}
                >
                    {
                        snackbar.message
                    }
                </Alert>
            </Snackbar>
        </Box>
    );
}