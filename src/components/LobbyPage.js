import "../index.css";
import CodeBlockItem from "./CodeBlockItem";
import { useState } from "react";

export default function LobbyPage(props) {
  return (
    <div className="container">
      <Header />
      <Menu
        onClick={props.setSelectedItem}
        codeBlocksData={props.codeBlocksData}
      />
    </div>
  );
}

function Header() {
  return (
    <header className="second-header">
      <h1>Choose code block</h1>
    </header>
  );
}

function Menu(props) {
  const numOfCodeBlocks = props.codeBlocksData.length;

  const handleClick = (block) => {
    props.onClick(block);
  };

  return (
    <main className="menu">
      {numOfCodeBlocks > 0 ? (
        <ul className="pizzas">
          {props.codeBlocksData.map((block) => (
            <CodeBlockItem
              item={block}
              onClick={() => handleClick(block)}
              key={block.name}
            />
          ))}
        </ul>
      ) : (
        <p>No code blocks found yet. Working on it :)</p>
      )}
    </main>
  );
}
