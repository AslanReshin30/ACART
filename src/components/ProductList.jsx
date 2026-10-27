import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/useCart";

const FASHION_CATEGORIES = [
  { label: "Men's Shirts", slug: "mens-shirts" },
  { label: "Women's Dresses", slug: "womens-dresses" },
  { label: "Men's Shoes", slug: "mens-shoes" },
  { label: "Women's Shoes", slug: "womens-shoes" },
  { label: "Women's Bags", slug: "womens-bags" },
  { label: "Women's Jewellery", slug: "womens-jewellery" },
  { label: "Sunglasses", slug: "sunglasses" },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const { addToCart } = useCart();

  useEffect(() => {
    const controller = new AbortController();

    const fetchFashionProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const responses = await Promise.all(
          FASHION_CATEGORIES.map((category) =>
            fetch(`https://dummyjson.com/products/category/${category.slug}`, {
              signal: controller.signal,
            }),
          ),
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("Unable to load all fashion categories.");
        }

        const results = await Promise.all(
          responses.map((response) => response.json()),
        );

        const categoryProducts = results.flatMap((result, index) =>
          (result.products || []).map((product) => ({
            ...product,
            // Prefix IDs to keep these products distinct from
            // products from other APIs in the shopping cart.
            id: `fashion-${FASHION_CATEGORIES[index].slug}-${product.id}`,
            originalId: product.id,
            categoryLabel: FASHION_CATEGORIES[index].label,
            image: product.thumbnail || product.images?.[0] || "",
          })),
        );

        setProducts(categoryProducts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Something went wrong while loading products.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchFashionProducts();

    return () => controller.abort();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch =
          product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === "all" ||
          product.categoryLabel === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === "low-high") return a.price - b.price;
        if (sort === "high-low") return b.price - a.price;
        if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sort === "name") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [products, search, selectedCategory, sort]);

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      image: product.image || product.thumbnail || product.images?.[0] || "",
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading fashion products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h3>Unable to load fashion products</h3>
        <p className="text-secondary">{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Fashion Collection</h1>
        <p className="text-secondary">
          Explore clothing, shoes, bags, jewellery and sunglasses.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <input
            type="search"
            className="form-control"
            placeholder="Search fashion products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search fashion products"
          />
        </div>

        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Fashion Categories</option>
            {FASHION_CATEGORIES.map((category) => (
              <option key={category.slug} value={category.label}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Recommended</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Fashion Products</h4>
        <span className="text-secondary">
          {filteredProducts.length} products
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <h5>No products found</h5>
          <p className="text-secondary">Try another search or category.</p>
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSort("default");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div className="col-6 col-md-4 col-lg-3" key={product.id}>
              <article className="card h-100 shadow-sm">
                <div
                  className="d-flex align-items-center justify-content-center bg-light p-3"
                  style={{ height: "220px" }}
                >
                  <img
                    src={
                      product.image ||
                      product.thumbnail ||
                      product.images?.[0] ||
                      ""
                    }
                    alt={product.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "190px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>

                <div className="card-body d-flex flex-column">
                  <small className="text-primary mb-2">
                    {product.categoryLabel}
                  </small>

                  <h6 className="card-title">{product.title}</h6>

                  <p
                    className="card-text text-secondary small"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mb-3 mt-auto">
                    <strong className="fs-5">
                      ${Number(product.price).toFixed(2)}
                    </strong>

                    {product.rating != null && (
                      <span className="small text-warning">
                        ★ {Number(product.rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductList;
