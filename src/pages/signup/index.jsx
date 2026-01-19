import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import pos_logo_long_inv from "../../assets/pos_logo_long_inv.png";
 import pos_logo_long from "../../assets/pos_logo_long.png";
  import settng_up_pos from "../../assets/settng_up_pos.png";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  signupForAccount,
  verifyEmail,
  completeSignup,
} from "../../functions/systemSettings";
import { ChevronRight, Cloud, Laptop } from "lucide-react";

// Reusable Marketing Panel Component
const MarketingPanel = ({ isMobile = false }) => {
  const features = [
    { icon: Cloud, text: "Access Anywhere, Anytime" },
    { icon: Laptop, text: "Use Your Existing Hardware" },
  ];

  return (
    <div
      className={`bg-gradient-to-br from-sky-600 to-sky-700 text-white flex flex-col relative overflow-hidden ${
        isMobile
          ? "p-8 border-t border-sky-500/30"
          : "hidden lg:flex p-8 lg:p-12 justify-between h-full"
      }`}
    >
      {/* Background decorative blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={pos_logo_long_inv}
            alt="Legend POS"
            className="h-12 mx-auto"
          />
        </div>

        {/* Headline */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold leading-tight">
            Welcome to Legend POS
          </h2>
        </div>

        {/* Tagline + Description + Features */}
        <div className="flex flex-col gap-6 mb-10">
          <p className="text-xl font-medium text-blue-100 text-center">
            Simple. Fast. Reliable.
          </p>

          <p className="text-base text-blue-50 leading-relaxed text-center max-w-xl mx-auto">
            Run your entire store using the laptop, PC, or tablet you already own — no expensive hardware required.
          </p>

          {/* Features with icons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-blue-50">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-base font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Already have an account? */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <p className="text-lg font-medium text-blue-100">
            Already have an account?
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 bg-white text-sky-700 px-5 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm group"
          >
            <span>Sign in</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-blue-100 mt-auto pt-6 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-5 mb-4">
            <Link to="/privacy" className="hover:text-white hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white hover:underline">
              Terms of Service
            </Link>
            <Link to="/refund" className="hover:text-white hover:underline">
              Refund Policy
            </Link>
          </div>
          <p className="text-blue-200">
            © {new Date().getFullYear()} Legend POS by LegendByte
          </p>
        </div>
      </div>
    </div>
  );
};

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessDescription: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
    checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
  });

  const navigate = useNavigate();

  // Password strength logic
  useEffect(() => {
    const pwd = formData.password;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
    const passed = Object.values(checks).filter(Boolean).length;

    let score = 0, label = "", color = "";
    if (passed > 0) {
      if (passed <= 2) { score = 1; label = "Weak"; color = "bg-red-500"; }
      else if (passed <= 4) { score = 2; label = "Medium"; color = "bg-yellow-500"; }
      else { score = 3; label = "Strong"; color = "bg-green-500"; }
    }
    setPasswordStrength({ score, label, color, checks });
  }, [formData.password]);

  // Timer logic
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev <= 1 ? 0 : prev - 1);
      if (timeLeft <= 1) setIsTimerActive(false);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    if (step === 2 && timeLeft === 0) {
      setTimeLeft(300);
      setIsTimerActive(true);
    }
  }, [step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setStatus({ type: "", message: "" });
  };

  // Handlers (signup, resend, verify) remain the same
  // ... (your existing handleSignup, resendVerificationCode, handleVerifyCode, handleResendCode functions)

//   // ─── Step 1: Signup ───────────────────────────────────────
  const handleSignup = async () => {
    const { displayName, email, password, confirmPassword } = formData;

    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (passwordStrength.score < 2) {
      setStatus({ type: "error", message: "Please choose a stronger password." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = {
        displayName: displayName.trim(),
        userName: email.trim(),
        password,
        businessDescription: formData.businessDescription.trim(),
      };

      const res = await signupForAccount(payload);

      if (res?.data?.exception) {
        setStatus({ type: "error", message: res.data.exception.message });
        return;
      }
      if (res?.data?.error) {
        setStatus({ type: "error", message: res.data.error });
        return;
      }

      setStatus({ type: "success", message: res?.data?.message });
      setStep(2);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };


  
  const resendVerificationCode = async () => {
    const { displayName, email, password, confirmPassword } = formData;

    setTimeLeft(300);
    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (passwordStrength.score < 2) {
      setStatus({ type: "error", message: "Please choose a stronger password." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = {
        displayName: displayName.trim(),
        userName: email.trim(),
        password,
        businessDescription: formData.businessDescription.trim(),
      };

      const res = await signupForAccount(payload);

      if (res?.data?.exception) {
        setStatus({ type: "error", message: res.data.exception.message });
        return;
      }
      if (res?.data?.error) {
        setStatus({ type: "error", message: res.data.error });
        return;
      }

      setStatus({ type: "success", message: res?.data?.message });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Step 2: Verify code ──────────────────────────────────
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setStatus({ type: "error", message: "Please enter the verification code." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const verifyRes = await verifyEmail({
        userName: formData.email.trim(),
        verificationCode: verificationCode.trim(),
      });

      if (verifyRes?.data.exception) {
        setStatus({ type: "error", message: verifyRes.data.exception.message });
        return;
      }
      if (verifyRes?.error) {
        setStatus({ type: "error", message: verifyRes.data.error });
        return;
      }

      setStep(3);

      const completeRes = await completeSignup({
        userName: formData.email.trim(),
        password: formData.password,
        displayName: formData.displayName.trim(),
        verificationCode: verificationCode.trim(),
      });

      console.log(completeRes);

      if (completeRes?.data.exception) {
        setStatus({ type: "error", message: completeRes.data.exception.message });
        setStep(2);
        return;
      }
      if (completeRes?.data.error) {
        setStatus({ type: "error", message: completeRes.data.error });
        setStep(2);
        return;
      }

      setStatus({
        type: "success",
        message: completeRes?.data.message || "Your Legend POS account has been created!",
      });
      setStep(4);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "An unexpected error occurred. Please try again." });
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    resendVerificationCode();
    setStatus({ type: "", message: "" });
    setVerificationCode("");
    setStatus({ type: "info", message: "New code requested. Please check your email again." });
  };



  const MessageBox = () => status.message ? (
    <div className={`p-4 rounded-lg border text-sm ${
      status.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
      status.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
      "bg-blue-50 border-blue-200 text-blue-800"
    }`}>{status.message}</div>
  ) : null;

 const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => updateForm("displayName", e.target.value)}
                placeholder="John Doe"
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateForm("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2 text-center">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.color || "bg-gray-300"
                      }`}
                      style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                    />
                  </div>
                  {passwordStrength.label && (
                    <span className="text-sm font-medium text-gray-700">
                      {passwordStrength.label}
                    </span>
                  )}
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 list-none">
                  <li className={passwordStrength.checks.length ? "text-green-600" : ""}>
                    ✓ At least 8 characters
                  </li>
                  <li className={passwordStrength.checks.uppercase ? "text-green-600" : ""}>
                    ✓ One uppercase letter
                  </li>
                  <li className={passwordStrength.checks.lowercase ? "text-green-600" : ""}>
                    ✓ One lowercase letter
                  </li>
                  <li className={passwordStrength.checks.number ? "text-green-600" : ""}>
                    ✓ One number
                  </li>
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Description (optional)
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => updateForm("businessDescription", e.target.value)}
                placeholder="Tell us briefly about your business..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            <MessageBox />

            <button
              onClick={handleSignup}
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 font-semibold text-white bg-sky-600 rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800">Verify Your Email</h3>
            <p className="text-gray-600">
              We sent a 6-digit code to <strong>{formData.email}</strong>
            </p>

            <div className="text-lg font-mono font-bold text-sky-600">
              Time remaining:{" "}
              <span className={timeLeft < 60 ? "text-red-600" : ""}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {timeLeft === 0 && (
              <p className="text-red-600 text-sm">Verification code has expired.</p>
            )}

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                setStatus({ type: "", message: "" });
              }}
              placeholder="Enter code"
              maxLength={6}
              className="w-full max-w-xs mx-auto px-5 py-4 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              autoFocus
            />

            <MessageBox />

            <button
              onClick={handleVerifyCode}
              disabled={isSubmitting}
              className={`w-full max-w-xs mx-auto py-3.5 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sky-600 hover:underline font-medium"
              >
                Resend code
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                <div className="mb-10">
                              <img src={pos_logo_long} className="h-12" alt="Legend POS" />
                            </div>

          

      <img
            src={settng_up_pos}
            alt="Setting up POS"
            className="h-44 mx-auto"
          />


           <div className="flex gap-1 items-center">
             <h3 className="text-2xl font-bold text-gray-800 animate-pulse">Setting up your POS</h3>
              </div>
            <p className="text-gray-600 max-w-md">
              We're creating your Legend POS tenant. This usually takes 1–5 minutes... 
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md text-sm text-amber-800">
              <strong className="text-amber-900">
                Please do not close this tab or refresh the page
              </strong>
              <br />
              until the setup is complete. Closing now may result in an incomplete account.
            </div>

            <MessageBox />
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
                  <div className="mb-10">
                              <img src={pos_logo_long} className="h-12" alt="Legend POS" />
                            </div>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Account Created!</h3>
              <p className="text-lg text-gray-600 mb-8">
                Your Legend POS account is ready. Welcome aboard!
              </p>
            </div>

            <MessageBox />

            <button
              onClick={() => navigate("/signin")}
              className="w-full max-w-sm py-4 px-8 font-semibold text-lg text-white bg-sky-600 rounded-xl hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all shadow-lg"
            >
              Sign In Now
            </button>

            <p className="text-sm text-gray-500">
              You'll be redirected to the login page to start using your POS.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[620px]">
            {/* Main content area */}
            <div
              className={`p-6 lg:p-12 flex flex-col justify-center bg-white transition-all duration-300 ${
                (step === 3 || step===4) ? "lg:col-span-2 items-center" : ""
              }`}
            >
              <div className={`${step === 3 ? "w-full max-w-3xl" : "max-w-md mx-auto w-full"}`}>
                {step === 1 && (
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
                    <p className="mt-2 text-gray-600">Start managing your business today</p>
                  </div>
                )}
    
                {renderContent()}

              </div>
            </div>

            {/* Marketing panel – shown below on mobile, right on desktop, hidden in step 3 */}
            {(step !== 3 & step !== 4) ? (
              <>
                {/* Desktop: right side */}
                <MarketingPanel />

                {/* Mobile: below the form */}
                <div className="lg:hidden">
                  <MarketingPanel isMobile />
                </div>
              </>
            ):null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;