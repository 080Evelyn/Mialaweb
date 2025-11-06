import { ArrowUpRight, BaggageClaimIcon, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { products } from "@/config";

const ProductList = () => {
  return (
    <section className="py-20 bg-gray-50" id="products">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full border-2 border-pink-300 flex items-center justify-center bg-white shadow-sm">
              <BaggageClaimIcon className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Featured Products
          </h2>
          <span className="w-22 h-1 bg-pink-300 mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                {/* <div className="flex gap-4 flex-wrap justify-between items-center">
                  {product.oldPrice && (
                    <p className="line-through text-red-400 font-semibold">
                      {product.oldPrice}
                    </p>
                  )}
                  <p className="font-bold mt-1 text-">{product.price}</p>
                </div> */}
              </div>

              <div className="px-4 pb-4">
                <Button
                  onClick={() =>
                    window.open(
                      `https://wa.me/2349161302009?text=Hi 👋, I’d like to order the ${product.name}.`,
                      "_blank"
                    )
                  }
                  className="w-full bg-[#B10303] text-white py-3 rounded-sm flex items-center justify-center  gap-2 cursor-pointer hover:bg-green-600 transition-colors"
                >
                  <img
                    src="/images/white-whatsapp-icon.svg"
                    alt="whatsapp icon"
                    className="size-6.5"
                  />
                  <span>Checkout</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid place-content-center">
          <Link
            to="https://www.instagram.com/miala_beauty/?hl=en"
            target="_blank"
            className="group inline-flex items-center bg-black text-white px-8 py-3 rounded-full hover:bg-foreground/80 transition"
          >
            View All Products
            <ArrowUpRight className="size-5 ml-2 group-hover:-translate-y-1 group-hover:translate-x-1.5 transition duration-400" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
