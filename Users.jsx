import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust to your firebase.js path

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    cnic: "",
    dob: "",
    securityQuestion: "",
    profilePicture: "",
    nationalIdCardFront: "",
    nationalIdCardBack: "",
  });
  const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(userData);
        setFilteredUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = users.filter((user) => {
      const userInfo = Object.values(user).join(" ").toLowerCase();
      return userInfo.includes(searchQuery.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const usersCollection = collection(db, "users");
      const docRef = await addDoc(usersCollection, { ...newUser, verified: false }); // Set verified to false by default
      alert("User added successfully!");

      const addedUser = { id: docRef.id, ...newUser, verified: false };
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setFilteredUsers((prevUsers) => [...prevUsers, addedUser]);

      setNewUser({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        cnic: "",
        dob: "",
        securityQuestion: "",
        profilePicture: "",
        nationalIdCardFront: "",
        nationalIdCardBack: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const userDoc = doc(db, "users", userId);
        await deleteDoc(userDoc);
        alert("User deleted successfully!");
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  // Function to handle edit user functionality
  const editUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setNewUser(userToEdit); // Populate form with current user data
    setEditingUserId(userId); // Track which user is being edited
  };

  // Function to update user details
  const updateUser = async (e) => {
    e.preventDefault();
    if (!editingUserId) return;

    try {
      const userDoc = doc(db, "users", editingUserId);
      await updateDoc(userDoc, newUser);
      alert("User updated successfully!");

      setUsers(users.map((user) => (user.id === editingUserId ? { id: user.id, ...newUser } : user)));
      setFilteredUsers(filteredUsers.map((user) => (user.id === editingUserId ? { id: user.id, ...newUser } : user)));

      setNewUser({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        cnic: "",
        dob: "",
        securityQuestion: "",
        profilePicture: "",
        nationalIdCardFront: "",
        nationalIdCardBack: "",
      });
      setEditingUserId(null); // Reset editing state to show Add form
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Function to verify a user
  const verifyUser = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, { verified: true });
      alert("User verified successfully!");

      setUsers(users.map((user) => (user.id === userId ? { ...user, verified: true } : user)));
      setFilteredUsers(filteredUsers.map((user) => (user.id === userId ? { ...user, verified: true } : user)));
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Failed to verify user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Users List</h1>

      {/* Add/Edit User Form */}
      <form className="add-user-form" onSubmit={editingUserId ? updateUser : addUser}>
        <h2>{editingUserId ? "Edit User" : "Add New User"}</h2>
        <input
          type="text"
          name="fullName"
          value={newUser.fullName}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={newUser.phone}
          onChange={handleInputChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={newUser.address}
          onChange={handleInputChange}
          placeholder="Address"
        />
        <input
          type="text"
          name="cnic"
          value={newUser.cnic}
          onChange={handleInputChange}
          placeholder="CNIC"
        />
        <input
          type="date"
          name="dob"
          value={newUser.dob}
          onChange={handleInputChange}
          placeholder="Date of Birth"
        />
        <input
          type="text"
          name="securityQuestion"
          value={newUser.securityQuestion}
          onChange={handleInputChange}
          placeholder="Security Question"
        />
        <input
          type="text"
          name="profilePicture"
          value={newUser.profilePicture}
          onChange={handleInputChange}
          placeholder="Profile Picture URL"
        />
        <input
          type="text"
          name="nationalIdCardFront"
          value={newUser.nationalIdCardFront}
          onChange={handleInputChange}
          placeholder="National ID Card Front URL"
        />
        <input
          type="text"
          name="nationalIdCardBack"
          value={newUser.nationalIdCardBack}
          onChange={handleInputChange}
          placeholder="National ID Card Back URL"
        />
        <button type="submit" className="add-btn">
          {editingUserId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Search input */}
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by user info..."
          className="search-input"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>CNIC</th>
            <th>Date of Birth</th>
            <th>Security Question</th>
            <th>Actions</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.cnic}</td>
              <td>{user.dob}</td>
              <td>{user.securityQuestion}</td>
              <td>
                <button onClick={() => editUser(user.id)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
              <td>
                {user.verified ? (
                  <span>Verified</span>
                ) : (
                  <button onClick={() => verifyUser(user.id)}>Verify</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
