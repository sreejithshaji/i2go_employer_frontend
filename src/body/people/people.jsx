import React, { useEffect, useState } from "react";
import TeamCard from "../../components/TeamCard/TeamCard";
import { supabase } from "../../services/supabase";
import { candidatesService } from "../../services/candidates";




// Fetch team members from Supabase
const People = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await candidatesService.getCandidates();
                console.log('Fetched candidates:', data);
                setTeamMembers(data);

            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        fetchData();
    }, []);


    return (
        <main className="main-content">
            <div className="design-team-header">
                <h2>Candidates</h2>
                <div className="search-filter">
                    <input type="text" placeholder="Search" className="search-input" />
                    <select className="grade-select">
                        <option>Grade</option>
                        <option>Junior</option>
                        <option>Middle</option>
                        <option>Senior</option>
                    </select>
                    <button className="filter-btn">☰</button>
                </div>
            </div>
            <div className="content-row">
                <div className="team-grid">
                    {loading && <div>Loading...</div>}
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {!loading && !error && teamMembers.map((member, idx) => (
                        <TeamCard key={idx} {...member} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default People;