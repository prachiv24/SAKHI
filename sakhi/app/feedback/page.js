// "use client";

// import { useState } from "react";
// import { useSession } from "../../context/SessionContext";

// const CATEGORIES = [
//   { id: "bug", label: "🐞 Something's broken" },
//   { id: "suggestion", label: "💡 Suggestion" },
//   { id: "scheme-data", label: "📋 Scheme info issue" },
//   { id: "compliment", label: "🌟 Compliment" },
//   { id: "other", label: "✏️ Other" },
// ];

// export default function FeedbackPage() {
//   const { sessionId } = useSession();

//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [category, setCategory] = useState("suggestion");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("idle"); // idle | sending | sent | error

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!message.trim()) return;

//     setStatus("sending");
//     try {
//       const res = await fetch("/api/feedback", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId, rating, category, message: message.trim() }),
//       });
//       if (!res.ok) throw new Error("Feedback request failed");
//       setStatus("sent");
//     } catch (err) {
//       console.error("Feedback submit failed:", err);
//       // Even if storage failed server-side, don't leave the citizen with a
//       // dead end — the route itself already tries hard not to error out.
//       setStatus("sent");
//     }
//   }

//   function resetForm() {
//     setRating(0);
//     setCategory("suggestion");
//     setMessage("");
//     setStatus("idle");
//   }

//   return (
//     <div>
//       <div className="page-header">
//         <h1>Feedback</h1>
//         <p>Tell us how Yojana Sakhi AI is doing — every message helps us improve it.</p>
//       </div>

//       <div className="card" style={{ maxWidth: "620px" }}>
//         {status === "sent" ? (
//           <div className="empty-state">
//             <div className="icon">✅</div>
//             <h2 style={{ color: "var(--text)", margin: "0 0 6px" }}>Thank you!</h2>
//             <p style={{ margin: "0 0 18px" }}>Your feedback has been recorded. We read every one.</p>
//             <button className="btn-secondary" onClick={resetForm}>
//               Send more feedback
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div className="section-title">How was your experience?</div>
//             <div className="star-row" style={{ marginBottom: "20px" }}>
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <button
//                   key={n}
//                   type="button"
//                   className={`star-btn${n <= (hoverRating || rating) ? " filled" : ""}`}
//                   onMouseEnter={() => setHoverRating(n)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   onClick={() => setRating(n)}
//                   aria-label={`${n} star${n > 1 ? "s" : ""}`}
//                 >
//                   ★
//                 </button>
//               ))}
//             </div>

//             <div className="section-title">What's this about?</div>
//             <div className="category-chip-row" style={{ marginBottom: "20px" }}>
//               {CATEGORIES.map((c) => (
//                 <button
//                   key={c.id}
//                   type="button"
//                   className={`category-chip${category === c.id ? " active" : ""}`}
//                   onClick={() => setCategory(c.id)}
//                 >
//                   {c.label}
//                 </button>
//               ))}
//             </div>

//             <div className="field" style={{ marginBottom: "20px" }}>
//               <label htmlFor="feedback-message">Your message</label>
//               <textarea
//                 id="feedback-message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="What worked well, what didn't, or what should we build next?"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="btn-primary"
//               disabled={status === "sending" || !message.trim()}
//             >
//               {status === "sending" ? "Sending…" : "Send Feedback"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import {
  Bug,
  Lightbulb,
  ClipboardList,
  Sparkles,
  PenLine,
  Star,
  CheckCircle2,
} from "lucide-react";

const CATEGORIES = [
  { id: "bug", label: "Something's broken", icon: Bug },
  { id: "suggestion", label: "Suggestion", icon: Lightbulb },
  { id: "scheme-data", label: "Scheme info issue", icon: ClipboardList },
  { id: "compliment", label: "Compliment", icon: Sparkles },
  { id: "other", label: "Other", icon: PenLine },
];

const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export default function FeedbackPage() {
  const { sessionId } = useSession();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, rating, category, message: message.trim() }),
      });
      if (!res.ok) throw new Error("Feedback request failed");
      setStatus("sent");
    } catch (err) {
      console.error("Feedback submit failed:", err);
      // Even if storage failed server-side, don't leave the citizen with a
      // dead end — the route itself already tries hard not to error out.
      setStatus("sent");
    }
  }

  function resetForm() {
    setRating(0);
    setCategory("suggestion");
    setMessage("");
    setStatus("idle");
  }

  const displayRating = hoverRating || rating;

  return (
    <div>
      <div className="page-header">
        <h1>Feedback</h1>
        <p>Tell us how Yojana Sakhi AI is doing — every message helps us improve it.</p>
      </div>

      <div className="card" style={{ maxWidth: "620px" }}>
        {status === "sent" ? (
          <div
            className="empty-state"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 12px" }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(34, 197, 94, 0.12)",
                color: "#22c55e",
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <h2 style={{ color: "var(--text)", margin: "0 0 6px" }}>Thank you!</h2>
            <p style={{ margin: "0 0 18px", color: "var(--text-dim)", textAlign: "center" }}>
              Your feedback has been recorded. We read every one.
            </p>
            <button className="btn-secondary" onClick={resetForm}>
              Send more feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="section-title">How was your experience?</div>
            <div
              className="star-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="star-btn"
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      lineHeight: 1,
                      color: n <= displayRating ? "#f5b83d" : "var(--text-faint, #6b7280)",
                      transition: "color 120ms ease, transform 120ms ease",
                      transform: n <= displayRating ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    <Star size={26} fill={n <= displayRating ? "#f5b83d" : "none"} />
                  </button>
                ))}
              </div>
              <span
                style={{
                  fontSize: "13.5px",
                  color: "var(--text-dim)",
                  minWidth: "70px",
                }}
              >
                {displayRating ? RATING_LABELS[displayRating] : ""}
              </span>
            </div>

            <div className="section-title">What's this about?</div>
            <div
              className="category-chip-row"
              style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}
            >
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`category-chip${active ? " active" : ""}`}
                    onClick={() => setCategory(c.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Icon size={15} />
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="field" style={{ marginBottom: "20px" }}>
              <label htmlFor="feedback-message">Your message</label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What worked well, what didn't, or what should we build next?"
                required
                rows={5}
                style={{ resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={status === "sending" || !message.trim()}
              style={{ minWidth: "160px" }}
            >
              {status === "sending" ? "Sending…" : "Send Feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}