import React, { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    SaveOutlined,
    ImageOutlined,
    DeleteOutline,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000";
const gold = "#D4AF37";

const getToken = () => {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token") ||
        ""
    );
};

const AdminProductEdit = () => {
    const navigate = useNavigate();
    const { uuid } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [brands, setBrands] = useState([]);
    const [loadingBrands, setLoadingBrands] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        brand_uuid: "",
        model: "",
        original_price: "",
        discount: "",
        inStock: "",
        offer: false,
        size: "",
    });

    const [errors, setErrors] = useState({});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // -----------------------------------------
    // Input Style
    // -----------------------------------------

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#fafafa",
            minHeight: 48,

            "& fieldset": {
                borderColor: "#e4e4e4",
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
            fontSize: 13,
            color: "#222",
        },

        "& textarea": {
            fontSize: 13,
            lineHeight: 1.9,
        },

        "& .MuiFormHelperText-root": {
            fontSize: 10,
            marginLeft: 0,
            marginRight: 0,
        },
    };

    // -----------------------------------------
    // Snackbar
    // -----------------------------------------

    const showSnackbar = (
        message,
        severity = "success"
    ) => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    // -----------------------------------------
    // Helpers
    // -----------------------------------------

    const getProductData = (data) => {
        return (
            data?.product ||
            data?.data?.product ||
            data?.data ||
            data
        );
    };

    const getBrandId = (brand) => {
        return (
            brand?.uuid ||
            brand?.brand_uuid ||
            brand?.id ||
            brand?._id ||
            ""
        );
    };

    const getBrandName = (brand) => {
        return (
            brand?.name ||
            brand?.title ||
            "بدون نام"
        );
    };

    const getImageUrl = (image) => {
        if (!image) return "";

        if (
            typeof image === "object"
        ) {
            image =
                image?.name ||
                image?.url ||
                image?.path ||
                "";
        }

        if (!image) return "";

        if (
            String(image).startsWith("http://") ||
            String(image).startsWith("https://")
        ) {
            return image;
        }

        if (String(image).startsWith("/api/")) {
            return `${API_URL}${image}`;
        }

        if (String(image).startsWith("/")) {
            return `${API_URL}${image}`;
        }

        return `${API_URL}/api/image/${image}`;
    };

    const getProductImage = (product) => {
        return (
            product?.image ||
            product?.main_image ||
            product?.image_name ||
            product?.image_url ||
            product?.images?.[0]?.name ||
            product?.images?.[0]?.url ||
            ""
        );
    };

    // -----------------------------------------
    // Fetch Brands
    // -----------------------------------------

    const fetchBrands = async () => {
        try {
            setLoadingBrands(true);

            const response = await fetch(
                `${API_URL}/api/brands`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch brands"
                );
            }

            const data = await response.json();

            const brandList =
                data?.brands ||
                data?.data ||
                data ||
                [];

            setBrands(
                Array.isArray(brandList)
                    ? brandList
                    : []
            );
        } catch (error) {
            console.error(
                "Brands fetch error:",
                error
            );

            showSnackbar(
                "دریافت برندها با خطا مواجه شد",
                "error"
            );
        } finally {
            setLoadingBrands(false);
        }
    };

    // -----------------------------------------
    // Fetch Product
    // -----------------------------------------

    const fetchProduct = async () => {
        if (!uuid) {
            showSnackbar(
                "شناسه محصول پیدا نشد",
                "error"
            );

            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const token = getToken();

            const response = await fetch(
                `${API_URL}/api/products/${uuid}`,
                {
                    method: "GET",
                    headers: {
                        ...(token
                            ? {
                                  Authorization: `Bearer ${token}`,
                              }
                            : {}),
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch product"
                );
            }

            const data = await response.json();

            const product = getProductData(data);

            if (!product) {
                throw new Error(
                    "Product not found"
                );
            }

            /*
             * برند می‌تواند به صورت:
             * brand_uuid
             * brand
             * brand.uuid
             * brand_id
             * برگردد.
             */

            const brandUuid =
                product?.brand_uuid ||
                product?.brand?.uuid ||
                product?.brand?.brand_uuid ||
                product?.brand_id ||
                "";

            const image = getProductImage(product);

            setForm({
                name: product?.name || "",
                description:
                    product?.description || "",
                brand_uuid: String(
                    brandUuid || ""
                ),
                model: product?.model || "",
                original_price:
                    product?.original_price ??
                    product?.originalPrice ??
                    "",
                discount:
                    product?.discount ?? "",
                inStock:
                    product?.inStock ??
                    product?.in_stock ??
                    product?.stock ??
                    product?.quantity ??
                    "",
                offer:
                    product?.offer === true ||
                    product?.offer === "true" ||
                    product?.offer === 1 ||
                    product?.offer === "1",
                size: product?.size || "",
            });

            if (image) {
                setImagePreview(
                    getImageUrl(image)
                );
            }
        } catch (error) {
            console.error(
                "Product fetch error:",
                error
            );

            showSnackbar(
                "دریافت اطلاعات محصول با خطا مواجه شد",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
        fetchProduct();
    }, [uuid]);

    // -----------------------------------------
    // Form Change
    // -----------------------------------------

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

    const handleOfferChange = (event) => {
        setForm((prev) => ({
            ...prev,
            offer: event.target.value,
        }));
    };

    // -----------------------------------------
    // Image
    // -----------------------------------------

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showSnackbar(
                "فایل انتخاب‌شده باید تصویر باشد",
                "error"
            );

            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showSnackbar(
                "حجم تصویر نباید بیشتر از ۵ مگابایت باشد",
                "error"
            );

            event.target.value = "";
            return;
        }

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    // -----------------------------------------
    // Validation
    // -----------------------------------------

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name =
                "نام محصول الزامی است";
        }

        if (!form.brand_uuid) {
            newErrors.brand_uuid =
                "انتخاب برند الزامی است";
        }

        if (
            form.original_price === "" ||
            Number(form.original_price) < 0
        ) {
            newErrors.original_price =
                "قیمت اصلی را به صورت صحیح وارد کنید";
        }

        if (
            form.discount !== "" &&
            (Number(form.discount) < 0 ||
                Number(form.discount) > 100)
        ) {
            newErrors.discount =
                "تخفیف باید بین ۰ تا ۱۰۰ باشد";
        }

        if (
            form.inStock === "" ||
            Number(form.inStock) < 0
        ) {
            newErrors.inStock =
                "موجودی را به صورت صحیح وارد کنید";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // -----------------------------------------
    // Update Product
    // -----------------------------------------

    const updateProduct = async () => {
        if (!validate()) {
            showSnackbar(
                "لطفاً اطلاعات محصول را بررسی کنید",
                "error"
            );
            return;
        }

        try {
            setSaving(true);

            const token = getToken();

            if (!token) {
                showSnackbar(
                    "توکن ورود پیدا نشد",
                    "error"
                );

                return;
            }

            const data = new FormData();

            data.append(
                "name",
                form.name.trim()
            );

            data.append(
                "description",
                form.description.trim()
            );

            /*
             * مهم:
             * مقدار brand باید UUID برند باشد.
             */
            data.append(
                "brand",
                form.brand_uuid
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
                String(
                    form.discount === ""
                        ? 0
                        : form.discount
                )
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

            /*
             * فقط اگر کاربر تصویر جدید
             * انتخاب کرده باشد ارسال می‌شود.
             */
            if (imageFile) {
                data.append(
                    "image",
                    imageFile
                );
            }

            const response = await fetch(
                `${API_URL}/api/products/${uuid}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            );

            let result = null;

            try {
                result = await response.json();
            } catch {
                result = null;
            }

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                        "Update product failed"
                );
            }

            showSnackbar(
                "محصول با موفقیت بروزرسانی شد"
            );

            setTimeout(() => {
                navigate("/admin/products");
            }, 800);
        } catch (error) {
            console.error(
                "Update product error:",
                error
            );

            showSnackbar(
                error?.message ||
                    "بروزرسانی محصول با خطا مواجه شد",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------------------
    // Loading
    // -----------------------------------------

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    direction: "ltr",
                }}
            >
                <CircularProgress
                    size={32}
                    sx={{ color: gold }}
                />

                <Typography
                    sx={{
                        mt: 2,
                        color: "#777",
                        fontSize: 13,
                    }}
                >
                    در حال دریافت اطلاعات محصول...
                </Typography>
            </Box>
        );
    }

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
                        ویرایش محصول
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            color: "#777",
                            fontSize: 14,
                        }}
                    >
                        ویرایش اطلاعات و مشخصات محصول
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/admin/products"
                        )
                    }
                    sx={{
                        borderColor: "#ddd",
                        color: "#555",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2,
                        "&:hover": {
                            borderColor: "#bbb",
                            backgroundColor:
                                "#fafafa",
                        },
                    }}
                >
                    بازگشت به محصولات
                </Button>
            </Box>

            {/* Main Form */}

            <Box
                sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 2,
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                {/* Basic Information */}

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#222",
                            mb: 2.5,
                        }}
                    >
                        اطلاعات اصلی
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
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
                            sx={inputSx}
                        />

                        <FormControl
                            fullWidth
                            error={Boolean(
                                errors.brand_uuid
                            )}
                            sx={{
                                ...inputSx,
                                "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#fafafa",
                                        minHeight: 48,
                                    },
                            }}
                        >
                            <InputLabel>
                                برند
                            </InputLabel>

                            <Select
                                name="brand_uuid"
                                value={
                                    form.brand_uuid
                                }
                                onChange={
                                    handleChange
                                }
                                label="برند"
                                disabled={
                                    loadingBrands
                                }
                            >
                                {loadingBrands ? (
                                    <MenuItem
                                        disabled
                                    >
                                        در حال دریافت
                                        برندها...
                                    </MenuItem>
                                ) : (
                                    brands.map(
                                        (brand) => {
                                            const brandId =
                                                getBrandId(
                                                    brand
                                                );

                                            return (
                                                <MenuItem
                                                    key={
                                                        brandId
                                                    }
                                                    value={String(
                                                        brandId
                                                    )}
                                                >
                                                    {getBrandName(
                                                        brand
                                                    )}
                                                </MenuItem>
                                            );
                                        }
                                    )
                                )}
                            </Select>

                            {errors.brand_uuid && (
                                <FormHelperText>
                                    {
                                        errors.brand_uuid
                                    }
                                </FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            fullWidth
                            label="مدل"
                            name="model"
                            value={form.model}
                            onChange={handleChange}
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            label="سایز"
                            name="size"
                            value={form.size}
                            onChange={handleChange}
                            placeholder="مثلاً 120*240*95"
                            sx={inputSx}
                        />
                    </Box>
                </Box>

                {/* Description */}

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#222",
                            mb: 2.5,
                        }}
                    >
                        توضیحات
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label="توضیحات محصول"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        sx={inputSx}
                    />
                </Box>

                {/* Price & Inventory */}

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#222",
                            mb: 2.5,
                        }}
                    >
                        قیمت و موجودی
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
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
                            onChange={handleChange}
                            error={Boolean(
                                errors.original_price
                            )}
                            helperText={
                                errors.original_price
                            }
                            inputProps={{
                                min: 0,
                            }}
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            type="number"
                            label="تخفیف (%)"
                            name="discount"
                            value={form.discount}
                            onChange={handleChange}
                            error={Boolean(
                                errors.discount
                            )}
                            helperText={
                                errors.discount
                            }
                            inputProps={{
                                min: 0,
                                max: 100,
                            }}
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            type="number"
                            label="موجودی"
                            name="inStock"
                            value={form.inStock}
                            onChange={handleChange}
                            error={Boolean(
                                errors.inStock
                            )}
                            helperText={
                                errors.inStock
                            }
                            inputProps={{
                                min: 0,
                            }}
                            sx={inputSx}
                        />

                        <FormControl
                            fullWidth
                            sx={{
                                ...inputSx,
                                "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#fafafa",
                                        minHeight: 48,
                                    },
                            }}
                        >
                            <InputLabel>
                                پیشنهاد ویژه
                            </InputLabel>

                            <Select
                                value={
                                    form.offer
                                        ? "true"
                                        : "false"
                                }
                                onChange={(e) =>
                                    setForm(
                                        (prev) => ({
                                            ...prev,
                                            offer:
                                                e
                                                    .target
                                                    .value ===
                                                "true",
                                        })
                                    )
                                }
                                label="پیشنهاد ویژه"
                            >
                                <MenuItem value="false">
                                    خیر
                                </MenuItem>

                                <MenuItem value="true">
                                    بله
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Image */}

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#222",
                            mb: 2.5,
                        }}
                    >
                        تصویر محصول
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 180,
                                height: 180,
                                borderRadius: 2,
                                border:
                                    "1px solid #e5e5e5",
                                backgroundColor:
                                    "#fafafa",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                overflow: "hidden",
                            }}
                        >
                            {imagePreview ? (
                                <img
                                    src={
                                        imagePreview
                                    }
                                    alt="تصویر محصول"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit:
                                            "contain",
                                    }}
                                />
                            ) : (
                                <ImageOutlined
                                    sx={{
                                        fontSize: 48,
                                        color: "#ccc",
                                    }}
                                />
                            )}
                        </Box>

                        <Box>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={
                                    <ImageOutlined />
                                }
                                sx={{
                                    borderColor:
                                        "#ddd",
                                    color: "#444",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    mb: 1,
                                    "&:hover": {
                                        borderColor:
                                            gold,
                                        backgroundColor:
                                            "#fffaf0",
                                    },
                                }}
                            >
                                انتخاب تصویر جدید

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                />
                            </Button>

                            {imagePreview && (
                                <Button
                                    display="flex"
                                    startIcon={
                                        <DeleteOutline />
                                    }
                                    onClick={
                                        removeImage
                                    }
                                    sx={{
                                        display:
                                            "flex",
                                        color: "#d32f2f",
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}
                                >
                                    حذف تصویر
                                </Button>
                            )}

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    color: "#999",
                                    fontSize: 11,
                                }}
                            >
                                فرمت‌های مجاز:
                                JPG، PNG، WEBP
                                <br />
                                حداکثر حجم: ۵ مگابایت
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Actions */}

                <Box
                    sx={{
                        pt: 3,
                        borderTop:
                            "1px solid #eee",
                        display: "flex",
                        justifyContent:
                            "flex-start",
                        alignItems: "center",
                        gap: 1.5,
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={
                            saving ? (
                                <CircularProgress
                                    size={18}
                                    sx={{
                                        color: "#111",
                                    }}
                                />
                            ) : (
                                <SaveOutlined />
                            )
                        }
                        onClick={updateProduct}
                        disabled={saving}
                        sx={{
                            backgroundColor: gold,
                            color: "#111",
                            fontWeight: 800,
                            px: 3,
                            py: 1.2,
                            borderRadius: 2,
                            minWidth: 150,
                            "&:hover": {
                                backgroundColor:
                                    "#b99524",
                            },
                        }}
                    >
                        {saving
                            ? "در حال ذخیره..."
                            : "ذخیره تغییرات"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        disabled={saving}
                        sx={{
                            borderColor: "#ddd",
                            color: "#555",
                            fontWeight: 600,
                            px: 2.5,
                            py: 1.2,
                            borderRadius: 2,
                            "&:hover": {
                                borderColor: "#bbb",
                                backgroundColor:
                                    "#fafafa",
                            },
                        }}
                    >
                        انصراف
                    </Button>
                </Box>
            </Box>

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

export default AdminProductEdit;