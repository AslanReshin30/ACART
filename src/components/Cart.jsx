import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useCart } from "../context/useCart";

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container text-center py-5">
        <h2>Your cart is empty</h2>
        <p className="text-secondary">Add some products to get started.</p>

        <Button as={Link} to="/products" variant="primary">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Shopping Cart</h2>

      {cartItems.map((item) => (
        <div key={item.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <div className="row align-items-center g-3">
              <div className="col-4 col-md-2 text-center">
                <img
                  src={
                    item.image ||
                    item.thumbnail ||
                    item.images?.[0] ||
                    item.product?.image ||
                    ""
                  }
                  alt={item.title || item.name || "Product"}
                  style={{
                    width: "100%",
                    maxWidth: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="col-8 col-md-4">
                <h5>{item.title}</h5>
                <p className="text-secondary mb-0">
                  ${Number(item.price).toFixed(2)} each
                </p>
              </div>

              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    aria-label={`Decrease quantity of ${item.title}`}
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </Button>

                  <span>{item.quantity}</span>

                  <Button
                    size="sm"
                    variant="outline-secondary"
                    aria-label={`Increase quantity of ${item.title}`}
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="col-6 col-md-3 text-end">
                <strong>
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </strong>

                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4>Total</h4>
            <h4>${cartTotal.toFixed(2)}</h4>
          </div>

          <div className="d-flex justify-content-between flex-wrap gap-2">
            <Button variant="outline-danger" onClick={clearCart}>
              Clear Cart
            </Button>

            <Button
              variant="success"
              onClick={() =>
                alert("Cart is ready! Checkout is not implemented yet.")
              }
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
