import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import "../CSS/Electronics.css";

const API_URLS = [
  "https://dummyjson.com/products/category/smartphones",
  "https://dummyjson.com/products/category/laptops",
];

function Electronics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const responses = await Promise.all(API_URLS.map((url) => fetch(url)));

        if (responses.some((response) => !response.ok)) {
          throw new Error("Failed to fetch electronics");
        }

        const results = await Promise.all(
          responses.map((response) => response.json()),
        );

        const smartphones = results[0].products.map((product) => ({
          ...product,
          storeCategory: "Smartphones",
        }));

        const laptops = results[1].products.map((product) => ({
          ...product,
          storeCategory: "Laptops",
        }));

        if (!cancelled) {
          setProducts([...smartphones, ...laptops]);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.storeCategory === category;

      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, category, search, sort]);

  return (
    <main className="electronics-page">
      <section className="electronics-hero">
        <span className="electronics-eyebrow">ACART COLLECTION</span>
        <h1>Electronics for everyday life.</h1>
        <p>Discover smartphones, laptops, and more in one place.</p>

        <div className="electronics-search">
          <input
            type="search"
            placeholder="Search phones or laptops..."
            aria-label="Search electronics"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span>⌕</span>
        </div>
      </section>

      <section className="electronics-content">
        <div className="electronics-heading">
          <div>
            <h2>Explore Electronics</h2>
            <p>
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} products found`}
            </p>
          </div>

          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Recommended</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="electronics-filters">
          {["All", "Smartphones", "Laptops"].map((item) => (
            <Button
              key={item}
              variant={category === item ? "dark" : "outline-secondary"}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        {loading && (
          <p className="electronics-message">Loading electronics...</p>
        )}

        {!loading && error && (
          <div className="electronics-message">
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="electronics-message">
            No products found. Try another search or category.
          </p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="electronics-grid">
            {filteredProducts.map((product) => (
              <Card className="electronics-card" key={product.id}>
                <div className="electronics-image">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                  />
                  <span className="electronics-category-tag">
                    {product.storeCategory}
                  </span>
                </div>

                <Card.Body>
                  <div className="electronics-rating">
                    ★ {Number(product.rating).toFixed(1)}
                  </div>

                  <Card.Title>{product.title}</Card.Title>

                  <p className="electronics-description">
                    {product.description}
                  </p>

                  <h4>${Number(product.price).toFixed(2)}</h4>

                  <Button
                    className="electronics-add-button"
                    onClick={() =>
                      addToCart({
                        ...product,
                        id: `dummyjson-${product.id}`,
                      })
                    }
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        <div className="electronics-back">
          <Link to="/">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}

export default Electronics;
