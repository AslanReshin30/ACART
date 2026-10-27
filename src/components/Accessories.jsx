import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import "../CSS/Accessories.css";

const API_URL = "https://dummyjson.com/products/category/mobile-accessories";

export default function Lifestyle() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load accessories. Please try again.");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      id: `dummyjson-${product.id}`,
      image: product.thumbnail || product.images?.[0] || product.image || "",
    });
  };

  return (
    <main className="lifestyle-page">
      <section className="lifestyle-heading">
        <span className="lifestyle-eyebrow">ACART ACCESSORIES</span>

        <h1>Explore Our Accessories</h1>

        <p>
          Discover mobile accessories and useful tech essentials for your
          everyday needs.
        </p>

        <Link to="/" className="lifestyle-back">
          ← Back to Home
        </Link>
      </section>

      <section className="lifestyle-toolbar">
        <input
          type="search"
          placeholder="Search accessories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search accessories"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort accessories"
        >
          <option value="default">Recommended</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </section>

      {loading && <p className="lifestyle-message">Loading accessories...</p>}

      {!loading && error && (
        <div className="lifestyle-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="lifestyle-results">
            <h2>Mobile Accessories</h2>
            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="lifestyle-message">No matching accessories found.</p>
          ) : (
            <section className="lifestyle-grid">
              {filteredProducts.map((product) => (
                <article className="lifestyle-card" key={product.id}>
                  <div className="lifestyle-image-wrap">
                    <img
                      src={product.thumbnail || product.images?.[0]}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="lifestyle-card-content">
                    <span className="lifestyle-category">
                      Mobile Accessories
                    </span>

                    <h3>{product.title}</h3>

                    <p className="lifestyle-description">
                      {product.description}
                    </p>

                    <div className="lifestyle-price-row">
                      <span className="lifestyle-price">
                        ${Number(product.price).toFixed(2)}
                      </span>

                      {product.rating != null && (
                        <span className="lifestyle-rating">
                          ★ {Number(product.rating).toFixed(1)}
                        </span>
                      )}
                    </div>

                    <button
                      className="lifestyle-add-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}
