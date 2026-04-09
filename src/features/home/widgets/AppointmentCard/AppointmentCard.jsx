import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useConsultations } from "../../../consult/hooks/useConsultations";
import styles from "./AppointmentCard.module.css";

export default function AppointmentCard() {
  const { upcoming } = useConsultations();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef(null);

  const nextAppointment = useMemo(() => upcoming[0] ?? null, [upcoming]);
  const currentAppointmentWithLink = useMemo(
    () => upcoming.find((item) => Boolean(item.meetLink)) ?? null,
    [upcoming]
  );

  const meetLink = currentAppointmentWithLink?.meetLink ?? "";
  const meetUrl = useMemo(() => {
    if (!meetLink) return "";
    return /^https?:\/\//i.test(meetLink) ? meetLink : `https://${meetLink}`;
  }, [meetLink]);

  const copy = useCallback(async () => {
    if (!meetUrl || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(meetUrl);
    } catch {
      return;
    }

    setCopied(true);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [meetUrl]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.iconWrap}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <span className={styles.cardTitle}>Next Appointment</span>
      </div>

      <p className={styles.doctor}>
        {nextAppointment
          ? `Session with ${nextAppointment.dietitian}`
          : "No appointment scheduled"}
      </p>
      <p className={styles.consultType}>
        {nextAppointment?.type ?? "Health Consultation"}
      </p>

      <div className={styles.timeRow}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.timeIcon}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className={styles.time}>
          {nextAppointment
            ? `${nextAppointment.date}, ${nextAppointment.time}`
            : "Book your next consultation"}
        </span>
      </div>

      {meetLink ? (
        <div className={styles.meetSection}>
          <span className={styles.meetLabel}>Join via Google Meet</span>
          <div className={styles.meetRow}>
            <span className={styles.meetLink}>{meetLink}</span>
            <button
              type="button"
              onClick={copy}
              className={styles.copyBtn}
              aria-label="Copy meet link"
            >
              {copied ? (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="16"
                  height="16"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="15"
                  height="15"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
          <p className={styles.meetHint}>Copy the link and join 5 minutes early.</p>
        </div>
      ) : (
        <div className={styles.meetSection}>
          <span className={styles.meetLabel}>Meeting Link</span>
          <Link to="/dashboard/consult" className={styles.scheduleBtn}>
            Schedule Meeting
          </Link>
          <p className={styles.meetHint}>No active meet link yet. Book your session to get one.</p>
        </div>
      )}
    </div>
  );
}
