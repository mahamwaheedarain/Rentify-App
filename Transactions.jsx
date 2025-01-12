import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust to your firebase.js path

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsCollection = collection(db, "transactions");
        const transactionSnapshot = await getDocs(transactionsCollection);
        const transactionData = transactionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(transactionData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to render a value or "null" if undefined or null
  const renderValue = (value) => {
    return value === null || value === undefined ? "null" : value;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Transactions List</h1>
      <table>
        <thead>
          <tr>
            <th>Transaction Type</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Related Product ID</th>
            <th>Transaction Method</th>
            <th>Reference ID</th>
            <th>Details</th>
            <th>Recipient ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{renderValue(transaction.transactionType)}</td>
                <td>{renderValue(transaction.userId)}</td>
                <td>{renderValue(transaction.amount)}</td>
                <td>{renderValue(transaction.status)}</td>
                <td>
                  {transaction.date
                    ? new Date(transaction.date.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{renderValue(transaction.relatedProductId)}</td>
                <td>{renderValue(transaction.transactionMethod)}</td>
                <td>{renderValue(transaction.referenceId)}</td>
                <td>{renderValue(transaction.details)}</td>
                <td>{renderValue(transaction.recipientId)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
