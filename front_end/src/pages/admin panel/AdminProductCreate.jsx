import React, { useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBackRounded,
    CloudUploadOutlined,
    DeleteOutlineRounded,
    ImageOutlined,
    SaveRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const gold = "#D4AF37";

export default function AdminProductCreate() {
    const navigate = useNavigate();

    // =========================
    // FORM
    // =========================

    const [form, setForm] = useState({
        name: "",
        description: "",
        brand: "",
        model: "",
        original_price: "",
        discount: "",
        inStock: "",
        offer: false,
        size: "",
    });

    // =========================
    // IMAGE
    // =========================

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // =========================
    // STATES
    // =========================

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

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
    // IMAGE SELECT
    // =========================

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setSnackbar({
                open: true,
                message: "فایل انتخاب‌شده باید تصویر باشد.",
                severity: "error",
            });

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message: "حجم تصویر نباید بیشتر از ۵ مگابایت باشد.",
                severity: "error",
            });

            return;
        }

        setImage(file);

        setImagePreview(
            URL.createObjectURL(file)
        );
    };

    // =========================
    // REMOVE IMAGE
    // =========================

    const handleRemoveImage = () => {
        setImage(null);

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImagePreview("");
    };

    // =========================
    // VALIDATION
    // =========================

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "نام محصول الزامی است.";
        }

        if (!form.description.trim()) {
            newErrors.description =
                "توضیحات محصول الزامی است.";
        }

        if (!form.brand.trim()) {
            newErrors.brand =
                "نام برند الزامی است.";
        }

        if (!form.model.trim()) {
            newErrors.model =
                "مدل محصول الزامی است.";
        }

        if (
            form.original_price === "" ||
            Number(form.original_price) < 0
        ) {
            newErrors.original_price =
                "قیمت اصلی را وارد کنید.";
        }

        if (
            form.discount === "" ||
            Number(form.discount) < 0 ||
            Number(form.discount) > 100
        ) {
            newErrors.discount =
                "تخفیف باید بین ۰ تا ۱۰۰ باشد.";
        }

        if (
            form.inStock === "" ||
            Number(form.inStock) < 0
        ) {
            newErrors.inStock =
                "موجودی محصول را وارد کنید.";
        }

        if (!form.size.trim()) {
            newErrors.size =
                "ابعاد محصول را وارد کنید.";
        }

        if (!image) {
            newErrors.image =
                "تصویر محصول الزامی است.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

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

            // =========================
            // EXACT API FIELDS
            // =========================

            data.append(
                "name",
                form.name.trim()
            );

            data.append(
                "description",
                form.description.trim()
            );

            data.append(
                "brand",
                form.brand.trim()
            );

            data.append(
                "model",
                form.model.trim()
            );

            data.append(
                "original_price",
                String(form.original_price)
            );

            data.append(
                "discount",
                String(form.discount)
            );

            data.append(
                "inStock",
                String(form.inStock)
            );

            data.append(
                "offer",
                String(form.offer)
            );

            data.append(
                "size",
                form.size.trim()
            );

            data.append(
                "image",
                image
            );

            await axios.post(
                `${API_URL}/api/products`,
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
                    "محصول با موفقیت ایجاد شد.",
                severity: "success",
            });

            setTimeout(() => {
                navigate("/admin/products");
            }, 1000);
        } catch (error) {
            console.error(
                "Create product error:",
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
                    "ایجاد محصول با خطا مواجه شد.",
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
            borderRadius: 1.8,
            bgcolor: "#fafafa",

            "& fieldset": {
                borderColor: "#e5e5e5",
            },

            "&:hover fieldset": {
                borderColor: "#d2d2d2",
            },

            "&.Mui-focused fieldset": {
                borderColor: gold,
            },
        },

        "& .MuiInputLabel-root": {
            fontSize: 12,
        },

        "& .MuiInputLabel-root.Mui-focused": {
            color: gold,
        },

        "& input": {
            fontSize: 12,
        },

        "& textarea": {
            fontSize: 12,
            lineHeight: 1.8,
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
                    justifyContent: "space-between",
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
                        افزودن محصول
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: 12,
                            color: "#888",
                        }}
                    >
                        ایجاد محصول جدید در فروشگاه
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackRounded />
                    }
                    onClick={() =>
                        navigate("/admin/products")
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
                    }}
                >
                    بازگشت به محصولات
                </Button>
            </Box>

            {/* ================= FORM ================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "minmax(0, 1fr) 360px",
                        },
                        gap: 2.5,
                        alignItems: "start",
                    }}
                >
                    {/* ================= LEFT ================= */}

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
                        <Box
                            sx={{
                                px: 2.5,
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
                                اطلاعات محصول
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.3,
                                    fontSize: 10,
                                    color: "#999",
                                }}
                            >
                                اطلاعات اصلی محصول را وارد کنید.
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
                            {/* NAME */}

                            <TextField
                                fullWidth
                                label="نام محصول"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                error={Boolean(
                                    errors.name
                                )}
                                helperText={
                                    errors.name
                                }
                                sx={{
                                    ...inputSx,
                                    mb: 2,
                                }}
                            />

                            {/* DESCRIPTION */}

                            <TextField
                                fullWidth
                                multiline
                                minRows={5}
                                label="توضیحات محصول"
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={handleChange}
                                error={Boolean(
                                    errors.description
                                )}
                                helperText={
                                    errors.description
                                }
                                sx={{
                                    ...inputSx,
                                    mb: 2,
                                }}
                            />

                            {/* BRAND + MODEL */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    label="برند"
                                    name="brand"
                                    value={form.brand}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="مثلاً Datees"
                                    error={Boolean(
                                        errors.brand
                                    )}
                                    helperText={
                                        errors.brand
                                    }
                                    sx={inputSx}
                                />

                                <TextField
                                    fullWidth
                                    label="مدل"
                                    name="model"
                                    value={form.model}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="مثلاً TT_537"
                                    error={Boolean(
                                        errors.model
                                    )}
                                    helperText={
                                        errors.model
                                    }
                                    sx={inputSx}
                                />
                            </Box>

                            {/* PRICE + DISCOUNT */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="قیمت اصلی"
                                    name="original_price"
                                    value={
                                        form.original_price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    error={Boolean(
                                        errors.original_price
                                    )}
                                    helperText={
                                        errors.original_price
                                    }
                                    inputProps={{
                                        min: 0,
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography
                                                    sx={{
                                                        fontSize: 10,
                                                        color: "#999",
                                                    }}
                                                >
                                                    تومان
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputSx}
                                />

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="تخفیف"
                                    name="discount"
                                    value={
                                        form.discount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                        max: 100,
                                    }}
                                    error={Boolean(
                                        errors.discount
                                    )}
                                    helperText={
                                        errors.discount
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography
                                                    sx={{
                                                        fontSize: 10,
                                                        color: "#999",
                                                    }}
                                                >
                                                    درصد
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputSx}
                                />
                            </Box>

                            {/* STOCK + SIZE */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="موجودی"
                                    name="inStock"
                                    value={
                                        form.inStock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                    }}
                                    error={Boolean(
                                        errors.inStock
                                    )}
                                    helperText={
                                        errors.inStock
                                    }
                                    sx={inputSx}
                                />

                                <TextField
                                    fullWidth
                                    label="ابعاد"
                                    name="size"
                                    value={form.size}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="120*240*95"
                                    error={Boolean(
                                        errors.size
                                    )}
                                    helperText={
                                        errors.size ||
                                        "مثال: 120*240*95"
                                    }
                                    sx={inputSx}
                                />
                            </Box>
                        </Box>
                    </Paper>

                    {/* ================= RIGHT ================= */}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                        }}
                    >
                        {/* IMAGE */}

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
                            <Box
                                sx={{
                                    px: 2.5,
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
                                    تصویر محصول
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.3,
                                        fontSize: 10,
                                        color: "#999",
                                    }}
                                >
                                    تصویر اصلی محصول را انتخاب کنید.
                                </Typography>
                            </Box>

                            <Box sx={{ p: 2.5 }}>
                                {imagePreview ? (
                                    <Box>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: 260,
                                                border:
                                                    "1px solid #e8e8e8",
                                                borderRadius: 2,
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
                                                position:
                                                    "relative",
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={
                                                    imagePreview
                                                }
                                                alt="Preview"
                                                sx={{
                                                    width:
                                                        "100%",
                                                    height:
                                                        "100%",
                                                    objectFit:
                                                        "contain",
                                                }}
                                            />

                                            <IconButton
                                                onClick={
                                                    handleRemoveImage
                                                }
                                                sx={{
                                                    position:
                                                        "absolute",
                                                    top: 8,
                                                    right: 8,
                                                    width: 34,
                                                    height: 34,
                                                    bgcolor:
                                                        "rgba(255,255,255,0.95)",
                                                    color:
                                                        "#d32f2f",
                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.08)",

                                                    "&:hover":
                                                        {
                                                            bgcolor:
                                                                "#fff",
                                                            color:
                                                                "#b71c1c",
                                                        },
                                                }}
                                            >
                                                <DeleteOutlineRounded
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        </Box>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 10,
                                                color: "#888",
                                                overflow:
                                                    "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            {
                                                image?.name
                                            }
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            height: 260,
                                            borderRadius: 2,
                                            borderStyle:
                                                "dashed",
                                            borderColor:
                                                errors.image
                                                    ? "#d32f2f"
                                                    : "#ddd",
                                            color: "#888",
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            gap: 1,
                                            textTransform:
                                                "none",

                                            "&:hover":
                                                {
                                                    borderColor:
                                                        gold,
                                                    bgcolor:
                                                        "rgba(212,175,55,0.03)",
                                                },
                                        }}
                                    >
                                        <CloudUploadOutlined
                                            sx={{
                                                fontSize: 38,
                                                color: gold,
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: "#555",
                                            }}
                                        >
                                            انتخاب تصویر
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 10,
                                                color: "#aaa",
                                            }}
                                        >
                                            JPG, PNG, WEBP
                                            تا ۵ مگابایت
                                        </Typography>

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

                                {errors.image && (
                                    <Typography
                                        sx={{
                                            mt: 1,
                                            fontSize: 10,
                                            color: "#d32f2f",
                                        }}
                                    >
                                        {
                                            errors.image
                                        }
                                    </Typography>
                                )}
                            </Box>
                        </Paper>

                        {/* OFFER */}

                        <Paper
                            elevation={0}
                            sx={{
                                border:
                                    "1px solid #e6e6e6",
                                borderRadius: 2.5,
                                bgcolor: "#fff",
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2.5,
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 800,
                                            color: "#222",
                                        }}
                                    >
                                        پیشنهاد ویژه
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.35,
                                            fontSize: 10,
                                            color: "#999",
                                        }}
                                    >
                                        محصول به عنوان پیشنهاد ویژه نمایش داده شود.
                                    </Typography>
                                </Box>

                                <Button
                                    type="button"
                                    variant={
                                        form.offer
                                            ? "contained"
                                            : "outlined"
                                    }
                                    onClick={() =>
                                        setForm(
                                            (prev) => ({
                                                ...prev,
                                                offer:
                                                    !prev.offer,
                                            })
                                        )
                                    }
                                    sx={{
                                        minWidth: 80,
                                        height: 36,
                                        borderRadius: 1.8,
                                        fontSize: 11,
                                        fontWeight: 700,

                                        ...(form.offer
                                            ? {
                                                  bgcolor:
                                                      gold,
                                                  color:
                                                      "#111",
                                                  "&:hover":
                                                      {
                                                          bgcolor:
                                                              "#c19d2f",
                                                      },
                                              }
                                            : {
                                                  borderColor:
                                                      "#ddd",
                                                  color:
                                                      "#777",
                                              }),
                                    }}
                                >
                                    {form.offer
                                        ? "فعال"
                                        : "غیرفعال"}
                                </Button>
                            </Box>
                        </Paper>

                        {/* SAVE */}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
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
                                minHeight: 48,
                                borderRadius: 2,
                                bgcolor: "#111",
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 800,
                                boxShadow: "none",

                                "&:hover": {
                                    bgcolor: "#222",
                                    boxShadow: "none",
                                },

                                "&:disabled": {
                                    bgcolor: "#ddd",
                                    color: "#999",
                                },
                            }}
                        >
                            {loading
                                ? "در حال ایجاد محصول..."
                                : "ایجاد محصول"}
                        </Button>
                    </Box>
                </Box>
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
                    severity={snackbar.severity}
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