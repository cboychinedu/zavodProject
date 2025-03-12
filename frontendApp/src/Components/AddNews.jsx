import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const AddNews = () => {
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    images: null,  
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files[0] });  
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const newsData = new FormData();
    newsData.append("title", formData.title);
    newsData.append("text", formData.text);
    if (formData.images) newsData.append("images", formData.images);
    newsData.append("tags", formData.tags.split(","));  

    try {
      const response = await axios.post("http://localhost:3001/news", newsData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", response.data);  
      setMessage("News added successfully!");
      setFormData({ title: "", text: "", images: null, tags: "" });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);  
      setMessage("Failed to add news. Try again.");
    }

    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "500px" }} className="shadow-sm p-4">
        <h3 className="text-center"> Admin Panel </h3>
        <h3 className="text-center mb-4">Add New News</h3>
        {message && <Alert variant={message.includes("successfully") ? "success" : "danger"}>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter news title"
              required
            />
          </Form.Group>

          {/* Text */}
          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter news content"
              required
            />
          </Form.Group>

          {/* Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
          </Form.Group>

          {/* Tags */}
          <Form.Group className="mb-3">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. politics, sports, tech"
              required
            />
          </Form.Group>

          {/* Submit Button */}
          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" className="me-2" /> : "Submit News"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddNews;
