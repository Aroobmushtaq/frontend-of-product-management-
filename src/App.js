import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [users, setUsers] = useState([]); // Store user data
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    price: "",
    description: "",
    image: null,
  });
  const [editingUser, setEditingUser] = useState(null); // being edited

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/array/");
      setUsers(response.data.user);
    } catch (err) {
      toast.error("Error fetching users");
      console.error("Error fetching users:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission for Create/Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      if (editingUser) {
        // Update user
        await axios.patch(
          `http://localhost:3000/api/array/${editingUser._id}`,
          formData
        );
        toast.success("Product updated successfully");
      } else {
        // Create new user
        await axios.post("http://localhost:3000/api/array/", data);
        toast.success("Product created successfully");
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error("Error submitting form");
      console.error("Error submitting form:", err.message);
    }
  };

  // Delete a user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/array/${id}`);
      toast.success("Product deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Error deleting user");
      console.error("Error deleting user:", err.message);
    }
  };

  // Edit user: pre-fill form
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      color: user.color,
      price: user.price,
      description: user.description,
      image: user.image, // File upload won't pre-fill, must upload new image
    });
    toast.info("Editing user");
  };

  // Reset form and editing state
  const resetForm = () => {
    setFormData({
      name: "",
      color: "",
      price: "",
      description: "",
      image: null,
    });
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Product Management</h1>

      {/* Form for Create/Update */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{editingUser ? "Update User" : "Create User"}</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {editingUser ? "Update" : "Create"}
          </button>
          {editingUser && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* User List */}
      <h2 className="text-3xl font-semibold text-center text-gray-800 mt-10 mb-6">Product List</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <li
            key={user._id}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 h-96 flex flex-col"
          >
            {user.image && (
              <img
                src={`http://localhost:3000/${user.image}`}
                alt="User"
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
            )}
            <p className="text-lg font-semibold text-gray-800"><strong>Name:</strong> {user.name}</p>
            <p className="text-gray-700"><strong>Color:</strong> {user.color}</p>
            <p className="text-gray-700"><strong>Price:</strong> {user.price}</p>
            <p className="text-gray-700"><strong>Description:</strong> {user.description}</p>
            <div className="mt-4 flex justify-between mt-auto">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;