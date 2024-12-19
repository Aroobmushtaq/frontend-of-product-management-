import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    price: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/array/${id}`);
        const user = response.data.user;
        setFormData({
          name: user.name,
          color: user.color,
          price: user.price,
          description: user.description,
          image: null,
        });
      } catch (err) {
        console.error("Error fetching user details");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("color", formData.color);
    data.append("price", formData.price);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await axios.patch(`http://localhost:3001/api/array/${id}`, data);
      alert(response.data.message);
    } catch (err) {
      alert("Error updating user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} placeholder="Name" onChange={handleChange} />
      <input type="text" name="color" value={formData.color} placeholder="Color" onChange={handleChange} />
      <input type="text" name="price" value={formData.price} placeholder="Price" onChange={handleChange} />
      <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange}></textarea>
      <input type="file" name="image" onChange={handleFileChange} />
      <button type="submit">Update User</button>
    </form>
  );
};

export default UpdateUser;
