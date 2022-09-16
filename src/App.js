import "./App.scss";
import React, { useEffect } from "react";

import BoardBar from "./components/BoardBar/BoardBar";
import AppBar from "./components/AppBar/AppBar";
import BoardContent from "./components/BoardContent/BoardContent";

function App() {
  return (
    <div className="app-master">
      <AppBar />
      <BoardBar />
      <BoardContent />
    </div>
  );
}

export default App;
