import React from "react";
import Users from "./components/Users";
import Products from "./components/Products";
import Transactions from "./components/Transactions";
import Chats from "./components/Chats";
import Wallets from "./components/Wallets";

function App() {
  return (
    <div>
      <header>
        <h1>Rentify Admin Panel</h1>
      </header>
      <Users />
      <Products />
      <Transactions />
      <Chats />
      <Wallets />
    </div>
  );
}

export default App;