import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the cart button
    addToCart(product, 1);
    toast.success("Added to cart successfully!");
  };

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
        <div className="relative w-full pt-[100%]"> {/* Create a square aspect ratio container */}
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {/* Overlay with cart button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                size="icon"
                className="bg-white text-green-600 hover:bg-green-50 rounded-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="bg-white text-green-600 hover:bg-green-50 rounded-full"
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-600 font-medium">
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
          <Button className="w-full bg-green-600 hover:bg-green-700">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard; 