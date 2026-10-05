import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    Alert,
    Avatar,
    Divider,
} from "@mui/material";

import {
    Search,
    Add,
    Edit,
    Delete,
    Visibility,
    Article as ArticleIcon,
    Close,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const AdminArticles = () => {
    const navigate = useNavigate();

    const [articles, setArticles] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [loading, setLoading] = useState(true);

    const [selectedArticle, setSelectedArticle] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    const [viewDialog, setViewDialog] = useState(false);

    const [page, setPage] = useState(1);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const rowsPerPage = 8;

    // --------------------------------------------------
    // Fetch Articles
    // --------------------------------------------------

    const fetchArticles = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/articles`);

            if (!response.ok) {
                throw new Error("خطا در دریافت مقالات");
            }

            const result = await response.json();

            let articlesData = [];

            if (Array.isArray(result)) {
                articlesData = result;
            } else if (Array.isArray(result?.data)) {
                articlesData = result.data;
            } else if (Array.isArray(result?.articles)) {
                articlesData = result.articles;
            } else if (Array.isArray(result?.data?.articles)) {
                articlesData = result.data.articles;
            }

            setArticles(articlesData);
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "دریافت مقالات با خطا مواجه شد",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
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
    // Categories
    // --------------------------------------------------

    const categories = useMemo(() => {
        const values = articles
            .map((article) => article.category)
            .filter(Boolean);

        return [...new Set(values)];
    }, [articles]);

    // --------------------------------------------------
    // Search + Filter
    // --------------------------------------------------

    const filteredArticles = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return articles.filter((article) => {
            const matchesSearch =
                !searchValue ||
                String(article.title || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(article.category || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(article.author || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(article.excerpt || "")
                    .toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                categoryFilter === "all" ||
                article.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [articles, search, categoryFilter]);

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(filteredArticles.length / rowsPerPage)
    );

    const paginatedArticles = filteredArticles.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    useEffect(() => {
        setPage(1);
    }, [search, categoryFilter]);

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    const openDeleteDialog = (article) => {
        setArticleToDelete(article);
        setDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(false);
        setArticleToDelete(null);
    };

    const handleDelete = async () => {
        if (!articleToDelete) return;

        try {
            const articleId = articleToDelete.id;

            const response = await fetch(
                `${API_URL}/api/articles/${articleId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("خطا در حذف مقاله");
            }

            setArticles((prev) =>
                prev.filter((article) => article.id !== articleId)
            );

            setSnackbar({
                open: true,
                message: "مقاله با موفقیت حذف شد",
                severity: "success",
            });
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "حذف مقاله با خطا مواجه شد",
                severity: "error",
            });
        } finally {
            closeDeleteDialog();
        }
    };

    // --------------------------------------------------
    // View
    // --------------------------------------------------

    const openViewDialog = (article) => {
        setSelectedArticle(article);
        setViewDialog(true);
    };

    const closeViewDialog = () => {
        setViewDialog(false);
        setSelectedArticle(null);
    };

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    const getContent = (article) => {
        if (!Array.isArray(article?.content)) {
            return [];
        }

        return article.content;
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
                        مقالات
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777",
                        }}
                    >
                        مدیریت مقالات فروشگاه
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/articles/create")}
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
                    افزودن مقاله
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
                        placeholder="جستجو در عنوان، دسته‌بندی، نویسنده..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                        displayEmpty
                        sx={{
                            minWidth: 180,
                            borderRadius: 2,
                        }}
                    >
                        <MenuItem value="all">
                            همه دسته‌بندی‌ها
                        </MenuItem>

                        {categories.map((category) => (
                            <MenuItem
                                key={category}
                                value={category}
                            >
                                {category}
                            </MenuItem>
                        ))}
                    </Select>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777",
                            ml: "auto",
                        }}
                    >
                        {filteredArticles.length} مقاله
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
                        <TableRow sx={{ backgroundColor: "#fafafa" }}>

                            <TableCell sx={{ width: 200, fontWeight: 700, textAlign: 'center' }}>
                                مقاله
                            </TableCell>

                            <TableCell sx={{ width: 170, fontWeight: 700, textAlign: 'center' }}>
                                دسته‌بندی
                            </TableCell>

                            <TableCell sx={{ width: 150, fontWeight: 700, textAlign: 'center' }}>
                                نویسنده
                            </TableCell>

                            <TableCell sx={{ width: 150, fontWeight: 700, textAlign: 'center' }}>
                                زمان مطالعه
                            </TableCell>

                            <TableCell sx={{ width: 130, fontWeight: 700, textAlign: 'center' }}>
                                تاریخ
                            </TableCell>

                            <TableCell sx={{ width: 110, fontWeight: 700, textAlign: 'center' }}>
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
                                    sx={{ py: 6 }}
                                >
                                    <Typography color="text.secondary">
                                        در حال دریافت مقالات...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : paginatedArticles.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    <ArticleIcon
                                        sx={{
                                            fontSize: 42,
                                            color: "#bbb",
                                            mb: 1,
                                        }}
                                    />

                                    <Typography color="text.secondary">
                                        مقاله‌ای پیدا نشد
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedArticles.map((article) => (
                                <TableRow
                                    key={article.id}
                                    hover
                                    sx={{
                                        height: 86,
                                        "&:last-child td": {
                                            borderBottom: 0,
                                        },
                                    }}
                                >
                                    {/* Article */}

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
                                                    article.main_image
                                                )}
                                                sx={{
                                                    width: 54,
                                                    height: 54,
                                                    flexShrink: 0,
                                                    backgroundColor: "#f5f5f5",
                                                }}
                                            >
                                                <ArticleIcon
                                                    sx={{
                                                        color: "#aaa",
                                                    }}
                                                />
                                            </Avatar>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                    noWrap
                                                    title={article.title || ""}
                                                    sx={{
                                                        color: "#222",
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {article.title || "-"}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    noWrap
                                                    title={article.excerpt || ""}
                                                    sx={{
                                                        color: "#888",
                                                        display: "block",
                                                    }}
                                                >
                                                    {article.excerpt || "-"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Category */}

                                    <TableCell>
                                        <Chip
                                            label={article.category || "-"}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#f7f0d8",
                                                color: "#8a6d13",
                                                fontWeight: 600,
                                                maxWidth: 150,
                                            }}
                                        />
                                    </TableCell>

                                    {/* Author */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            noWrap
                                            title={article.author || ""}
                                        >
                                            {article.author || "-"}
                                        </Typography>
                                    </TableCell>

                                    {/* Reading Time */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#555",
                                            }}
                                        >
                                            {article.reading_time || "-"}
                                        </Typography>
                                    </TableCell>

                                    {/* Date */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#555",
                                            }}
                                        >
                                            {article.date || "-"}
                                        </Typography>
                                    </TableCell>

                                    {/* Actions */}

                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    openViewDialog(article)
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
                                                        `/admin/articles/edit/${article.id}`
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
                                                    openDeleteDialog(article)
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}

            {filteredArticles.length > rowsPerPage && (
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
                        onChange={(_, value) => setPage(value)}
                        color="primary"
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
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: 700,
                    }}
                >
                    مشاهده مقاله

                    <IconButton onClick={closeViewDialog}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {selectedArticle && (
                        <Box>
                            {/* Image */}

                            {selectedArticle.main_image && (
                                <Box
                                    component="img"
                                    src={getImageUrl(
                                        selectedArticle.main_image
                                    )}
                                    alt={
                                        selectedArticle.title || ""
                                    }
                                    sx={{
                                        width: "100%",
                                        maxHeight: 320,
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        mb: 3,
                                    }}
                                />
                            )}

                            {/* Title */}

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{
                                    color: "#111",
                                    mb: 2,
                                }}
                            >
                                {selectedArticle.title}
                            </Typography>

                            {/* Meta */}

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                    mb: 2,
                                }}
                            >
                                <Chip
                                    label={
                                        selectedArticle.category
                                    }
                                    size="small"
                                />

                                <Chip
                                    label={
                                        selectedArticle.author
                                    }
                                    size="small"
                                />

                                <Chip
                                    label={selectedArticle.date}
                                    size="small"
                                />

                                <Chip
                                    label={
                                        selectedArticle.reading_time
                                    }
                                    size="small"
                                />
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/* Excerpt */}

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#555",
                                    lineHeight: 2,
                                    mb: 3,
                                    fontWeight: 500,
                                }}
                            >
                                {selectedArticle.excerpt}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            {/* Content */}

                            {getContent(selectedArticle).map(
                                (block, index) => {
                                    if (
                                        block.type === "heading"
                                    ) {
                                        return (
                                            <Typography
                                                key={index}
                                                variant="h6"
                                                fontWeight={700}
                                                sx={{
                                                    color: "#222",
                                                    mt: 3,
                                                    mb: 1.5,
                                                }}
                                            >
                                                {block.text}
                                            </Typography>
                                        );
                                    }

                                    if (
                                        block.type ===
                                        "paragraph"
                                    ) {
                                        return (
                                            <Typography
                                                key={index}
                                                variant="body1"
                                                sx={{
                                                    color: "#555",
                                                    lineHeight: 2.1,
                                                    mb: 2,
                                                }}
                                            >
                                                {block.text}
                                            </Typography>
                                        );
                                    }

                                    return null;
                                }
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2,
                    }}
                >
                    <Button
                        onClick={closeViewDialog}
                        sx={{
                            color: "#555",
                        }}
                    >
                        بستن
                    </Button>

                    {selectedArticle && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => {
                                closeViewDialog();

                                navigate(
                                    `/admin/articles/edit/${selectedArticle.id}`
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
                            ویرایش مقاله
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}

            <Dialog
                open={deleteDialog}
                onClose={closeDeleteDialog}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    حذف مقاله
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        آیا از حذف مقاله
                        {" "}
                        <strong>
                            {articleToDelete?.title}
                        </strong>
                        {" "}
                        مطمئن هستید؟
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2,
                    }}
                >
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
                        حذف مقاله
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

export default AdminArticles;