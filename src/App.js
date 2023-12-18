import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect } from "react";

function TextEditor({ text, setText }) {
  const handleTextChange = (event) => {
    setText(event.target.value);
  };
  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Type your text here..."
      />
    </div>
  );
}

function Player({ text }) {
  const [index, setIndex] = useState(0);
  const indexRef = React.useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  const textParts = text
    .split(/\s/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
  const incrIndex = (amount) => {
    const newIndex = Math.max(
      0,
      Math.min(indexRef.current + amount, textParts.length - 1)
    );
    console.log("setIndex", newIndex, indexRef.current, textParts.length);
    setIndex(newIndex);
  };
  const handleClick = (event) => {
    incrIndex(1);
  };
  const handleScroll = (event) => {
    console.log(event.deltaY);
    if (event.deltaY > 0) {
      // Scrolling down
      incrIndex(1);
    } else {
      // Scrolling up
      incrIndex(-1);
    }
  };
  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const end = Math.min(textParts.length, index + 10);
  return (
    <div className="Player" onClick={handleClick}>
      <h1>{textParts[index]}</h1>
      <p className="Preview">{textParts.slice(index, end).join(" ")}</p>
    </div>
  );
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState(localStorage.getItem("text") || "");
  useEffect(() => {
    localStorage.setItem("text", text);
  }, [text]); // Dependency array ensures this runs only when text changes
  if (isPlaying) {
    return (
      <div className="App">
        <Player text={text} />
      </div>
    );
  }
  return (
    <div className="App">
      <TextEditor text={text} setText={setText} />
      <button onClick={() => setIsPlaying(true)}>Go!</button>
    </div>
  );
}

export default App;
