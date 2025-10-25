import React from "react";
import TeamCard from "./TeamCard";
import "./App.css";

const teamMembers = [
    {
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "James Smith",
        role: "Middle UI/UX",
        projects: 22,
        done: 18,
        progress: 3,
        productivity: 69,
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
        name: "Kevin Kim",
        role: "Senior Graphic",
        projects: 80,
        done: 2,
        progress: 80,
        productivity: 80,
    },
    {
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Lissa Shulz",
        role: "Junior Graphic",
        projects: 7,
        done: 5,
        progress: 1,
        productivity: 40,
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/65.jpg",
        name: "Jaspal Cortes",
        role: "Junior UI/UX",
        projects: 7,
        done: 6,
        progress: 1,
        productivity: 60,
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/66.jpg",
        name: "Elliot Morrison",
        role: "Senior UI/UX",
        projects: 130,
        done: 45,
        progress: 40,
        productivity: 90,
    },
    {
        avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        name: "Jace O'Quinn",
        role: "Middle Graphic",
        projects: 45,
        done: 40,
        progress: 3,
        productivity: 75,
    },
];

function TeamGrid() {
    return (
        <div className="team-grid">
            {teamMembers.map((member, idx) => (
                <TeamCard key={idx} {...member} />
            ))}
        </div>
    );
}

export default TeamGrid;
