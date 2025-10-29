import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import "./SchedulePopup.css";


const SchedulePopup = ({ open, onClose, candidateId }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState(null);

    React.useEffect(() => {
        async function fetchUser() {
            const { data, error } = await supabase.auth.getUser();
            if (data && data.user) setUserId(data.user.id);
        }
        fetchUser();
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const dateTime = new Date(`${date}T${time}`);
            if (!userId) throw new Error("User not authenticated");
            const { error: insertError } = await supabase
                .from("meetings")
                .insert([
                    {
                        candidate_id: candidateId,
                        user_id: userId,
                        date_time: dateTime.toISOString(),
                        status: "pending"
                    }
                ]);
            if (insertError) throw insertError;
            setSuccess(true);
            setDate("");
            setTime("");
        } catch (err) {
            setError(err.message || "Failed to schedule meeting");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="schedule-popup-overlay">
            <div className="schedule-popup">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Schedule Interview</h2>
                <form className="schedule-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="meeting-date">Date</label>
                        <input type="date" id="meeting-date" name="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="meeting-time">Time</label>
                        <input type="time" id="meeting-time" name="time" value={time} onChange={e => setTime(e.target.value)} required />
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
                    {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginTop: 10 }}>Meeting scheduled!</div>}
                </form>
            </div>
        </div>
    );
};

export default SchedulePopup;
