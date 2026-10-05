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
} from "@mui/material";

import {
    ArrowBackRounded,
    CloudUploadRounded,
    DeleteOutlineRounded,
    SaveRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const gold = "#D4AF37";

export default function AdminBrandCreate() {
    const navigate = useNavigate();

    // =========================
    // FORM
    // =========================

    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "active",
        logo: null,
        logoPreview: "",
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
    // CLEANUP PREVIEW
    // =========================

    useEffect(() => {
        return () => {
            if (form.logoPreview) {
                URL.revokeObjectURL(
                    form.logoPreview
                );
            }
        };
    }, [form.logoPreview]);

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
    // LOGO CHANGE
    // =========================

    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // فقط تصویر
        if (!file.type.startsWith("image/")) {
            setSnackbar({
                open: true,
                message:
                    "فایل لوگو باید یک تصویر باشد.",
                severity: "error",
            });

            event.target.value = "";
            return;
        }

        // حداکثر 5MB
        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message:
                    "حجم لوگو نباید بیشتر از ۵ مگابایت باشد.",
                severity: "error",
            });

            event.target.value = "";
            return;
        }

        // اگر preview قبلی وجود دارد
        if (form.logoPreview) {
            URL.revokeObjectURL(
                form.logoPreview
            );
        }

        const preview =
            URL.createObjectURL(file);

        setForm((prev) => ({
            ...prev,
            logo: file,
            logoPreview: preview,
        }));

        setErrors((prev) => ({
            ...prev,
            logo: "",
        }));
    };

    // =========================
    // REMOVE LOGO
    // =========================

    const handleRemoveLogo = () => {
        if (form.logoPreview) {
            URL.revokeObjectURL(
                form.logoPreview
            );
        }

        setForm((prev) => ({
            ...prev,
            logo: null,
            logoPreview: "",
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
                "نام برند الزامی است.";
        } else if (name.length < 2) {
            newErrors.name =
                "نام برند باید حداقل ۲ کاراکتر باشد.";
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
                "name",
                form.name.trim()
            );

            data.append(
                "description",
                form.description.trim()
            );

            data.append(
                "status",
                form.status
            );

            if (form.logo) {
                data.append(
                    "logo",
                    form.logo
                );
            }

            await axios.post(
                `${API_URL}/api/brands`,
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
                    "برند با موفقیت ایجاد شد.",
                severity: "success",
            });

            setTimeout(() => {
                navigate("/admin/brands");
            }, 1000);
        } catch (error) {
            console.error(
                "Create brand error:",
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
                    "ایجاد برند با خطا مواجه شد.",
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
                        افزودن برند
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: 12,
                            color: "#888",
                        }}
                    >
                        ایجاد برند جدید برای محصولات
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackRounded />
                    }
                    onClick={() =>
                        navigate(
                            "/admin/brands"
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
                    بازگشت به برندها
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
                            اطلاعات برند
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.3,
                                fontSize: 10,
                                color: "#999",
                            }}
                        >
                            اطلاعات برند و لوگوی آن را وارد کنید.
                        </Typography>
                    </Box>

                    {/* ================= CONTENT ================= */}

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
                            label="نام برند"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="مثلاً Datees"
                            error={Boolean(
                                errors.name
                            )}
                            helperText={
                                errors.name ||
                                "نام برند را وارد کنید."
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
                            placeholder="توضیح کوتاهی درباره این برند..."
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
                                mb: 2.5,
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

                        {/* ================= LOGO ================= */}

                        <Box
                            sx={{
                                border:
                                    "1px solid #e4e4e4",
                                borderRadius: 2,
                                bgcolor: "#fafafa",
                                p: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "#333",
                                    mb: 1.5,
                                }}
                            >
                                لوگوی برند
                            </Typography>

                            {form.logoPreview ? (
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
                                    {/* IMAGE */}

                                    <Box
                                        sx={{
                                            width: 110,
                                            height: 110,
                                            borderRadius: 2,
                                            border:
                                                "1px solid #ddd",
                                            bgcolor:
                                                "#fff",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            overflow:
                                                "hidden",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={
                                                form.logoPreview
                                            }
                                            alt="Logo preview"
                                            sx={{
                                                width:
                                                    "100%",
                                                height:
                                                    "100%",
                                                objectFit:
                                                    "contain",
                                                p: 1,
                                            }}
                                        />
                                    </Box>

                                    {/* FILE INFO */}

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth:
                                                200,
                                        }}
                                    >
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
                                                    .logo
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
                                                    .logo
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
                                                handleRemoveLogo
                                            }
                                            sx={{
                                                borderRadius:
                                                    1.5,
                                                fontSize:
                                                    11,
                                                minHeight:
                                                    34,

                                                "& .MuiButton-startIcon":
                                                    {
                                                        marginLeft:
                                                            0.5,
                                                        marginRight:
                                                            0,
                                                    },
                                            }}
                                        >
                                            حذف لوگو
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
                                        minHeight: 110,
                                        borderRadius: 2,
                                        borderStyle:
                                            "dashed",
                                        borderColor:
                                            "#d5d5d5",
                                        color: "#666",
                                        bgcolor: "#fff",
                                        fontSize: 12,
                                        fontWeight: 700,

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
                                    انتخاب لوگو

                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleLogoChange
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
                                فرمت‌های تصویری مجاز و حداکثر حجم فایل ۵ مگابایت.
                            </Typography>
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
                                        "/admin/brands"
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
                                    minWidth: 130,
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
                                    : "ایجاد برند"}
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