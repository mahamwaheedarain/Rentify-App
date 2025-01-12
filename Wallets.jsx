import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust to your firebase.js path

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch wallets data
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const walletsCollection = collection(db, "wallets");
        const walletSnapshot = await getDocs(walletsCollection);
        const walletData = walletSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWallets(walletData);

        // Fetch user data to resolve userIds for wallet
        const userIds = walletData.map((wallet) => wallet.id);
        const usersData = {};
        for (const userId of userIds) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            usersData[userId] = userDoc.data();
          }
        }

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wallets:", error);
        setLoading(false);
      }
    };

    fetchWallets();
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
      <h1>Wallets List</h1>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Balance</th>
            <th>Last Updated</th>
            <th>Payment Methods</th>
          </tr>
        </thead>
        <tbody>
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <tr key={wallet.id}>
                <td>{users[wallet.id]?.fullName || "Unknown User"}</td>
                <td>{renderValue(wallet.balance)}</td>
                <td>
                  {wallet.lastUpdated
                    ? new Date(wallet.lastUpdated.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {wallet.paymentMethods?.length > 0 ? (
                    wallet.paymentMethods.map((method, index) => (
                      <div key={index}>
                        <strong>{method.type}:</strong> {method.details}{" "}
                        {method.isActive ? "(Active)" : "(Inactive)"}
                      </div>
                    ))
                  ) : (
                    "No payment methods"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No wallets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Wallets;
