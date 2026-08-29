"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { saveSession, type SessionUser } from "@/lib/client-auth";
import { ShieldCheck, Phone, Mail, Lock, User, ArrowRight, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState("");

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  const handlePhoneChange = (val: string) => {
    // Only numbers, max 10 digits
    const clean = val.replace(/\D/g, "");
    if (clean.length <= 10) {
      setPhone(clean);
    }
  };

  const handleSendOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (phone.length !== 10) {
      setError("Số điện thoại phải bao gồm đúng 10 chữ số (VD: 0901234567).");
      return;
    }

    if (!phone.startsWith("0")) {
      setError("Số điện thoại Việt Nam phải bắt đầu bằng số 0.");
      return;
    }

    // Generate random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpCode("");
    setOtpError("");
    setOtpTimer(60);
    setShowOtpModal(true);
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpTimer(60);
    setOtpError("");
  };

  const handleVerifyOtpAndRegister = async () => {
    if (otpCode.trim() !== generatedOtp) {
      setOtpError("Mã OTP không chính xác. Vui lòng kiểm tra lại!");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email, password })
      });

      const payload = (await response.json()) as {
        message?: string;
        token?: string;
        user?: SessionUser;
      };

      setLoading(false);

      if (!response.ok || !payload.token || !payload.user) {
        setOtpError(payload.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
        return;
      }

      setShowOtpModal(false);
      saveSession(payload.token, payload.user);
      router.push("/products");
    } catch (err) {
      setLoading(false);
      setOtpError("Có lỗi xảy ra trong quá trình đăng ký.");
    }
  };

  return (
    <main className="min-h-[85vh] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Đăng ký Tài khoản</h1>
          <p className="text-sm text-slate-500">Trở thành thành viên TechStore để nhận ưu đãi hấp dẫn</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Họ và tên *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                required
                placeholder="Nhập họ và tên đầy đủ"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Số điện thoại (đúng 10 số) *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                required
                type="tel"
                maxLength={10}
                placeholder="VD: 0901234567"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="pl-9 h-11 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                required
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Mật khẩu (tối thiểu 8 ký tự) *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                required
                type="password"
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-100">{error}</p>}

          <Button
            type="submit"
            className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            Tiếp Tục Xác Thực OTP <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 pt-2 border-t border-slate-100">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      {/* --- OTP VERIFICATION MODAL --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <KeyRound className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Xác Thực Mã OTP</h3>
              <p className="text-xs text-slate-500">
                Mã xác thực 6 số đã được gửi tới SĐT <span className="font-bold text-slate-800">{phone}</span> và Email <span className="font-bold text-slate-800">{email}</span>
              </p>
            </div>

            {/* Notification simulated OTP display for quick testing */}
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-center">
              <p className="text-xs text-blue-700 font-medium">Mã OTP xác thực của bạn là:</p>
              <p className="text-2xl font-mono font-bold text-blue-600 tracking-widest my-1">{generatedOtp}</p>
              <p className="text-[11px] text-blue-500">(Gắn trực tiếp mô phỏng SMS/Email cho demo)</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block text-center">Nhập 6 số OTP</label>
              <Input
                type="text"
                maxLength={6}
                placeholder="••••••"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-2xl tracking-[0.5em] h-14 rounded-2xl border-slate-300 focus:ring-2 focus:ring-blue-600"
              />
              {otpError && <p className="text-xs text-red-600 font-medium text-center mt-1">{otpError}</p>}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
              <span>Hết hạn sau: <strong className="text-blue-600 font-mono text-sm">{otpTimer}s</strong></span>
              {otpTimer === 0 ? (
                <button 
                  onClick={handleResendOtp}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Gửi lại mã OTP
                </button>
              ) : (
                <span className="text-slate-400">Gửi lại mã sau {otpTimer}s</span>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleVerifyOtpAndRegister}
                disabled={loading || otpCode.length !== 6}
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 disabled:bg-slate-300"
              >
                {loading ? "Đang kích hoạt..." : "Xác Thực & Hoàn Tất Đăng Ký"}
              </Button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 py-1"
              >
                Quay lại chỉnh sửa thông tin
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
