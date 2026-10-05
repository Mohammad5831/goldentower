import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import {
    PeopleAltRounded,
    ShoppingBagRounded,
    ReceiptLongRounded,
    PaymentsRounded,
    Inventory2Rounded,
    ArrowBackIosNewRounded,
    TrendingUpRounded,
} from "@mui/icons-material";

const API_URL = "https://api.goldentower.ir";

const gold = "#D4AF37";

const StatCard = ({
    title,
    value,
    icon,
    description,
    loading = false,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                border: "1px solid #e7e7e7",
                borderRadius: 3,
                bgcolor: "#fff",
                height: "100%",
                transition: "all 0.25s ease",

                "&:hover": {
                    borderColor: gold,
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#777",
                            fontWeight: 600,
                            mb: 1,
                        }}
                    >
                        {title}
                    </Typography>

                    {loading ? (
                        <Skeleton
                            width={90}
                            height={42}
                        />
                    ) : (
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 25,
                                    sm: 29,
                                },
                                fontWeight: 800,
                                color: "#111",
                                lineHeight: 1.2,
                            }}
                        >
                            {value}
                        </Typography>
                    )}

                    {description && (
                        <Typography
                            sx={{
                                mt: 1,
                                fontSize: 11,
                                color: "#999",
                            }}
                        >
                            {description}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2,
                        bgcolor: "rgba(212,175,55,0.12)",
                        color: gold,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    );
};

const Section = ({
    title,
    subtitle,
    children,
    action,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid #e7e7e7",
                borderRadius: 3,
                bgcolor: "#fff",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#111",
                        }}
                    >
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography
                            sx={{
                                mt: 0.4,
                                fontSize: 11,
                                color: "#999",
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {action}
            </Box>

            {children}
        </Paper>
    );
};

const StatusChip = ({ status }) => {
    const statusMap = {
        pending: {
            label: "در انتظار",
            color: "warning",
        },
        processing: {
            label: "در حال پردازش",
            color: "info",
        },
        completed: {
            label: "تکمیل شده",
            color: "success",
        },
        cancelled: {
            label: "لغو شده",
            color: "error",
        },
        delivered: {
            label: "تحویل شده",
            color: "success",
        },
    };

    const current = statusMap[status] || {
        label: status || "نامشخص",
        color: "default",
    };

    return (
        <Chip
            label={current.label}
            color={current.color}
            size="small"
            sx={{
                fontSize: 10,
                height: 26,
            }}
        />
    );
};

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [
                usersResponse,
                productsResponse,
                ordersResponse,
            ] = await Promise.all([
                axios.get(`${API_URL}/api/users`),
                axios.get(`${API_URL}/api/products`),
                axios.get(`${API_URL}/api/orders`),
            ]);

            setUsers(
                usersResponse.data?.users ||
                usersResponse.data ||
                []
            );

            setProducts(
                productsResponse.data?.products ||
                productsResponse.data ||
                []
            );

            setOrders(
                ordersResponse.data?.orders ||
                ordersResponse.data ||
                []
            );
        } catch (err) {
            console.error(err);

            setError(
                "دریافت اطلاعات داشبورد با خطا مواجه شد."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    /*
     * اگر ساختار order در API شما متفاوت باشد،
     * فقط این بخش‌ها را بعداً با ساختار واقعی API هماهنگ می‌کنیم.
     */

    const totalRevenue = orders.reduce((total, order) => {
        const price =
            Number(
                order.total_price ??
                order.total ??
                order.amount ??
                0
            );

        return total + price;
    }, 0);

    const recentOrders = [...orders]
        .sort((a, b) => {
            const dateA = new Date(
                a.createdAt ||
                a.created_at ||
                0
            );

            const dateB = new Date(
                b.createdAt ||
                b.created_at ||
                0
            );

            return dateB - dateA;
        })
        .slice(0, 5);

    const recentProducts = [...products]
        .slice(-5)
        .reverse();

    const lowStockProducts = products
        .filter((product) => {
            const stock = Number(
                product.stock ??
                product.inventory ??
                product.quantity ??
                0
            );

            return stock <= 5;
        })
        .slice(0, 5);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fa-IR").format(
            Number(price) || 0
        );
    };

    return (
        <Box>
            {/* Page intro */}
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
                                sm: 25,
                            },
                            fontWeight: 800,
                            color: "#111",
                        }}
                    >
                        خوش آمدید 👋
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.7,
                            fontSize: 13,
                            color: "#777",
                        }}
                    >
                        وضعیت کلی فروشگاه را از اینجا مدیریت کنید.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        border: "1px solid #e7e7e7",
                    }}
                >
                    <TrendingUpRounded
                        sx={{
                            color: gold,
                            fontSize: 19,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 11,
                            color: "#666",
                            fontWeight: 600,
                        }}
                    >
                        نمای کلی فروشگاه
                    </Typography>
                </Box>
            </Box>

            {/* Error */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* KPI */}
            <Grid
                container
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="کاربران"
                        value={users.length}
                        description="تعداد کاربران ثبت‌شده"
                        icon={
                            <PeopleAltRounded />
                        }
                        loading={loading}
                    />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="محصولات"
                        value={products.length}
                        description="تعداد محصولات فروشگاه"
                        icon={
                            <ShoppingBagRounded />
                        }
                        loading={loading}
                    />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="سفارشات"
                        value={orders.length}
                        description="کل سفارش‌های ثبت‌شده"
                        icon={
                            <ReceiptLongRounded />
                        }
                        loading={loading}
                    />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="فروش کل"
                        value={
                            `${formatPrice(totalRevenue)} تومان`
                        }
                        description="مجموع مبلغ سفارش‌ها"
                        icon={
                            <PaymentsRounded />
                        }
                        loading={loading}
                    />
                </Grid>
            </Grid>

            {/* Main content */}
            <Grid
                container
                spacing={2}
            >
                {/* Recent Orders */}
                <Grid
                    item
                    xs={12}
                    lg={7}
                >
                    <Section
                        title="آخرین سفارشات"
                        subtitle="آخرین سفارش‌های ثبت‌شده در فروشگاه"
                    >
                        {loading ? (
                            <Box sx={{ p: 2 }}>
                                {[1, 2, 3, 4].map(
                                    (item) => (
                                        <Skeleton
                                            key={item}
                                            height={60}
                                            sx={{
                                                mb: 1,
                                            }}
                                        />
                                    )
                                )}
                            </Box>
                        ) : recentOrders.length === 0 ? (
                            <Box
                                sx={{
                                    py: 6,
                                    textAlign: "center",
                                }}
                            >
                                <ReceiptLongRounded
                                    sx={{
                                        fontSize: 42,
                                        color: "#ddd",
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#999",
                                    }}
                                >
                                    هنوز سفارشی ثبت نشده است.
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {recentOrders.map(
                                    (order, index) => {
                                        const orderId =
                                            order.uuid ||
                                            order.id ||
                                            index + 1;

                                        const customerName =
                                            order.user?.first_name
                                                ? `${order.user.first_name} ${order.user.last_name || ""}`
                                                : order.customer_name ||
                                                  "کاربر";

                                        const total =
                                            order.total_price ??
                                            order.total ??
                                            order.amount ??
                                            0;

                                        return (
                                            <Box
                                                key={orderId}
                                                sx={{
                                                    px: {
                                                        xs: 2,
                                                        sm: 2.5,
                                                    },
                                                    py: 1.7,
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 1.5,
                                                    borderBottom:
                                                        index !==
                                                        recentOrders.length -
                                                            1
                                                            ? "1px solid #f0f0f0"
                                                            : "none",
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 38,
                                                        height: 38,
                                                        bgcolor:
                                                            "#f5f5f5",
                                                        color: "#555",
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {String(
                                                        customerName
                                                    ).charAt(0)}
                                                </Avatar>

                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 13,
                                                            fontWeight: 700,
                                                            color: "#222",
                                                        }}
                                                    >
                                                        {
                                                            customerName
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: 10,
                                                            color: "#999",
                                                            mt: 0.3,
                                                        }}
                                                    >
                                                        سفارش #
                                                        {
                                                            order.id ||
                                                            order.uuid?.slice(
                                                                0,
                                                                8
                                                            ) ||
                                                            "—"
                                                        }
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        textAlign:
                                                            "left",
                                                        mr: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            fontWeight: 700,
                                                            color: "#222",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            total
                                                        )}{" "}
                                                        تومان
                                                    </Typography>

                                                    <StatusChip
                                                        status={
                                                            order.status
                                                        }
                                                    />
                                                </Box>

                                                <ArrowBackIosNewRounded
                                                    sx={{
                                                        fontSize: 14,
                                                        color: "#bbb",
                                                    }}
                                                />
                                            </Box>
                                        );
                                    }
                                )}
                            </Box>
                        )}
                    </Section>
                </Grid>

                {/* Low stock */}
                <Grid
                    item
                    xs={12}
                    lg={5}
                >
                    <Section
                        title="موجودی کم"
                        subtitle="محصولاتی که نیاز به بررسی دارند"
                    >
                        {loading ? (
                            <Box sx={{ p: 2 }}>
                                {[1, 2, 3].map(
                                    (item) => (
                                        <Skeleton
                                            key={item}
                                            height={65}
                                        />
                                    )
                                )}
                            </Box>
                        ) : lowStockProducts.length === 0 ? (
                            <Box
                                sx={{
                                    py: 6,
                                    px: 2,
                                    textAlign: "center",
                                }}
                            >
                                <Inventory2Rounded
                                    sx={{
                                        fontSize: 42,
                                        color: "#ddd",
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#999",
                                    }}
                                >
                                    محصولی با موجودی کم وجود ندارد.
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {lowStockProducts.map(
                                    (
                                        product,
                                        index
                                    ) => {
                                        const stock =
                                            Number(
                                                product.stock ??
                                                product.inventory ??
                                                product.quantity ??
                                                0
                                            );

                                        return (
                                            <Box
                                                key={
                                                    product.uuid ||
                                                    product.id ||
                                                    index
                                                }
                                                sx={{
                                                    px: {
                                                        xs: 2,
                                                        sm: 2.5,
                                                    },
                                                    py: 1.7,
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 1.5,
                                                    borderBottom:
                                                        index !==
                                                        lowStockProducts.length -
                                                            1
                                                            ? "1px solid #f0f0f0"
                                                            : "none",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 2,
                                                        bgcolor:
                                                            "#f7f7f7",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        color: "#777",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Inventory2Rounded fontSize="small" />
                                                </Box>

                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
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
                                                        {product.name ||
                                                            "محصول بدون نام"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: 10,
                                                            color: "#999",
                                                            mt: 0.3,
                                                        }}
                                                    >
                                                        موجودی فعلی
                                                    </Typography>
                                                </Box>

                                                <Chip
                                                    label={`${stock} عدد`}
                                                    size="small"
                                                    color={
                                                        stock ===
                                                        0
                                                            ? "error"
                                                            : "warning"
                                                    }
                                                    sx={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                    }}
                                                />
                                            </Box>
                                        );
                                    }
                                )}
                            </Box>
                        )}
                    </Section>
                </Grid>

                {/* Recent Products */}
                <Grid
                    item
                    xs={12}
                >
                    <Section
                        title="محصولات اخیر"
                        subtitle="آخرین محصولات اضافه‌شده به فروشگاه"
                    >
                        {loading ? (
                            <Box
                                sx={{
                                    p: 2,
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(180px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                                {[1, 2, 3, 4, 5].map(
                                    (item) => (
                                        <Skeleton
                                            key={item}
                                            variant="rounded"
                                            height={100}
                                        />
                                    )
                                )}
                            </Box>
                        ) : recentProducts.length === 0 ? (
                            <Box
                                sx={{
                                    py: 6,
                                    textAlign: "center",
                                }}
                            >
                                <ShoppingBagRounded
                                    sx={{
                                        fontSize: 42,
                                        color: "#ddd",
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#999",
                                    }}
                                >
                                    محصولی وجود ندارد.
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: {
                                        xs: 1.5,
                                        sm: 2,
                                    },
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(190px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                                {recentProducts.map(
                                    (
                                        product,
                                        index
                                    ) => (
                                        <Box
                                            key={
                                                product.uuid ||
                                                product.id ||
                                                index
                                            }
                                            sx={{
                                                p: 1.5,
                                                border: "1px solid #eee",
                                                borderRadius: 2,
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 1.5,
                                                transition:
                                                    "all 0.2s ease",

                                                "&:hover": {
                                                    borderColor:
                                                        gold,
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 55,
                                                    height: 55,
                                                    borderRadius: 2,
                                                    bgcolor:
                                                        "#f7f7f7",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    flexShrink: 0,
                                                    overflow:
                                                        "hidden",
                                                }}
                                            >
                                                {product.image ? (
                                                    <Box
                                                        component="img"
                                                        src={`${API_URL}/api/image/${product.image}`}
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
                                                    <ShoppingBagRounded
                                                        sx={{
                                                            color: "#bbb",
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
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {product.name ||
                                                        "محصول بدون نام"}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize: 11,
                                                        color: gold,
                                                        fontWeight: 700,
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    {formatPrice(
                                                        product.current_price ??
                                                            product.price ??
                                                            0
                                                    )}{" "}
                                                    تومان
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )
                                )}
                            </Box>
                        )}
                    </Section>
                </Grid>
            </Grid>
        </Box>
    );
}