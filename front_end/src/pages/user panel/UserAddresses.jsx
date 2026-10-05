// src/pages/user panel/UserAddresses.jsx

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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    AddOutlined,
    ArrowBackOutlined,
    DeleteOutline,
    EditOutlined,
    LocationOnOutlined,
    PhoneOutlined,
    HomeOutlined,
    CheckCircleOutline,
    StarBorderOutlined,
    CloseOutlined,
    SaveOutlined,
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


const getAddressesArray = (data) => {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.addresses)) {
        return data.addresses;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (
        Array.isArray(
            data?.data?.addresses
        )
    ) {
        return data.data.addresses;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    return [];
};


const normalizeBoolean = (value) => {

    if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true"
    ) {
        return true;
    }

    return false;
};


const emptyForm = {
    title: "",
    recipient_name: "",
    phone_number: "",
    province: "",
    city: "",
    address: "",
    postal_code: "",
    plaque: "",
    unit: "",
    is_default: false,
};


// ======================================================
// Component
// ======================================================

export default function UserAddresses() {

    const navigate = useNavigate();

    const [addresses, setAddresses] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedAddress, setSelectedAddress] =
        useState(null);

    const [form, setForm] =
        useState(emptyForm);

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
    // Fetch Addresses
    // ==================================================

    const fetchAddresses = useCallback(
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
                        `${API_URL}/api/addresses`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    getAddressesArray(
                        response.data
                    );

                setAddresses(data);

            } catch (error) {

                console.error(
                    "Addresses error:",
                    error
                );

                const message =
                    error.response?.data
                        ?.message ||
                    "دریافت آدرس‌ها با خطا مواجه شد.";

                showMessage(message);

            } finally {

                setIsLoading(false);

            }
        },
        [showMessage]
    );


    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);


    // ==================================================
    // Open Add Dialog
    // ==================================================

    const handleAdd = () => {

        setSelectedAddress(null);

        setForm({
            ...emptyForm,
        });

        setDialogOpen(true);
    };


    // ==================================================
    // Open Edit Dialog
    // ==================================================

    const handleEdit = (
        address
    ) => {

        setSelectedAddress(
            address
        );

        setForm({
            title: getField(
                address,
                [
                    "title",
                    "name",
                ]
            ),

            recipient_name: getField(
                address,
                [
                    "recipient_name",
                    "recipientName",
                    "full_name",
                    "fullName",
                ]
            ),

            phone_number: getField(
                address,
                [
                    "phone_number",
                    "phoneNumber",
                    "phone",
                ]
            ),

            province: getField(
                address,
                [
                    "province",
                    "state",
                ]
            ),

            city: getField(
                address,
                [
                    "city",
                ]
            ),

            address: getField(
                address,
                [
                    "address",
                    "full_address",
                    "fullAddress",
                ]
            ),

            postal_code: getField(
                address,
                [
                    "postal_code",
                    "postalCode",
                    "zip_code",
                    "zipCode",
                ]
            ),

            plaque: getField(
                address,
                [
                    "plaque",
                    "plate",
                ]
            ),

            unit: getField(
                address,
                [
                    "unit",
                    "unit_number",
                    "unitNumber",
            ]
            ),

            is_default:
                normalizeBoolean(
                    getField(
                        address,
                        [
                            "is_default",
                            "isDefault",
                        ],
                        false
                    )
                ),
        });

        setDialogOpen(true);
    };


    // ==================================================
    // Close Dialog
    // ==================================================

    const handleCloseDialog = () => {

        if (isSaving) {
            return;
        }

        setDialogOpen(false);

        setSelectedAddress(null);

        setForm({
            ...emptyForm,
        });
    };


    // ==================================================
    // Form Change
    // ==================================================

    const handleChange = (
        event
    ) => {

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
    // Save Address
    // ==================================================

    const handleSave = async (
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


        // ----------------------------------------------
        // Validation
        // ----------------------------------------------

        if (
            !form.recipient_name.trim()
        ) {

            showMessage(
                "نام گیرنده را وارد کنید."
            );

            return;
        }


        if (
            !form.phone_number.trim()
        ) {

            showMessage(
                "شماره تماس گیرنده را وارد کنید."
            );

            return;
        }


        if (
            !form.province.trim()
        ) {

            showMessage(
                "استان را وارد کنید."
            );

            return;
        }


        if (
            !form.city.trim()
        ) {

            showMessage(
                "شهر را وارد کنید."
            );

            return;
        }


        if (
            !form.address.trim()
        ) {

            showMessage(
                "آدرس را وارد کنید."
            );

            return;
        }


        if (
            !form.postal_code.trim()
        ) {

            showMessage(
                "کد پستی را وارد کنید."
            );

            return;
        }


        try {

            setIsSaving(true);

            const data = {
                title:
                    form.title.trim(),

                recipient_name:
                    form.recipient_name.trim(),

                phone_number:
                    form.phone_number.trim(),

                province:
                    form.province.trim(),

                city:
                    form.city.trim(),

                address:
                    form.address.trim(),

                postal_code:
                    form.postal_code.trim(),

                plaque:
                    form.plaque.trim(),

                unit:
                    form.unit.trim(),

                is_default:
                    form.is_default,
            };


            // ------------------------------------------
            // Create
            // ------------------------------------------

            if (!selectedAddress) {

                const response =
                    await axios.post(
                        `${API_URL}/api/addresses`,
                        data,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );

                const createdAddress =
                    response.data?.address ||
                    response.data?.data ||
                    response.data;

                if (
                    createdAddress &&
                    typeof createdAddress ===
                        "object" &&
                    !Array.isArray(
                        createdAddress
                    )
                ) {

                    setAddresses(
                        (current) => {

                            if (
                                data.is_default
                            ) {
                                return [
                                    ...current.map(
                                        (item) => ({
                                            ...item,
                                            is_default:
                                                false,
                                        })
                                    ),
                                    createdAddress,
                                ];
                            }

                            return [
                                ...current,
                                createdAddress,
                            ];
                        }
                    );

                } else {

                    await fetchAddresses();

                }


                showMessage(
                    "آدرس با موفقیت اضافه شد.",
                    "success"
                );

            }


            // ------------------------------------------
            // Update
            // ------------------------------------------

            else {

                const addressUuid =
                    getField(
                        selectedAddress,
                        [
                            "uuid",
                            "address_uuid",
                            "id",
                        ]
                    );

                if (!addressUuid) {

                    throw new Error(
                        "Address UUID not found"
                    );

                }


                const response =
                    await axios.put(
                        `${API_URL}/api/addresses/${addressUuid}`,
                        data,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );


                const updatedAddress =
                    response.data?.address ||
                    response.data?.data ||
                    response.data;


                if (
                    updatedAddress &&
                    typeof updatedAddress ===
                        "object" &&
                    !Array.isArray(
                        updatedAddress
                    )
                ) {

                    setAddresses(
                        (current) => {

                            return current.map(
                                (item) => {

                                    const itemUuid =
                                        getField(
                                            item,
                                            [
                                                "uuid",
                                                "address_uuid",
                                                "id",
                                            ]
                                        );

                                    if (
                                        String(
                                            itemUuid
                                        ) ===
                                        String(
                                            addressUuid
                                        )
                                    ) {
                                        return updatedAddress;
                                    }

                                    if (
                                        data.is_default
                                    ) {
                                        return {
                                            ...item,
                                            is_default:
                                                false,
                                        };
                                    }

                                    return item;
                                }
                            );
                        }
                    );

                } else {

                    await fetchAddresses();

                }


                showMessage(
                    "آدرس با موفقیت بروزرسانی شد.",
                    "success"
                );
            }


            setDialogOpen(false);

            setSelectedAddress(null);

            setForm({
                ...emptyForm,
            });

        } catch (error) {

            console.error(
                "Save address error:",
                error
            );

            const message =
                error.response?.data
                    ?.message ||
                "ذخیره آدرس با خطا مواجه شد.";

            showMessage(message);

        } finally {

            setIsSaving(false);

        }
    };


    // ==================================================
    // Delete Dialog
    // ==================================================

    const openDeleteDialog = (
        address
    ) => {

        setSelectedAddress(
            address
        );

        setDeleteDialogOpen(
            true
        );
    };


    const closeDeleteDialog = () => {

        setDeleteDialogOpen(
            false
        );

        setSelectedAddress(
            null
        );
    };


    // ==================================================
    // Delete Address
    // ==================================================

    const handleDelete = async () => {

        const token = getToken();

        if (!token) {

            showMessage(
                "لطفاً ابتدا وارد حساب کاربری شوید."
            );

            return;
        }

        if (!selectedAddress) {
            return;
        }

        try {

            const addressUuid =
                getField(
                    selectedAddress,
                    [
                        "uuid",
                        "address_uuid",
                        "id",
                    ]
                );

            if (!addressUuid) {

                throw new Error(
                    "Address UUID not found"
                );

            }


            await axios.delete(
                `${API_URL}/api/addresses/${addressUuid}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            setAddresses(
                (current) =>
                    current.filter(
                        (item) => {

                            const itemUuid =
                                getField(
                                    item,
                                    [
                                        "uuid",
                                        "address_uuid",
                                        "id",
                                    ]
                                );

                            return (
                                String(
                                    itemUuid
                                ) !==
                                String(
                                    addressUuid
                                )
                            );
                        }
                    )
            );


            showMessage(
                "آدرس با موفقیت حذف شد.",
                "success"
            );

            closeDeleteDialog();

        } catch (error) {

            console.error(
                "Delete address error:",
                error
            );

            const message =
                error.response?.data
                    ?.message ||
                "حذف آدرس با خطا مواجه شد.";

            showMessage(message);
        }
    };


    // ==================================================
    // Set Default Address
    // ==================================================

    const handleSetDefault = async (
        address
    ) => {

        const token = getToken();

        if (!token) {

            showMessage(
                "لطفاً ابتدا وارد حساب کاربری شوید."
            );

            return;
        }

        const addressUuid =
            getField(
                address,
                [
                    "uuid",
                    "address_uuid",
                    "id",
                ]
            );

        if (!addressUuid) {
            return;
        }

        try {

            await axios.patch(
                `${API_URL}/api/addresses/${addressUuid}/default`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            setAddresses(
                (current) =>
                    current.map(
                        (item) => {

                            const itemUuid =
                                getField(
                                    item,
                                    [
                                        "uuid",
                                        "address_uuid",
                                        "id",
                                    ]
                                );

                            return {
                                ...item,
                                is_default:
                                    String(
                                        itemUuid
                                    ) ===
                                    String(
                                        addressUuid
                                    ),
                            };
                        }
                    )
            );


            showMessage(
                "آدرس پیش‌فرض تغییر کرد.",
                "success"
            );

        } catch (error) {

            console.error(
                "Set default address error:",
                error
            );

            const message =
                error.response?.data
                    ?.message ||
                "تغییر آدرس پیش‌فرض با خطا مواجه شد.";

            showMessage(message);
        }
    };


    // ==================================================
    // Address Card
    // ==================================================

    const renderAddressCard = (
        address,
        index
    ) => {

        const addressUuid =
            getField(
                address,
                [
                    "uuid",
                    "address_uuid",
                    "id",
                ],
                index
            );

        const title =
            getField(
                address,
                [
                    "title",
                    "name",
                ],
                "آدرس"
            );

        const recipientName =
            getField(
                address,
                [
                    "recipient_name",
                    "recipientName",
                    "full_name",
                    "fullName",
                ],
                "-"
            );

        const phoneNumber =
            getField(
                address,
                [
                    "phone_number",
                    "phoneNumber",
                    "phone",
                ],
                "-"
            );

        const province =
            getField(
                address,
                [
                    "province",
                    "state",
                ],
                "-"
            );

        const city =
            getField(
                address,
                [
                    "city",
                ],
                "-"
            );

        const addressText =
            getField(
                address,
                [
                    "address",
                    "full_address",
                    "fullAddress",
                ],
                "-"
            );

        const postalCode =
            getField(
                address,
                [
                    "postal_code",
                    "postalCode",
                    "zip_code",
                    "zipCode",
                ],
                "-"
            );

        const plaque =
            getField(
                address,
                [
                    "plaque",
                    "plate",
                ],
                ""
            );

        const unit =
            getField(
                address,
                [
                    "unit",
                    "unit_number",
                    "unitNumber",
                ],
                ""
            );

        const isDefault =
            normalizeBoolean(
                getField(
                    address,
                    [
                        "is_default",
                        "isDefault",
                    ],
                    false
                )
            );


        return (
            <Card
                key={addressUuid}
                elevation={0}
                sx={{
                    height: "100%",

                    borderRadius: 2,

                    border: isDefault
                        ? `1.5px solid ${GOLD}`
                        : "1px solid #e8e8e8",

                    backgroundColor:
                        "#fff",

                    position:
                        "relative",

                    overflow:
                        "hidden",

                    transition:
                        "all 0.2s ease",

                    "&:hover": {
                        borderColor:
                            GOLD,
                    },
                }}
            >

                {/* Default Label */}

                {isDefault && (
                    <Box
                        sx={{
                            position:
                                "absolute",

                            top: 0,
                            right: 0,

                            px: 1.5,
                            py: 0.7,

                            backgroundColor:
                                "#fffdf5",

                            borderBottomLeftRadius:
                                8,

                            direction:
                                "rtl",
                        }}
                    >

                        <Typography
                            variant="caption"
                            sx={{
                                color:
                                    GOLD,

                                fontWeight:
                                    800,
                            }}
                        >
                            آدرس پیش‌فرض
                        </Typography>

                    </Box>
                )}


                <CardContent
                    sx={{
                        p: 2.5,
                    }}
                >

                    {/* Header */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "space-between",

                            gap: 2,

                            direction:
                                "rtl",

                            mb: 2,
                        }}
                    >

                        <Box
                            sx={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 1,

                                minWidth: 0,
                            }}
                        >

                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    flexShrink: 0,

                                    borderRadius:
                                        1.5,

                                    backgroundColor:
                                        "#fffdf5",

                                    color:
                                        GOLD,
                                }}
                            >
                                <HomeOutlined />
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight:
                                        800,

                                    overflow:
                                        "hidden",

                                    textOverflow:
                                        "ellipsis",

                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                {title}
                            </Typography>

                        </Box>

                    </Box>


                    <Divider
                        sx={{
                            mb: 2,
                        }}
                    />


                    {/* Recipient */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            gap: 1.2,

                            direction:
                                "rtl",

                            mb: 1.5,
                        }}
                    >

                        <PersonIcon />

                        <Box
                            sx={{
                                minWidth:
                                    0,

                                direction:
                                    "rtl",

                                textAlign:
                                    "right",
                            }}
                        >

                            <Typography
                                variant="caption"
                                sx={{
                                    display:
                                        "block",

                                    color:
                                        "text.secondary",
                                }}
                            >
                                گیرنده
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight:
                                        700,
                                }}
                            >
                                {recipientName}
                            </Typography>

                        </Box>

                    </Box>


                    {/* Phone */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            gap: 1.2,

                            direction:
                                "rtl",

                            mb: 1.5,
                        }}
                    >

                        <PhoneOutlined
                            sx={{
                                color:
                                    "#999",
                                fontSize:
                                    20,
                            }}
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                direction:
                                    "ltr",

                                textAlign:
                                    "right",

                                fontWeight:
                                    600,
                            }}
                        >
                            {phoneNumber}
                        </Typography>

                    </Box>


                    {/* Location */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            gap: 1.2,

                            direction:
                                "rtl",

                            mb: 1.5,
                        }}
                    >

                        <LocationOnOutlined
                            sx={{
                                color:
                                    "#999",
                                fontSize:
                                    20,
                            }}
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight:
                                    600,
                            }}
                        >
                            {province}،{" "}
                            {city}
                        </Typography>

                    </Box>


                    {/* Address */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            gap: 1.2,

                            direction:
                                "rtl",

                            mb: 1.5,
                        }}
                    >

                        <HomeOutlined
                            sx={{
                                color:
                                    "#999",
                                fontSize:
                                    20,
                            }}
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight:
                                    1.9,

                                color:
                                    "#444",

                                direction:
                                    "rtl",

                                textAlign:
                                    "right",
                            }}
                        >
                            {addressText}
                        </Typography>

                    </Box>


                    {/* Postal */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            gap: 2,

                            direction:
                                "rtl",

                            mt: 2,

                            p: 1.5,

                            borderRadius:
                                1.5,

                            backgroundColor:
                                "#fafafa",
                        }}
                    >

                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "text.secondary",
                            }}
                        >
                            کد پستی
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                direction:
                                    "ltr",

                                fontWeight:
                                    700,
                            }}
                        >
                            {postalCode}
                        </Typography>

                    </Box>


                    {/* Plaque / Unit */}

                    {(plaque || unit) && (
                        <Box
                            sx={{
                                display:
                                    "flex",

                                gap: 2,

                                mt: 1.5,

                                direction:
                                    "rtl",
                            }}
                        >

                            {plaque && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    پلاک:{" "}
                                    <strong>
                                        {plaque}
                                    </strong>
                                </Typography>
                            )}

                            {unit && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    واحد:{" "}
                                    <strong>
                                        {unit}
                                    </strong>
                                </Typography>
                            )}

                        </Box>
                    )}


                    <Divider
                        sx={{
                            my: 2,
                        }}
                    />


                    {/* Actions */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            gap: 1,

                            direction:
                                "ltr",
                        }}
                    >

                        <Box
                            sx={{
                                display:
                                    "flex",

                                gap: 1,

                                direction:
                                    "ltr",
                            }}
                        >

                            <Button
                                size="small"
                                startIcon={
                                    <EditOutlined />
                                }
                                onClick={() =>
                                    handleEdit(
                                        address
                                    )
                                }
                                sx={{
                                    borderRadius:
                                        1.5,

                                    color:
                                        "#555",

                                    "&:hover":
                                        {
                                            color:
                                                GOLD,

                                            backgroundColor:
                                                "#fffdf5",
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
                                    ویرایش
                                </Box>
                            </Button>


                            <IconButton
                                size="small"
                                onClick={() =>
                                    openDeleteDialog(
                                        address
                                    )
                                }
                                sx={{
                                    color:
                                        "#888",

                                    "&:hover":
                                        {
                                            color:
                                                "#d32f2f",

                                            backgroundColor:
                                                "#fff5f5",
                                        },
                                }}
                            >
                                <DeleteOutline
                                    fontSize="small"
                                />
                            </IconButton>

                        </Box>


                        {!isDefault && (
                            <Button
                                size="small"
                                startIcon={
                                    <StarBorderOutlined />
                                }
                                onClick={() =>
                                    handleSetDefault(
                                        address
                                    )
                                }
                                sx={{
                                    borderRadius:
                                        1.5,

                                    color:
                                        "#777",

                                    "&:hover":
                                        {
                                            color:
                                                GOLD,

                                            backgroundColor:
                                                "#fffdf5",
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
                                    پیش‌فرض
                                </Box>
                            </Button>
                        )}

                    </Box>

                </CardContent>

            </Card>
        );
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

                    direction:
                        "ltr",
                }}
            >

                <CircularProgress
                    size={36}
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
                width: "100%",
                minWidth: 0,

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
                                "ltr",

                            textAlign:
                                "left",
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
                            آدرس‌های من
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "text.secondary",
                            }}
                        >
                            آدرس‌های ارسال خود را مدیریت کنید
                        </Typography>

                    </Box>

                </Box>


                <Button
                    variant="contained"
                    startIcon={
                        <AddOutlined />
                    }
                    onClick={
                        handleAdd
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
                    <Box
                        component="span"
                        sx={{
                            direction:
                                "ltr",
                        }}
                    >
                        افزودن آدرس
                    </Box>
                </Button>

            </Box>


            {/* ==========================================
                Empty
            ========================================== */}

            {addresses.length ===
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
                            py: 7,

                            textAlign:
                                "center",

                            direction:
                                "ltr",
                        }}
                    >

                        <LocationOnOutlined
                            sx={{
                                fontSize:
                                    58,

                                color:
                                    "#ccc",

                                mb: 2,
                            }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight:
                                    800,

                                mb: 1,
                            }}
                        >
                            هنوز آدرسی ثبت نکرده‌اید
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "text.secondary",

                                mb: 3,
                            }}
                        >
                            برای ثبت سفارش، حداقل یک آدرس
                            برای ارسال کالا اضافه کنید.
                        </Typography>

                        <Button
                            variant="outlined"
                            startIcon={
                                <AddOutlined />
                            }
                            onClick={
                                handleAdd
                            }
                            sx={{
                                borderColor:
                                    GOLD,

                                color:
                                    GOLD,

                                borderRadius:
                                    2,

                                "&:hover":
                                    {
                                        borderColor:
                                            GOLD,

                                        backgroundColor:
                                            "#fffdf5",
                                    },
                            }}
                        >
                            افزودن اولین آدرس
                        </Button>

                    </CardContent>

                </Card>

            ) : (

                /* ======================================
                   Address List
                ====================================== */

                <Grid
                    container
                    spacing={3}
                    sx={{
                        direction:
                            "ltr",
                    }}
                >

                    {addresses.map(
                        (
                            address,
                            index
                        ) =>
                            <Grid
                                key={
                                    getField(
                                        address,
                                        [
                                            "uuid",
                                            "address_uuid",
                                            "id",
                                        ],
                                        index
                                    )
                                }
                                size={{
                                    xs: 12,
                                    md: 6,
                                    xl: 4,
                                }}
                            >
                                {renderAddressCard(
                                    address,
                                    index
                                )}
                            </Grid>
                    )}

                </Grid>

            )}


            {/* ==========================================
                Add / Edit Dialog
            ========================================== */}

            <Dialog
                open={
                    dialogOpen
                }
                onClose={
                    handleCloseDialog
                }
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius:
                            2,
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        direction:
                            "ltr",

                        textAlign:
                            "left",

                        fontWeight:
                            800,

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "space-between",
                    }}
                >

                    <Box>
                        {selectedAddress
                            ? "ویرایش آدرس"
                            : "افزودن آدرس جدید"}
                    </Box>

                    <IconButton
                        onClick={
                            handleCloseDialog
                        }
                        disabled={
                            isSaving
                        }
                    >
                        <CloseOutlined />
                    </IconButton>

                </DialogTitle>


                <Divider />


                <form
                    onSubmit={
                        handleSave
                    }
                >

                    <DialogContent
                        sx={{
                            p: 3,
                        }}
                    >

                        <Grid
                            container
                            spacing={2}
                            sx={{
                                direction:
                                    "ltr",
                            }}
                        >

                            {/* Title */}

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    label="عنوان آدرس"
                                    name="title"
                                    placeholder="مثلاً منزل، محل کار"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
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

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color:
                                                    GOLD,
                                            },
                                    }}
                                />

                            </Grid>


                            {/* Recipient */}

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="نام گیرنده"
                                    name="recipient_name"
                                    value={
                                        form.recipient_name
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                    required
                                    label="شماره تماس"
                                    name="phone_number"
                                    value={
                                        form.phone_number
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                                    "ltr",
                                            },

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color:
                                                    GOLD,
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

                            </Grid>


                            {/* Province */}

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="استان"
                                    name="province"
                                    value={
                                        form.province
                                    }
                                    onChange={
                                        handleChange
                                    }
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

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color:
                                                    GOLD,
                                            },
                                    }}
                                />

                            </Grid>


                            {/* City */}

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="شهر"
                                    name="city"
                                    value={
                                        form.city
                                    }
                                    onChange={
                                        handleChange
                                    }
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

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color:
                                                    GOLD,
                                            },
                                    }}
                                />

                            </Grid>


                            {/* Postal Code */}

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="کد پستی"
                                    name="postal_code"
                                    value={
                                        form.postal_code
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                                    "ltr",
                                            },

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color:
                                                    GOLD,
                                            },
                                    }}
                                />

                            </Grid>


                            {/* Plaque */}

                            <Grid
                                size={{
                                    xs: 6,
                                    sm: 3,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    label="پلاک"
                                    name="plaque"
                                    value={
                                        form.plaque
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    sx={{
                                        direction:
                                            "ltr",

                                        "& .MuiOutlinedInput-root":
                                            {
                                                borderRadius:
                                                    2,
                                            },
                                    }}
                                />

                            </Grid>


                            {/* Unit */}

                            <Grid
                                size={{
                                    xs: 6,
                                    sm: 3,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    label="واحد"
                                    name="unit"
                                    value={
                                        form.unit
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    sx={{
                                        direction:
                                            "ltr",

                                        "& .MuiOutlinedInput-root":
                                            {
                                                borderRadius:
                                                    2,
                                            },
                                    }}
                                />

                            </Grid>


                            {/* Address */}

                            <Grid
                                size={{
                                    xs: 12,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    minRows={4}
                                    label="آدرس کامل"
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
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

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color:
                                                    GOLD,
                                            },
                                    }}
                                />

                            </Grid>


                            {/* Default */}

                            <Grid
                                size={{
                                    xs: 12,
                                }}
                            >

                                <Box
                                    onClick={() =>
                                        setForm(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                is_default:
                                                    !current.is_default,
                                            })
                                        )
                                    }
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1.5,

                                        p: 1.5,

                                        borderRadius:
                                            2,

                                        border:
                                            form.is_default
                                                ? `1px solid ${GOLD}`
                                                : "1px solid #e5e5e5",

                                        backgroundColor:
                                            form.is_default
                                                ? "#fffdf5"
                                                : "#fff",

                                        cursor:
                                            "pointer",

                                        direction:
                                            "ltr",
                                    }}
                                >

                                    {form.is_default ? (
                                        <CheckCircleOutline
                                            sx={{
                                                color:
                                                    GOLD,
                                            }}
                                        />
                                    ) : (
                                        <StarBorderOutlined
                                            sx={{
                                                color:
                                                    "#999",
                                            }}
                                        />
                                    )}

                                    <Box
                                        sx={{
                                            direction:
                                                "ltr",

                                            textAlign:
                                                "left",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            استفاده به عنوان آدرس پیش‌فرض
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color:
                                                    "text.secondary",
                                            }}
                                        >
                                            این آدرس برای سفارش‌های
                                            بعدی به صورت پیش‌فرض
                                            انتخاب می‌شود.
                                        </Typography>

                                    </Box>

                                </Box>

                            </Grid>

                        </Grid>

                    </DialogContent>


                    <DialogActions
                        sx={{
                            p: 2.5,

                            borderTop:
                                "1px solid #eee",

                            direction:
                                "ltr",
                        }}
                    >

                        <Button
                            onClick={
                                handleCloseDialog
                            }
                            disabled={
                                isSaving
                            }
                            sx={{
                                borderRadius:
                                    2,

                                color:
                                    "#666",
                            }}
                        >
                            انصراف
                        </Button>


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
                            {isSaving
                                ? "در حال ذخیره..."
                                : "ذخیره آدرس"}
                        </Button>

                    </DialogActions>

                </form>

            </Dialog>


            {/* ==========================================
                Delete Dialog
            ========================================== */}

            <Dialog
                open={
                    deleteDialogOpen
                }
                onClose={
                    closeDeleteDialog
                }
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius:
                            2,
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        direction:
                            "ltr",

                        textAlign:
                            "left",

                        fontWeight:
                            800,
                    }}
                >
                    حذف آدرس
                </DialogTitle>


                <DialogContent
                    sx={{
                        direction:
                            "ltr",

                        textAlign:
                            "left",
                    }}
                >

                    <Typography
                        variant="body2"
                        sx={{
                            color:
                                "text.secondary",

                            lineHeight:
                                1.9,
                        }}
                    >
                        آیا از حذف این آدرس مطمئن هستید؟
                        این عملیات قابل بازگشت نیست.
                    </Typography>

                </DialogContent>


                <DialogActions
                    sx={{
                        p: 2,

                        direction:
                            "ltr",
                    }}
                >

                    <Button
                        onClick={
                            closeDeleteDialog
                        }
                        sx={{
                            color:
                                "#666",

                            borderRadius:
                                2,
                        }}
                    >
                        انصراف
                    </Button>


                    <Button
                        variant="contained"
                        color="error"
                        startIcon={
                            <DeleteOutline />
                        }
                        onClick={
                            handleDelete
                        }
                        sx={{
                            borderRadius:
                                2,

                            boxShadow:
                                "none",
                        }}
                    >
                        حذف آدرس
                    </Button>

                </DialogActions>

            </Dialog>


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
                            "ltr",
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


// ======================================================
// Small Icon Component
// ======================================================

function PersonIcon() {
    return (
        <PersonOutline
            sx={{
                color:
                    "#999",

                fontSize:
                    20,
            }}
        />
    );
}