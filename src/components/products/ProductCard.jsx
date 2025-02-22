import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success("Added to cart successfully!");
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/products/${product._id}`);
  };

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
        <div className="relative w-full pt-[100%]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Updated overlay with reduced opacity and backdrop blur */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]" />
          {/* Action buttons with new styling */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Button
                size="icon"
                className="bg-white/90 text-green-600 hover:bg-white hover:text-green-700 rounded-full shadow-lg hover:shadow-xl w-11 h-11 transition-all duration-300"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="bg-white/90 text-green-600 hover:bg-white hover:text-green-700 rounded-full shadow-lg hover:shadow-xl w-11 h-11 transition-all duration-300"
                onClick={handleViewDetails}
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4 bg-gradient-to-b from-white to-gray-50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors duration-300">
              {product.name}
            </h3>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              {product.category}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-600 font-medium text-lg">
              ৳{product.price_per_unit}/{product.unit}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock} {product.unit}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard; 