// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "../../context/SessionContext";

// const STATUS_STYLES = {
//   submitted: { label: "Submitted",  color: "#facc15", bg: "rgba(250, 204, 21, 0.12)" },
//   approved:  { label: "Approved",   color: "#4ade80", bg: "rgba(74, 222, 128, 0.12)" },
//   rejected:  { label: "Rejected",   color: "#f87171", bg: "rgba(248, 113, 113, 0.12)" },
//   pending:   { label: "Pending",    color: "#facc15", bg: "rgba(250, 204, 21, 0.12)" },
// };

// function formatDate(iso) {
//   if (!iso) return "";
//   const d = new Date(iso);
//   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
//     " · " +
//     d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
// }

// export default function Page() {
//   const { sessionId } = useSession();

//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState("");

//   useEffect(() => {
//     if (!sessionId) return;

//     let cancelled = false;

//     async function load() {
//       setLoading(true);
//       setError("");
//       try {
//         const res  = await fetch(`/api/applications?sessionId=${encodeURIComponent(sessionId)}`);
//         const data = await res.json();

//         if (!res.ok) throw new Error(data.error || "Could not load applications");
//         if (!cancelled) setApplications(data.applications || []);
//       } catch (err) {
//         if (!cancelled) setError(err.message || "Could not load applications");
//         console.error(err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => { cancelled = true; };
//   }, [sessionId]);

//   return (
//     <div>
//       <div className="page-header">
//         <h1>Track Applications</h1>
//       </div>

//       {/* No sessionId found at all */}
//       {!sessionId && (
//         <div className="placeholder-card">
//           <div className="icon">📈</div>
//           <h2>No active session found</h2>
//           <p>Please start from your profile or a scheme page first.</p>
//         </div>
//       )}

//       {/* Loading */}
//       {sessionId && loading && (
//         <div className="placeholder-card">
//           <div className="icon">⏳</div>
//           <h2>Loading your applications...</h2>
//         </div>
//       )}

//       {/* Error */}
//       {sessionId && !loading && error && (
//         <div className="placeholder-card">
//           <div className="icon">⚠️</div>
//           <h2>Something went wrong</h2>
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Empty state */}
//       {sessionId && !loading && !error && applications.length === 0 && (
//         <div className="placeholder-card">
//           <div className="icon">📈</div>
//           <h2>No applications yet</h2>
//           <p>Once you submit an application, track its status here.</p>
//         </div>
//       )}

//       {/* Application list */}
//       {sessionId && !loading && !error && applications.length > 0 && (
//         <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
//           {applications.map((app) => {
//             const statusInfo = STATUS_STYLES[app.status] || STATUS_STYLES.submitted;
//             return (
//               <div
//                 key={app.id}
//                 style={{
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   borderRadius: "12px",
//                   padding: "20px",
//                   background: "rgba(255,255,255,0.03)",
//                 }}
//               >
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: "16px" }}>
//                       {app.scheme_name || app.scheme_id}
//                     </div>
//                     <div style={{ fontSize: "13px", opacity: 0.6, marginTop: "4px" }}>
//                       Applied on {formatDate(app.applied_at)}
//                     </div>
//                   </div>
//                   <span
//                     style={{
//                       padding: "4px 12px",
//                       borderRadius: "999px",
//                       fontSize: "13px",
//                       fontWeight: 600,
//                       color: statusInfo.color,
//                       background: statusInfo.bg,
//                     }}
//                   >
//                     {statusInfo.label}
//                   </span>
//                 </div>

//                 {app.documents_snapshot && app.documents_snapshot.length > 0 && (
//                   <div style={{ marginTop: "12px", fontSize: "13px", opacity: 0.7 }}>
//                     {app.documents_snapshot.length} document{app.documents_snapshot.length > 1 ? "s" : ""} verified at time of application
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useSession } from "../../context/SessionContext";
import {
  TrendingUp,
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck2,
  CalendarDays,
} from "lucide-react";

const STATUS_STYLES = {
  submitted: { label: "Submitted", color: "#facc15", bg: "rgba(250, 204, 21, 0.12)", icon: Clock },
  approved:  { label: "Approved",  color: "#4ade80", bg: "rgba(74, 222, 128, 0.12)", icon: CheckCircle2 },
  rejected:  { label: "Rejected",  color: "#f87171", bg: "rgba(248, 113, 113, 0.12)", icon: XCircle },
  pending:   { label: "Pending",   color: "#facc15", bg: "rgba(250, 204, 21, 0.12)", icon: Clock },
};

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function PlaceholderIcon({ icon: Icon, spin }) {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.06)",
        color: "var(--text-dim)",
        margin: "0 auto 14px",
      }}
    >
      <Icon size={24} className={spin ? "spin" : undefined} />
    </div>
  );
}

export default function Page() {
  const { sessionId } = useSession();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res  = await fetch(`/api/applications?sessionId=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Could not load applications");
        if (!cancelled) setApplications(data.applications || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load applications");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div>
      <div className="page-header">
        <h1>Track Applications</h1>
      </div>

      {/* No sessionId found at all */}
      {!sessionId && (
        <div className="placeholder-card" style={{ textAlign: "center" }}>
          <PlaceholderIcon icon={TrendingUp} />
          <h2>No active session found</h2>
          <p>Please start from your profile or a scheme page first.</p>
        </div>
      )}

      {/* Loading */}
      {sessionId && loading && (
        <div className="placeholder-card" style={{ textAlign: "center" }}>
          <PlaceholderIcon icon={Loader2} spin />
          <h2>Loading your applications...</h2>
        </div>
      )}

      {/* Error */}
      {sessionId && !loading && error && (
        <div className="placeholder-card" style={{ textAlign: "center" }}>
          <PlaceholderIcon icon={AlertTriangle} />
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Empty state */}
      {sessionId && !loading && !error && applications.length === 0 && (
        <div className="placeholder-card" style={{ textAlign: "center" }}>
          <PlaceholderIcon icon={TrendingUp} />
          <h2>No applications yet</h2>
          <p>Once you submit an application, track its status here.</p>
        </div>
      )}

      {/* Application list */}
      {sessionId && !loading && !error && applications.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
          {applications.map((app) => {
            const statusInfo = STATUS_STYLES[app.status] || STATUS_STYLES.submitted;
            const StatusIcon = statusInfo.icon;
            return (
              <div
                key={app.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderLeft: `3px solid ${statusInfo.color}`,
                  borderRadius: "12px",
                  padding: "18px 20px",
                  background: "rgba(255,255,255,0.03)",
                  transition: "background 150ms ease, border-color 150ms ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "16px" }}>
                      {app.scheme_name || app.scheme_id}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", opacity: 0.6, marginTop: "5px" }}>
                      <CalendarDays size={13} />
                      Applied on {formatDate(app.applied_at)}
                    </div>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: statusInfo.color,
                      background: statusInfo.bg,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <StatusIcon size={13} />
                    {statusInfo.label}
                  </span>
                </div>

                {app.documents_snapshot && app.documents_snapshot.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "14px",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      fontSize: "13px",
                      opacity: 0.7,
                    }}
                  >
                    <FileCheck2 size={14} />
                    {app.documents_snapshot.length} document{app.documents_snapshot.length > 1 ? "s" : ""} verified at time of application
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}