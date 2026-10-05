// src/pages/user panel/UserWishlist.jsx

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    Snackbar,
    Typography,
} from "@mui/material";

import {
    ArrowBackOutlined,
    DeleteOutline,
    Favorite,
    FavoriteBorder,
    ShoppingCartOutlined,
    VisibilityOutlined,
} from "@mui/icons-material";

import {
    useNavigate,
} from "react-router-dom";


// ======================================================
// Constants
// ======================================================

const API_URL = "https://api.goldentower.ir";

const GOLD = "#D4AF37";


// ======================================================
// Token
// ======================================================

const getToken = () => {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token") ||
        ""
    );
};


// ======================================================
// Helpers
// ======================================================

const getField = (
    object,
    fields,
    fallback = ""
) => {

    if (!object) {
        return fallback;
    }

    for (const field of fields) {

        if (
            object[field] !== undefined &&
            object[field] !== null
        ) {
            return object[field];
        }
    }

    return fallback;
};


const getWishlistArray = (
    data
) => {

    if (Array.isArray(data)) {
        return data;
    }

    if (
        Array.isArray(
            data?.wishlist
        )
    ) {
        return data.wishlist;
    }

    if (
        Array.isArray(
            data?.favorites
        )
    ) {
        return data.favorites;
    }

    if (
        Array.isArray(
            data?.data
        )
    ) {
        return data.data;
    }

    if (
        Array.isArray(
            data?.data?.wishlist
        )
    ) {
        return data.data.wishlist;
    }

    if (
        Array.isArray(
            data?.data?.favorites
        )
    ) {
        return data.data.favorites;
    }

    if (
        Array.isArray(
            data?.results
        )
    ) {
        return data.results;
    }

    return [];
};


const getProductFromWishlist = (
    item
) => {

    if (
        item?.product &&
        typeof item.product === "object"
    ) {
        return item.product;
    }

    if (
        item?.Product &&
        typeof item.Product === "object"
    ) {
        return item.Product;
    }

    return item;
};


const getProductUuid = (
    item
) => {

    const product =
        getProductFromWishlist(
            item
        );

    return getField(
        product,
        [
            "uuid",
            "product_uuid",
            "productUuid",
        ]
    );
};


const getProductName = (
    item
) => {

    const product =
        getProductFromWishlist(
            item
        );

    return getField(
        product,
        [
            "name",
            "title",
        ],
        "محصول بدون نام"
    );
};


const getProductDescription = (
    item
) => {

    const product =
        getProductFromWishlist(
            item
        );

    return getField(
        product,
        [
            "description",
            "short_description",
            "shortDescription",
        ],
        ""
    );
};


const getProductPrice = (
    item
) => {

    const product =
        getProductFromWishlist(
            item
        );

    const price = getField(
        product,
        [
            "price",
            "original_price",
            "originalPrice",
        ],
        0
    );

    const numericPrice =
        Number(
            String(price)
                .replace(
                    /,/g,
                    ""
                )
        );

    return Number.isFinite(
        numericPrice
    )
        ? numericPrice
        : 0;
};


const getProductDiscount = (
    item
) => {

    const product =
        getProductFromWishlist(
            item
        );

    const discount =
        getField(
            product,
            [
                "discount",
                "discount_percent",
                "discountPercent",
            ],
            0
        );

    const numericDiscount =
        Number(
            discount
        );

    return Number.isFinite(
        numericDiscount
    )
        ? numericDiscount
        : 0;
};


const getProductImage = (
    item
) => {

    const product =
        getProductFromWishlist(
            item
        );

    const directImage =
        getField(
            product,
            [
                "image",
                "main_image",
                "mainImage",
                "thumbnail",
                "image_url",
                "imageUrl",
            ]
        );

    if (
        typeof directImage ===
            "string" &&
        directImage
    ) {
        return directImage;
    }

    if (
        Array.isArray(
            product?.images
        ) &&
        product.images.length > 0
    ) {

        const firstImage =
            product.images[0];

        if (
            typeof firstImage ===
            "string"
        ) {
            return firstImage;
        }

        return getField(
            firstImage,
            [
                "url",
                "image_url",
                "imageUrl",
                "name",
                "path",
            ]
        );
    }

    if (
        product?.image &&
        typeof product.image ===
            "object"
    ) {
        return getField(
            product.image,
            [
                "url",
                "image_url",
                "imageUrl",
                "name",
                "path",
            ]
        );
    }

    return "";
};


const formatPrice = (
    price
) => {

    if (!price) {
        return "۰ تومان";
    }

    return `${Number(
        price
    ).toLocaleString(
        "fa-IR"
    )} تومان`;
};


const getDiscountedPrice = (
    price,
    discount
) => {

    if (
        !discount ||
        discount <= 0
    ) {
        return price;
    }

    return Math.round(
        price -
        (
            price *
            discount /
            100
        )
    );
};


const getStock = (
    item
) => {

    const product =
        getProductFromWishlist(
            item
        );

    const stock =
        getField(
            product,
            [
                "inStock",
                "in_stock",
                "stock",
                "quantity",
            ],
            0
        );

    return Number(
        stock
    ) || 0;
};


// ======================================================
// Component
// ======================================================

export default function UserWishlist() {

    const navigate =
        useNavigate();


    const [
        wishlist,
        setWishlist,
    ] = useState([]);


    const [
        isLoading,
        setIsLoading,
    ] = useState(true);


    const [
        deletingUuid,
        setDeletingUuid,
    ] = useState(null);


    const [
        addingToCartUuid,
        setAddingToCartUuid,
    ] = useState(null);


    const [
        snackbar,
        setSnackbar,
    ] = useState({
        open: false,
        message: "",
        severity: "error",
    });


    // ==================================================
    // Snackbar
    // ==================================================

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


    const closeSnackbar = () => {

        setSnackbar(
            (current) => ({
                ...current,
                open: false,
            })
        );
    };


    // ==================================================
    // Fetch Wishlist
    // ==================================================

    const fetchWishlist =
        useCallback(
            async () => {

                const token =
                    getToken();

                if (!token) {

                    setIsLoading(
                        false
                    );

                    showMessage(
                        "لطفاً ابتدا وارد حساب کاربری شوید."
                    );

                    return;
                }


                try {

                    setIsLoading(
                        true
                    );


                    const response =
                        await axios.get(
                            `${API_URL}/api/wishlist`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );


                    setWishlist(
                        getWishlistArray(
                            response.data
                        )
                    );

                } catch (
                    error
                ) {

                    console.error(
                        "Wishlist error:",
                        error
                    );


                    const message =
                        error.response
                            ?.data
                            ?.message ||
                        "دریافت علاقه‌مندی‌ها با خطا مواجه شد.";


                    showMessage(
                        message
                    );

                } finally {

                    setIsLoading(
                        false
                    );
                }

            },
            [
                showMessage,
            ]
        );


    useEffect(
        () => {
            fetchWishlist();
        },
        [
            fetchWishlist,
        ]
    );


    // ==================================================
    // Remove From Wishlist
    // ==================================================

    const handleRemove =
        async (
            item
        ) => {

            const token =
                getToken();

            if (!token) {

                showMessage(
                    "لطفاً ابتدا وارد حساب کاربری شوید."
                );

                return;
            }


            const productUuid =
                getProductUuid(
                    item
                );


            if (!productUuid) {

                showMessage(
                    "شناسه محصول پیدا نشد."
                );

                return;
            }


            try {

                setDeletingUuid(
                    productUuid
                );


                await axios.delete(
                    `${API_URL}/api/wishlist/${productUuid}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                setWishlist(
                    (current) =>
                        current.filter(
                            (
                                wishlistItem
                            ) =>
                                String(
                                    getProductUuid(
                                        wishlistItem
                                    )
                                ) !==
                                String(
                                    productUuid
                                )
                        )
                );


                showMessage(
                    "محصول از علاقه‌مندی‌ها حذف شد.",
                    "success"
                );

            } catch (
                error
            ) {

                console.error(
                    "Remove wishlist error:",
                    error
                );


                const message =
                    error.response
                        ?.data
                        ?.message ||
                    "حذف محصول از علاقه‌مندی‌ها با خطا مواجه شد.";


                showMessage(
                    message
                );

            } finally {

                setDeletingUuid(
                    null
                );
            }
        };


    // ==================================================
    // Add To Cart
    // ==================================================

    const handleAddToCart =
        async (
            item
        ) => {

            const token =
                getToken();


            if (!token) {

                showMessage(
                    "لطفاً ابتدا وارد حساب کاربری شوید."
                );

                return;
            }


            const productUuid =
                getProductUuid(
                    item
                );


            if (!productUuid) {

                showMessage(
                    "شناسه محصول پیدا نشد."
                );

                return;
            }


            const stock =
                getStock(
                    item
                );


            if (
                stock <= 0
            ) {

                showMessage(
                    "این محصول در حال حاضر موجود نیست."
                );

                return;
            }


            try {

                setAddingToCartUuid(
                    productUuid
                );


                await axios.post(
                    `${API_URL}/api/carts`,
                    {
                        product_uuid:
                            productUuid,

                        quantity:
                            1,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                showMessage(
                    "محصول به سبد خرید اضافه شد.",
                    "success"
                );

            } catch (
                error
            ) {

                console.error(
                    "Add to cart error:",
                    error
                );


                const message =
                    error.response
                        ?.data
                        ?.message ||
                    "افزودن محصول به سبد خرید با خطا مواجه شد.";


                showMessage(
                    message
                );

            } finally {

                setAddingToCartUuid(
                    null
                );
            }
        };


    // ==================================================
    // Product View
    // ==================================================

    const handleViewProduct =
        (
            item
        ) => {

            const productUuid =
                getProductUuid(
                    item
                );


            if (!productUuid) {

                showMessage(
                    "شناسه محصول پیدا نشد."
                );

                return;
            }


            navigate(
                `/products/${productUuid}`
            );
        };


    // ==================================================
    // Loading
    // ==================================================

    if (isLoading) {

        return (
            <Box
                sx={{
                    width:
                        "100%",

                    minHeight:
                        500,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    direction:
                        "ltr",
                }}
            >

                <CircularProgress
                    size={38}
                    sx={{
                        color:
                            GOLD,
                    }}
                />

            </Box>
        );
    }


    // ==================================================
    // Render
    // ==================================================

    return (
        <Box
            sx={{
                width:
                    "100%",

                minWidth:
                    0,

                direction:
                    "ltr",

                boxSizing:
                    "border-box",
            }}
        >

            {/* ==========================================
                Header
            ========================================== */}

            <Box
                sx={{
                    mb: 3,

                    display:
                        "flex",

                    alignItems: {
                        xs:
                            "flex-start",
                        sm:
                            "center",
                    },

                    justifyContent:
                        "space-between",

                    flexDirection: {
                        xs:
                            "column",
                        sm:
                            "row",
                    },

                    gap: 2,

                    direction:
                        "ltr",
                }}
            >

                <Box
                    sx={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 1.5,
                    }}
                >

                    <IconButton
                        onClick={() =>
                            navigate(
                                "/user"
                            )
                        }
                        sx={{
                            border:
                                "1px solid #e5e5e5",

                            borderRadius:
                                2,

                            color:
                                "#444",

                            "&:hover":
                                {
                                    borderColor:
                                        GOLD,

                                    color:
                                        GOLD,

                                    backgroundColor:
                                        "#fffdf5",
                                },
                        }}
                    >
                        <ArrowBackOutlined />
                    </IconButton>


                    <Box
                        sx={{
                            direction:
                                "rtl",

                            textAlign:
                                "right",
                        }}
                    >

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight:
                                    800,

                                color:
                                    "#111",

                                mb: 0.7,
                            }}
                        >
                            علاقه‌مندی‌ها
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "text.secondary",
                            }}
                        >
                            محصولاتی که ذخیره کرده‌اید
                        </Typography>

                    </Box>

                </Box>


                {wishlist.length >
                    0 && (
                    <Box
                        sx={{
                            px: 2,

                            py: 1,

                            borderRadius:
                                2,

                            backgroundColor:
                                "#fffdf5",

                            border:
                                `1px solid ${GOLD}`,

                            direction:
                                "rtl",
                        }}
                    >

                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight:
                                    700,

                                color:
                                    GOLD,
                            }}
                        >
                            {wishlist.length.toLocaleString(
                                "fa-IR"
                            )}{" "}
                            محصول
                        </Typography>

                    </Box>
                )}

            </Box>


            {/* ==========================================
                Empty State
            ========================================== */}

            {wishlist.length ===
            0 ? (

                <Card
                    elevation={0}
                    sx={{
                        borderRadius:
                            2,

                        border:
                            "1px solid #e8e8e8",

                        backgroundColor:
                            "#fff",
                    }}
                >

                    <CardContent
                        sx={{
                            py: 8,

                            textAlign:
                                "center",

                            direction:
                                "rtl",
                        }}
                    >

                        <Box
                            sx={{
                                width:
                                    78,

                                height:
                                    78,

                                mx:
                                    "auto",

                                mb: 2,

                                borderRadius:
                                    "50%",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                backgroundColor:
                                    "#fff5f5",
                            }}
                        >

                            <FavoriteBorder
                                sx={{
                                    fontSize:
                                        40,

                                    color:
                                        "#bbb",
                                }}
                            />

                        </Box>


                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight:
                                    800,

                                mb: 1,
                            }}
                        >
                            لیست علاقه‌مندی‌های شما خالی است
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "text.secondary",

                                mb: 3,

                                lineHeight:
                                    1.9,
                            }}
                        >
                            محصولاتی که دوست دارید را
                            به علاقه‌مندی‌ها اضافه کنید
                            تا بعداً به راحتی به آن‌ها
                            دسترسی داشته باشید.
                        </Typography>


                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                            sx={{
                                borderRadius:
                                    2,

                                backgroundColor:
                                    GOLD,

                                color:
                                    "#fff",

                                fontWeight:
                                    700,

                                boxShadow:
                                    "none",

                                "&:hover":
                                    {
                                        backgroundColor:
                                            "#b8962e",

                                        boxShadow:
                                            "none",
                                    },
                            }}
                        >
                            مشاهده محصولات
                        </Button>

                    </CardContent>

                </Card>

            ) : (

                /* ======================================
                   Wishlist Grid
                ====================================== */

                <Grid
                    container
                    spacing={3}
                    sx={{
                        direction:
                            "ltr",
                    }}
                >

                    {wishlist.map(
                        (
                            item,
                            index
                        ) => {

                            const productUuid =
                                getProductUuid(
                                    item
                                );

                            const name =
                                getProductName(
                                    item
                                );

                            const description =
                                getProductDescription(
                                    item
                                );

                            const price =
                                getProductPrice(
                                    item
                                );

                            const discount =
                                getProductDiscount(
                                    item
                                );

                            const finalPrice =
                                getDiscountedPrice(
                                    price,
                                    discount
                                );

                            const image =
                                getProductImage(
                                    item
                                );

                            const stock =
                                getStock(
                                    item
                                );

                            const isDeleting =
                                String(
                                    deletingUuid
                                ) ===
                                String(
                                    productUuid
                                );

                            const isAdding =
                                String(
                                    addingToCartUuid
                                ) ===
                                String(
                                    productUuid
                                );


                            return (
                                <Grid
                                    key={
                                        productUuid ||
                                        index
                                    }
                                    size={{
                                        xs:
                                            12,
                                        sm:
                                            6,
                                        lg:
                                            4,
                                        xl:
                                            3,
                                    }}
                                >

                                    <Card
                                        elevation={
                                            0
                                        }
                                        sx={{
                                            height:
                                                "100%",

                                            borderRadius:
                                                2,

                                            border:
                                                "1px solid #e8e8e8",

                                            overflow:
                                                "hidden",

                                            backgroundColor:
                                                "#fff",

                                            transition:
                                                "all 0.2s ease",

                                            "&:hover":
                                                {
                                                    borderColor:
                                                        GOLD,

                                                    transform:
                                                        "translateY(-2px)",
                                                },
                                        }}
                                    >

                                        {/* Image */}

                                        <Box
                                            sx={{
                                                position:
                                                    "relative",

                                                height:
                                                    220,

                                                backgroundColor:
                                                    "#fafafa",

                                                overflow:
                                                    "hidden",
                                            }}
                                        >

                                            {image ? (

                                                <Box
                                                    component="img"
                                                    src={
                                                        image
                                                    }
                                                    alt={
                                                        name
                                                    }
                                                    sx={{
                                                        width:
                                                            "100%",

                                                        height:
                                                            "100%",

                                                        objectFit:
                                                            "contain",

                                                        display:
                                                            "block",

                                                        p:
                                                            2,

                                                        transition:
                                                            "transform 0.25s ease",

                                                        "&:hover":
                                                            {
                                                                transform:
                                                                    "scale(1.04)",
                                                            },
                                                    }}
                                                    onError={(
                                                        event
                                                    ) => {
                                                        event.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                            ) : (

                                                <Box
                                                    sx={{
                                                        width:
                                                            "100%",

                                                        height:
                                                            "100%",

                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "center",

                                                        color:
                                                            "#ccc",
                                                    }}
                                                >

                                                    <ShoppingCartOutlined
                                                        sx={{
                                                            fontSize:
                                                                55,
                                                        }}
                                                    />

                                                </Box>
                                            )}


                                            {/* Favorite */}

                                            <IconButton
                                                onClick={() =>
                                                    handleRemove(
                                                        item
                                                    )
                                                }
                                                disabled={
                                                    isDeleting
                                                }
                                                sx={{
                                                    position:
                                                        "absolute",

                                                    top:
                                                        10,

                                                    right:
                                                        10,

                                                    width:
                                                        38,

                                                    height:
                                                        38,

                                                    backgroundColor:
                                                        "#fff",

                                                    color:
                                                        "#e53935",

                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.08)",

                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "#fff5f5",
                                                        },
                                                }}
                                            >

                                                {isDeleting ? (

                                                    <CircularProgress
                                                        size={
                                                            18
                                                        }
                                                        sx={{
                                                            color:
                                                                "#e53935",
                                                        }}
                                                    />

                                                ) : (

                                                    <Favorite
                                                        fontSize="small"
                                                    />

                                                )}

                                            </IconButton>


                                            {/* Discount */}

                                            {discount >
                                                0 && (
                                                <Box
                                                    sx={{
                                                        position:
                                                            "absolute",

                                                        top:
                                                            12,

                                                        left:
                                                            12,

                                                        px:
                                                            1,

                                                        py:
                                                            0.5,

                                                        borderRadius:
                                                            1,

                                                        backgroundColor:
                                                            "#111",

                                                        color:
                                                            "#fff",

                                                        fontSize:
                                                            12,

                                                        fontWeight:
                                                            800,

                                                        direction:
                                                            "rtl",
                                                    }}
                                                >
                                                    {discount.toLocaleString(
                                                        "fa-IR"
                                                    )}
                                                    ٪ تخفیف
                                                </Box>
                                            )}

                                        </Box>


                                        {/* Content */}

                                        <CardContent
                                            sx={{
                                                p:
                                                    2,

                                                direction:
                                                    "rtl",
                                            }}
                                        >

                                            {/* Name */}

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        800,

                                                    fontSize:
                                                        16,

                                                    color:
                                                        "#111",

                                                    mb:
                                                        1,

                                                    minHeight:
                                                        48,

                                                    display:
                                                        "-webkit-box",

                                                    WebkitLineClamp:
                                                        2,

                                                    WebkitBoxOrient:
                                                        "vertical",

                                                    overflow:
                                                        "hidden",

                                                    textAlign:
                                                        "right",
                                                }}
                                            >
                                                {name}
                                            </Typography>


                                            {/* Description */}

                                            {description && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color:
                                                            "text.secondary",

                                                        lineHeight:
                                                            1.8,

                                                        minHeight:
                                                            44,

                                                        mb:
                                                            1.5,

                                                        display:
                                                            "-webkit-box",

                                                        WebkitLineClamp:
                                                            2,

                                                        WebkitBoxOrient:
                                                            "vertical",

                                                        overflow:
                                                            "hidden",

                                                        textAlign:
                                                            "right",
                                                    }}
                                                >
                                                    {
                                                        description
                                                    }
                                                </Typography>
                                            )}


                                            {/* Price */}

                                            <Box
                                                sx={{
                                                    minHeight:
                                                        58,

                                                    mb:
                                                        1.5,

                                                    direction:
                                                        "rtl",
                                                }}
                                            >

                                                {discount >
                                                    0 && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color:
                                                                "#999",

                                                            textDecoration:
                                                                "line-through",

                                                            mb:
                                                                0.3,

                                                            direction:
                                                                "rtl",
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            price
                                                        )}
                                                    </Typography>
                                                )}


                                                <Typography
                                                    sx={{
                                                        fontWeight:
                                                            900,

                                                        color:
                                                            "#111",

                                                        fontSize:
                                                            17,
                                                    }}
                                                >
                                                    {formatPrice(
                                                        finalPrice
                                                    )}
                                                </Typography>

                                            </Box>


                                            {/* Stock */}

                                            <Box
                                                sx={{
                                                    mb:
                                                        1.5,

                                                    direction:
                                                        "rtl",
                                                }}
                                            >

                                                {stock >
                                                0 ? (

                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color:
                                                                "#2e7d32",

                                                            fontWeight:
                                                                700,
                                                        }}
                                                    >
                                                        موجود در انبار
                                                    </Typography>

                                                ) : (

                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color:
                                                                "#d32f2f",

                                                            fontWeight:
                                                                700,
                                                        }}
                                                    >
                                                        ناموجود
                                                    </Typography>
                                                )}

                                            </Box>


                                            {/* Buttons */}

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",

                                                    gap:
                                                        1,

                                                    direction:
                                                        "ltr",
                                                }}
                                            >

                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    disabled={
                                                        stock <=
                                                            0 ||
                                                        isAdding
                                                    }
                                                    startIcon={
                                                        isAdding ? (
                                                            <CircularProgress
                                                                size={
                                                                    16
                                                                }
                                                                sx={{
                                                                    color:
                                                                        "#fff",
                                                                }}
                                                            />
                                                        ) : (
                                                            <ShoppingCartOutlined
                                                                fontSize="small"
                                                            />
                                                        )
                                                    }
                                                    onClick={() =>
                                                        handleAddToCart(
                                                            item
                                                        )
                                                    }
                                                    sx={{
                                                        borderRadius:
                                                            1.5,

                                                        backgroundColor:
                                                            GOLD,

                                                        color:
                                                            "#fff",

                                                        fontWeight:
                                                            700,

                                                        fontSize:
                                                            12,

                                                        boxShadow:
                                                            "none",

                                                        "&:hover":
                                                            {
                                                                backgroundColor:
                                                                    "#b8962e",

                                                                boxShadow:
                                                                    "none",
                                                            },

                                                        "&.Mui-disabled":
                                                            {
                                                                backgroundColor:
                                                                    "#ddd",

                                                                color:
                                                                    "#999",
                                                            },
                                                    }}
                                                >
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            direction:
                                                                "rtl",
                                                        }}
                                                    >
                                                        {isAdding
                                                            ? "در حال افزودن..."
                                                            : "افزودن به سبد"}
                                                    </Box>
                                                </Button>


                                                <IconButton
                                                    onClick={() =>
                                                        handleViewProduct(
                                                            item
                                                        )
                                                    }
                                                    sx={{
                                                        width:
                                                            42,

                                                        height:
                                                            42,

                                                        flexShrink:
                                                            0,

                                                        border:
                                                            "1px solid #e5e5e5",

                                                        borderRadius:
                                                            1.5,

                                                        color:
                                                            "#555",

                                                        "&:hover":
                                                            {
                                                                borderColor:
                                                                    GOLD,

                                                                color:
                                                                    GOLD,

                                                                backgroundColor:
                                                                    "#fffdf5",
                                                            },
                                                    }}
                                                >
                                                    <VisibilityOutlined
                                                        fontSize="small"
                                                    />
                                                </IconButton>

                                            </Box>

                                        </CardContent>

                                    </Card>

                                </Grid>
                            );
                        }
                    )}

                </Grid>

            )}


            {/* ==========================================
                Snackbar
            ========================================== */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={
                    4000
                }
                onClose={
                    closeSnackbar
                }
                anchorOrigin={{
                    vertical:
                        "bottom",

                    horizontal:
                        "center",
                }}
            >

                <Alert
                    onClose={
                        closeSnackbar
                    }
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    sx={{
                        width:
                            "100%",

                        direction:
                            "rtl",
                    }}
                >
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </Box>
    );
}