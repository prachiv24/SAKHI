// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession } from "../../context/SessionContext";
// import { useLanguage, LANGUAGES } from "../../context/LanguageContext";

// const VOICE_REPLIES_KEY = "yojana-sakhi-voice-replies";
// const NOTIFICATIONS_KEY = "yojana-sakhi-notifications";

// function readBoolPref(key, fallback = true) {
//   if (typeof window === "undefined") return fallback;
//   const stored = window.localStorage.getItem(key);
//   if (stored === null) return fallback;
//   return stored === "true";
// }

// function Toggle({ on, onClick, label }) {
//   return (
//     <button
//       type="button"
//       className={`toggle-switch${on ? " on" : ""}`}
//       onClick={onClick}
//       role="switch"
//       aria-checked={on}
//       aria-label={label}
//     >
//       <span className="knob" />
//     </button>
//   );
// }

// export default function SettingsPage() {
//   const router = useRouter();
//   const { sessionId, user, signOut } = useSession();
//   const { language } = useLanguage();

//   const [voiceReplies, setVoiceReplies] = useState(true);
//   const [notifications, setNotifications] = useState(true);
//   const [toast, setToast] = useState("");
//   const [exporting, setExporting] = useState(false);
//   const [confirmingReset, setConfirmingReset] = useState(false);

//   useEffect(() => {
//     setVoiceReplies(readBoolPref(VOICE_REPLIES_KEY, true));
//     setNotifications(readBoolPref(NOTIFICATIONS_KEY, true));
//   }, []);

//   function flashToast(msg) {
//     setToast(msg);
//     setTimeout(() => setToast(""), 2500);
//   }

//   function toggleVoice() {
//     const next = !voiceReplies;
//     setVoiceReplies(next);
//     window.localStorage.setItem(VOICE_REPLIES_KEY, String(next));
//     flashToast(next ? "Voice replies turned on." : "Voice replies turned off.");
//   }

//   function toggleNotifications() {
//     const next = !notifications;
//     setNotifications(next);
//     window.localStorage.setItem(NOTIFICATIONS_KEY, String(next));
//     flashToast(next ? "Notifications turned on." : "Notifications turned off.");
//   }

//   async function handleExport() {
//     if (!sessionId) return;
//     setExporting(true);
//     try {
//       const res = await fetch(`/api/profile?sessionId=${encodeURIComponent(sessionId)}`);
//       const data = await res.json();
//       const blob = new Blob([JSON.stringify(data.profile || {}, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "yojana-sakhi-profile.json";
//       a.click();
//       URL.revokeObjectURL(url);
//       flashToast("Profile data downloaded.");
//     } catch (err) {
//       console.error("Export failed:", err);
//       flashToast("Couldn't export right now — please try again.");
//     } finally {
//       setExporting(false);
//     }
//   }

//   async function handleLogout() {
//     if (!confirmingReset) {
//       setConfirmingReset(true);
//       return;
//     }
//     await signOut();
//     router.push("/login");
//   }

//   const currentLangLabel =
//     LANGUAGES.find((l) => l.code === language)?.nameLocal || "English";

//   return (
//     <div>
//       <div className="page-header">
//         <h1>Settings</h1>
//         <p>Manage how Yojana Sakhi AI talks to you and what it remembers.</p>
//       </div>

//       <div className="settings-section card">
//         <div className="section-title">Preferences</div>

//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Conversation language</div>
//             <div className="settings-row-desc">Currently {currentLangLabel}. Change it on the Languages page.</div>
//           </div>
//           <div className="settings-row-right">
//             <Link href="/languages" className="btn-secondary" style={{ textDecoration: "none" }}>
//               Change →
//             </Link>
//           </div>
//         </div>

//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Voice replies</div>
//             <div className="settings-row-desc">Let Sakhi AI speak its answers out loud in the chat widget.</div>
//           </div>
//           <div className="settings-row-right">
//             <Toggle on={voiceReplies} onClick={toggleVoice} label="Voice replies" />
//           </div>
//         </div>

//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Application updates</div>
//             <div className="settings-row-desc">Get notified about document verification and application status.</div>
//           </div>
//           <div className="settings-row-right">
//             <Toggle on={notifications} onClick={toggleNotifications} label="Notifications" />
//           </div>
//         </div>

//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Appearance</div>
//             <div className="settings-row-desc">Yojana Sakhi AI currently uses a single dark theme.</div>
//           </div>
//           <div className="settings-row-right">
//             <span className="badge green">Dark</span>
//           </div>
//         </div>
//       </div>

//       <div className="settings-section card">
//         <div className="section-title">Your Data</div>

//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Account ID</div>
//             <div className="settings-row-desc">Ties your profile, chats, and documents to your account — follows you across devices.</div>
//           </div>
//           <div className="settings-row-right">
//             <span className="settings-session-id">
//               {sessionId ? `${sessionId.slice(0, 8)}…` : "Loading…"}
//             </span>
//           </div>
//         </div>

//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Download my data</div>
//             <div className="settings-row-desc">Export your saved profile as a JSON file.</div>
//           </div>
//           <div className="settings-row-right">
//             <button className="btn-secondary" onClick={handleExport} disabled={!sessionId || exporting}>
//               {exporting ? "Preparing…" : "Export"}
//             </button>
//           </div>
//         </div>

//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Log out</div>
//             <div className="settings-row-desc">
//               Signs you out of {user?.email || "your account"} on this device. Your profile and
//               documents stay saved for next time.
//             </div>
//           </div>
//           <div className="settings-row-right">
//             <button className="settings-danger-btn" onClick={handleLogout}>
//               {confirmingReset ? "Tap again to confirm" : "Log out"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="settings-section card">
//         <div className="section-title">About</div>
//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Yojana Sakhi AI</div>
//             <div className="settings-row-desc">
//               An AI companion helping Indian citizens discover, understand, and apply for government
//               welfare schemes — in their own language.
//             </div>
//           </div>
//           <div className="settings-row-right">
//             <span className="badge orange">v1.0</span>
//           </div>
//         </div>
//         <div className="settings-row">
//           <div>
//             <div className="settings-row-label">Have thoughts on the app?</div>
//             <div className="settings-row-desc">Tell us what's working and what isn't.</div>
//           </div>
//           <div className="settings-row-right">
//             <Link href="/feedback" className="btn-secondary" style={{ textDecoration: "none" }}>
//               Give Feedback →
//             </Link>
//           </div>
//         </div>
//       </div>

//       {toast && <div className="settings-toast">✓ {toast}</div>}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "../../context/SessionContext";
import { useLanguage, LANGUAGES } from "../../context/LanguageContext";
import {
  SlidersHorizontal,
  Globe,
  Volume2,
  BellRing,
  Moon,
  DatabaseZap,
  Fingerprint,
  Download,
  LogOut,
  Info,
  Sparkles,
  MessageSquareHeart,
  CheckCircle2,
} from "lucide-react";

const VOICE_REPLIES_KEY = "yojana-sakhi-voice-replies";
const NOTIFICATIONS_KEY = "yojana-sakhi-notifications";

function readBoolPref(key, fallback = true) {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
}

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
      className={`toggle-switch${on ? " on" : ""}`}
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span className="knob" />
    </button>
  );
}

function RowIcon({ icon: Icon }) {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.06)",
        color: "var(--text-dim)",
        flexShrink: 0,
      }}
    >
      <Icon size={16} />
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div
      className="section-title"
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
    >
      <Icon size={15} />
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { sessionId, user, signOut } = useSession();
  const { language } = useLanguage();

  const [voiceReplies, setVoiceReplies] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [toast, setToast] = useState("");
  const [exporting, setExporting] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    setVoiceReplies(readBoolPref(VOICE_REPLIES_KEY, true));
    setNotifications(readBoolPref(NOTIFICATIONS_KEY, true));
  }, []);

  function flashToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function toggleVoice() {
    const next = !voiceReplies;
    setVoiceReplies(next);
    window.localStorage.setItem(VOICE_REPLIES_KEY, String(next));
    flashToast(next ? "Voice replies turned on." : "Voice replies turned off.");
  }

  function toggleNotifications() {
    const next = !notifications;
    setNotifications(next);
    window.localStorage.setItem(NOTIFICATIONS_KEY, String(next));
    flashToast(next ? "Notifications turned on." : "Notifications turned off.");
  }

  async function handleExport() {
    if (!sessionId) return;
    setExporting(true);
    try {
      const res = await fetch(`/api/profile?sessionId=${encodeURIComponent(sessionId)}`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.profile || {}, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "yojana-sakhi-profile.json";
      a.click();
      URL.revokeObjectURL(url);
      flashToast("Profile data downloaded.");
    } catch (err) {
      console.error("Export failed:", err);
      flashToast("Couldn't export right now — please try again.");
    } finally {
      setExporting(false);
    }
  }

  async function handleLogout() {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    await signOut();
    router.push("/login");
  }

  const currentLangLabel =
    LANGUAGES.find((l) => l.code === language)?.nameLocal || "English";

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage how Yojana Sakhi AI talks to you and what it remembers.</p>
      </div>

      <div className="settings-section card">
        <SectionTitle icon={SlidersHorizontal}>Preferences</SectionTitle>

        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={Globe} />
            <div>
              <div className="settings-row-label">Conversation language</div>
              <div className="settings-row-desc">Currently {currentLangLabel}. Change it on the Languages page.</div>
            </div>
          </div>
          <div className="settings-row-right">
            <Link href="/languages" className="btn-secondary" style={{ textDecoration: "none" }}>
              Change →
            </Link>
          </div>
        </div>

        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={Volume2} />
            <div>
              <div className="settings-row-label">Voice replies</div>
              <div className="settings-row-desc">Let Sakhi AI speak its answers out loud in the chat widget.</div>
            </div>
          </div>
          <div className="settings-row-right">
            <Toggle on={voiceReplies} onClick={toggleVoice} label="Voice replies" />
          </div>
        </div>

        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={BellRing} />
            <div>
              <div className="settings-row-label">Application updates</div>
              <div className="settings-row-desc">Get notified about document verification and application status.</div>
            </div>
          </div>
          <div className="settings-row-right">
            <Toggle on={notifications} onClick={toggleNotifications} label="Notifications" />
          </div>
        </div>

        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={Moon} />
            <div>
              <div className="settings-row-label">Appearance</div>
              <div className="settings-row-desc">Yojana Sakhi AI currently uses a single dark theme.</div>
            </div>
          </div>
          <div className="settings-row-right">
            <span className="badge green">Dark</span>
          </div>
        </div>
      </div>

      <div className="settings-section card">
        <SectionTitle icon={DatabaseZap}>Your Data</SectionTitle>

        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={Fingerprint} />
            <div>
              <div className="settings-row-label">Account ID</div>
              <div className="settings-row-desc">Ties your profile, chats, and documents to your account — follows you across devices.</div>
            </div>
          </div>
          <div className="settings-row-right">
            <span className="settings-session-id">
              {sessionId ? `${sessionId.slice(0, 8)}…` : "Loading…"}
            </span>
          </div>
        </div>

        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={Download} />
            <div>
              <div className="settings-row-label">Download my data</div>
              <div className="settings-row-desc">Export your saved profile as a JSON file.</div>
            </div>
          </div>
          <div className="settings-row-right">
            <button className="btn-secondary" onClick={handleExport} disabled={!sessionId || exporting}>
              {exporting ? "Preparing…" : "Export"}
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={LogOut} />
            <div>
              <div className="settings-row-label">Log out</div>
              <div className="settings-row-desc">
                Signs you out of {user?.email || "your account"} on this device. Your profile and
                documents stay saved for next time.
              </div>
            </div>
          </div>
          <div className="settings-row-right">
            <button className="settings-danger-btn" onClick={handleLogout}>
              {confirmingReset ? "Tap again to confirm" : "Log out"}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section card">
        <SectionTitle icon={Info}>About</SectionTitle>
        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={Sparkles} />
            <div>
              <div className="settings-row-label">Yojana Sakhi AI</div>
              <div className="settings-row-desc">
                An AI companion helping Indian citizens discover, understand, and apply for government
                welfare schemes — in their own language.
              </div>
            </div>
          </div>
          <div className="settings-row-right">
            <span className="badge orange">v1.0</span>
          </div>
        </div>
        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <RowIcon icon={MessageSquareHeart} />
            <div>
              <div className="settings-row-label">Have thoughts on the app?</div>
              <div className="settings-row-desc">Tell us what's working and what isn't.</div>
            </div>
          </div>
          <div className="settings-row-right">
            <Link href="/feedback" className="btn-secondary" style={{ textDecoration: "none" }}>
              Give Feedback →
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="settings-toast"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}