import React, { useRef, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";

import {
    Save,
    Image as ImageIcon,
    Delete,
    Upload,
} from "@mui/icons-material";


// ==============================
// Reusable Settings Section
// ==============================

const SettingsSection = ({ title, description, children }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                border: "1px solid #e5e5e5",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#fff",
            }}
        >
            <Box
                sx={{
                    p: 3,
                    textAlign: "left",
                    direction: "ltr",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#111",
                        mb: 0.5,
                        textAlign: "left",
                        direction: "ltr",
                    }}
                >
                    {title}
                </Typography>

                {description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777",
                            textAlign: "left",
                            direction: "ltr",
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>

            <Divider />

            <Box
                sx={{
                    p: 3,
                    direction: "ltr",
                    textAlign: "left",
                }}
            >
                {children}
            </Box>
        </Paper>
    );
};


// ==============================
// Switch Row
// ==============================

const SwitchRow = ({ label, description, checked, onChange }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                py: 1.5,
                direction: "ltr",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: "left",
                    direction: "ltr",
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        color: "#222",
                        textAlign: "left",
                        direction: "ltr",
                    }}
                >
                    {label}
                </Typography>

                {description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777",
                            mt: 0.4,
                            textAlign: "left",
                            direction: "ltr",
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>

            <Switch
                checked={checked}
                onChange={onChange}
                sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#D4AF37",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#D4AF37",
                    },
                }}
            />
        </Box>
    );
};


// ==============================
// Input Style
// ==============================

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 1.5,
        backgroundColor: "#fff",
        "&.Mui-focused fieldset": {
            borderColor: "#D4AF37",
        },
    },

    "& .MuiInputLabel-root.Mui-focused": {
        color: "#D4AF37",
    },

    "& .MuiInputBase-input": {
        textAlign: "left",
        direction: "ltr",
    },

    "& textarea": {
        textAlign: "left",
        direction: "ltr",
    },
};


// ==============================
// Admin Settings
// ==============================

const AdminSettings = () => {
    const bannerInputRef = useRef(null);

    const [settings, setSettings] = useState({
        // General
        siteName: "Golden Tower",
        siteTitle: "Golden Tower | فروشگاه آنلاین",
        siteDescription: "فروشگاه آنلاین گلدن تاور",

        // Contact
        phone: "",
        email: "",
        address: "",

        // Social
        instagram: "",
        telegram: "",
        whatsapp: "",

        // Store
        storeStatus: true,
        allowRegistration: true,
        allowGuestPurchase: true,

        // Shipping
        shippingEnabled: true,
        shippingCost: 0,
        freeShippingEnabled: false,
        freeShippingMinimum: 0,

        // Payment
        onlinePaymentEnabled: true,
        cashOnDelivery: false,

        // SEO
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",

        // Language
        language: "fa",

        // Home Banner
        homeBanner: null,
        homeBannerPreview: "",
        homeBannerAlt: "",
        homeBannerLink: "",
        homeBannerEnabled: true,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });


    // ==============================
    // Handle Change
    // ==============================

    const handleChange = (field, value) => {
        setSettings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    // ==============================
    // Banner Upload
    // ==============================

    const handleBannerUpload = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setSnackbar({
                open: true,
                message: "فقط فایل تصویری قابل انتخاب است.",
                severity: "error",
            });

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message: "حجم تصویر نباید بیشتر از 5MB باشد.",
                severity: "error",
            });

            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setSettings((prev) => ({
            ...prev,
            homeBanner: file,
            homeBannerPreview: previewUrl,
        }));
    };


    // ==============================
    // Remove Banner
    // ==============================

    const removeBanner = () => {
        if (settings.homeBannerPreview) {
            URL.revokeObjectURL(settings.homeBannerPreview);
        }

        setSettings((prev) => ({
            ...prev,
            homeBanner: null,
            homeBannerPreview: "",
        }));

        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };


    // ==============================
    // Save
    // ==============================

    const handleSave = async () => {
        /*
            بعداً می‌توانی اینجا API را اضافه کنی.

            چون homeBanner یک File است،
            پیشنهاد می‌شود برای ارسال اطلاعات از FormData استفاده شود.

            مثال:

            const formData = new FormData();

            formData.append("siteName", settings.siteName);
            formData.append("siteTitle", settings.siteTitle);

            if (settings.homeBanner) {
                formData.append("homeBanner", settings.homeBanner);
            }

            await axios.put("/api/settings", formData);
        */

        console.log("Settings:", settings);

        setSnackbar({
            open: true,
            message: "تنظیمات با موفقیت ذخیره شد.",
            severity: "success",
        });
    };


    return (
        <Box
            sx={{
                width: "100%",
                direction: "ltr",
                textAlign: "left",
                pb: 5,
            }}
        >

            {/* ================================= */}
            {/* Page Header */}
            {/* ================================= */}

            <Box
                sx={{
                    width: "100%",
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    direction: "ltr",
                }}
            >
                <Box
                    sx={{
                        textAlign: "left",
                        direction: "ltr",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: "#111",
                            mb: 0.5,
                            textAlign: "left",
                            direction: "ltr",
                        }}
                    >
                        تنظیمات
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#777",
                            textAlign: "left",
                            direction: "ltr",
                        }}
                    >
                        مدیریت تنظیمات اصلی فروشگاه
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                        minWidth: 150,
                        height: 44,
                        borderRadius: 1.5,
                        backgroundColor: "#D4AF37",
                        color: "#111",
                        fontWeight: 700,
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: "#c19f2e",
                            boxShadow: "none",
                        },
                    }}
                >
                    ذخیره تغییرات
                </Button>
            </Box>


            {/* ================================= */}
            {/* General Settings */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="تنظیمات عمومی"
                    description="اطلاعات اصلی وب‌سایت و فروشگاه"
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="نام سایت"
                            value={settings.siteName}
                            onChange={(e) =>
                                handleChange("siteName", e.target.value)
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            label="عنوان سایت"
                            value={settings.siteTitle}
                            onChange={(e) =>
                                handleChange("siteTitle", e.target.value)
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="توضیحات سایت"
                            value={settings.siteDescription}
                            onChange={(e) =>
                                handleChange(
                                    "siteDescription",
                                    e.target.value
                                )
                            }
                            sx={{
                                ...inputSx,
                                gridColumn: {
                                    xs: "auto",
                                    md: "1 / -1",
                                },
                            }}
                        />
                    </Box>
                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Home Banner */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="بنر صفحه اصلی"
                    description="بنری که در قسمت بالای صفحه Home نمایش داده می‌شود"
                >

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            direction: "ltr",
                        }}
                    >

                        {/* Upload */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                direction: "ltr",
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: "left",
                                    direction: "ltr",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: "#222",
                                        textAlign: "left",
                                    }}
                                >
                                    تصویر بنر
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#777",
                                        mt: 0.5,
                                        textAlign: "left",
                                    }}
                                >
                                    فرمت‌های JPG، PNG و WEBP تا حداکثر 5MB
                                </Typography>
                            </Box>

                            <Box>
                                <input
                                    ref={bannerInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleBannerUpload}
                                />

                                <Button
                                    variant="outlined"
                                    startIcon={<Upload />}
                                    onClick={() =>
                                        bannerInputRef.current?.click()
                                    }
                                    sx={{
                                        borderColor: "#D4AF37",
                                        color: "#111",
                                        fontWeight: 600,
                                        borderRadius: 1.5,
                                        "&:hover": {
                                            borderColor: "#D4AF37",
                                            backgroundColor:
                                                "rgba(212,175,55,0.08)",
                                        },
                                    }}
                                >
                                    انتخاب تصویر
                                </Button>
                            </Box>
                        </Box>


                        {/* Banner Preview */}
                        {settings.homeBannerPreview && (
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    border: "1px solid #e5e5e5",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    backgroundColor: "#fafafa",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={settings.homeBannerPreview}
                                    alt="Home Banner"
                                    sx={{
                                        width: "100%",
                                        maxHeight: 320,
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />

                                <IconButton
                                    onClick={removeBanner}
                                    sx={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        backgroundColor: "#fff",
                                        color: "#d32f2f",
                                        "&:hover": {
                                            backgroundColor: "#fff",
                                        },
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        )}


                        {/* Banner Inputs */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr",
                                },
                                gap: 2,
                            }}
                        >

                            <TextField
                                fullWidth
                                label="متن جایگزین تصویر"
                                value={settings.homeBannerAlt}
                                onChange={(e) =>
                                    handleChange(
                                        "homeBannerAlt",
                                        e.target.value
                                    )
                                }
                                sx={inputSx}
                            />

                            <TextField
                                fullWidth
                                label="لینک بنر"
                                placeholder="https://..."
                                value={settings.homeBannerLink}
                                onChange={(e) =>
                                    handleChange(
                                        "homeBannerLink",
                                        e.target.value
                                    )
                                }
                                sx={inputSx}
                            />

                        </Box>


                        <SwitchRow
                            label="نمایش بنر"
                            description="در صورت خاموش بودن، بنر در صفحه اصلی نمایش داده نمی‌شود."
                            checked={settings.homeBannerEnabled}
                            onChange={(e) =>
                                handleChange(
                                    "homeBannerEnabled",
                                    e.target.checked
                                )
                            }
                        />

                    </Box>

                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Contact */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="اطلاعات تماس"
                    description="اطلاعاتی که کاربران برای ارتباط با فروشگاه استفاده می‌کنند"
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="شماره تماس"
                            value={settings.phone}
                            onChange={(e) =>
                                handleChange("phone", e.target.value)
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            label="ایمیل"
                            value={settings.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value)
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="آدرس"
                            value={settings.address}
                            onChange={(e) =>
                                handleChange("address", e.target.value)
                            }
                            sx={{
                                ...inputSx,
                                gridColumn: {
                                    xs: "auto",
                                    md: "1 / -1",
                                },
                            }}
                        />

                    </Box>
                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Social */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="شبکه‌های اجتماعی"
                    description="لینک شبکه‌های اجتماعی فروشگاه"
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Instagram"
                            placeholder="https://instagram.com/..."
                            value={settings.instagram}
                            onChange={(e) =>
                                handleChange("instagram", e.target.value)
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            label="Telegram"
                            placeholder="https://t.me/..."
                            value={settings.telegram}
                            onChange={(e) =>
                                handleChange("telegram", e.target.value)
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            label="WhatsApp"
                            placeholder="https://wa.me/..."
                            value={settings.whatsapp}
                            onChange={(e) =>
                                handleChange("whatsapp", e.target.value)
                            }
                            sx={inputSx}
                        />

                    </Box>
                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Store */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="تنظیمات فروشگاه"
                    description="مدیریت وضعیت فروشگاه و ثبت سفارش"
                >

                    <SwitchRow
                        label="فعال بودن فروشگاه"
                        description="در صورت خاموش بودن، فروشگاه غیرفعال خواهد شد."
                        checked={settings.storeStatus}
                        onChange={(e) =>
                            handleChange("storeStatus", e.target.checked)
                        }
                    />

                    <Divider />

                    <SwitchRow
                        label="اجازه ثبت‌نام کاربران"
                        description="کاربران جدید می‌توانند حساب کاربری ایجاد کنند."
                        checked={settings.allowRegistration}
                        onChange={(e) =>
                            handleChange(
                                "allowRegistration",
                                e.target.checked
                            )
                        }
                    />

                    <Divider />

                    <SwitchRow
                        label="خرید بدون ورود"
                        description="کاربر می‌تواند بدون ساخت حساب سفارش ثبت کند."
                        checked={settings.allowGuestPurchase}
                        onChange={(e) =>
                            handleChange(
                                "allowGuestPurchase",
                                e.target.checked
                            )
                        }
                    />

                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Shipping */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="تنظیمات ارسال"
                    description="مدیریت هزینه و شرایط ارسال سفارش‌ها"
                >

                    <SwitchRow
                        label="فعال بودن ارسال"
                        checked={settings.shippingEnabled}
                        onChange={(e) =>
                            handleChange(
                                "shippingEnabled",
                                e.target.checked
                            )
                        }
                    />

                    <Divider />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                            mt: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="هزینه ارسال"
                            value={settings.shippingCost}
                            onChange={(e) =>
                                handleChange(
                                    "shippingCost",
                                    e.target.value
                                )
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            type="number"
                            label="حداقل مبلغ ارسال رایگان"
                            value={settings.freeShippingMinimum}
                            onChange={(e) =>
                                handleChange(
                                    "freeShippingMinimum",
                                    e.target.value
                                )
                            }
                            sx={inputSx}
                        />

                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <SwitchRow
                            label="ارسال رایگان"
                            description="برای سفارش‌هایی که به حداقل مبلغ مشخص‌شده برسند."
                            checked={settings.freeShippingEnabled}
                            onChange={(e) =>
                                handleChange(
                                    "freeShippingEnabled",
                                    e.target.checked
                                )
                            }
                        />
                    </Box>

                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Payment */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="تنظیمات پرداخت"
                    description="روش‌های پرداخت قابل استفاده در فروشگاه"
                >

                    <SwitchRow
                        label="پرداخت آنلاین"
                        description="پرداخت از طریق درگاه اینترنتی"
                        checked={settings.onlinePaymentEnabled}
                        onChange={(e) =>
                            handleChange(
                                "onlinePaymentEnabled",
                                e.target.checked
                            )
                        }
                    />

                    <Divider />

                    <SwitchRow
                        label="پرداخت در محل"
                        description="پرداخت هنگام دریافت سفارش"
                        checked={settings.cashOnDelivery}
                        onChange={(e) =>
                            handleChange(
                                "cashOnDelivery",
                                e.target.checked
                            )
                        }
                    />

                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* SEO */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="تنظیمات SEO"
                    description="اطلاعات متا برای موتورهای جستجو"
                >

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Meta Title"
                            value={settings.metaTitle}
                            onChange={(e) =>
                                handleChange(
                                    "metaTitle",
                                    e.target.value
                                )
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Meta Description"
                            value={settings.metaDescription}
                            onChange={(e) =>
                                handleChange(
                                    "metaDescription",
                                    e.target.value
                                )
                            }
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            label="Meta Keywords"
                            value={settings.metaKeywords}
                            onChange={(e) =>
                                handleChange(
                                    "metaKeywords",
                                    e.target.value
                                )
                            }
                            sx={inputSx}
                        />

                    </Box>

                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Language */}
            {/* ================================= */}

            <Box sx={{ mb: 3 }}>
                <SettingsSection
                    title="زبان سایت"
                    description="زبان پیش‌فرض فروشگاه"
                >

                    <Select
                        fullWidth
                        value={settings.language}
                        onChange={(e) =>
                            handleChange(
                                "language",
                                e.target.value
                            )
                        }
                        sx={{
                            borderRadius: 1.5,
                            textAlign: "left",
                            direction: "ltr",

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor: "#D4AF37",
                                },
                        }}
                    >
                        <MenuItem value="fa">
                            فارسی
                        </MenuItem>

                        {/* <MenuItem value="en">
                            English
                        </MenuItem> */}
                    </Select>

                </SettingsSection>
            </Box>


            {/* ================================= */}
            {/* Bottom Save */}
            {/* ================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mt: 4,
                    direction: "ltr",
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                        minWidth: 180,
                        height: 46,
                        borderRadius: 1.5,
                        backgroundColor: "#D4AF37",
                        color: "#111",
                        fontWeight: 700,
                        boxShadow: "none",

                        "&:hover": {
                            backgroundColor: "#c19f2e",
                            boxShadow: "none",
                        },
                    }}
                >
                    ذخیره تغییرات
                </Button>
            </Box>


            {/* ================================= */}
            {/* Snackbar */}
            {/* ================================= */}

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
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    sx={{
                        width: "100%",
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default AdminSettings;