import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useCart } from "../context/useCart";
import "../CSS/home.css";

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Jewellery", icon: "💎" },
  { name: "Accessories", icon: "🎧" },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(
          "https://dummyjson.com/products/category/mens-shirts?limit=4",
        );

        if (!response.ok) {
          throw new Error("Could not fetch products");
        }

        const data = await response.json();

        if (!Array.isArray(data.products)) {
          throw new Error("Invalid product data");
        }

        const featuredProducts = data.products.map((product) => ({
          ...product,
          id: `fashion-${product.id}`,
          originalId: product.id,
          image: product.thumbnail || product.images?.[0] || "",
        }));

        setProducts(featuredProducts);
        setError(false);
      } catch (error) {
        console.error("Error loading featured products:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="acart-home">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">WELCOME TO ACART</span>

          <h1>
            Find your next
            <br />
            <span>favourite thing.</span>
          </h1>

          <p>
            Discover quality products, explore new arrivals, and enjoy a better
            shopping experience.
          </p>

          <div className="hero-actions">
            <Button
              className="shop-button"
              onClick={() => navigate("/products")}
            >
              Shop Now <span aria-hidden="true">→</span>
            </Button>

            <Button
              variant="outline-dark"
              onClick={() =>
                document.getElementById("featured-products")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Products
            </Button>
          </div>

          <div className="hero-note">
            <span>✓</span> Easy shopping
            <span>✓</span> Quality products
            <span>✓</span> Simple checkout
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            <div className="hero-shopping-icon">🛍️</div>
            <div className="floating-card floating-card-top">
              <span>✨</span> Discover more
            </div>
            <div className="floating-card floating-card-bottom">
              Your next favourite is here.
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits-section">
        <div className="benefit-item">
          <span className="benefit-icon">🚚</span>
          <div>
            <h3>Convenient Shopping</h3>
            <p>Browse products in one place</p>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">🔒</span>
          <div>
            <h3>Shop with Confidence</h3>
            <p>A simple shopping experience</p>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">💬</span>
          <div>
            <h3>Need Help?</h3>
            <p>We're here to help you shop</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">EXPLORE</span>
            <h2>Shop by category</h2>
            <p>Find products that match your interests.</p>
          </div>

          <Link to="/products" className="text-link">
            View all products →
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={
                category.name === "Electronics"
                  ? "/electronics"
                  : category.name === "Accessories"
                    ? "/accessories"
                    : "/products"
              }
              className="category-card"
              key={category.name}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <span className="category-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="home-section featured-section" id="featured-products">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">OUR COLLECTION</span>
            <h2>Featured products</h2>
            <p>Explore a selection from our product collection.</p>
          </div>

          <Link to="/products" className="text-link">
            View all →
          </Link>
        </div>

        {loading && <p className="product-message">Loading products...</p>}

        {!loading && error && (
          <div className="product-message">
            <p>Products are unavailable right now.</p>
            <Button
              variant="outline-dark"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
            <p className="small mt-2">
              Make sure your product backend is running.
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="product-message">
            <p>No products available yet.</p>
            <Button variant="dark" onClick={() => navigate("/products")}>
              Explore Store
            </Button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="home-product-grid">
            {products.map((product) => (
              <Card className="home-product-card" key={product.id}>
                <div className="home-product-image">
                  <Card.Img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                  />
                </div>

                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>

                  <p className="home-product-price">
                    ${Number(product.price).toFixed(2)}
                  </p>

                  <Button
                    className="add-cart-button"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Call to action */}
      <section className="home-cta">
        <div>
          <span>YOUR NEXT GREAT FIND</span>
          <h2>Good finds are just a click away.</h2>
          <p>Explore our collection and discover something you love.</p>
        </div>

        <Button variant="light" onClick={() => navigate("/products")}>
          Start Shopping →
        </Button>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-brand">
          <Link to="/home">
            ACART<span>.</span>
          </Link>
          <p>A simpler way to discover your favourites.</p>
        </div>

        <div className="footer-links">
          <Link to="/home">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/login">Login</Link>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} ACART. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
