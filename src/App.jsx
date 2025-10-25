
import React from "react";
import "./App.css";
import TeamCard from "./components/TeamCard/TeamCard";
import Sidebar from "./components/Sidebar/Sidebar";
import People from "./body/people/people";

function App() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <People />
    </div>
  );
}

export default App;
