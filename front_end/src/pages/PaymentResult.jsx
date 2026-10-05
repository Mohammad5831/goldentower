
// src/pages/PaymentResult.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

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
    Typography,
} from "@mui/material";

import {
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    WarningAmber as WarningAmberIcon,
    Home as HomeIcon,
    ArrowForward as ArrowForwardIcon,
    ReceiptLong as ReceiptLongIcon,
} from "@mui/icons-material";

import axios from "axios";
import Cookies from "js-cookie";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

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

const formatPrice = (price) => {
    if (
        price === undefined ||
        price === null ||
        price === ""
    ) {
        return "نامشخص";
    }

    const numericPrice = Number(
        String(price).replace(/,/g, "")
    );

    if (Number.isNaN(numericPrice)) {
        return `${price} تومان`;
    }

    return (
        new Intl.NumberFormat("en-IR").format(
            numericPrice
        ) + " تومان"
    );
};

const PaymentResult = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const Status = params.get("Status");
    const Authority = params.get("Authority");
    const order_id = params.get("order_id");

    const token = useMemo(
        () => getToken(),
        []
    );

    const [paymentDetail, setPaymentDetail] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "error",
        });

    /* =========================
       Snackbar
    ========================= */

    const showMessage = useCallback(
        (
            message,
            severity = "error"
        ) => {
            setSnackbar({
                open: true,
                message,
                severity,
            });
        },
        []
    );

    const closeSnackbar = useCallback(() => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    }, []);

    /* =========================
       Payment Verify
    ========================= */

    const paymentVerify =
        useCallback(async () => {
            /*
             * اگر اطلاعات callback ناقص باشد
             */

            if (
                !order_id ||
                !Authority ||
                !Status
            ) {
                setError(
                    "اطلاعات بازگشت از درگاه ناقص است."
                );

                setLoading(false);

                return;
            }

            /*
             * برای تأیید پرداخت
             * token لازم است.
             */

            if (!token) {
                setError(
                    "نشست کاربری شما معتبر نیست. لطفاً دوباره وارد حساب شوید."
                );

                setLoading(false);

                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response =
                    await axios.post(
                        `${API_URL}/api/payment/verify`,
                        {
                            order_id,
                            Authority,
                            Status,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                setPaymentDetail(
                    response?.data || null
                );
            } catch (err) {
                console.error(
                    "Payment verification error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                        "خطا در تأیید پرداخت."
                );
            } finally {
                setLoading(false);
            }
        }, [
            order_id,
            Authority,
            Status,
            token,
        ]);

    useEffect(() => {
        paymentVerify();
    }, [paymentVerify]);

    /* =========================
       Navigation
    ========================= */

    const handleContinueOrder =
        useCallback(() => {
            if (!order_id) {
                navigate("/user/orders");
                return;
            }

            navigate(
                `/user-information/${order_id}`
            );
        }, [
            navigate,
            order_id,
        ]);

    const handleOrders =
        useCallback(() => {
            navigate("/user/orders");
        }, [navigate]);

    const handleHome =
        useCallback(() => {
            navigate("/");
        }, [navigate]);

    /* =========================
       Status
    ========================= */

    const isSuccess =
        Status === "OK" &&
        paymentDetail &&
        !error;

    const isCancelled =
        Status === "NOK" &&
        !error;

    /* =========================
       Loading
    ========================= */

    if (loading) {
        return (
            <Box
                sx={{
                    direction: "ltr",
                    minHeight: "70vh",
                    bgcolor: "#fafafa",
                    py: 6,
                }}
            >
                <Container maxWidth="sm">
                    <Card
                        elevation={0}
                        sx={{
                            border:
                                "1px solid #e8e8e8",
                            borderRadius: 3,
                            bgcolor: "#fff",
                        }}
                    >
                        <CardContent
                            sx={{
                                py: 7,
                                textAlign:
                                    "center",
                            }}
                        >
                            <CircularProgress
                                size={48}
                                sx={{
                                    color: GOLD,
                                }}
                            />

                            <Box
                                sx={{
                                    direction:
                                        "ltr",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={900}
                                    sx={{
                                        mt: 3,
                                        color: "#111",
                                    }}
                                >
                                    در حال بررسی پرداخت...
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                    }}
                                >
                                    لطفاً تا پایان
                                    بررسی درگاه صبر
                                    کنید.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    /* =========================
       Main
    ========================= */

    return (
        <Box
            sx={{
                direction: "ltr",
                minHeight: "70vh",
                bgcolor: "#fafafa",
                py: {
                    xs: 3,
                    md: 6,
                },
            }}
        >
            <Container maxWidth="sm">
                {/* =========================
                    Success
                ========================= */}

                {isSuccess && (
                    <Card
                        elevation={0}
                        sx={{
                            border:
                                "1px solid #e8e8e8",
                            borderRadius: 3,
                            bgcolor: "#fff",
                            overflow:
                                "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                height: 5,
                                bgcolor: "#2e7d32",
                            }}
                        />

                        <CardContent
                            sx={{
                                p: {
                                    xs: 2.5,
                                    md: 4,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    direction:
                                        "ltr",
                                    textAlign:
                                        "center",
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        fontSize: 82,
                                        color: "#2e7d32",
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    variant="h4"
                                    fontWeight={900}
                                    color="#111"
                                    sx={{
                                        fontSize: {
                                            xs: "1.7rem",
                                            md: "2.1rem",
                                        },
                                    }}
                                >
                                    پرداخت موفق
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                        lineHeight:
                                            1.9,
                                    }}
                                >
                                    پرداخت شما با
                                    موفقیت تأیید شد.
                                </Typography>

                                <Box
                                    sx={{
                                        mt: 4,
                                        p: 2.5,
                                        bgcolor:
                                            "#fafafa",
                                        border:
                                            "1px solid #eeeeee",
                                        borderRadius: 2,
                                        textAlign:
                                            "left",
                                    }}
                                >
                                    {/* Amount */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            gap: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            مبلغ پرداختی
                                        </Typography>

                                        <Typography
                                            fontWeight={900}
                                            sx={{
                                                color:
                                                    GOLD,
                                            }}
                                        >
                                            {formatPrice(
                                                paymentDetail?.totalPrice
                                            )}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    {/* Ref ID */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            gap: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            کد رهگیری
                                        </Typography>

                                        <Typography
                                            fontWeight={800}
                                            sx={{
                                                direction:
                                                    "ltr",
                                                textAlign:
                                                    "left",
                                                wordBreak:
                                                    "break-all",
                                            }}
                                        >
                                            {paymentDetail?.refId ||
                                                "نامشخص"}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    {/* Order */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            gap: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            شماره سفارش
                                        </Typography>

                                        <Typography
                                            fontWeight={800}
                                            sx={{
                                                direction:
                                                    "ltr",
                                            }}
                                        >
                                            {order_id ||
                                                "نامشخص"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Continue */}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={
                                        handleContinueOrder
                                    }
                                    endIcon={
                                        <ArrowForwardIcon />
                                    }
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        bgcolor: "#111",
                                        color: "#fff",
                                        fontWeight: 900,
                                        "&:hover": {
                                            bgcolor:
                                                "#222",
                                        },
                                    }}
                                >
                                    ادامه سفارش
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={
                                        handleOrders
                                    }
                                    startIcon={
                                        <ReceiptLongIcon />
                                    }
                                    sx={{
                                        mt: 1.5,
                                        py: 1.3,
                                        borderRadius: 2,
                                        borderColor:
                                            "#ddd",
                                        color: "#111",
                                        fontWeight: 700,
                                        "&:hover": {
                                            borderColor:
                                                GOLD,
                                        },
                                    }}
                                >
                                    مشاهده سفارش‌ها
                                </Button>

                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={
                                        handleHome
                                    }
                                    startIcon={
                                        <HomeIcon />
                                    }
                                    sx={{
                                        mt: 0.5,
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    بازگشت به خانه
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* =========================
                    Cancelled
                ========================= */}

                {!isSuccess &&
                    isCancelled && (
                        <Card
                            elevation={0}
                            sx={{
                                border:
                                    "1px solid #e8e8e8",
                                borderRadius: 3,
                                bgcolor: "#fff",
                            }}
                        >
                            <Box
                                sx={{
                                    height: 5,
                                    bgcolor:
                                        GOLD,
                                }}
                            />

                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        md: 4,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        direction:
                                            "ltr",
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <WarningAmberIcon
                                        sx={{
                                            fontSize: 82,
                                            color:
                                                "#ed6c02",
                                        }}
                                    />

                                    <Typography
                                        variant="h4"
                                        fontWeight={900}
                                        color="#111"
                                        sx={{
                                            mt: 1,
                                            fontSize: {
                                                xs: "1.7rem",
                                                md: "2.1rem",
                                            },
                                        }}
                                    >
                                        پرداخت لغو شد
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
                                            lineHeight:
                                                1.9,
                                        }}
                                    >
                                        عملیات پرداخت
                                        توسط شما لغو
                                        شده است.
                                    </Typography>

                                    <Box
                                        sx={{
                                            mt: 3,
                                            p: 2,
                                            bgcolor:
                                                "#fff8e1",
                                            border:
                                                "1px solid #ffe082",
                                            borderRadius:
                                                2,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                        >
                                            در صورت تمایل
                                            می‌توانید دوباره
                                            از طریق سبد خرید
                                            اقدام به پرداخت
                                            کنید.
                                        </Typography>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={
                                            handleHome
                                        }
                                        startIcon={
                                            <HomeIcon />
                                        }
                                        sx={{
                                            mt: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            bgcolor:
                                                "#111",
                                            fontWeight:
                                                900,
                                            "&:hover": {
                                                bgcolor:
                                                    "#222",
                                            },
                                        }}
                                    >
                                        بازگشت به فروشگاه
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                {/* =========================
                    Error
                ========================= */}

                {!isSuccess &&
                    !isCancelled && (
                        <Card
                            elevation={0}
                            sx={{
                                border:
                                    "1px solid #e8e8e8",
                                borderRadius: 3,
                                bgcolor: "#fff",
                            }}
                        >
                            <Box
                                sx={{
                                    height: 5,
                                    bgcolor:
                                        "#d32f2f",
                                }}
                            />

                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        md: 4,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        direction:
                                            "ltr",
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <ErrorIcon
                                        sx={{
                                            fontSize: 82,
                                            color:
                                                "#d32f2f",
                                        }}
                                    />

                                    <Typography
                                        variant="h4"
                                        fontWeight={900}
                                        color="#111"
                                        sx={{
                                            mt: 1,
                                            fontSize: {
                                                xs: "1.7rem",
                                                md: "2.1rem",
                                            },
                                        }}
                                    >
                                        پرداخت ناموفق
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
                                            lineHeight:
                                                1.9,
                                        }}
                                    >
                                        {error ||
                                            "مشکلی در تأیید پرداخت رخ داده است."}
                                    </Typography>

                                    {order_id && (
                                        <Box
                                            sx={{
                                                mt: 3,
                                                p: 2,
                                                bgcolor:
                                                    "#fafafa",
                                                border:
                                                    "1px solid #eeeeee",
                                                borderRadius:
                                                    2,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                شماره سفارش
                                            </Typography>

                                            <Typography
                                                fontWeight={
                                                    800
                                                }
                                                sx={{
                                                    mt: 0.5,
                                                    direction:
                                                        "ltr",
                                                }}
                                            >
                                                {order_id}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={
                                            handleOrders
                                        }
                                        startIcon={
                                            <ReceiptLongIcon />
                                        }
                                        sx={{
                                            mt: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            bgcolor:
                                                "#111",
                                            fontWeight:
                                                900,
                                            "&:hover": {
                                                bgcolor:
                                                    "#222",
                                            },
                                        }}
                                    >
                                        مشاهده سفارش‌ها
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={
                                            handleHome
                                        }
                                        startIcon={
                                            <HomeIcon />
                                        }
                                        sx={{
                                            mt: 1,
                                            color:
                                                "text.secondary",
                                        }}
                                    >
                                        بازگشت به فروشگاه
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
            </Container>

            {/* Snackbar */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={
                    closeSnackbar
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity={
                        snackbar.severity
                    }
                    onClose={
                        closeSnackbar
                    }
                    sx={{
                        width: "100%",
                        direction: "ltr",
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PaymentResult;
