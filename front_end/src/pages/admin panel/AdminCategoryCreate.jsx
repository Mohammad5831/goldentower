import React, { useState } from "react";
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
} from "@mui/material";

import {
    ArrowBackRounded,
    SaveRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const gold = "#D4AF37";

export default function AdminCategoryCreate() {
    const navigate = useNavigate();

    // =========================
    // FORM
    // =========================

    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "active",
    });

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
    // VALIDATION
    // =========================

    const validateForm = () => {
        const newErrors = {};

        const name = form.name.trim();

        if (!name) {
            newErrors.name =
                "نام دسته‌بندی الزامی است.";
        } else if (name.length < 2) {
            newErrors.name =
                "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد.";
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

            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                status: form.status,
            };

            await axios.post(
                `${API_URL}/api/categories`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setSnackbar({
                open: true,
                message:
                    "دسته‌بندی با موفقیت ایجاد شد.",
                severity: "success",
            });

            setTimeout(() => {
                navigate("/admin/categories");
            }, 1000);
        } catch (error) {
            console.error(
                "Create category error:",
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
                    "ایجاد دسته‌بندی با خطا مواجه شد.",
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
                        افزودن دسته‌بندی
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: 12,
                            color: "#888",
                        }}
                    >
                        ایجاد دسته‌بندی جدید برای محصولات
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackRounded />
                    }
                    onClick={() =>
                        navigate(
                            "/admin/categories"
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
                    بازگشت به دسته‌بندی‌ها
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
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 900,
                        border:
                            "1px solid #e6e6e6",
                        borderRadius: 2.5,
                        bgcolor: "#fff",
                        overflow: "hidden",
                    }}
                >
                    {/* ================= CARD HEADER ================= */}

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
                            اطلاعات دسته‌بندی
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.3,
                                fontSize: 10,
                                color: "#999",
                            }}
                        >
                            اطلاعات دسته‌بندی را وارد کنید.
                        </Typography>
                    </Box>

                    {/* ================= FORM CONTENT ================= */}

                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                sm: 2.5,
                            },
                        }}
                    >
                        {/* ================= NAME ================= */}

                        <TextField
                            fullWidth
                            label="نام دسته‌بندی"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="مثلاً اجاق گاز"
                            error={Boolean(
                                errors.name
                            )}
                            helperText={
                                errors.name ||
                                "نام دسته‌بندی باید منحصر‌به‌فرد باشد."
                            }
                            autoComplete="off"
                            sx={{
                                ...inputSx,
                                mb: 2.5,
                            }}
                        />

                        {/* ================= DESCRIPTION ================= */}

                        <TextField
                            fullWidth
                            multiline
                            minRows={5}
                            label="توضیحات"
                            name="description"
                            value={
                                form.description
                            }
                            onChange={handleChange}
                            placeholder="توضیح کوتاهی درباره این دسته‌بندی..."
                            helperText="توضیحات اختیاری است."
                            sx={{
                                ...inputSx,
                                mb: 2.5,

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

                        {/* ================= STATUS ================= */}

                        <TextField
                            select
                            fullWidth
                            label="وضعیت"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            sx={{
                                ...inputSx,
                                mb: 0,
                            }}
                        >
                            <MenuItem
                                value="active"
                                sx={{
                                    fontSize: 12,
                                }}
                            >
                                فعال
                            </MenuItem>

                            <MenuItem
                                value="inactive"
                                sx={{
                                    fontSize: 12,
                                }}
                            >
                                غیرفعال
                            </MenuItem>
                        </TextField>

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
                                        "/admin/categories"
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

                                    "&:hover": {
                                        borderColor:
                                            "#bbb",
                                        bgcolor:
                                            "#fafafa",
                                    },
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
                                    minWidth: 145,
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

                                    "& .MuiButton-startIcon":
                                        {
                                            marginLeft:
                                                0.5,
                                            marginRight:
                                                0,
                                        },
                                }}
                            >
                                {loading
                                    ? "در حال ایجاد..."
                                    : "ایجاد دسته‌بندی"}
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