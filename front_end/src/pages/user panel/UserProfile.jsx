// src/pages/user panel/UserProfile.jsx

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    PersonOutline,
    PhoneOutlined,
    EmailOutlined,
    SaveOutlined,
    PhotoCameraOutlined,
    DeleteOutline,
    ArrowBackOutlined,
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


const getUserObject = (data) => {
    if (!data) {
        return null;
    }

    if (
        data.user &&
        typeof data.user === "object"
    ) {
        return data.user;
    }

    if (
        data.data &&
        typeof data.data === "object" &&
        !Array.isArray(data.data)
    ) {
        if (
            data.data.user &&
            typeof data.data.user === "object"
        ) {
            return data.data.user;
        }

        return data.data;
    }

    return data;
};


// ======================================================
// Component
// ======================================================

export default function UserProfile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

    const [avatarPreview, setAvatarPreview] =
        useState("");

    const [avatarFile, setAvatarFile] =
        useState(null);

    const [removeAvatar, setRemoveAvatar] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
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
        setSnackbar((current) => ({
            ...current,
            open: false,
        }));
    };


    // ==================================================
    // Fetch Profile
    // ==================================================

    const fetchProfile = useCallback(
        async () => {

            const token = getToken();

            if (!token) {
                showMessage(
                    "لطفاً ابتدا وارد حساب کاربری شوید."
                );

                setIsLoading(false);

                return;
            }

            try {

                setIsLoading(true);

                const response =
                    await axios.get(
                        `${API_URL}/api/users/me`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const userData =
                    getUserObject(
                        response.data
                    );

                if (!userData) {
                    throw new Error(
                        "User not found"
                    );
                }

                setUser(userData);

                setForm({
                    first_name:
                        getField(
                            userData,
                            [
                                "first_name",
                                "firstName",
                            ]
                        ),

                    last_name:
                        getField(
                            userData,
                            [
                                "last_name",
                                "lastName",
                            ]
                        ),

                    email:
                        getField(
                            userData,
                            [
                                "email",
                            ]
                        ),
                });

                const avatar =
                    getField(
                        userData,
                        [
                            "avatar",
                            "avatar_url",
                            "avatarUrl",
                        ]
                    );

                setAvatarPreview(
                    avatar || ""
                );

            } catch (error) {

                console.error(
                    "User profile error:",
                    error
                );

                const message =
                    error.response?.data
                        ?.message ||
                    "دریافت اطلاعات حساب با خطا مواجه شد.";

                showMessage(message);

            } finally {

                setIsLoading(false);

            }

        },
        [showMessage]
    );


    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);


    // ==================================================
    // Form Change
    // ==================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };


    // ==================================================
    // Avatar Select
    // ==================================================

    const handleAvatarChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            showMessage(
                "فایل انتخاب شده باید تصویر باشد."
            );

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showMessage(
                "حجم تصویر نباید بیشتر از ۵ مگابایت باشد."
            );

            return;
        }

        setAvatarFile(file);

        setRemoveAvatar(false);

        const preview =
            URL.createObjectURL(
                file
            );

        setAvatarPreview(preview);
    };


    // ==================================================
    // Remove Avatar
    // ==================================================

    const handleRemoveAvatar = () => {

        setAvatarFile(null);

        setAvatarPreview("");

        setRemoveAvatar(true);
    };


    // ==================================================
    // Save Profile
    // ==================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        const token = getToken();

        if (!token) {

            showMessage(
                "لطفاً ابتدا وارد حساب کاربری شوید."
            );

            return;
        }

        if (
            !form.first_name.trim() ||
            !form.last_name.trim()
        ) {

            showMessage(
                "نام و نام خانوادگی را وارد کنید."
            );

            return;
        }

        if (
            form.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email
            )
        ) {

            showMessage(
                "فرمت ایمیل صحیح نیست."
            );

            return;
        }

        try {

            setIsSaving(true);

            const userUuid =
                getField(
                    user,
                    [
                        "user_uuid",
                        "uuid",
                    ]
                );

            if (!userUuid) {
                throw new Error(
                    "User UUID not found"
                );
            }

            /*
             * چون avatar فایل است، از FormData
             * استفاده می‌کنیم.
             */

            const data = new FormData();

            data.append(
                "first_name",
                form.first_name.trim()
            );

            data.append(
                "last_name",
                form.last_name.trim()
            );

            data.append(
                "email",
                form.email.trim()
            );

            if (avatarFile) {

                data.append(
                    "avatar",
                    avatarFile
                );

            }

            if (removeAvatar) {

                data.append(
                    "remove_avatar",
                    "true"
                );

            }

            const response =
                await axios.put(
                    `${API_URL}/api/users/${userUuid}`,
                    data,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const updatedUser =
                getUserObject(
                    response.data
                );

            if (updatedUser) {

                setUser(
                    updatedUser
                );

                const avatar =
                    getField(
                        updatedUser,
                        [
                            "avatar",
                            "avatar_url",
                            "avatarUrl",
                        ]
                    );

                setAvatarPreview(
                    avatar || ""
                );
            }

            setAvatarFile(null);

            setRemoveAvatar(false);

            showMessage(
                "اطلاعات حساب با موفقیت بروزرسانی شد.",
                "success"
            );

        } catch (error) {

            console.error(
                "Update profile error:",
                error
            );

            const message =
                error.response?.data
                    ?.message ||
                "بروزرسانی اطلاعات حساب با خطا مواجه شد.";

            showMessage(message);

        } finally {

            setIsSaving(false);

        }
    };


    // ==================================================
    // Loading
    // ==================================================

    if (isLoading) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 500,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    direction: "ltr",
                }}
            >
                <CircularProgress
                    size={36}
                    sx={{
                        color: GOLD,
                    }}
                />
            </Box>
        );
    }


    // ==================================================
    // Error
    // ==================================================

    if (!user) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 500,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    direction: "ltr",
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 500,

                        borderRadius: 2,

                        border:
                            "1px solid #e8e8e8",
                    }}
                >
                    <CardContent
                        sx={{
                            py: 6,

                            textAlign:
                                "center",

                            direction:
                                "rtl",
                        }}
                    >
                        <PersonOutline
                            sx={{
                                fontSize: 52,
                                color: "#ccc",
                                mb: 2,
                            }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                            }}
                        >
                            اطلاعات حساب در دسترس نیست
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "text.secondary",
                                mb: 3,
                            }}
                        >
                            امکان دریافت اطلاعات
                            حساب کاربری وجود ندارد.
                        </Typography>

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    "/user"
                                )
                            }
                            sx={{
                                borderColor:
                                    "#ddd",
                                color:
                                    "#444",
                                borderRadius: 2,

                                "&:hover": {
                                    borderColor:
                                        GOLD,
                                    color:
                                        GOLD,
                                    backgroundColor:
                                        "#fffdf5",
                                },
                            }}
                        >
                            بازگشت به داشبورد
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        );
    }


    // ==================================================
    // User Data
    // ==================================================

    const phoneNumber =
        getField(
            user,
            [
                "phone_number",
                "phoneNumber",
                "phone",
            ],
            "-"
        );

    const userUuid =
        getField(
            user,
            [
                "user_uuid",
                "uuid",
            ],
            "-"
        );


    // ==================================================
    // Render
    // ==================================================

    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0,

                direction: "ltr",

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

                    display: "flex",

                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },

                    justifyContent:
                        "space-between",

                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },

                    gap: 2,

                    direction: "ltr",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
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
                            borderRadius: 2,
                            color: "#444",

                            "&:hover": {
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
                            اطلاعات حساب
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "text.secondary",
                            }}
                        >
                            مدیریت اطلاعات شخصی حساب کاربری
                        </Typography>

                    </Box>

                </Box>

            </Box>


            {/* ==========================================
                Profile
            ========================================== */}

            <form
                onSubmit={
                    handleSubmit
                }
            >

                <Grid
                    container
                    spacing={3}
                    sx={{
                        direction:
                            "ltr",
                    }}
                >

                    {/* ======================================
                        Avatar
                    ====================================== */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <Card
                            elevation={0}
                            sx={{
                                height:
                                    "100%",

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
                                    p: 3,

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    textAlign:
                                        "center",

                                    direction:
                                        "rtl",
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight:
                                            800,
                                        mb: 3,
                                    }}
                                >
                                    تصویر پروفایل
                                </Typography>

                                <Box
                                    sx={{
                                        position:
                                            "relative",
                                        mb: 2.5,
                                    }}
                                >

                                    <Avatar
                                        src={
                                            avatarPreview ||
                                            undefined
                                        }
                                        sx={{
                                            width: 130,
                                            height: 130,

                                            fontSize:
                                                42,

                                            backgroundColor:
                                                "#f5f5f5",

                                            color:
                                                GOLD,

                                            border:
                                                `3px solid ${GOLD}`,
                                        }}
                                    >
                                        {!avatarPreview &&
                                            form.first_name
                                                ?.charAt(
                                                    0
                                                )}
                                    </Avatar>

                                </Box>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        direction:
                                            "ltr",
                                    }}
                                >

                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={
                                            <PhotoCameraOutlined />
                                        }
                                        sx={{
                                            borderColor:
                                                "#ddd",
                                            color:
                                                "#444",
                                            borderRadius:
                                                2,

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
                                        انتخاب تصویر

                                        <input
                                            hidden
                                            type="file"
                                            accept="image/*"
                                            onChange={
                                                handleAvatarChange
                                            }
                                        />
                                    </Button>

                                    {avatarPreview && (
                                        <IconButton
                                            onClick={
                                                handleRemoveAvatar
                                            }
                                            sx={{
                                                border:
                                                    "1px solid #ddd",
                                                borderRadius:
                                                    2,
                                                color:
                                                    "#777",

                                                "&:hover":
                                                    {
                                                        color:
                                                            "#d32f2f",
                                                        borderColor:
                                                            "#d32f2f",
                                                    },
                                            }}
                                        >
                                            <DeleteOutline />
                                        </IconButton>
                                    )}

                                </Stack>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 2,

                                        color:
                                            "text.secondary",

                                        lineHeight:
                                            1.8,
                                    }}
                                >
                                    فرمت‌های مجاز:
                                    JPG، PNG، WEBP
                                    <br />
                                    حداکثر حجم: ۵ مگابایت
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>


                    {/* ======================================
                        Form
                    ====================================== */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 8,
                        }}
                    >

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
                                    p: {
                                        xs: 2,
                                        md: 3,
                                    },
                                }}
                            >

                                <Box
                                    sx={{
                                        mb: 3,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,

                                        direction:
                                            "rtl",
                                    }}
                                >

                                    <PersonOutline
                                        sx={{
                                            color:
                                                GOLD,
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight:
                                                800,
                                        }}
                                    >
                                        اطلاعات شخصی
                                    </Typography>

                                </Box>


                                <Grid
                                    container
                                    spacing={2.5}
                                    sx={{
                                        direction:
                                            "ltr",
                                    }}
                                >

                                    {/* First Name */}

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >

                                        <TextField
                                            fullWidth
                                            label="نام"
                                            name="first_name"
                                            value={
                                                form.first_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            InputLabelProps={{
                                                sx: {
                                                    direction:
                                                        "rtl",
                                                },
                                            }}
                                            sx={{
                                                direction:
                                                    "rtl",

                                                "& .MuiOutlinedInput-root":
                                                    {
                                                        borderRadius:
                                                            2,

                                                        "&:hover fieldset":
                                                            {
                                                                borderColor:
                                                                    GOLD,
                                                            },

                                                        "&.Mui-focused fieldset":
                                                            {
                                                                borderColor:
                                                                    GOLD,
                                                            },
                                                    },

                                                "& .MuiInputLabel-root.Mui-focused":
                                                    {
                                                        color:
                                                            GOLD,
                                                    },
                                            }}
                                        />

                                    </Grid>


                                    {/* Last Name */}

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >

                                        <TextField
                                            fullWidth
                                            label="نام خانوادگی"
                                            name="last_name"
                                            value={
                                                form.last_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            sx={{
                                                direction:
                                                    "rtl",

                                                "& .MuiOutlinedInput-root":
                                                    {
                                                        borderRadius:
                                                            2,

                                                        "&:hover fieldset":
                                                            {
                                                                borderColor:
                                                                    GOLD,
                                                            },

                                                        "&.Mui-focused fieldset":
                                                            {
                                                                borderColor:
                                                                    GOLD,
                                                            },
                                                    },

                                                "& .MuiInputLabel-root.Mui-focused":
                                                    {
                                                        color:
                                                            GOLD,
                                                    },
                                            }}
                                        />

                                    </Grid>


                                    {/* Phone */}

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >

                                        <TextField
                                            fullWidth
                                            label="شماره تلفن"
                                            value={
                                                phoneNumber
                                            }
                                            disabled
                                            sx={{
                                                direction:
                                                    "ltr",

                                                "& .MuiOutlinedInput-root":
                                                    {
                                                        borderRadius:
                                                            2,
                                                    },
                                            }}
                                            InputProps={{
                                                startAdornment:
                                                    (
                                                        <PhoneOutlined
                                                            sx={{
                                                                mr: 1,
                                                                color:
                                                                    "#999",
                                                            }}
                                                        />
                                                    ),
                                            }}
                                        />

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display:
                                                    "block",

                                                mt: 0.7,

                                                direction:
                                                    "rtl",

                                                textAlign:
                                                    "right",

                                                color:
                                                    "text.secondary",
                                            }}
                                        >
                                            شماره تلفن از طریق
                                            ورود با OTP مدیریت
                                            می‌شود.
                                        </Typography>

                                    </Grid>


                                    {/* Email */}

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >

                                        <TextField
                                            fullWidth
                                            label="ایمیل"
                                            name="email"
                                            type="email"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            InputProps={{
                                                startAdornment:
                                                    (
                                                        <EmailOutlined
                                                            sx={{
                                                                mr: 1,
                                                                color:
                                                                    "#999",
                                                            }}
                                                        />
                                                    ),
                                            }}
                                            sx={{
                                                direction:
                                                    "ltr",

                                                "& .MuiOutlinedInput-root":
                                                    {
                                                        borderRadius:
                                                            2,

                                                        "&:hover fieldset":
                                                            {
                                                                borderColor:
                                                                    GOLD,
                                                            },

                                                        "&.Mui-focused fieldset":
                                                            {
                                                                borderColor:
                                                                    GOLD,
                                                            },
                                                    },

                                                "& .MuiInputLabel-root":
                                                    {
                                                        direction:
                                                            "rtl",
                                                    },

                                                "& .MuiInputLabel-root.Mui-focused":
                                                    {
                                                        color:
                                                            GOLD,
                                                    },
                                            }}
                                        />

                                    </Grid>

                                </Grid>


                                <Divider
                                    sx={{
                                        my: 3,
                                    }}
                                />


                                {/* Account UUID */}

                                <Box
                                    sx={{
                                        direction:
                                            "rtl",

                                        textAlign:
                                            "right",

                                        mb: 3,
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "text.secondary",

                                            mb: 0.7,
                                        }}
                                    >
                                        شناسه کاربری
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            direction:
                                                "ltr",

                                            textAlign:
                                                "right",

                                            fontFamily:
                                                "monospace",

                                            color:
                                                "#555",

                                            wordBreak:
                                                "break-all",
                                        }}
                                    >
                                        {userUuid}
                                    </Typography>

                                </Box>


                                {/* Save */}

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        justifyContent:
                                            "flex-end",

                                        direction:
                                            "ltr",
                                    }}
                                >

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={
                                            isSaving
                                        }
                                        startIcon={
                                            isSaving ? (
                                                <CircularProgress
                                                    size={18}
                                                    sx={{
                                                        color:
                                                            "#fff",
                                                    }}
                                                />
                                            ) : (
                                                <SaveOutlined />
                                            )
                                        }
                                        sx={{
                                            minWidth:
                                                150,

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
                                        <Box
                                            component="span"
                                            sx={{
                                                direction:
                                                    "rtl",
                                            }}
                                        >
                                            {isSaving
                                                ? "در حال ذخیره..."
                                                : "ذخیره تغییرات"}
                                        </Box>
                                    </Button>

                                </Box>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

            </form>


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