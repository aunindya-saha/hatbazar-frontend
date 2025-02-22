import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Pencil, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_URL = 'http://localhost:5001/api';

const StarRating = ({ rating, setRating, disabled = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && setRating(star)}
          className={`${
            disabled ? "cursor-default" : "cursor-pointer hover:text-yellow-500"
          } ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );
};

const BuyerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    image: null,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${API_URL}/buyers/${user._id}/reviews`);
      setReviews(response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(review => ({
          ...review,
          product: review.product_id // Assuming the endpoint populates product_id
        }))
      );
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setFormData({
      rating: review.rating,
      comment: review.comment,
      image: review.image,
    });
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      const reviewData = new FormData();
      reviewData.append("rating", formData.rating);
      reviewData.append("comment", formData.comment);
      if (formData.image) {
        reviewData.append("image", formData.image);
      }

      await axios.put(`${API_URL}/reviews/${editingReview}`, reviewData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Review updated successfully");
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Reviews Yet
        </h2>
        <p className="text-gray-600">
          You haven't written any reviews yet. Start shopping and share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 mb-8">
        My Reviews
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-green-100"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={review.product.image}
                  alt={review.product.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {review.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <StarRating rating={review.rating} disabled />
                </div>
              </div>
              
              <p className="mt-4 text-gray-700">{review.comment}</p>
              
              {review.image && (
                <img
                  src={review.image}
                  alt="Review"
                  className="mt-4 rounded-lg max-h-48 object-cover"
                />
              )}
              
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(review)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(review._id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerReviews; 