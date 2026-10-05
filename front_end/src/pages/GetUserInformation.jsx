
import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    LocationOn as LocationOnIcon,
    Payment as PaymentIcon,
} from "@mui/icons-material";

const API_URL = "https://api.goldentower.ir";
const GOLD = "#D4AF37";

const getToken = () => {
    return (
        Cookies.get("token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token") ||
        ""
    );
};

const GetUserInformation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const token = useMemo(() => getToken(), []);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showMessage = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const closeSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const userInformation = useFormik({
        initialValues: {
            customer_name: "",
            customer_phone: "",
            customer_email: "",
            customer_address: "",
            note: "",
            order_uuid: orderId || "",
        },

        validate: (values) => {
            const errors = {};

            if (!values.customer_name.trim()) {
                errors.customer_name =
                    "نام و نام خانوادگی الزامی است";
            }

            if (!values.customer_phone.trim()) {
                errors.customer_phone =
                    "شماره تماس الزامی است";
            }

            if (!values.customer_address.trim()) {
                errors.customer_address =
                    "آدرس الزامی است";
            }

            if (
                values.customer_email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    values.customer_email
                )
            ) {
                errors.customer_email =
                    "ایمیل وارد شده معتبر نیست";
            }

            return errors;
        },

        onSubmit: async (values) => {
            if (!token) {
                showMessage(
                    "برای ثبت اطلاعات ابتدا وارد حساب کاربری شوید",
                    "warning"
                );

                setTimeout(() => {
                    navigate("/login");
                }, 700);

                return;
            }

            if (!orderId) {
                showMessage(
                    "شناسه سفارش مشخص نیست",
                    "error"
                );

                return;
            }

            try {
                setLoading(true);

                const payload = {
                    customer_name:
                        values.customer_name.trim(),

                    customer_phone:
                        values.customer_phone.trim(),

                    customer_email:
                        values.customer_email.trim() || null,

                    customer_address:
                        values.customer_address.trim(),

                    note:
                        values.note.trim() || null,

                    order_uuid: orderId,
                };

                const res = await axios.post(
                    `${API_URL}/api/payment/user-information`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(
                    "User information response:",
                    res.data
                );

                showMessage(
                    "اطلاعات با موفقیت ثبت شد",
                    "success"
                );

                setTimeout(() => {
                    navigate("/");
                }, 800);
            } catch (error) {
                console.error(
                    "User information error:",
                    error
                );

                showMessage(
                    error?.response?.data?.message ||
                        "خطا در ثبت اطلاعات مشتری",
                    "error"
                );
            } finally {
                setLoading(false);
            }
        },
    });

    /*
     * اگر orderId وجود نداشته باشد،
     * کاربر نباید در این صفحه بماند.
     */
    useEffect(() => {
        if (!orderId) {
            showMessage(
                "شناسه سفارش مشخص نیست",
                "error"
            );

            setTimeout(() => {
                navigate("/cart");
            }, 1000);
        }
    }, [orderId, navigate]);

    /*
     * اگر بخواهی بعداً اطلاعات کاربر را
     * به صورت خودکار از API بگیری،
     * این قسمت محل مناسبی برای آن است.
     */

    return (
        <Box
            sx={{
                direction: "ltr",
                minHeight: "70vh",
                bgcolor: "#fafafa",
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >
            <Container maxWidth="md">
                {/* Header */}

                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid #e8e8e8",
                        borderRadius: 3,
                        bgcolor: "#fff",
                        mb: 3,
                    }}
                >
                    <CardContent
                        sx={{
                            p: {
                                xs: 2.5,
                                md: 3,
                            },
                            "&:last-child": {
                                pb: {
                                    xs: 2.5,
                                    md: 3,
                                },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                direction: "rtl",
                                textAlign: "right",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    mb: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor:
                                            "rgba(212,175,55,0.12)",
                                        color: GOLD,
                                    }}
                                >
                                    <LocationOnIcon />
                                </Box>

                                <Typography
                                    variant="h5"
                                    fontWeight={900}
                                    color="#111"
                                >
                                    اطلاعات ارسال
                                </Typography>
                            </Box>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    lineHeight: 1.9,
                                }}
                            >
                                اطلاعات گیرنده و آدرس خود را
                                برای تکمیل سفارش وارد کنید.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Form */}

                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid #e8e8e8",
                        borderRadius: 3,
                        bgcolor: "#fff",
                    }}
                >
                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },
                            "&:last-child": {
                                pb: {
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                },
                            },
                        }}
                    >
                        <Box
                            component="form"
                            onSubmit={
                                userInformation.handleSubmit
                            }
                            sx={{
                                direction: "rtl",
                            }}
                        >
                            {/* Name */}

                            <TextField
                                fullWidth
                                name="customer_name"
                                label="نام و نام خانوادگی"
                                placeholder="مثلاً محمدحسین زینلی"
                                value={
                                    userInformation.values
                                        .customer_name
                                }
                                onChange={
                                    userInformation.handleChange
                                }
                                onBlur={
                                    userInformation.handleBlur
                                }
                                error={
                                    userInformation.touched
                                        .customer_name &&
                                    Boolean(
                                        userInformation.errors
                                            .customer_name
                                    )
                                }
                                helperText={
                                    userInformation.touched
                                        .customer_name
                                        ? userInformation.errors
                                              .customer_name
                                        : ""
                                }
                                sx={{
                                    mb: 2.5,
                                }}
                            />

                            {/* Phone */}

                            <TextField
                                fullWidth
                                name="customer_phone"
                                label="شماره تماس"
                                placeholder="09xxxxxxxxx"
                                value={
                                    userInformation.values
                                        .customer_phone
                                }
                                onChange={
                                    userInformation.handleChange
                                }
                                onBlur={
                                    userInformation.handleBlur
                                }
                                error={
                                    userInformation.touched
                                        .customer_phone &&
                                    Boolean(
                                        userInformation.errors
                                            .customer_phone
                                    )
                                }
                                helperText={
                                    userInformation.touched
                                        .customer_phone
                                        ? userInformation.errors
                                              .customer_phone
                                        : ""
                                }
                                inputProps={{
                                    dir: "ltr",
                                }}
                                sx={{
                                    mb: 2.5,
                                }}
                            />

                            {/* Email */}

                            <TextField
                                fullWidth
                                name="customer_email"
                                label="ایمیل"
                                placeholder="example@email.com"
                                value={
                                    userInformation.values
                                        .customer_email
                                }
                                onChange={
                                    userInformation.handleChange
                                }
                                onBlur={
                                    userInformation.handleBlur
                                }
                                error={
                                    userInformation.touched
                                        .customer_email &&
                                    Boolean(
                                        userInformation.errors
                                            .customer_email
                                    )
                                }
                                helperText={
                                    userInformation.touched
                                        .customer_email
                                        ? userInformation.errors
                                              .customer_email
                                        : "اختیاری"
                                }
                                inputProps={{
                                    dir: "ltr",
                                }}
                                sx={{
                                    mb: 2.5,
                                }}
                            />

                            {/* Address */}

                            <TextField
                                fullWidth
                                name="customer_address"
                                label="آدرس کامل"
                                placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد..."
                                value={
                                    userInformation.values
                                        .customer_address
                                }
                                onChange={
                                    userInformation.handleChange
                                }
                                onBlur={
                                    userInformation.handleBlur
                                }
                                error={
                                    userInformation.touched
                                        .customer_address &&
                                    Boolean(
                                        userInformation.errors
                                            .customer_address
                                    )
                                }
                                helperText={
                                    userInformation.touched
                                        .customer_address
                                        ? userInformation.errors
                                              .customer_address
                                        : ""
                                }
                                multiline
                                rows={4}
                                sx={{
                                    mb: 2.5,
                                }}
                            />

                            {/* Note */}

                            <TextField
                                fullWidth
                                name="note"
                                label="توضیحات سفارش"
                                placeholder="توضیحات اضافی برای سفارش..."
                                value={
                                    userInformation.values
                                        .note
                                }
                                onChange={
                                    userInformation.handleChange
                                }
                                multiline
                                rows={3}
                                helperText="اختیاری"
                                sx={{
                                    mb: 3,
                                }}
                            />

                            <Divider
                                sx={{
                                    mb: 3,
                                }}
                            />

                            {/* Order ID */}

                            <Box
                                sx={{
                                    bgcolor: "#fafafa",
                                    border:
                                        "1px solid #eeeeee",
                                    borderRadius: 2,
                                    p: 2,
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    sx={{
                                        mb: 0.5,
                                    }}
                                >
                                    شناسه سفارش
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    sx={{
                                        direction: "ltr",
                                        textAlign: "left",
                                        wordBreak:
                                            "break-all",
                                    }}
                                >
                                    {orderId || "-"}
                                </Typography>
                            </Box>

                            {/* Submit */}

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                color: "#fff",
                                            }}
                                        />
                                    ) : (
                                        <CheckCircleIcon />
                                    )
                                }
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    bgcolor: "#111",
                                    color: "#fff",
                                    fontWeight: 900,
                                    fontSize: "1rem",
                                    "&:hover": {
                                        bgcolor: "#222",
                                    },
                                    "&.Mui-disabled": {
                                        bgcolor: "#d5d5d5",
                                        color: "#888",
                                    },
                                }}
                            >
                                {loading
                                    ? "در حال ثبت اطلاعات..."
                                    : "ثبت اطلاعات سفارش"}
                            </Button>

                            {/* Back */}

                            <Button
                                fullWidth
                                variant="text"
                                disabled={loading}
                                startIcon={
                                    <ArrowBackIcon />
                                }
                                onClick={() =>
                                    navigate("/cart")
                                }
                                sx={{
                                    mt: 1,
                                    color: "#555",
                                    fontWeight: 700,
                                }}
                            >
                                بازگشت به سبد خرید
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Payment Info */}

                <Card
                    elevation={0}
                    sx={{
                        mt: 3,
                        border: `1px solid rgba(212,175,55,0.35)`,
                        borderRadius: 3,
                        bgcolor:
                            "rgba(212,175,55,0.06)",
                    }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                direction: "rtl",
                                display: "flex",
                                gap: 1.5,
                                alignItems: "flex-start",
                            }}
                        >
                            <PaymentIcon
                                sx={{
                                    color: GOLD,
                                    mt: 0.3,
                                }}
                            />

                            <Box>
                                <Typography
                                    fontWeight={800}
                                    color="#111"
                                    gutterBottom
                                >
                                    مرحله بعد
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        lineHeight: 1.9,
                                    }}
                                >
                                    پس از ثبت اطلاعات،
                                    سفارش شما آماده ادامه
                                    فرآیند پرداخت خواهد بود.
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            {/* Snackbar */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={closeSnackbar}
                    sx={{
                        width: "100%",
                        direction: "rtl",
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GetUserInformation;
