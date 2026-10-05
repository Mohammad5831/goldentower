import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import {
    AddRounded,
    DeleteOutlineRounded,
    EditOutlined,
    Inventory2Outlined,
    RefreshRounded,
    SearchRounded,
    VisibilityOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";
const IMAGE_URL = `${API_URL}/api/image`;

const gold = "#D4AF37";

export default function AdminProducts() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        product: null,
    });

    const [deleting, setDeleting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/api/products`
            );

            const data =
                response.data?.products ??
                response.data ??
                [];

            setProducts(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(err);

            setError(
                "دریافت محصولات با خطا مواجه شد."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getStock = (product) => {
        return Number(
            product.inStock ??
            product.inventory ??
            product.quantity ??
            0
        );
    };

    const getPrice = (product) => {
        return Number(
            product.current_price ??
            product.price ??
            0
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fa-IR").format(
            Number(price) || 0
        );
    };

    const getProductStatus = (product) => {
        if (
            product.status === "inactive" ||
            product.status === "disabled"
        ) {
            return {
                label: "غیرفعال",
                color: "default",
            };
        }

        if (getStock(product) <= 0) {
            return {
                label: "ناموجود",
                color: "error",
            };
        }

        if (getStock(product) <= 5) {
            return {
                label: "موجودی کم",
                color: "warning",
            };
        }

        return {
            label: "فعال",
            color: "success",
        };
    };

    const filteredProducts = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return products.filter((product) => {
            const name =
                String(
                    product.name || ""
                ).toLowerCase();

            const brand =
                String(
                    product.brand || ""
                ).toLowerCase();

            const uuid =
                String(
                    product.uuid || ""
                ).toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                name.includes(normalizedSearch) ||
                brand.includes(normalizedSearch) ||
                uuid.includes(normalizedSearch);

            const status =
                getProductStatus(product);

            let matchesStatus = true;

            if (statusFilter === "active") {
                matchesStatus =
                    status.label === "فعال";
            }

            if (statusFilter === "low") {
                matchesStatus =
                    status.label === "موجودی کم";
            }

            if (statusFilter === "out") {
                matchesStatus =
                    status.label === "ناموجود";
            }

            if (statusFilter === "inactive") {
                matchesStatus =
                    status.label === "غیرفعال";
            }

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        products,
        search,
        statusFilter,
    ]);

    const paginatedProducts =
        filteredProducts.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setPage(0);
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(
            Number(event.target.value)
        );
        setPage(0);
    };

    const openDeleteDialog = (product) => {
        setDeleteDialog({
            open: true,
            product,
        });
    };

    const closeDeleteDialog = () => {
        if (deleting) return;

        setDeleteDialog({
            open: false,
            product: null,
        });
    };

    const handleDelete = async () => {
        const product =
            deleteDialog.product;

        if (!product) return;

        try {
            setDeleting(true);

            await axios.delete(
                `${API_URL}/api/products/${product.uuid}`
            );

            setProducts((prev) =>
                prev.filter(
                    (item) =>
                        item.uuid !==
                        product.uuid
                )
            );

            setSnackbar({
                open: true,
                message:
                    "محصول با موفقیت حذف شد.",
                severity: "success",
            });

            setDeleteDialog({
                open: false,
                product: null,
            });
        } catch (err) {
            console.error(err);

            setSnackbar({
                open: true,
                message:
                    "حذف محصول با خطا مواجه شد.",
                severity: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            {/* ================= HEADER ================= */}

            <Box
                sx={{
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
                <Box>
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 21,
                                sm: 24,
                            },
                            fontWeight: 800,
                            color: "#111",
                            lineHeight: 1.4,
                        }}
                    >
                        محصولات
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: 12,
                            color: "#888",
                        }}
                    >
                        مدیریت و بررسی محصولات فروشگاه
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={
                        <AddRounded />
                    }
                    onClick={() =>
                        navigate(
                            "/admin/products/create"
                        )
                    }
                    sx={{
                        minHeight: 42,
                        px: 2,
                        borderRadius: 2,
                        bgcolor: "#111",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        boxShadow: "none",

                        "&:hover": {
                            bgcolor: "#222",
                            boxShadow: "none",
                        },

                        "& .MuiButton-startIcon": {
                            marginLeft: 0.5,
                            marginRight: 0,
                        },
                    }}
                >
                    افزودن محصول
                </Button>
            </Box>

            {/* ================= ERROR ================= */}

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

            {/* ================= FILTER ================= */}

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
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <TextField
                        value={search}
                        onChange={
                            handleSearchChange
                        }
                        placeholder="جستجوی نام، برند یا شناسه..."
                        size="small"
                        sx={{
                            flex: 1,
                            minWidth: {
                                xs: "100%",
                                sm: 260,
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

                    <Select
                        value={
                            statusFilter
                        }
                        onChange={
                            handleStatusChange
                        }
                        size="small"
                        sx={{
                            height: 40,
                            minWidth: {
                                xs: "100%",
                                sm: 150,
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
                            همه محصولات
                        </MenuItem>

                        <MenuItem value="active">
                            فعال
                        </MenuItem>

                        <MenuItem value="low">
                            موجودی کم
                        </MenuItem>

                        <MenuItem value="out">
                            ناموجود
                        </MenuItem>

                        <MenuItem value="inactive">
                            غیرفعال
                        </MenuItem>
                    </Select>

                    <IconButton
                        onClick={
                            fetchProducts
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

            {/* ================= TABLE ================= */}

            <Paper
                elevation={0}
                sx={{
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
                            }}
                        >
                            لیست محصولات
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: 10,
                                color: "#999",
                            }}
                        >
                            {filteredProducts.length.toLocaleString(
                                "fa-IR"
                            )}{" "}
                            محصول
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
                ) : filteredProducts.length ===
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
                            محصولی پیدا نشد
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
                                overflowX:
                                    "auto",
                            }}
                        >
                            <Table
                                sx={{
                                    minWidth: 900,
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
                                                width: "36%",
                                                py: 1.5,
                                                px: 2.5,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                            }}
                                        >
                                            محصول
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "14%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                            }}
                                        >
                                            برند
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "16%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                            }}
                                        >
                                            قیمت
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "10%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                            }}
                                        >
                                            موجودی
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                width: "12%",
                                                py: 1.5,
                                                px: 2,
                                                fontSize: 10,
                                                fontWeight: 800,
                                                color: "#888",
                                            }}
                                        >
                                            وضعیت
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                width: "12%",
                                                py: 1.5,
                                                px: 2,
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
                                    {paginatedProducts.map(
                                        (
                                            product,
                                            index
                                        ) => {
                                            const status =
                                                getProductStatus(
                                                    product
                                                );

                                            const stock =
                                                getStock(
                                                    product
                                                );

                                            return (
                                                <TableRow
                                                    key={
                                                        product.uuid ||
                                                        product.id ||
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
                                                    {/* Product */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2.5,
                                                            py: 1,
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
                                                                    width: 50,
                                                                    height: 50,
                                                                    border:
                                                                        "1px solid #ededed",
                                                                    borderRadius: 1.5,
                                                                    bgcolor:
                                                                        "#fafafa",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    overflow:
                                                                        "hidden",
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {product.image ? (
                                                                    <Box
                                                                        component="img"
                                                                        src={`${IMAGE_URL}/${product.image}`}
                                                                        alt={
                                                                            product.name ||
                                                                            ""
                                                                        }
                                                                        sx={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            objectFit:
                                                                                "contain",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Inventory2Outlined
                                                                        sx={{
                                                                            color: "#bbb",
                                                                            fontSize: 21,
                                                                        }}
                                                                    />
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
                                                                        fontWeight: 700,
                                                                        color: "#222",
                                                                        maxWidth: 300,
                                                                        overflow:
                                                                            "hidden",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                        whiteSpace:
                                                                            "nowrap",
                                                                    }}
                                                                >
                                                                    {product.name ||
                                                                        "بدون نام"}
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        mt: 0.45,
                                                                        fontSize: 9,
                                                                        color: "#aaa",
                                                                        direction:
                                                                            "ltr",
                                                                        textAlign:
                                                                            "right",
                                                                        maxWidth: 260,
                                                                        overflow:
                                                                            "hidden",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                        whiteSpace:
                                                                            "nowrap",
                                                                    }}
                                                                >
                                                                    {product.uuid ||
                                                                        `ID: ${product.id}`}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    {/* Brand */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 11,
                                                                color: "#555",
                                                            }}
                                                        >
                                                            {product.brand ||
                                                                "—"}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Price */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
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
                                                                    fontWeight: 700,
                                                                    color: "#222",
                                                                }}
                                                            >
                                                                {formatPrice(
                                                                    getPrice(
                                                                        product
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

                                                    {/* Stock */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                                color:
                                                                    stock <=
                                                                    0
                                                                        ? "#d32f2f"
                                                                        : stock <=
                                                                            5
                                                                          ? "#ed6c02"
                                                                          : "#333",
                                                            }}
                                                        >
                                                            {stock.toLocaleString(
                                                                "fa-IR"
                                                            )}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Status */}

                                                    <TableCell
                                                        sx={{
                                                            px: 2,
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
                                                                fontSize: 9,
                                                                fontWeight: 700,
                                                                minWidth: 65,
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
                                                                title="مشاهده"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/productDetail/${product.product_uuid}`
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
                                                                title="ویرایش"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/products/edit/${product.uuid}`
                                                                    )
                                                                }
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    color: "#777",

                                                                    "&:hover":
                                                                        {
                                                                            color: "#1976d2",
                                                                            bgcolor:
                                                                                "rgba(25,118,210,0.08)",
                                                                        },
                                                                }}
                                                            >
                                                                <EditOutlined
                                                                    sx={{
                                                                        fontSize: 18,
                                                                    }}
                                                                />
                                                            </IconButton>

                                                            <IconButton
                                                                size="small"
                                                                title="حذف"
                                                                onClick={() =>
                                                                    openDeleteDialog(
                                                                        product
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
                                filteredProducts.length
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
                                            "rtl",
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

            {/* ================= DELETE DIALOG ================= */}

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
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: 17,
                        fontWeight: 800,
                    }}
                >
                    حذف محصول
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#666",
                            lineHeight: 2,
                        }}
                    >
                        آیا مطمئن هستید که می‌خواهید محصول{" "}
                        <strong>
                            {
                                deleteDialog
                                    .product
                                    ?.name
                            }
                        </strong>{" "}
                        را حذف کنید؟
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 11,
                            color: "#d32f2f",
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
                            : "حذف محصول"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ================= SNACKBAR ================= */}

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