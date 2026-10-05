import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    Snackbar,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";

import {
    ArrowBackRounded,
    CloudUploadRounded,
    DeleteOutlineRounded,
    SaveRounded,
    AddRounded,
    DragHandleRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const gold = "#D4AF37";

export default function AdminArticleCreate() {
    const navigate = useNavigate();

    // =========================
    // FORM
    // =========================

    const [form, setForm] = useState({
        title: "",
        category: "",
        author: "برج طلایی",
        reading_time: "",
        excerpt: "",
        main_image: null,
        main_image_preview: "",
        content: [
            {
                type: "paragraph",
                text: "",
            },
        ],
    });

    // =========================
    // STATES
    // =========================

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] =
        useState(true);

    const [errors, setErrors] = useState({});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // =========================
    // TOKEN
    // =========================

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("access_token") ||
            ""
        );
    };

    // =========================
    // LOAD CATEGORIES
    // =========================

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);

                const token = getToken();

                const response = await axios.get(
                    `${API_URL}/api/categories`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    response.data?.categories ||
                    response.data?.data ||
                    response.data ||
                    [];

                setCategories(
                    Array.isArray(data) ? data : []
                );
            } catch (error) {
                console.error(
                    "Fetch categories error:",
                    error
                );

                setSnackbar({
                    open: true,
                    message:
                        "دریافت دسته‌بندی‌ها با خطا مواجه شد.",
                    severity: "error",
                });
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // =========================
    // CLEANUP IMAGE PREVIEW
    // =========================

    useEffect(() => {
        return () => {
            if (form.main_image_preview) {
                URL.revokeObjectURL(
                    form.main_image_preview
                );
            }
        };
    }, [form.main_image_preview]);

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // =========================
    // IMAGE CHANGE
    // =========================

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setSnackbar({
                open: true,
                message:
                    "فایل تصویر باید یک تصویر معتبر باشد.",
                severity: "error",
            });

            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message:
                    "حجم تصویر نباید بیشتر از ۵ مگابایت باشد.",
                severity: "error",
            });

            event.target.value = "";
            return;
        }

        if (form.main_image_preview) {
            URL.revokeObjectURL(
                form.main_image_preview
            );
        }

        const preview =
            URL.createObjectURL(file);

        setForm((prev) => ({
            ...prev,
            main_image: file,
            main_image_preview: preview,
        }));

        setErrors((prev) => ({
            ...prev,
            main_image: "",
        }));
    };

    // =========================
    // REMOVE IMAGE
    // =========================

    const handleRemoveImage = () => {
        if (form.main_image_preview) {
            URL.revokeObjectURL(
                form.main_image_preview
            );
        }

        setForm((prev) => ({
            ...prev,
            main_image: null,
            main_image_preview: "",
        }));
    };

    // =========================
    // CONTENT CHANGE
    // =========================

    const handleContentChange = (
        index,
        value
    ) => {
        setForm((prev) => {
            const content = [...prev.content];

            content[index] = {
                ...content[index],
                text: value,
            };

            return {
                ...prev,
                content,
            };
        });
    };

    // =========================
    // CONTENT TYPE CHANGE
    // =========================

    const handleContentTypeChange = (
        index,
        value
    ) => {
        setForm((prev) => {
            const content = [...prev.content];

            content[index] = {
                ...content[index],
                type: value,
            };

            return {
                ...prev,
                content,
            };
        });
    };

    // =========================
    // ADD CONTENT
    // =========================

    const addContent = (type = "paragraph") => {
        setForm((prev) => ({
            ...prev,
            content: [
                ...prev.content,
                {
                    type,
                    text: "",
                },
            ],
        }));
    };

    // =========================
    // REMOVE CONTENT
    // =========================

    const removeContent = (index) => {
        setForm((prev) => {
            if (prev.content.length === 1) {
                return {
                    ...prev,
                    content: [
                        {
                            type: "paragraph",
                            text: "",
                        },
                    ],
                };
            }

            return {
                ...prev,
                content: prev.content.filter(
                    (_, i) => i !== index
                ),
            };
        });
    };

    // =========================
    // VALIDATION
    // =========================

    const validateForm = () => {
        const newErrors = {};

        if (!form.title.trim()) {
            newErrors.title =
                "عنوان مقاله الزامی است.";
        } else if (
            form.title.trim().length < 5
        ) {
            newErrors.title =
                "عنوان مقاله باید حداقل ۵ کاراکتر باشد.";
        }

        if (!form.category) {
            newErrors.category =
                "دسته‌بندی مقاله را انتخاب کنید.";
        }

        if (!form.author.trim()) {
            newErrors.author =
                "نام نویسنده الزامی است.";
        }

        if (!form.reading_time.trim()) {
            newErrors.reading_time =
                "زمان مطالعه را وارد کنید.";
        }

        if (!form.excerpt.trim()) {
            newErrors.excerpt =
                "خلاصه مقاله الزامی است.";
        }

        const hasContent = form.content.some(
            (item) => item.text.trim()
        );

        if (!hasContent) {
            newErrors.content =
                "حداقل یک بخش برای محتوای مقاله وارد کنید.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const token = getToken();

            const data = new FormData();

            data.append(
                "title",
                form.title.trim()
            );

            data.append(
                "category",
                form.category
            );

            data.append(
                "author",
                form.author.trim()
            );

            data.append(
                "reading_time",
                form.reading_time.trim()
            );

            data.append(
                "excerpt",
                form.excerpt.trim()
            );

            if (form.main_image) {
                data.append(
                    "main_image",
                    form.main_image
                );
            }

            const cleanedContent =
                form.content
                    .filter(
                        (item) =>
                            item.text.trim()
                    )
                    .map((item) => ({
                        type: item.type,
                        text: item.text.trim(),
                    }));

            data.append(
                "content",
                JSON.stringify(
                    cleanedContent
                )
            );

            await axios.post(
                `${API_URL}/api/articles`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    maxBodyLength: Infinity,
                }
            );

            setSnackbar({
                open: true,
                message:
                    "مقاله با موفقیت ایجاد شد.",
                severity: "success",
            });

            setTimeout(() => {
                navigate("/admin/articles");
            }, 1000);
        } catch (error) {
            console.error(
                "Create article error:",
                error
            );

            const serverMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "";

            setSnackbar({
                open: true,
                message:
                    serverMessage ||
                    "ایجاد مقاله با خطا مواجه شد.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // INPUT STYLE
    // =========================

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "#fafafa",
            minHeight: 48,

            "& fieldset": {
                borderColor: "#e4e4e4",
                transition:
                    "border-color 0.2s ease",
            },

            "&:hover fieldset": {
                borderColor: "#cfcfcf",
            },

            "&.Mui-focused fieldset": {
                borderColor: gold,
                borderWidth: 1,
            },
        },

        "& .MuiInputLabel-root": {
            fontSize: 12,
            color: "#777",
        },

        "& .MuiInputLabel-root.Mui-focused": {
            color: gold,
        },

        "& .MuiInputBase-input": {
            fontSize: 12,
            color: "#222",
        },

        "& textarea": {
            fontSize: 12,
            lineHeight: 1.9,
        },

        "& .MuiFormHelperText-root": {
            fontSize: 10,
            marginLeft: 0,
            marginRight: 0,
            lineHeight: 1.6,
        },

        "& .MuiSelect-select": {
            fontSize: 12,
            display: "flex",
            alignItems: "center",
        },
    };

    return (
        <Box
            sx={{
                width: "100%",
                direction: "ltr",
            }}
        >
            {/* ================= HEADER ================= */}

            <Box
                sx={{
                    mb: 3,
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
                        افزودن مقاله
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: 12,
                            color: "#888",
                        }}
                    >
                        ایجاد مقاله جدید برای بخش وبلاگ
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackRounded />
                    }
                    onClick={() =>
                        navigate(
                            "/admin/articles"
                        )
                    }
                    sx={{
                        minHeight: 42,
                        px: 2,
                        borderRadius: 2,
                        borderColor: "#ddd",
                        color: "#555",
                        fontSize: 12,
                        fontWeight: 700,

                        "&:hover": {
                            borderColor: gold,
                            color: gold,
                            bgcolor:
                                "rgba(212,175,55,0.04)",
                        },

                        "& .MuiButton-startIcon": {
                            marginLeft: 0.5,
                            marginRight: 0,
                        },
                    }}
                >
                    بازگشت به مقالات
                </Button>
            </Box>

            {/* ================= FORM ================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: "100%",
                }}
            >
                {/* ================= BASIC INFO ================= */}

                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 1100,
                        border:
                            "1px solid #e6e6e6",
                        borderRadius: 2.5,
                        bgcolor: "#fff",
                        overflow: "hidden",
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 2.5,
                            },
                            py: 1.8,
                            borderBottom:
                                "1px solid #eeeeee",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#222",
                            }}
                        >
                            اطلاعات مقاله
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.3,
                                fontSize: 10,
                                color: "#999",
                            }}
                        >
                            اطلاعات اصلی مقاله را وارد کنید.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                sm: 2.5,
                            },
                        }}
                    >
                        {/* TITLE */}

                        <TextField
                            fullWidth
                            label="عنوان مقاله"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="مثلاً راهنمای خرید اجاق گاز رومیزی"
                            error={Boolean(
                                errors.title
                            )}
                            helperText={
                                errors.title ||
                                "عنوان اصلی مقاله."
                            }
                            autoComplete="off"
                            sx={{
                                ...inputSx,
                                mb: 2.5,
                            }}
                        />

                        {/* CATEGORY + AUTHOR */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                },
                                gap: 2,
                                mb: 2.5,
                            }}
                        >
                            <TextField
                                select
                                fullWidth
                                label="دسته‌بندی"
                                name="category"
                                value={
                                    form.category
                                }
                                onChange={
                                    handleChange
                                }
                                error={Boolean(
                                    errors.category
                                )}
                                helperText={
                                    errors.category ||
                                    (categoriesLoading
                                        ? "در حال دریافت دسته‌بندی‌ها..."
                                        : "دسته‌بندی مقاله را انتخاب کنید.")
                                }
                                disabled={
                                    categoriesLoading
                                }
                                sx={inputSx}
                            >
                                {categories.map(
                                    (category) => {
                                        const value =
                                            category.uuid ||
                                            category.category_uuid ||
                                            category.id;

                                        const name =
                                            category.name ||
                                            category.title;

                                        return (
                                            <MenuItem
                                                key={
                                                    value
                                                }
                                                value={
                                                    value
                                                }
                                                sx={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                {name}
                                            </MenuItem>
                                        );
                                    }
                                )}
                            </TextField>

                            <TextField
                                fullWidth
                                label="نویسنده"
                                name="author"
                                value={
                                    form.author
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="مثلاً برج طلایی"
                                error={Boolean(
                                    errors.author
                                )}
                                helperText={
                                    errors.author ||
                                    "نام نویسنده مقاله."
                                }
                                sx={inputSx}
                            />
                        </Box>

                        {/* READING TIME */}

                        <TextField
                            fullWidth
                            label="زمان مطالعه"
                            name="reading_time"
                            value={
                                form.reading_time
                            }
                            onChange={handleChange}
                            placeholder="مثلاً ۵ دقیقه مطالعه"
                            error={Boolean(
                                errors.reading_time
                            )}
                            helperText={
                                errors.reading_time ||
                                "مثلاً ۵ دقیقه مطالعه"
                            }
                            sx={{
                                ...inputSx,
                                mb: 2.5,
                            }}
                        />

                        {/* EXCERPT */}

                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label="خلاصه مقاله"
                            name="excerpt"
                            value={
                                form.excerpt
                            }
                            onChange={handleChange}
                            placeholder="خلاصه کوتاهی از محتوای مقاله..."
                            error={Boolean(
                                errors.excerpt
                            )}
                            helperText={
                                errors.excerpt ||
                                "این متن در لیست مقالات نمایش داده می‌شود."
                            }
                            sx={{
                                ...inputSx,

                                "& .MuiOutlinedInput-root":
                                    {
                                        minHeight:
                                            "auto",
                                        alignItems:
                                            "flex-start",
                                        py: 1.2,
                                    },
                            }}
                        />
                    </Box>
                </Paper>

                {/* ================= IMAGE ================= */}

                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 1100,
                        border:
                            "1px solid #e6e6e6",
                        borderRadius: 2.5,
                        bgcolor: "#fff",
                        overflow: "hidden",
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 2.5,
                            },
                            py: 1.8,
                            borderBottom:
                                "1px solid #eeeeee",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#222",
                            }}
                        >
                            تصویر اصلی مقاله
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                sm: 2.5,
                            },
                        }}
                    >
                        {form.main_image_preview ? (
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 2,
                                    flexWrap:
                                        "wrap",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 220,
                                        height: 130,
                                        borderRadius: 2,
                                        border:
                                            "1px solid #ddd",
                                        overflow:
                                            "hidden",
                                        bgcolor:
                                            "#fafafa",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={
                                            form.main_image_preview
                                        }
                                        alt="Article preview"
                                        sx={{
                                            width:
                                                "100%",
                                            height:
                                                "100%",
                                            objectFit:
                                                "cover",
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize:
                                                12,
                                            fontWeight:
                                                700,
                                            color:
                                                "#333",
                                            mb: 0.5,
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {
                                            form
                                                .main_image
                                                ?.name
                                        }
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize:
                                                10,
                                            color:
                                                "#999",
                                            mb: 1.5,
                                        }}
                                    >
                                        {(
                                            form
                                                .main_image
                                                ?.size /
                                            1024 /
                                            1024
                                        ).toFixed(
                                            2
                                        )}{" "}
                                        MB
                                    </Typography>

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={
                                            <DeleteOutlineRounded />
                                        }
                                        onClick={
                                            handleRemoveImage
                                        }
                                        sx={{
                                            borderRadius:
                                                1.5,
                                            fontSize:
                                                11,
                                        }}
                                    >
                                        حذف تصویر
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={
                                    <CloudUploadRounded />
                                }
                                sx={{
                                    width: "100%",
                                    minHeight: 130,
                                    borderRadius: 2,
                                    borderStyle:
                                        "dashed",
                                    borderColor:
                                        "#d5d5d5",
                                    color: "#666",
                                    bgcolor: "#fafafa",
                                    fontSize: 12,
                                    fontWeight: 700,

                                    "&:hover": {
                                        borderColor:
                                            gold,
                                        color: gold,
                                        bgcolor:
                                            "rgba(212,175,55,0.04)",
                                    },
                                }}
                            >
                                انتخاب تصویر اصلی

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                />
                            </Button>
                        )}

                        <Typography
                            sx={{
                                mt: 1,
                                fontSize: 10,
                                color: "#999",
                            }}
                        >
                            تصویر شاخص مقاله — حداکثر حجم ۵ مگابایت.
                        </Typography>
                    </Box>
                </Paper>

                {/* ================= CONTENT ================= */}

                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 1100,
                        border:
                            "1px solid #e6e6e6",
                        borderRadius: 2.5,
                        bgcolor: "#fff",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 2.5,
                            },
                            py: 1.8,
                            borderBottom:
                                "1px solid #eeeeee",
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            gap: 2,
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
                                محتوای مقاله
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.3,
                                    fontSize: 10,
                                    color: "#999",
                                }}
                            >
                                محتوای مقاله را به صورت پاراگراف و عنوان وارد کنید.
                            </Typography>
                        </Box>

                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={
                                <AddRounded />
                            }
                            onClick={() =>
                                addContent(
                                    "paragraph"
                                )
                            }
                            sx={{
                                minHeight: 38,
                                borderRadius: 2,
                                borderColor:
                                    "#ddd",
                                color: "#555",
                                fontSize: 11,
                                fontWeight: 700,
                            }}
                        >
                            افزودن بخش
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                sm: 2.5,
                            },
                        }}
                    >
                        {form.content.map(
                            (item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position:
                                            "relative",
                                        mb:
                                            index ===
                                            form
                                                .content
                                                .length -
                                                1
                                                ? 0
                                                : 2,
                                        p: 2,
                                        border:
                                            "1px solid #e7e7e7",
                                        borderRadius: 2,
                                        bgcolor:
                                            "#fafafa",
                                    }}
                                >
                                    {/* BLOCK HEADER */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "space-between",
                                            mb: 1.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 0.8,
                                            }}
                                        >
                                            <DragHandleRounded
                                                sx={{
                                                    fontSize:
                                                        18,
                                                    color:
                                                        "#aaa",
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        11,
                                                    fontWeight:
                                                        700,
                                                    color:
                                                        "#666",
                                                }}
                                            >
                                                بخش{" "}
                                                {index +
                                                    1}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                gap: 1,
                                                alignItems:
                                                    "center",
                                            }}
                                        >
                                            <TextField
                                                select
                                                size="small"
                                                value={
                                                    item.type
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleContentTypeChange(
                                                        index,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                sx={{
                                                    width: 130,

                                                    "& .MuiOutlinedInput-root":
                                                        {
                                                            borderRadius:
                                                                1.5,
                                                            bgcolor:
                                                                "#fff",
                                                            minHeight:
                                                                36,
                                                        },

                                                    "& .MuiInputBase-input":
                                                        {
                                                            fontSize:
                                                                11,
                                                        },
                                                }}
                                            >
                                                <MenuItem
                                                    value="paragraph"
                                                    sx={{
                                                        fontSize:
                                                            11,
                                                    }}
                                                >
                                                    پاراگراف
                                                </MenuItem>

                                                <MenuItem
                                                    value="heading"
                                                    sx={{
                                                        fontSize:
                                                            11,
                                                    }}
                                                >
                                                    عنوان
                                                </MenuItem>
                                            </TextField>

                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    removeContent(
                                                        index
                                                    )
                                                }
                                                sx={{
                                                    color:
                                                        "#999",

                                                    "&:hover":
                                                        {
                                                            color:
                                                                "#d32f2f",
                                                            bgcolor:
                                                                "rgba(211,47,47,0.06)",
                                                        },
                                                }}
                                            >
                                                <DeleteOutlineRounded fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    {/* CONTENT TEXT */}

                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={
                                            item.type ===
                                            "heading"
                                                ? 2
                                                : 5
                                        }
                                        placeholder={
                                            item.type ===
                                            "heading"
                                                ? "عنوان بخش را وارد کنید..."
                                                : "متن پاراگراف را وارد کنید..."
                                        }
                                        value={
                                            item.text
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleContentChange(
                                                index,
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        error={
                                            Boolean(
                                                errors.content
                                            ) &&
                                            !item.text.trim()
                                        }
                                        sx={{
                                            ...inputSx,

                                            "& .MuiOutlinedInput-root":
                                                {
                                                    bgcolor:
                                                        "#fff",
                                                    minHeight:
                                                        "auto",
                                                    alignItems:
                                                        "flex-start",
                                                    py: 1.2,
                                                },

                                            ...(item.type ===
                                                "heading" && {
                                                "& .MuiInputBase-input":
                                                    {
                                                        fontSize:
                                                            15,
                                                        fontWeight:
                                                            700,
                                                    },
                                            }),
                                        }}
                                    />
                                </Box>
                            )
                        )}

                        {errors.content && (
                            <Typography
                                sx={{
                                    mt: 1.5,
                                    fontSize: 10,
                                    color: "#d32f2f",
                                }}
                            >
                                {errors.content}
                            </Typography>
                        )}

                        {/* ADD CONTENT BUTTONS */}

                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={
                                    <AddRounded />
                                }
                                onClick={() =>
                                    addContent(
                                        "heading"
                                    )
                                }
                                sx={{
                                    minHeight: 38,
                                    borderRadius: 2,
                                    borderColor:
                                        "#ddd",
                                    color: "#555",
                                    fontSize: 11,
                                }}
                            >
                                افزودن عنوان
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={
                                    <AddRounded />
                                }
                                onClick={() =>
                                    addContent(
                                        "paragraph"
                                    )
                                }
                                sx={{
                                    minHeight: 38,
                                    borderRadius: 2,
                                    borderColor:
                                        "#ddd",
                                    color: "#555",
                                    fontSize: 11,
                                }}
                            >
                                افزودن پاراگراف
                            </Button>
                        </Box>

                        {/* ================= ACTIONS ================= */}

                        <Box
                            sx={{
                                mt: 3,
                                pt: 2.5,
                                borderTop:
                                    "1px solid #eeeeee",
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                                alignItems:
                                    "center",
                                gap: 1,
                            }}
                        >
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        "/admin/articles"
                                    )
                                }
                                disabled={loading}
                                sx={{
                                    minWidth: 100,
                                    minHeight: 42,
                                    borderRadius: 2,
                                    borderColor:
                                        "#ddd",
                                    color: "#666",
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                انصراف
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={17}
                                            color="inherit"
                                        />
                                    ) : (
                                        <SaveRounded />
                                    )
                                }
                                sx={{
                                    minWidth: 125,
                                    minHeight: 42,
                                    borderRadius: 2,
                                    bgcolor: "#111",
                                    color: "#fff",
                                    fontSize: 12,
                                    fontWeight: 800,
                                    boxShadow:
                                        "none",

                                    "&:hover": {
                                        bgcolor: "#222",
                                        boxShadow:
                                            "none",
                                    },

                                    "&:disabled": {
                                        bgcolor:
                                            "#ddd",
                                        color:
                                            "#999",
                                    },
                                }}
                            >
                                {loading
                                    ? "در حال ایجاد..."
                                    : "ایجاد مقاله"}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* ================= SNACKBAR ================= */}

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
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    sx={{
                        borderRadius: 2,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}