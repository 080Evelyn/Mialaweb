import { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav className="bg-white/50 backdrop-blur-lg shadow-sm sticky top-0 z-50 px-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="miala logo" className="h-8" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-rose-500 font-medium transition-all duration-300 ease-in-out"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" className="relative group">
                <ShoppingCart className="size-6 text-gray-700 group-hover:text-rose-500 transition-colors duration-300" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
            </div>

            <a
              href="#mission"
              className="bg-rose-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-rose-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Learn More</span>
            </a>
          </div>

          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Cart on Mobile */}
            <button className="relative p-2 text-gray-700 hover:text-rose-500 transition-colors duration-300">
              <ShoppingCart className="size-6.5" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
            >
              <div className="size-6 flex flex-col justify-center space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-64 opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-rose-500 font-medium py-2 text-left transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/2349012345678"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rose-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-600 transition-colors duration-300 flex items-center justify-center space-x-2 mt-4"
            >
              <span>💬</span>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
