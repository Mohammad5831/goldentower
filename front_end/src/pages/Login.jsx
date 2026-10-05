// src/pages/Login.jsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  CheckCircleOutline,
  PhoneAndroid,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const API_URL = "http://localhost:5000";

const GOLD = "#D4AF37";

const steps = ["شماره موبایل", "تایید کد"];

const normalizeDigits = (value) => {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );
};

const formatPhone = (phone) => {
  if (!phone) return "";

  const normalized = normalizeDigits(phone);

  if (normalized.length !== 11) {
    return normalized;
  }

  return `${normalized.slice(0, 4)} ${normalized.slice(
    4,
    7
  )} ${normalized.slice(7, 11)}`;
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const otpInputRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ---------------------------------------------
  // Snackbar
  // ---------------------------------------------

  const showMessage = useCallback(
    (message, severity = "success") => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const handleCloseSnackbar = () => {
    setSnackbar((current) => ({
      ...current,
      open: false,
    }));
  };

  // ---------------------------------------------
  // Countdown
  // ---------------------------------------------

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // ---------------------------------------------
  // Focus OTP input
  // ---------------------------------------------

  useEffect(() => {
    if (activeStep === 1) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [activeStep]);

  // ---------------------------------------------
  // Validation
  // ---------------------------------------------

  const normalizedPhone = normalizeDigits(phoneNumber);

  const normalizedOtp = normalizeDigits(otp);

  const isPhoneValid = /^09\d{9}$/.test(normalizedPhone);

  // OTP دقیقاً 6 رقم
  const isOtpValid = /^\d{6}$/.test(normalizedOtp);

  // ---------------------------------------------
  // Send OTP
  // ---------------------------------------------

  const sendOtp = useCallback(
    async (isResend = false) => {
      if (!isPhoneValid) {
        showMessage(
          "لطفاً یک شماره موبایل معتبر وارد کنید.",
          "error"
        );

        return;
      }

      if (isResend && resendTimer > 0) {
        return;
      }

      if (isResend) {
        setIsResending(true);
      } else {
        setIsLoading(true);
      }

      try {
        await axios.post(`${API_URL}/api/auth/login`, {
          phone_number: normalizedPhone,
        });

        setOtp("");
        setActiveStep(1);

        // 60 ثانیه تا ارسال مجدد
        setResendTimer(60);

        showMessage(
          isResend
            ? "کد تایید مجدداً ارسال شد."
            : "کد تایید با موفقیت ارسال شد."
        );
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "خطایی در ارسال کد تایید رخ داد.";

        showMessage(message, "error");
      } finally {
        setIsLoading(false);
        setIsResending(false);
      }
    },
    [
      isPhoneValid,
      normalizedPhone,
      resendTimer,
      showMessage,
    ]
  );

  // ---------------------------------------------
  // Verify OTP
  // ---------------------------------------------

  const verifyOtp = useCallback(async () => {
    if (!isOtpValid) {
      showMessage(
        "کد تایید باید دقیقاً ۶ رقم باشد.",
        "error"
      );

      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login/verify`,
        {
          phone_number: normalizedPhone,
          otp: normalizedOtp,
        }
      );

      const token = response.data?.token;

      if (!token) {
        throw new Error("TOKEN_NOT_FOUND");
      }

      login(token);

      showMessage("ورود با موفقیت انجام شد.");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.message === "TOKEN_NOT_FOUND"
          ? "توکن ورود از سرور دریافت نشد."
          : "کد تایید اشتباه است یا منقضی شده است.");

      showMessage(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [
    isOtpValid,
    normalizedPhone,
    normalizedOtp,
    login,
    navigate,
    showMessage,
  ]);

  // ---------------------------------------------
  // Next
  // ---------------------------------------------

  const handleNext = useCallback(async () => {
    if (activeStep === 0) {
      await sendOtp(false);
      return;
    }

    await verifyOtp();
  }, [
    activeStep,
    sendOtp,
    verifyOtp,
  ]);

  // ---------------------------------------------
  // Back
  // ---------------------------------------------

  const handleBack = useCallback(() => {
    if (isLoading || isResending) {
      return;
    }

    if (activeStep === 1) {
      setActiveStep(0);
      setOtp("");
      return;
    }

    navigate("/");
  }, [
    activeStep,
    isLoading,
    isResending,
    navigate,
  ]);

  // ---------------------------------------------
  // Enter
  // ---------------------------------------------

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    if (
      activeStep === 0 &&
      isPhoneValid &&
      !isLoading
    ) {
      handleNext();
    }

    if (
      activeStep === 1 &&
      isOtpValid &&
      !isLoading
    ) {
      handleNext();
    }
  };

  // ---------------------------------------------
  // Render
  // ---------------------------------------------

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
        py: {
          xs: 3,
          sm: 5,
          md: 8,
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            mx: "auto",

            p: {
              xs: 3,
              sm: 5,
            },

            borderRadius: 3,

            border: "1px solid #e8e8e8",

            boxShadow:
              "0 12px 40px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* ----------------------------------- */}
          {/* Logo */}
          {/* ----------------------------------- */}

          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,

                borderRadius: "50%",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                border: `2px solid ${GOLD}`,

                backgroundColor: "#fffdf5",
              }}
            >
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: GOLD,
                  direction: "ltr",
                }}
              >
                GT
              </Typography>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#111",
                mb: 0.7,
              }}
            >
              برج طلایی
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              ورود به حساب کاربری
            </Typography>
          </Box>

          {/* ----------------------------------- */}
          {/* Stepper */}
          {/* ----------------------------------- */}

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 4,

              "& .MuiStepLabel-label": {
                fontSize: {
                  xs: 12,
                  sm: 13,
                },
              },

              "& .MuiStepIcon-root.Mui-active": {
                color: GOLD,
              },

              "& .MuiStepIcon-root.Mui-completed": {
                color: GOLD,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* ----------------------------------- */}
          {/* Back */}
          {/* ----------------------------------- */}

          <Button
            variant="text"
            startIcon={<ArrowForward />}
            onClick={handleBack}
            disabled={isLoading || isResending}
            sx={{
              color: "text.secondary",
              mb: 2,

              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {activeStep === 0
              ? "بازگشت به خانه"
              : "تغییر شماره موبایل"}
          </Button>

          {/* =================================== */}
          {/* STEP 1 */}
          {/* =================================== */}

          {activeStep === 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                ورود یا عضویت
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 3,
                  lineHeight: 1.8,
                }}
              >
                شماره موبایل خود را وارد کنید تا
                کد تایید برای شما ارسال شود.
              </Typography>

              <TextField
                fullWidth
                autoFocus
                type="tel"
                label="شماره موبایل"
                placeholder="09123456789"
                value={phoneNumber}
                onChange={(event) => {
                  const value = normalizeDigits(
                    event.target.value
                  )
                    .replace(/\D/g, "")
                    .slice(0, 11);

                  setPhoneNumber(value);
                }}
                onKeyDown={handleKeyDown}
                error={
                  phoneNumber.length > 0 &&
                  !isPhoneValid
                }
                helperText={
                  phoneNumber.length > 0 &&
                  !isPhoneValid
                    ? "شماره موبایل باید با 09 شروع شده و 11 رقم باشد."
                    : " "
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroid
                        sx={{
                          color: "text.secondary",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,

                    "&.Mui-focused fieldset": {
                      borderColor: GOLD,
                    },
                  },

                  "& .MuiInputLabel-root.Mui-focused": {
                    color: GOLD,
                  },

                  "& input": {
                    direction: "ltr",
                    textAlign: "left",
                    unicodeBidi: "isolate",
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                disabled={
                  !isPhoneValid || isLoading
                }
                sx={{
                  mt: 2,
                  height: 50,
                  borderRadius: 2,
                  fontWeight: 700,

                  backgroundColor: GOLD,
                  color: "#111",

                  "&:hover": {
                    backgroundColor: "#c19f2f",
                  },

                  "&.Mui-disabled": {
                    backgroundColor: "#e5e5e5",
                    color: "#999",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "#555",
                    }}
                  />
                ) : (
                  "ارسال کد تایید"
                )}
              </Button>
            </Box>
          )}

          {/* =================================== */}
          {/* STEP 2 */}
          {/* =================================== */}

          {activeStep === 1 && (
            <Box>
              <Box
                sx={{
                  textAlign: "center",
                  mb: 3,
                }}
              >
                <CheckCircleOutline
                  sx={{
                    fontSize: 45,
                    color: GOLD,
                    mb: 1,
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  تایید شماره موبایل
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                  }}
                >
                  کد تایید ارسال شده به شماره
                </Typography>

                {/* شماره موبایل */}
                <Typography
                  component="div"
                  sx={{
                    mt: 1,

                    direction: "ltr",
                    unicodeBidi: "isolate",

                    textAlign: "center",

                    fontWeight: 700,
                    fontSize: 16,

                    color: "#111",

                    letterSpacing: "0.5px",
                  }}
                >
                  {formatPhone(normalizedPhone)}
                </Typography>
              </Box>

              <TextField
                fullWidth
                autoFocus
                inputRef={otpInputRef}
                label="کد تایید"
                placeholder="123456"
                value={otp}
                onChange={(event) => {
                  const value = normalizeDigits(
                    event.target.value
                  )
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setOtp(value);
                }}
                onKeyDown={handleKeyDown}
                error={
                  otp.length > 0 && !isOtpValid
                }
                helperText={
                  otp.length > 0 && !isOtpValid
                    ? "کد تایید باید دقیقاً ۶ رقم باشد."
                    : " "
                }
                inputProps={{
                  maxLength: 6,
                  inputMode: "numeric",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,

                    "&.Mui-focused fieldset": {
                      borderColor: GOLD,
                    },
                  },

                  "& .MuiInputLabel-root.Mui-focused": {
                    color: GOLD,
                  },

                  "& input": {
                    direction: "ltr",
                    textAlign: "center",
                    unicodeBidi: "isolate",

                    letterSpacing: "6px",
                    fontSize: 22,
                    fontWeight: 700,
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                disabled={
                  !isOtpValid || isLoading
                }
                sx={{
                  mt: 2,
                  height: 50,
                  borderRadius: 2,
                  fontWeight: 700,

                  backgroundColor: GOLD,
                  color: "#111",

                  "&:hover": {
                    backgroundColor: "#c19f2f",
                  },

                  "&.Mui-disabled": {
                    backgroundColor: "#e5e5e5",
                    color: "#999",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "#555",
                    }}
                  />
                ) : (
                  "تایید و ورود"
                )}
              </Button>

              {/* -------------------------------- */}
              {/* Resend */}
              {/* -------------------------------- */}

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  textAlign: "center",
                }}
              >
                {resendTimer > 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    ارسال مجدد کد تا{" "}
                    <Box
                      component="span"
                      sx={{
                        direction: "ltr",
                        unicodeBidi: "isolate",
                        display: "inline-block",

                        color: "#111",
                        fontWeight: 700,
                      }}
                    >
                      {resendTimer}
                    </Box>{" "}
                    ثانیه دیگر
                  </Typography>
                ) : (
                  <Button
                    variant="text"
                    startIcon={
                      isResending ? (
                        <CircularProgress size={18} />
                      ) : (
                        <Refresh />
                      )
                    }
                    onClick={() => sendOtp(true)}
                    disabled={isResending}
                    sx={{
                      color: GOLD,
                      fontWeight: 700,

                      "&:hover": {
                        backgroundColor: "#fffdf5",
                      },
                    }}
                  >
                    ارسال مجدد کد
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* ----------------------------------- */}
          {/* Footer */}
          {/* ----------------------------------- */}

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              color: "text.disabled",
              mt: 4,
              lineHeight: 1.8,
            }}
          >
            با ورود به حساب کاربری، استفاده از خدمات
            برج طلایی را می‌پذیرید.
          </Typography>
        </Paper>
      </Container>

      {/* --------------------------------------- */}
      {/* Snackbar */}
      {/* --------------------------------------- */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
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
}