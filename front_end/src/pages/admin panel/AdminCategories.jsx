import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Pagination,
    Select,
    Snackbar,
    Alert,
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
    DeleteOutline,
    EditOutlined,
    Search,
    CategoryOutlined,
    VisibilityOutlined,
    Refresh,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";
const gold = "#D4AF37";

const AdminCategories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [viewDialog, setViewDialog] = useState(false);
    const [viewCategory, setViewCategory] = useState(null);

    const [page, setPage] = useState(1);
    const rowsPerPage = 8;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // -----------------------------------------
    // Helpers
    // -----------------------------------------

    const getCategoryId = (category) => {
        return (
            category?.uuid ||
            category?.category_uuid ||
            category?.id ||
            category?._id
        );
    };

    const getCategoryName = (category) => {
        return category?.name || category?.title || "بدون نام";
    };

    const getCategoryDescription = (category) => {
        return category?.description || category?.desc || "-";
    };

    const getCategoryStatus = (category) => {
        const status =
            category?.status ||
            category?.category_status ||
            "active";

        return String(status).toLowerCase();
    };

    const getProductCount = (category) => {
        if (typeof category?.product_count === "number") {
            return category.product_count;
        }

        if (typeof category?.products_count === "number") {
            return category.products_count;
        }

        if (Array.isArray(category?.products)) {
            return category.products.length;
        }

        if (
            category?._count &&
            typeof category._count.products === "number"
        ) {
            return category._count.products;
        }

        return 0;
    };

    const getCreatedDate = (category) => {
        const date =
            category?.createdAt ||
            category?.created_at ||
            category?.date;

        if (!date) return "-";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("fa-IR");
    };

    const getStatusLabel = (category) => {
        const status = getCategoryStatus(category);

        if (
            status === "active" ||
            status === "enabled" ||
            status === "1"
        ) {
            return "فعال";
        }

        return "غیرفعال";
    };

    const isActive = (category) => {
        const status = getCategoryStatus(category);

        return (
            status === "active" ||
            status === "enabled" ||
            status === "1"
        );
    };

    // -----------------------------------------
    // Snackbar
    // -----------------------------------------

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    // -----------------------------------------
    // Fetch Categories
    // -----------------------------------------

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/categories`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch categories"
                );
            }

            const data = await response.json();

            const categoryList =
                data?.categories ||
                data?.data ||
                data ||
                [];

            setCategories(
                Array.isArray(categoryList)
                    ? categoryList
                    : []
            );
        } catch (error) {
            console.error(
                "Categories fetch error:",
                error
            );

            setCategories([]);

            showSnackbar(
                "دریافت دسته‌بندی‌ها با خطا مواجه شد",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // -----------------------------------------
    // Delete
    // -----------------------------------------

    const openDeleteDialog = (category) => {
        setSelectedCategory(category);
        setDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        if (deleting) return;

        setDeleteDialog(false);
        setSelectedCategory(null);
    };

    const deleteCategory = async () => {
        if (!selectedCategory) return;

        const categoryId =
            getCategoryId(selectedCategory);

        if (!categoryId) {
            showSnackbar(
                "شناسه دسته‌بندی پیدا نشد",
                "error"
            );
            return;
        }

        try {
            setDeleting(true);

            const response = await fetch(
                `${API_URL}/api/categories/${categoryId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            setCategories((prev) =>
                prev.filter(
                    (category) =>
                        getCategoryId(category) !==
                        categoryId
                )
            );

            showSnackbar(
                "دسته‌بندی با موفقیت حذف شد"
            );

            setDeleteDialog(false);
            setSelectedCategory(null);
        } catch (error) {
            console.error(
                "Delete category error:",
                error
            );

            showSnackbar(
                "حذف دسته‌بندی با خطا مواجه شد",
                "error"
            );
        } finally {
            setDeleting(false);
        }
    };

    // -----------------------------------------
    // View
    // -----------------------------------------

    const openViewDialog = (category) => {
        setViewCategory(category);
        setViewDialog(true);
    };

    const closeViewDialog = () => {
        setViewDialog(false);
        setViewCategory(null);
    };

    // -----------------------------------------
    // Filtering
    // -----------------------------------------

    const filteredCategories = useMemo(() => {
        const searchValue =
            search.trim().toLowerCase();

        return categories.filter((category) => {
            const name =
                getCategoryName(category).toLowerCase();

            const uuid = String(
                getCategoryId(category) || ""
            ).toLowerCase();

            const description =
                getCategoryDescription(
                    category
                ).toLowerCase();

            const status =
                getCategoryStatus(category);

            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                uuid.includes(searchValue) ||
                description.includes(searchValue);

            let matchesStatus = true;

            if (statusFilter === "active") {
                matchesStatus =
                    status === "active" ||
                    status === "enabled" ||
                    status === "1";
            }

            if (statusFilter === "inactive") {
                matchesStatus =
                    status === "inactive" ||
                    status === "disabled" ||
                    status === "0";
            }

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        categories,
        search,
        statusFilter,
    ]);

    // -----------------------------------------
    // Pagination
    // -----------------------------------------

    const totalPages = Math.ceil(
        filteredCategories.length /
            rowsPerPage
    );

    const paginatedCategories =
        filteredCategories.slice(
            (page - 1) * rowsPerPage,
            page * rowsPerPage
        );

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    // -----------------------------------------
    // Render
    // -----------------------------------------

    return (
        <Box
            sx={{
                width: "100%",
                direction: "ltr",
                minWidth: 0,
            }}
        >
            {/* Header */}

            <Box
                sx={{
                    mb: 2.5,
                    width: "100%",
                    display: "flex",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    justifyContent: "space-between",
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
                        textAlign: "left",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 22,
                                md: 26,
                            },
                            fontWeight: 800,
                            color: "#111",
                        }}
                    >
                        دسته‌بندی‌ها
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            color: "#777",
                            fontSize: 14,
                        }}
                    >
                        مدیریت دسته‌بندی محصولات
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
                        navigate(
                            "/admin/categories/create"
                        )
                    }
                    sx={{
                        backgroundColor: gold,
                        color: "#111",
                        fontWeight: 700,
                        px: 2.5,
                        py: 1.2,
                        borderRadius: 2,
                        minWidth: 170,
                        whiteSpace: "nowrap",
                        "&:hover": {
                            backgroundColor:
                                "#b99524",
                        },
                    }}
                >
                    افزودن دسته‌بندی
                </Button>
            </Box>

            {/* Filters */}

            <Box
                sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                }}
            >
                <TextField
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="جستجوی دسته‌بندی..."
                    size="small"
                    sx={{
                        flex: 1,
                        minWidth: {
                            xs: "100%",
                            sm: 250,
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            backgroundColor: "#fafafa",
                        },
                        "& .MuiInputBase-input": {
                            fontSize: 13,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <Search
                                sx={{
                                    color: "#888",
                                    mr: 1,
                                }}
                            />
                        ),
                    }}
                />

                <Select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                    size="small"
                    sx={{
                        minWidth: 150,
                        borderRadius: 1.5,
                        backgroundColor: "#fafafa",
                        fontSize: 13,
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

                <IconButton
                    onClick={fetchCategories}
                    disabled={loading}
                    sx={{
                        border: "1px solid #e5e5e5",
                        borderRadius: 1.5,
                        width: 40,
                        height: 40,
                        color: "#555",
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={18}
                            sx={{ color: gold }}
                        />
                    ) : (
                        <Refresh fontSize="small" />
                    )}
                </IconButton>
            </Box>

            {/* Table */}

            <TableContainer
                sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 2,
                    overflowX: "auto",
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
                                backgroundColor:
                                    "#fafafa",
                            }}
                        >
                            <TableCell
                                sx={{
                                    width: "14%",
                                    fontWeight: 800,
                                    color: "#333",
                                    textAlign: "center",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                عملیات
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: "14%",
                                    fontWeight: 800,
                                    color: "#333",
                                    textAlign: "center",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                تاریخ ایجاد
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: "14%",
                                    fontWeight: 800,
                                    color: "#333",
                                    textAlign: "center",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                وضعیت
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: "18%",
                                    fontWeight: 800,
                                    color: "#333",
                                    textAlign: "center",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                تعداد محصولات
                            </TableCell>

                            <TableCell
                                sx={{
                                    width: "40%",
                                    fontWeight: 800,
                                    color: "#333",
                                    textAlign: "left",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                دسته‌بندی
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    sx={{
                                        py: 8,
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <CircularProgress
                                        size={30}
                                        sx={{
                                            color: gold,
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            mt: 1.5,
                                            color: "#777",
                                            fontSize: 13,
                                        }}
                                    >
                                        در حال دریافت
                                        دسته‌بندی‌ها...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : paginatedCategories.length ===
                          0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    sx={{
                                        py: 7,
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <CategoryOutlined
                                        sx={{
                                            fontSize: 42,
                                            color: "#ccc",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            mt: 1,
                                            color: "#777",
                                            fontSize: 14,
                                        }}
                                    >
                                        دسته‌بندی‌ای
                                        پیدا نشد
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCategories.map(
                                (category) => {
                                    const categoryId =
                                        getCategoryId(
                                            category
                                        );

                                    const active =
                                        isActive(
                                            category
                                        );

                                    return (
                                        <TableRow
                                            key={
                                                categoryId
                                            }
                                            hover
                                            sx={{
                                                height: 76,
                                                "&:last-child td":
                                                    {
                                                        borderBottom:
                                                            0,
                                                    },
                                            }}
                                        >
                                            {/* عملیات */}

                                            <TableCell
                                                sx={{
                                                    textAlign:
                                                        "center",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems:
                                                            "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            openViewDialog(
                                                                category
                                                            )
                                                        }
                                                        sx={{
                                                            color: "#666",
                                                            "&:hover":
                                                                {
                                                                    backgroundColor:
                                                                        "#f5f5f5",
                                                                },
                                                        }}
                                                    >
                                                        <VisibilityOutlined fontSize="small" />
                                                    </IconButton>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/categories/edit/${categoryId}`
                                                            )
                                                        }
                                                        sx={{
                                                            color: "#555",
                                                            "&:hover":
                                                                {
                                                                    color: gold,
                                                                    backgroundColor:
                                                                        "#fffaf0",
                                                                },
                                                        }}
                                                    >
                                                        <EditOutlined fontSize="small" />
                                                    </IconButton>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            openDeleteDialog(
                                                                category
                                                            )
                                                        }
                                                        sx={{
                                                            color: "#d32f2f",
                                                            "&:hover":
                                                                {
                                                                    backgroundColor:
                                                                        "#fff5f5",
                                                                },
                                                        }}
                                                    >
                                                        <DeleteOutline fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>

                                            {/* تاریخ */}

                                            <TableCell
                                                sx={{
                                                    textAlign:
                                                        "center",
                                                    color: "#666",
                                                    fontSize: 12,
                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {getCreatedDate(
                                                    category
                                                )}
                                            </TableCell>

                                            {/* وضعیت */}

                                            <TableCell
                                                sx={{
                                                    textAlign:
                                                        "center",
                                                }}
                                            >
                                                <Chip
                                                    label={getStatusLabel(
                                                        category
                                                    )}
                                                    size="small"
                                                    sx={{
                                                        minWidth: 70,
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        backgroundColor:
                                                            active
                                                                ? "#e8f5e9"
                                                                : "#f5f5f5",
                                                        color:
                                                            active
                                                                ? "#2e7d32"
                                                                : "#777",
                                                    }}
                                                />
                                            </TableCell>

                                            {/* تعداد محصولات */}

                                            <TableCell
                                                sx={{
                                                    textAlign:
                                                        "center",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: "#333",
                                                    }}
                                                >
                                                    {getProductCount(
                                                        category
                                                    )}
                                                </Typography>
                                            </TableCell>

                                            {/* دسته‌بندی */}

                                            <TableCell
                                                sx={{
                                                    textAlign:
                                                        "left",
                                                    overflow:
                                                        "hidden",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1.5,
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 42,
                                                            height: 42,
                                                            minWidth: 42,
                                                            borderRadius:
                                                                1.5,
                                                            backgroundColor:
                                                                "#fffaf0",
                                                            border: "1px solid #eee2bf",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <CategoryOutlined
                                                            sx={{
                                                                color: gold,
                                                                fontSize: 22,
                                                            }}
                                                        />
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 13,
                                                                fontWeight: 700,
                                                                color: "#222",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {getCategoryName(
                                                                category
                                                            )}
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
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {String(
                                                                categoryId ||
                                                                    "-"
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}

            {!loading &&
                filteredCategories.length >
                    rowsPerPage && (
                    <Box
                        sx={{
                            mt: 2.5,
                            display: "flex",
                            justifyContent:
                                "center",
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) =>
                                setPage(value)
                            }
                            shape="rounded"
                            sx={{
                                "& .MuiPaginationItem-root.Mui-selected":
                                    {
                                        backgroundColor:
                                            gold,
                                        color: "#111",
                                        fontWeight: 700,
                                    },
                                "& .MuiPaginationItem-root:hover":
                                    {
                                        backgroundColor:
                                            "#f8efd2",
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
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        direction: "ltr",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        textAlign: "left",
                        borderBottom:
                            "1px solid #eee",
                    }}
                >
                    جزئیات دسته‌بندی
                </DialogTitle>

                <DialogContent sx={{ pt: 3 }}>
                    {viewCategory && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection:
                                    "column",
                                gap: 2,
                            }}
                        >
                            <InfoItem
                                label="نام دسته‌بندی"
                                value={getCategoryName(
                                    viewCategory
                                )}
                            />

                            <InfoItem
                                label="شناسه"
                                value={String(
                                    getCategoryId(
                                        viewCategory
                                    ) || "-"
                                )}
                                ltr
                            />

                            <InfoItem
                                label="توضیحات"
                                value={getCategoryDescription(
                                    viewCategory
                                )}
                            />

                            <InfoItem
                                label="تعداد محصولات"
                                value={String(
                                    getProductCount(
                                        viewCategory
                                    )
                                )}
                            />

                            <InfoItem
                                label="وضعیت"
                                value={getStatusLabel(
                                    viewCategory
                                )}
                            />

                            <InfoItem
                                label="تاریخ ایجاد"
                                value={getCreatedDate(
                                    viewCategory
                                )}
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                        justifyContent:
                            "flex-start",
                    }}
                >
                    <Button
                        onClick={closeViewDialog}
                        sx={{
                            color: "#555",
                            fontWeight: 600,
                        }}
                    >
                        بستن
                    </Button>

                    {viewCategory && (
                        <Button
                            variant="contained"
                            startIcon={
                                <EditOutlined />
                            }
                            onClick={() =>
                                navigate(
                                    `/admin/categories/edit/${getCategoryId(
                                        viewCategory
                                    )}`
                                )
                            }
                            sx={{
                                backgroundColor: gold,
                                color: "#111",
                                fontWeight: 700,
                                "&:hover": {
                                    backgroundColor:
                                        "#b99524",
                                },
                            }}
                        >
                            ویرایش
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}

            <Dialog
                open={deleteDialog}
                onClose={closeDeleteDialog}
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
                        fontWeight: 800,
                        textAlign: "left",
                    }}
                >
                    حذف دسته‌بندی
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{
                            color: "#555",
                            lineHeight: 1.9,
                            textAlign: "left",
                            fontSize: 14,
                        }}
                    >
                        آیا مطمئن هستید که می‌خواهید
                        دسته‌بندی{" "}
                        <strong>
                            {selectedCategory
                                ? getCategoryName(
                                      selectedCategory
                                  )
                                : ""}
                        </strong>{" "}
                        را حذف کنید؟
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.5,
                            color: "#d32f2f",
                            fontSize: 12,
                            lineHeight: 1.8,
                            textAlign: "left",
                        }}
                    >
                        در صورت وجود محصول مرتبط،
                        ممکن است حذف دسته‌بندی توسط
                        سرور انجام نشود.
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                        justifyContent:
                            "flex-start",
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={closeDeleteDialog}
                        disabled={deleting}
                        sx={{
                            color: "#555",
                            fontWeight: 600,
                        }}
                    >
                        انصراف
                    </Button>

                    <Button
                        onClick={deleteCategory}
                        variant="contained"
                        disabled={deleting}
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    size={16}
                                    sx={{
                                        color: "#fff",
                                    }}
                                />
                            ) : (
                                <DeleteOutline />
                            )
                        }
                        sx={{
                            backgroundColor:
                                "#d32f2f",
                            color: "#fff",
                            fontWeight: 700,
                            minWidth: 80,
                            "&:hover": {
                                backgroundColor:
                                    "#b71c1c",
                            },
                        }}
                    >
                        {deleting
                            ? "در حال حذف..."
                            : "حذف"}
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

// -----------------------------------------
// Info Item
// -----------------------------------------

const InfoItem = ({
    label,
    value,
    ltr = false,
}) => {
    return (
        <Box
            sx={{
                p: 1.5,
                border: "1px solid #eee",
                borderRadius: 2,
                backgroundColor: "#fafafa",
            }}
        >
            <Typography
                sx={{
                    fontSize: 11,
                    color: "#999",
                    mb: 0.5,
                    textAlign: "left",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#333",
                    textAlign: "left",
                    direction: ltr
                        ? "ltr"
                        : "inherit",
                    wordBreak: ltr
                        ? "break-all"
                        : "normal",
                }}
            >
                {value || "-"}
            </Typography>
        </Box>
    );
};

export default AdminCategories;