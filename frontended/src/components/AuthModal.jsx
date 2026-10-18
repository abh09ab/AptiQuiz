import { useState } from "react";
import { ShieldCheck, X, Mail, Smartphone, User, Check, ArrowRight } from "lucide-react";

export default function AuthModal({
  userProfile,
  onSaveProfile,
  onClose,
  avatars = [],
}) {
  const [authTab, setAuthTab] = useState("gmail"); // "gmail" | "phone" | "profile"
  const [gmailAddress, setGmailAddress] = useState(userProfile?.email || "abhay.verma@gmail.com");
  const [phoneNum, setPhoneNum] = useState(userProfile?.phone || "9876543210");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [authName, setAuthName] = useState(userProfile?.name || "Abhay");
  const [authAvatar, setAuthAvatar] = useState(userProfile?.avatar || "⚡");
  const [authCollege, setAuthCollege] = useState(userProfile?.college || "BITS Pilani / IIT");
  const [authTarget, setAuthTarget] = useState(userProfile?.targetCompany || "Software Engineer @ Google");

  const handleGmailSubmit = (e) => {
    e.preventDefault();
    if (!gmailAddress.trim() || !gmailAddress.includes("@")) {
      alert("Please enter a valid Gmail address.");
      return;
    }
    const derivedName = gmailAddress.split("@")[0].replace(".", " ");
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    const updated = {
      ...userProfile,
      name: formattedName,
      email: gmailAddress,
      avatar: "⚡",
      authMethod: "Gmail",
    };
    onSaveProfile(updated);
    onClose();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNum || phoneNum.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode !== "1234" && otpCode.length !== 4) {
      alert("Please enter the 4-digit OTP code (Demo OTP: 1234).");
      return;
    }
    setOtpVerified(true);
    const updated = {
      ...userProfile,
      name: `User ${phoneNum.slice(-4)}`,
      phone: phoneNum,
      avatar: "🚀",
      authMethod: "Phone OTP",
    };
    onSaveProfile(updated);
    setTimeout(() => {
      onClose();
      setOtpSent(false);
      setOtpVerified(false);
    }, 700);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!authName.trim()) {
      alert("Please enter your display name.");
      return;
    }
    const updated = {
      ...userProfile,
      name: authName.trim(),
      avatar: authAvatar,
      college: authCollege.trim(),
      targetCompany: authTarget.trim(),
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card-3d" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="auth-header">
          <div className="auth-header-title">
            <ShieldCheck size={26} color="#8b5cf6" />
            <h2>Candidate Authentication</h2>
          </div>
          <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* AUTH METHOD TABS */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${authTab === "gmail" ? "active-tab" : ""}`}
            onClick={() => setAuthTab("gmail")}
          >
            <Mail size={16} /> Gmail Login
          </button>
          <button
            className={`auth-tab ${authTab === "phone" ? "active-tab" : ""}`}
            onClick={() => setAuthTab("phone")}
          >
            <Smartphone size={16} /> Mobile OTP
          </button>
          <button
            className={`auth-tab ${authTab === "profile" ? "active-tab" : ""}`}
            onClick={() => setAuthTab("profile")}
          >
            <User size={16} /> Edit Profile
          </button>
        </div>

        {/* TAB 1: GMAIL SIGN IN */}
        {authTab === "gmail" && (
          <form onSubmit={handleGmailSubmit} className="auth-form-body">
            <div className="auth-center-icon">
              <Mail size={32} color="#ea4335" />
            </div>
            <h3 className="auth-form-title">Sign in with Google / Gmail</h3>
            <p className="auth-form-desc">
              Synchronize your test history, track global ELO rating, and claim Amazon vouchers.
            </p>

            <div className="auth-field-group">
              <label>Gmail Address</label>
              <input
                type="email"
                placeholder="your.name@gmail.com"
                value={gmailAddress}
                onChange={(e) => setGmailAddress(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-auth-submit">
              <span>Sign In with Gmail</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* TAB 2: MOBILE OTP */}
        {authTab === "phone" && (
          <div className="auth-form-body">
            <div className="auth-center-icon">
              <Smartphone size={32} color="#06b6d4" />
            </div>
            <h3 className="auth-form-title">Sign in via Mobile OTP</h3>
            <p className="auth-form-desc">
              Fast, passwordless login with instant SMS verification. (Demo OTP is <strong>1234</strong>)
            </p>

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="auth-field-group">
                  <label>10-Digit Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
                <button type="submit" className="btn-auth-submit">
                  <span>Send Verification Code</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="auth-field-group">
                  <label>Enter 4-Digit OTP Code (Enter: 1234)</label>
                  <input
                    type="text"
                    placeholder="1234"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={4}
                    autoFocus
                    required
                  />
                </div>
                <button type="submit" className="btn-auth-submit">
                  {otpVerified ? (
                    <>
                      <Check size={18} /> Verified! Logging in...
                    </>
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {authTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="auth-form-body">
            <h3 className="auth-form-title">Customize Candidate Profile</h3>
            <p className="auth-form-desc">
              Your profile is visible on the Live Leaderboard and during Multiplayer Battles.
            </p>

            <div className="auth-field-group">
              <label>Choose Avatar</label>
              <div className="avatar-selection-grid">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`avatar-pick-btn ${authAvatar === av.emoji ? "selected" : ""}`}
                    onClick={() => setAuthAvatar(av.emoji)}
                    title={av.title}
                  >
                    <span>{av.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-field-group">
              <label>Candidate Name</label>
              <input
                type="text"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>College / University</label>
              <input
                type="text"
                value={authCollege}
                onChange={(e) => setAuthCollege(e.target.value)}
              />
            </div>

            <div className="auth-field-group">
              <label>Target Dream Company</label>
              <input
                type="text"
                value={authTarget}
                onChange={(e) => setAuthTarget(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-auth-submit">
              <span>Save Profile Changes</span>
              <Check size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
