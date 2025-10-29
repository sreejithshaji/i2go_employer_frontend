import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./MeetingsBody.css";

const MeetingsBody = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        async function fetchUserAndMeetings() {
            setLoading(true);
            setError("");
            try {
                const { data: userData } = await supabase.auth.getUser();
                if (!userData || !userData.user) {
                    setError("Not authenticated");
                    setLoading(false);
                    return;
                }
                setUserId(userData.user.id);
                // Fetch meetings with candidate name join
                const { data, error: fetchError } = await supabase
                    .from("meetings")
                    .select("id, candidate_id, date_time, status, candidates(full_name)")
                    .eq("user_id", userData.user.id)
                    .order("date_time", { ascending: false });
                if (fetchError) throw fetchError;
                setMeetings(data || []);
            } catch (err) {
                setError(err.message || "Failed to fetch meetings");
            } finally {
                setLoading(false);
            }
        }
        fetchUserAndMeetings();
    }, []);

    return (
        <div className="meetings-body">
            <h2>Meetings</h2>
            {loading ? (
                <div className="meetings-list-placeholder">Loading...</div>
            ) : error ? (
                <div className="meetings-list-placeholder" style={{ color: 'red' }}>{error}</div>
            ) : meetings.length === 0 ? (
                <div className="meetings-list-placeholder">No meetings to show yet.</div>
            ) : (
                <div className="meetings-table-wrapper">
                    <table className="meetings-table styled-meetings-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.map(meeting => (
                                <tr key={meeting.id}>
                                    <td className="candidate-name">{meeting.candidates?.full_name || meeting.candidate_id}</td>
                                    <td>{new Date(meeting.date_time).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge status-${meeting.status}`}>{meeting.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MeetingsBody;
