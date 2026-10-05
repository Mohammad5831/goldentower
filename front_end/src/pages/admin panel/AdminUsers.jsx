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

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const API_URL = "http://localhost:5000";

const gold = "#D4AF37";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("all");

    const [roleFilter, setRoleFilter] =
        useState("all");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [userToDelete, setUserToDelete] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });

    // =========================================================
    // HELPERS
    // =========================================================

    const getUserId = (user) =>
        user?.uuid ||
        user?.user_uuid ||
        user?.id ||
        user?._id ||
        "-";

    const getName = (user) => {
        const firstName =
            user?.first_name ||
            user?.firstName ||
            "";

        const lastName =
            user?.last_name ||
            user?.lastName ||
            "";

        const fullName =
            `${firstName} ${lastName}`.trim();

        return (
            fullName ||
            user?.name ||
            user?.full_name ||
            user?.fullName ||
            "بدون نام"
        );
    };

    const getPhone = (user) =>
        user?.phone ||
        user?.mobile ||
        user?.phone_number ||
        "-";

    const getEmail = (user) =>
        user?.email || "-";

    const getRole = (user) =>
        user?.role ||
        user?.user_role ||
        "user";

    const getStatus = (user) =>
        user?.status ||
        user?.account_status ||
        "active";

    const getCreatedAt = (user) =>
        user?.createdAt ||
        user?.created_at ||
        user?.register_date ||
        user?.registered_at ||
        null;

    const formatDate = (date) => {
        if (!date) return "-";

        const parsed = new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "-";
        }

        return parsed.toLocaleDateString(
            "fa-IR"
        );
    };

    const normalize = (value) =>
        String(value || "").toLowerCase();

    const getRoleLabel = (role) => {
        const value = normalize(role);

        if (
            value === "admin" ||
            value === "administrator"
        ) {
            return "مدیر";
        }

        if (value === "staff") {
            return "کارمند";
        }

        return "کاربر";
    };

    const getRoleColor = (role) => {
        const value = normalize(role);

        if (
            value === "admin" ||
            value === "administrator"
        ) {
            return "warning";
        }

        if (value === "staff") {
            return "info";
        }

        return "default";
    };

    const getStatusLabel = (status) => {
        const value = normalize(status);

        if (
            value === "active" ||
            value === "enabled" ||
            value === "1"
        ) {
            return "فعال";
        }

        if (
            value === "inactive" ||
            value === "disabled" ||
            value === "0"
        ) {
            return "غیرفعال";
        }

        if (
            value === "blocked" ||
            value === "banned"
        ) {
            return "مسدود";
        }

        return "نامشخص";
    };

    const getStatusColor = (status) => {
        const value = normalize(status);

        if (
            value === "active" ||
            value === "enabled" ||
            value === "1"
        ) {
            return "success";
        }

        if (
            value === "blocked" ||
            value === "banned"
        ) {
            return "error";
        }

        if (
            value === "inactive" ||
            value === "disabled" ||
            value === "0"
        ) {
            return "default";
        }

        return "default";
    };

    // =========================================================
    // FETCH USERS
    // =========================================================

    const fetchUsers = useCallback(
        async () => {
            setLoading(true);

            try {
                const response =
                    await axios.get(
                        `${API_URL}/api/users`
                    );

                const data =
                    response.data;

                const usersData =
                    data?.users ||
                    data?.data ||
                    data ||
                    [];

                setUsers(
                    Array.isArray(
                        usersData
                    )
                        ? usersData
                        : []
                );
            } catch (error) {
                console.error(error);

                setSnackbar({
                    open: true,
                    message:
                        "دریافت کاربران با خطا مواجه شد",
                    severity:
                        "error",
                });
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // =========================================================
    // FILTER
    // =========================================================

    const filteredUsers = useMemo(() => {
        const value = search
            .trim()
            .toLowerCase();

        return users.filter(
            (user) => {
                const name =
                    getName(
                        user
                    ).toLowerCase();

                const phone =
                    String(
                        getPhone(user)
                    ).toLowerCase();

                const email =
                    getEmail(
                        user
                    ).toLowerCase();

                const id =
                    String(
                        getUserId(user)
                    ).toLowerCase();

                const role =
                    normalize(
                        getRole(user)
                    );

                const status =
                    normalize(
                        getStatus(user)
                    );

                const matchesSearch =
                    !value ||
                    name.includes(
                        value
                    ) ||
                    phone.includes(
                        value
                    ) ||
                    email.includes(
                        value
                    ) ||
                    id.includes(
                        value
                    );

                let matchesStatus =
                    true;

                if (
                    statusFilter ===
                    "active"
                ) {
                    matchesStatus =
                        status ===
                            "active" ||
                        status ===
                            "enabled" ||
                        status ===
                            "1";
                }

                if (
                    statusFilter ===
                    "inactive"
                ) {
                    matchesStatus =
                        status ===
                            "inactive" ||
                        status ===
                            "disabled" ||
                        status ===
                            "0";
                }

                if (
                    statusFilter ===
                    "blocked"
                ) {
                    matchesStatus =
                        status ===
                            "blocked" ||
                        status ===
                            "banned";
                }

                let matchesRole =
                    true;

                if (
                    roleFilter ===
                    "admin"
                ) {
                    matchesRole =
                        role ===
                            "admin" ||
                        role ===
                            "administrator";
                }

                if (
                    roleFilter ===
                    "user"
                ) {
                    matchesRole =
                        role ===
                            "user" ||
                        role ===
                            "customer";
                }

                if (
                    roleFilter ===
                    "staff"
                ) {
                    matchesRole =
                        role ===
                        "staff";
                }

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesRole
                );
            }
        );
    }, [
        users,
        search,
        statusFilter,
        roleFilter,
    ]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const paginatedUsers =
        useMemo(() => {
            const start =
                page *
                rowsPerPage;

            return filteredUsers.slice(
                start,
                start +
                    rowsPerPage
            );
        }, [
            filteredUsers,
            page,
            rowsPerPage,
        ]);

    useEffect(() => {
        setPage(0);
    }, [
        search,
        statusFilter,
        roleFilter,
    ]);

    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (user) => {
        setSelectedUser(user);
        setViewOpen(true);
    };

    const closeView = () => {
        setSelectedUser(null);
        setViewOpen(false);
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDeleteClick = (
        user
    ) => {
        setUserToDelete(user);
        setDeleteOpen(true);
    };

    const closeDelete = () => {
        if (deleting) return;

        setUserToDelete(null);
        setDeleteOpen(false);
    };

    const handleDelete = async () => {
        if (!userToDelete) {
            return;
        }

        const id =
            getUserId(
                userToDelete
            );

        if (
            !id ||
            id === "-"
        ) {
            setSnackbar({
                open: true,
                message:
                    "شناسه کاربر پیدا نشد",
                severity:
                    "error",
            });

            return;
        }

        try {
            setDeleting(true);

            await axios.delete(
                `${API_URL}/api/users/${id}`
            );

            setUsers(
                (prev) =>
                    prev.filter(
                        (user) =>
                            getUserId(
                                user
                            ) !== id
                    )
            );

            setSnackbar({
                open: true,
                message:
                    "کاربر با موفقیت حذف شد",
                severity:
                    "success",
            });

            setDeleteOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message:
                    "حذف کاربر با خطا مواجه شد",
                severity:
                    "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // UI
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
                    mb: 2.5,
                    width: "100%",
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
                <Box
                    sx={{
                        minWidth: 0,
                        textAlign:
                            "left",
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
                            textAlign:
                                "left",
                        }}
                    >
                        کاربران
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: 12,
                            color: "#888",
                            textAlign:
                                "left",
                        }}
                    >
                        مدیریت کاربران فروشگاه
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <RefreshRoundedIcon />
                    }
                    onClick={
                        fetchUsers
                    }
                    disabled={
                        loading
                    }
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
                                marginLeft:
                                    0.5,
                                marginRight:
                                    0,
                            },
                    }}
                >
                    بروزرسانی
                </Button>
            </Box>

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
                        flexWrap:
                            "wrap",
                    }}
                >
                    {/* Search */}

                    <TextField
                        size="small"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="جستجوی نام، موبایل، ایمیل یا شناسه..."
                        sx={{
                            flex: 1,
                            minWidth: {
                                xs: "100%",
                                sm: 280,
                            },

                            "& .MuiOutlinedInput-root":
                                {
                                    height: 40,
                                    borderRadius:
                                        1.5,
                                    bgcolor:
                                        "#fafafa",

                                    "& fieldset":
                                        {
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
                                    <SearchIcon
                                        sx={{
                                            fontSize: 19,
                                            color: "#aaa",
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Status */}

                    <Select
                        size="small"
                        value={
                            statusFilter
                        }
                        onChange={(e) =>
                            setStatusFilter(
                                e.target
                                    .value
                            )
                        }
                        sx={{
                            height: 40,
                            minWidth: {
                                xs: "100%",
                                sm: 160,
                            },
                            borderRadius:
                                1.5,
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
                            همه وضعیت‌ها
                        </MenuItem>

                        <MenuItem value="active">
                            فعال
                        </MenuItem>

                        <MenuItem value="inactive">
                            غیرفعال
                        </MenuItem>

                        <MenuItem value="blocked">
                            مسدود
                        </MenuItem>
                    </Select>

                    {/* Role */}

                    <Select
                        size="small"
                        value={
                            roleFilter
                        }
                        onChange={(e) =>
                            setRoleFilter(
                                e.target
                                    .value
                            )
                        }
                        sx={{
                            height: 40,
                            minWidth: {
                                xs: "100%",
                                sm: 160,
                            },
                            borderRadius:
                                1.5,
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
                            همه نقش‌ها
                        </MenuItem>

                        <MenuItem value="user">
                            کاربر
                        </MenuItem>

                        <MenuItem value="admin">
                            مدیر
                        </MenuItem>

                        <MenuItem value="staff">
                            کارمند
                        </MenuItem>
                    </Select>

                    {/* Refresh */}

                    <IconButton
                        onClick={
                            fetchUsers
                        }
                        disabled={
                            loading
                        }
                        sx={{
                            width: 40,
                            height: 40,
                            border:
                                "1px solid #e5e5e5",
                            borderRadius:
                                1.5,
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
                                sx={{
                                    color: gold,
                                }}
                            />
                        ) : (
                            <RefreshRoundedIcon
                                sx={{
                                    fontSize: 19,
                                }}
                            />
                        )}
                    </IconButton>
                </Box>
            </Paper>

            {/* =================================================
                TABLE
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    border:
                        "1px solid #e6e6e6",
                    borderRadius: 2.5,
                    bgcolor: "#fff",
                    overflow:
                        "hidden",
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
                    <Box
                        sx={{
                            textAlign:
                                "left",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#222",
                                textAlign:
                                    "left",
                            }}
                        >
                            لیست کاربران
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
                            {
                                filteredUsers.length
                            }{" "}
                            کاربر
                        </Typography>
                    </Box>
                </Box>

                <TableContainer
                    sx={{
                        width: "100%",
                        overflowX:
                            "auto",
                    }}
                >
                    <Table
                        sx={{
                            minWidth: 1000,
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
                                        width: 260,
                                        py: 1.5,
                                        px: 2.5,
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: "#888",
                                        textAlign:
                                            "left",
                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    کاربر
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: 150,
                                        py: 1.5,
                                        px: 2,
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: "#888",
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    شماره تماس
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: 220,
                                        py: 1.5,
                                        px: 2,
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: "#888",
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    ایمیل
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: 100,
                                        py: 1.5,
                                        px: 2,
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: "#888",
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    نقش
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: 100,
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
                                    sx={{
                                        width: 120,
                                        py: 1.5,
                                        px: 2,
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: "#888",
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    تاریخ ثبت‌نام
                                </TableCell>

                                <TableCell
                                    align="center"
                                    sx={{
                                        width: 110,
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
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            7
                                        }
                                        align="center"
                                        sx={{
                                            py: 8,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
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
                                                    mb: 1.5,
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    color: "#888",
                                                }}
                                            >
                                                در حال دریافت کاربران...
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedUsers.length ===
                              0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            7
                                        }
                                        align="center"
                                        sx={{
                                            py: 8,
                                        }}
                                    >
                                        <PeopleOutlineRoundedIcon
                                            sx={{
                                                fontSize: 44,
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
                                            کاربری پیدا نشد
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                fontSize: 10,
                                                color: "#aaa",
                                            }}
                                        >
                                            عبارت جستجو یا فیلتر را تغییر دهید.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map(
                                    (
                                        user,
                                        index
                                    ) => (
                                        <TableRow
                                            key={
                                                getUserId(
                                                    user
                                                ) ||
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
                                            {/* User */}

                                            <TableCell
                                                sx={{
                                                    px: 2.5,
                                                    py: 1,
                                                    textAlign:
                                                        "left",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1.5,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius:
                                                                "50%",
                                                            flexShrink: 0,
                                                            bgcolor:
                                                                "#f4f4f4",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            overflow:
                                                                "hidden",
                                                            border:
                                                                "1px solid #eee",
                                                        }}
                                                    >
                                                        {user?.avatar ? (
                                                            <Box
                                                                component="img"
                                                                src={`${API_URL}/api/image/${user.avatar}`}
                                                                alt={getName(
                                                                    user
                                                                )}
                                                                sx={{
                                                                    width:
                                                                        "100%",
                                                                    height:
                                                                        "100%",
                                                                    objectFit:
                                                                        "cover",
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 15,
                                                                    fontWeight: 800,
                                                                    color: gold,
                                                                }}
                                                            >
                                                                {getName(
                                                                    user
                                                                ).charAt(
                                                                    0
                                                                )}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                color: "#222",
                                                                textAlign:
                                                                    "left",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {getName(
                                                                user
                                                            )}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.35,
                                                                fontSize: 9,
                                                                color: "#aaa",
                                                                direction:
                                                                    "ltr",
                                                                textAlign:
                                                                    "left",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {
                                                                getUserId(
                                                                    user
                                                                )
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Phone */}

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
                                                        color: "#444",
                                                        direction:
                                                            "ltr",
                                                        textAlign:
                                                            "left",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {getPhone(
                                                        user
                                                    )}
                                                </Typography>
                                            </TableCell>

                                            {/* Email */}

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
                                                        direction:
                                                            "ltr",
                                                        textAlign:
                                                            "left",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {getEmail(
                                                        user
                                                    )}
                                                </Typography>
                                            </TableCell>

                                            {/* Role */}

                                            <TableCell
                                                sx={{
                                                    px: 2,
                                                    textAlign:
                                                        "left",
                                                }}
                                            >
                                                <Chip
                                                    label={getRoleLabel(
                                                        getRole(
                                                            user
                                                        )
                                                    )}
                                                    color={getRoleColor(
                                                        getRole(
                                                            user
                                                        )
                                                    )}
                                                    size="small"
                                                    sx={{
                                                        height: 25,
                                                        minWidth: 60,
                                                        fontSize: 9,
                                                        fontWeight: 700,
                                                    }}
                                                />
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
                                                    label={getStatusLabel(
                                                        getStatus(
                                                            user
                                                        )
                                                    )}
                                                    color={getStatusColor(
                                                        getStatus(
                                                            user
                                                        )
                                                    )}
                                                    size="small"
                                                    sx={{
                                                        height: 25,
                                                        minWidth: 65,
                                                        fontSize: 9,
                                                        fontWeight: 700,
                                                    }}
                                                />
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
                                                        color: "#666",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {formatDate(
                                                        getCreatedAt(
                                                            user
                                                        )
                                                    )}
                                                </Typography>
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
                                                        gap: 0.4,
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleView(
                                                                user
                                                            )
                                                        }
                                                        title="مشاهده"
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            border:
                                                                "1px solid #e2e2e2",
                                                            borderRadius:
                                                                1.5,
                                                            color: "#666",

                                                            "&:hover":
                                                                {
                                                                    borderColor:
                                                                        gold,
                                                                    color: gold,
                                                                    bgcolor:
                                                                        "rgba(212,175,55,0.05)",
                                                                },
                                                        }}
                                                    >
                                                        <VisibilityOutlinedIcon
                                                            sx={{
                                                                fontSize: 17,
                                                            }}
                                                        />
                                                    </IconButton>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                user
                                                            )
                                                        }
                                                        title="حذف"
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            border:
                                                                "1px solid #e2e2e2",
                                                            borderRadius:
                                                                1.5,
                                                            color: "#777",

                                                            "&:hover":
                                                                {
                                                                    borderColor:
                                                                        "#ef9a9a",
                                                                    color: "#d32f2f",
                                                                    bgcolor:
                                                                        "rgba(211,47,47,0.04)",
                                                                },
                                                        }}
                                                    >
                                                        <DeleteOutlineIcon
                                                            sx={{
                                                                fontSize: 17,
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                <Box
                    sx={{
                        borderTop:
                            "1px solid #eeeeee",
                        direction:
                            "ltr",
                    }}
                >
                    <TablePagination
                        component="div"
                        count={
                            filteredUsers.length
                        }
                        page={page}
                        rowsPerPage={
                            rowsPerPage
                        }
                        onPageChange={(
                            _event,
                            newPage
                        ) =>
                            setPage(
                                newPage
                            )
                        }
                        onRowsPerPageChange={(
                            event
                        ) => {
                            setRowsPerPage(
                                Number(
                                    event
                                        .target
                                        .value
                                )
                            );

                            setPage(0);
                        }}
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
                            direction:
                                "ltr",

                            "& .MuiTablePagination-toolbar":
                                {
                                    minHeight: 52,
                                    px: 2,
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
                </Box>
            </Paper>

            {/* =================================================
                VIEW USER DIALOG
            ================================================= */}

            <Dialog
                open={viewOpen}
                onClose={closeView}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        direction: "ltr",
                    },
                }}
            >
                {selectedUser && (
                    <>
                        <DialogTitle
                            sx={{
                                px: 3,
                                py: 2,
                                display:
                                    "flex",
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
                                    اطلاعات کاربر
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
                                    {
                                        getName(
                                            selectedUser
                                        )
                                    }
                                </Typography>
                            </Box>

                            <IconButton
                                size="small"
                                onClick={
                                    closeView
                                }
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent
                            dividers
                            sx={{
                                px: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                        },
                                    gap: 2.5,
                                }}
                            >
                                <InfoItem
                                    label="نام و نام خانوادگی"
                                    value={getName(
                                        selectedUser
                                    )}
                                />

                                <InfoItem
                                    label="شماره تماس"
                                    value={getPhone(
                                        selectedUser
                                    )}
                                    ltr
                                />

                                <InfoItem
                                    label="ایمیل"
                                    value={getEmail(
                                        selectedUser
                                    )}
                                    ltr
                                />

                                <InfoItem
                                    label="شناسه کاربر"
                                    value={getUserId(
                                        selectedUser
                                    )}
                                    ltr
                                />

                                <InfoItem
                                    label="تاریخ ثبت‌نام"
                                    value={formatDate(
                                        getCreatedAt(
                                            selectedUser
                                        )
                                    )}
                                />

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color: "#999",
                                            mb: 0.7,
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        نقش
                                    </Typography>

                                    <Chip
                                        label={getRoleLabel(
                                            getRole(
                                                selectedUser
                                            )
                                        )}
                                        color={getRoleColor(
                                            getRole(
                                                selectedUser
                                            )
                                        )}
                                        size="small"
                                        sx={{
                                            height: 25,
                                            fontSize: 9,
                                            fontWeight: 700,
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color: "#999",
                                            mb: 0.7,
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        وضعیت
                                    </Typography>

                                    <Chip
                                        label={getStatusLabel(
                                            getStatus(
                                                selectedUser
                                            )
                                        )}
                                        color={getStatusColor(
                                            getStatus(
                                                selectedUser
                                            )
                                        )}
                                        size="small"
                                        sx={{
                                            height: 25,
                                            fontSize: 9,
                                            fontWeight: 700,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </DialogContent>

                        <DialogActions
                            sx={{
                                px: 3,
                                py: 2,
                            }}
                        >
                            <Button
                                onClick={
                                    closeView
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
                open={deleteOpen}
                onClose={
                    closeDelete
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
                        px: 3,
                        py: 2,
                        fontSize: 17,
                        fontWeight: 800,
                        textAlign:
                            "left",
                    }}
                >
                    حذف کاربر
                </DialogTitle>

                <DialogContent
                    sx={{
                        px: 3,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#555",
                            lineHeight: 2,
                            textAlign:
                                "left",
                        }}
                    >
                        آیا از حذف کاربر{" "}
                        <strong>
                            {userToDelete
                                ? getName(
                                      userToDelete
                                  )
                                : ""}
                        </strong>{" "}
                        مطمئن هستید؟
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 10,
                            color: "#d32f2f",
                            textAlign:
                                "left",
                        }}
                    >
                        این عملیات قابل بازگشت نیست.
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={
                            closeDelete
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
                                    size={15}
                                    color="inherit"
                                />
                            ) : (
                                <DeleteOutlineIcon />
                            )
                        }
                        sx={{
                            minHeight: 38,
                            px: 2,
                            borderRadius: 2,
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        {deleting
                            ? "در حال حذف..."
                            : "حذف کاربر"}
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
                    vertical:
                        "bottom",
                    horizontal:
                        "left",
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
};

// =========================================================
// INFO ITEM
// =========================================================

const InfoItem = ({
    label,
    value,
    ltr = false,
}) => {
    return (
        <Box
            sx={{
                minWidth: 0,
            }}
        >
            <Typography
                sx={{
                    fontSize: 10,
                    color: "#999",
                    mb: 0.7,
                    textAlign:
                        "left",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#333",
                    direction: ltr
                        ? "ltr"
                        : "rtl",
                    textAlign:
                        "left",
                    wordBreak:
                        "break-word",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default AdminUsers;