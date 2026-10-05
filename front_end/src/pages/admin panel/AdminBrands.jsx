import React, { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import {
    Add,
    Business,
    Close,
    Delete,
    Edit,
    Search,
    Visibility,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const AdminBrands = () => {
    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(true);

    const [selectedBrand, setSelectedBrand] = useState(null);

    const [viewDialog, setViewDialog] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);

    const [page, setPage] = useState(1);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const rowsPerPage = 8;

    // --------------------------------------------------
    // Fetch Brands
    // --------------------------------------------------

    const fetchBrands = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/brands`);

            if (!response.ok) {
                throw new Error("خطا در دریافت برندها");
            }

            const result = await response.json();

            let brandsData = [];

            if (Array.isArray(result)) {
                brandsData = result;
            } else if (Array.isArray(result?.data)) {
                brandsData = result.data;
            } else if (Array.isArray(result?.brands)) {
                brandsData = result.brands;
            } else if (Array.isArray(result?.data?.brands)) {
                brandsData = result.data.brands;
            }

            setBrands(brandsData);
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "دریافت برندها با خطا مواجه شد",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // --------------------------------------------------
    // Image URL
    // --------------------------------------------------

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (typeof image !== "string") {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("data:")
        ) {
            return image;
        }

        if (image.startsWith("/api/")) {
            return `${API_URL}${image}`;
        }

        if (image.startsWith("/")) {
            return `${API_URL}${image}`;
        }

        return `${API_URL}/api/image/${image}`;
    };

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    const getBrandId = (brand) => {
        return brand?.uuid || brand?.id;
    };

    const getProductCount = (brand) => {
        if (typeof brand?.product_count === "number") {
            return brand.product_count;
        }

        if (typeof brand?.products_count === "number") {
            return brand.products_count;
        }

        if (Array.isArray(brand?.products)) {
            return brand.products.length;
        }

        return 0;
    };

    // --------------------------------------------------
    // Search + Filter
    // --------------------------------------------------

    const filteredBrands = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return brands.filter((brand) => {
            const matchesSearch =
                !searchValue ||
                String(brand.name || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(brand.description || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(brand.uuid || "")
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "all" ||
                (brand.status || "active") === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [brands, search, statusFilter]);

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(filteredBrands.length / rowsPerPage)
    );

    const paginatedBrands = filteredBrands.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    // --------------------------------------------------
    // View
    // --------------------------------------------------

    const openViewDialog = (brand) => {
        setSelectedBrand(brand);
        setViewDialog(true);
    };

    const closeViewDialog = () => {
        setViewDialog(false);
        setSelectedBrand(null);
    };

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    const openDeleteDialog = (brand) => {
        setBrandToDelete(brand);
        setDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(false);
        setBrandToDelete(null);
    };

    const handleDelete = async () => {
        if (!brandToDelete) return;

        try {
            const brandId = getBrandId(brandToDelete);

            const response = await fetch(
                `${API_URL}/api/brands/${brandId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("خطا در حذف برند");
            }

            setBrands((prev) =>
                prev.filter(
                    (brand) => getBrandId(brand) !== brandId
                )
            );

            setSnackbar({
                open: true,
                message: "برند با موفقیت حذف شد",
                severity: "success",
            });
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "حذف برند با خطا مواجه شد",
                severity: "error",
            });
        } finally {
            closeDeleteDialog();
        }
    };

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <Box
            sx={{
                width: "100%",
                direction: "ltr",
            }}
        >
            {/* Header */}

            <Box
                sx={{
                    mb: 3,
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            color: "#111",
                            mb: 0.5,
                        }}
                    >
                        برندها
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777",
                        }}
                    >
                        مدیریت برندهای محصولات فروشگاه
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
                        navigate("/admin/brands/create")
                    }
                    sx={{
                        backgroundColor: "#D4AF37",
                        color: "#111",
                        fontWeight: 700,
                        px: 2.5,
                        py: 1.2,
                        borderRadius: 2,
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: "#c19b25",
                            boxShadow: "none",
                        },
                    }}
                >
                    افزودن برند
                </Button>
            </Box>

            {/* Filters */}

            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    backgroundColor: "#fff",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="جستجو در نام و توضیحات برند..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        sx={{
                            width: {
                                xs: "100%",
                                md: 380,
                            },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search
                                        sx={{
                                            color: "#888",
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Select
                        size="small"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        sx={{
                            minWidth: 150,
                            borderRadius: 2,
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
                    </Select>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777",
                            ml: "auto",
                        }}
                    >
                        {filteredBrands.length} برند
                    </Typography>
                </Box>
            </Paper>

            {/* Table */}

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 2,
                    overflowX: "auto",
                    backgroundColor: "#fff",
                }}
            >
                <Table
                    sx={{
                        minWidth: 900,
                        tableLayout: "fixed",
                    }}
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "#fafafa",
                            }}
                        >
                            <TableCell
                                sx={{
                                    width: 200,
                                    fontWeight: 700,
                                    textAlign: 'center'
                                }}
                            >
                                برند
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: 260,
                                    fontWeight: 700,
                                    textAlign: 'center'
                                }}
                            >
                                توضیحات
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: 140,
                                    fontWeight: 700,
                                    textAlign: 'center'
                                }}
                            >
                                تعداد محصولات
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: 120,
                                    fontWeight: 700,
                                    textAlign: 'center'
                                }}
                            >
                                وضعیت
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: 130,
                                    fontWeight: 700,
                                    textAlign: 'center'
                                }}
                            >
                                تاریخ ایجاد
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: 120,
                                    fontWeight: 700,
                                    textAlign: 'center'
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
                                    colSpan={6}
                                    align="center"
                                    sx={{
                                        py: 6,
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        در حال دریافت برندها...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : paginatedBrands.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={{
                                        py: 6,
                                    }}
                                >
                                    <Business
                                        sx={{
                                            fontSize: 42,
                                            color: "#bbb",
                                            mb: 1,
                                        }}
                                    />

                                    <Typography color="text.secondary">
                                        برندی پیدا نشد
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBrands.map((brand) => {
                                const status =
                                    brand.status || "active";

                                return (
                                    <TableRow
                                        key={getBrandId(brand)}
                                        hover
                                        sx={{
                                            height: 82,
                                            "&:last-child td": {
                                                borderBottom: 0,
                                            },
                                        }}
                                    >
                                        {/* Brand */}

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Avatar
                                                    variant="rounded"
                                                    src={getImageUrl(
                                                        brand.logo
                                                    )}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        flexShrink: 0,
                                                        backgroundColor:
                                                            "#f5f5f5",
                                                    }}
                                                >
                                                    <Business
                                                        sx={{
                                                            color: "#aaa",
                                                        }}
                                                    />
                                                </Avatar>

                                                <Box
                                                    sx={{
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                        noWrap
                                                        title={
                                                            brand.name ||
                                                            ""
                                                        }
                                                        sx={{
                                                            color: "#222",
                                                        }}
                                                    >
                                                        {brand.name ||
                                                            "-"}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        noWrap
                                                        sx={{
                                                            color: "#999",
                                                            display:
                                                                "block",
                                                            mt: 0.4,
                                                        }}
                                                    >
                                                        {brand.uuid ||
                                                            "-"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* Description */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                noWrap
                                                title={
                                                    brand.description ||
                                                    ""
                                                }
                                                sx={{
                                                    color: "#555",
                                                }}
                                            >
                                                {brand.description ||
                                                    "-"}
                                            </Typography>
                                        </TableCell>

                                        {/* Product Count */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                sx={{
                                                    color: "#333",
                                                }}
                                            >
                                                {getProductCount(
                                                    brand
                                                )}
                                            </Typography>
                                        </TableCell>

                                        {/* Status */}

                                        <TableCell>
                                            <Chip
                                                label={
                                                    status ===
                                                    "active"
                                                        ? "فعال"
                                                        : "غیرفعال"
                                                }
                                                size="small"
                                                sx={{
                                                    minWidth: 75,
                                                    backgroundColor:
                                                        status ===
                                                        "active"
                                                            ? "#e8f5e9"
                                                            : "#eeeeee",
                                                    color:
                                                        status ===
                                                        "active"
                                                            ? "#2e7d32"
                                                            : "#666",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>

                                        {/* Created At */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#555",
                                                }}
                                            >
                                                {brand.createdAt ||
                                                    brand.created_at ||
                                                    "-"}
                                            </Typography>
                                        </TableCell>

                                        {/* Actions */}

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 0.5,
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        openViewDialog(
                                                            brand
                                                        )
                                                    }
                                                    sx={{
                                                        color: "#555",
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/brands/edit/${getBrandId(
                                                                brand
                                                            )}`
                                                        )
                                                    }
                                                    sx={{
                                                        color: "#D4AF37",
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        openDeleteDialog(
                                                            brand
                                                        )
                                                    }
                                                    sx={{
                                                        color: "#d32f2f",
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}

            {filteredBrands.length > rowsPerPage && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 3,
                    }}
                >
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) =>
                            setPage(value)
                        }
                        sx={{
                            "& .MuiPaginationItem-root.Mui-selected":
                                {
                                    backgroundColor: "#D4AF37",
                                    color: "#111",
                                },

                            "& .MuiPaginationItem-root.Mui-selected:hover":
                                {
                                    backgroundColor: "#c19b25",
                                },
                        }}
                    />
                </Box>
            )}

            {/* View Dialog */}

            <Dialog
                open={viewDialog}
                onClose={closeViewDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: 700,
                    }}
                >
                    مشاهده برند

                    <IconButton onClick={closeViewDialog}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {selectedBrand && (
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Avatar
                                    variant="rounded"
                                    src={getImageUrl(
                                        selectedBrand.logo
                                    )}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: "#f5f5f5",
                                    }}
                                >
                                    <Business
                                        sx={{
                                            fontSize: 38,
                                            color: "#aaa",
                                        }}
                                    />
                                </Avatar>

                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {selectedBrand.name}
                                    </Typography>

                                    <Chip
                                        label={
                                            selectedBrand.status ===
                                            "inactive"
                                                ? "غیرفعال"
                                                : "فعال"
                                        }
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            backgroundColor:
                                                selectedBrand.status ===
                                                "inactive"
                                                    ? "#eeeeee"
                                                    : "#e8f5e9",
                                            color:
                                                selectedBrand.status ===
                                                "inactive"
                                                    ? "#666"
                                                    : "#2e7d32",
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#777",
                                    mb: 0.5,
                                }}
                            >
                                توضیحات
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#333",
                                    lineHeight: 2,
                                    mb: 2.5,
                                }}
                            >
                                {selectedBrand.description ||
                                    "توضیحی ثبت نشده است."}
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#888",
                                        }}
                                    >
                                        تعداد محصولات
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                    >
                                        {getProductCount(
                                            selectedBrand
                                        )}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#888",
                                        }}
                                    >
                                        تاریخ ایجاد
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                    >
                                        {selectedBrand.createdAt ||
                                            selectedBrand.created_at ||
                                            "-"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={closeViewDialog}
                        sx={{
                            color: "#555",
                        }}
                    >
                        بستن
                    </Button>

                    {selectedBrand && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => {
                                closeViewDialog();

                                navigate(
                                    `/admin/brands/edit/${getBrandId(
                                        selectedBrand
                                    )}`
                                );
                            }}
                            sx={{
                                backgroundColor: "#D4AF37",
                                color: "#111",
                                fontWeight: 700,
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#c19b25",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            ویرایش برند
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}

            <Dialog
                open={deleteDialog}
                onClose={closeDeleteDialog}
            >
                <DialogTitle fontWeight={700}>
                    حذف برند
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        آیا از حذف برند{" "}
                        <strong>
                            {brandToDelete?.name}
                        </strong>{" "}
                        مطمئن هستید؟
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={closeDeleteDialog}
                        sx={{
                            color: "#555",
                        }}
                    >
                        انصراف
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        حذف برند
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminBrands;