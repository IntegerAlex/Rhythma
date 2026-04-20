import { useContext, useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonPage,
  IonBadge,
  IonButton,
  IonIcon,
  IonModal,
  IonChip,
} from "@ionic/react";
import {
  cartOutline,
  closeOutline,
  starOutline,
  star,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../state/Context";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  emoji: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Organic Menstrual Cup",
    description:
      "Medical-grade silicone, reusable for up to 10 years. Holds 3× more than a tampon. Eco-friendly and cost-saving.",
    price: "$29.99",
    emoji: "🌸",
    category: "Cups & Discs",
    rating: 4.8,
    reviews: 2341,
    badge: "Best Seller",
  },
  {
    id: 9,
    name: "Reusable Menstrual Disc",
    description:
      "Ultra-thin, flat-fit design for comfort and mess-free period sex. One size fits most. Reusable for 2 years.",
    price: "$32.99",
    emoji: "💿",
    category: "Cups & Discs",
    rating: 4.7,
    reviews: 452,
    badge: "New",
  },
  {
    id: 7,
    name: "Biodegradable Bamboo Pads",
    description:
      "Ultra-thin, highly absorbent bamboo fiber. Plastic-free and compostable. Set of 12 (Day & Night).",
    price: "$12.99",
    emoji: "🌱",
    category: "Pads & Tampons",
    rating: 4.6,
    reviews: 1456,
  },
  {
    id: 10,
    name: "Organic Cotton Tampons",
    description:
      "100% GOTS certified organic cotton with cardboard applicator. No synthetics, perfumes, or chlorine.",
    price: "$10.99",
    emoji: "☁️",
    category: "Pads & Tampons",
    rating: 4.8,
    reviews: 892,
  },
  {
    id: 4,
    name: "Magnesium Supplement",
    description:
      "High-absorption magnesium glycinate. Clinically shown to reduce PMS symptoms, cramping, and mood fluctuations.",
    price: "$24.99",
    emoji: "💊",
    category: "Supplements",
    rating: 4.7,
    reviews: 1203,
    badge: "Top Rated",
  },
  {
    id: 11,
    name: "Iron + Vitamin C",
    description:
      "Gentle iron bisglycinate with Vitamin C for better absorption. Supports energy levels during your period.",
    price: "$19.99",
    emoji: "🔋",
    category: "Supplements",
    rating: 4.9,
    reviews: 312,
    badge: "New",
  },
  {
    id: 2,
    name: "Herbal Pain Relief Patches",
    description:
      "Natural menthol & lavender heat patches. Provides 8 hours of targeted cramp relief without medication.",
    price: "$14.99",
    emoji: "🌿",
    category: "Wellness",
    rating: 4.6,
    reviews: 876,
  },
  {
    id: 5,
    name: "Leak-Proof Period Underwear",
    description:
      "Ultra-absorbent, odor-neutralizing fabric. Holds the equivalent of 3 tampons. Machine washable.",
    price: "$34.99",
    emoji: "🩲",
    category: "Wellness",
    rating: 4.5,
    reviews: 3104,
  },
  {
    id: 6,
    name: "Cycle Wellness Tea Bundle",
    description:
      "4-tea blend supporting each cycle phase: raspberry leaf, ginger, chamomile & spearmint. USDA organic.",
    price: "$22.99",
    emoji: "🍵",
    category: "Wellness",
    rating: 4.7,
    reviews: 689,
  },
  {
    id: 8,
    name: "PMS Relief Roller",
    description:
      "Aromatherapy roller with clary sage, ylang ylang, and marjoram essential oils. Apply to wrists and temples.",
    price: "$16.99",
    emoji: "✨",
    category: "Wellness",
    rating: 4.4,
    reviews: 328,
  },
];

const CATEGORIES = [
  "All",
  "Supplements",
  "Cups & Discs",
  "Pads & Tampons",
  "Wellness",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IonIcon
          key={i}
          icon={i <= Math.round(rating) ? star : starOutline}
          style={{ fontSize: 12, color: "#FFB800" }}
        />
      ))}
    </span>
  );
}

interface CartItem extends Product {
  qty: number;
}

const TabShop = () => {
  const theme = useContext(ThemeContext).theme;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [checkedOut, setCheckedOut] = useState(false);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current !== null)
        clearTimeout(addedTimeoutRef.current);
      if (checkoutTimeoutRef.current !== null)
        clearTimeout(checkoutTimeoutRef.current);
    };
  }, []);

  const isBasic = theme === "basic";
  const textColor = `var(--ion-color-text-${theme})`;
  const accentColor = isBasic
    ? "var(--ion-color-primary)"
    : "var(--ion-color-dark-dark)";

  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart
    .reduce(
      (sum, item) => sum + parseFloat(item.price.replace("$", "")) * item.qty,
      0,
    )
    .toFixed(2);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    if (addedTimeoutRef.current !== null) clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setAddedId(null), 1500);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const handleCheckout = () => {
    setCheckedOut(true);
    if (checkoutTimeoutRef.current !== null)
      clearTimeout(checkoutTimeoutRef.current);
    checkoutTimeoutRef.current = setTimeout(() => {
      setCart([]);
      setCheckedOut(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <IonPage
      className={`shop-container ${theme}`}
      style={{ backgroundColor: "transparent" }}
    >
      <div id="wide-screen">
        <IonContent
          color="none"
          style={{ "--background": "transparent" }}
        >
          <div style={{ padding: "12px 12px 80px 12px" }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                paddingTop: 8,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: "900",
                    color: textColor,
                    letterSpacing: "-0.5px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  Wellness Shop 🛍️
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: textColor,
                    opacity: 0.8,
                    fontWeight: 500,
                  }}
                >
                  Curated for your cycle
                </p>
              </div>

              {/* Cart button */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => setIsCartOpen(true)}
              >
                <IonButton
                  className={`glass-cart-btn ${!isBasic ? "dark-theme" : ""}`}
                  fill="clear"
                  style={{
                    "--border-radius": "50%",
                    width: 48,
                    height: 48,
                    color: textColor,
                    margin: 0,
                  }}
                >
                  <IonIcon
                    icon={cartOutline}
                    style={{ fontSize: 24 }}
                  />
                </IonButton>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                      }}
                    >
                      <IonBadge
                        className="glass-badge"
                        style={{
                          borderRadius: "50%",
                          minWidth: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {cartCount}
                      </IonBadge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Category filter */}
            <div
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                paddingBottom: 12,
                marginBottom: 20,
                scrollbarWidth: "none",
              }}
            >
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <IonChip
                    className={`glass-chip ${selectedCategory === cat ? "chip-active" : ""} ${!isBasic ? "dark-theme" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      fontWeight: selectedCategory === cat ? "600" : "500",
                      padding: "0 18px",
                      height: 38,
                      fontSize: 14,
                      margin: 0,
                    }}
                  >
                    {cat}
                  </IonChip>
                </motion.div>
              ))}
            </div>

            {/* Product grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    whileHover={{ y: -6 }}
                    className={`glass-card ${!isBasic ? "dark-theme" : ""}`}
                    style={{
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      position: "relative",
                    }}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <div
                        className="glass-badge"
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          borderRadius: 12,
                          padding: "4px 10px",
                          fontSize: 10,
                          fontWeight: "bold",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {product.badge}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: 44,
                        textAlign: "center",
                        lineHeight: 1.2,
                        marginTop: 12,
                      }}
                    >
                      {product.emoji}
                    </div>

                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: 14,
                        fontWeight: "700",
                        color: textColor,
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </p>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <StarRating rating={product.rating} />
                      <span
                        style={{
                          fontSize: 11,
                          color: textColor,
                          opacity: 0.7,
                          fontWeight: 500,
                        }}
                      >
                        ({product.reviews.toLocaleString()})
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: "800",
                        color: accentColor,
                      }}
                    >
                      {product.price}
                    </p>

                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      style={{ marginTop: "auto" }}
                    >
                      <IonButton
                        expand="block"
                        className={`glass-btn ${!isBasic ? "dark-theme" : ""}`}
                        fill="clear"
                        onClick={() => addToCart(product)}
                        style={{
                          color: textColor,
                          margin: 0,
                          fontWeight: 600,
                          minHeight: 40,
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {addedId === product.id ? (
                            <motion.span
                              key="added"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <IonIcon icon={checkmarkCircleOutline} />
                              Added!
                            </motion.span>
                          ) : (
                            <motion.span
                              key="add"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              Add to Cart
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </IonButton>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: 32,
                padding: 16,
                borderRadius: 16,
                background: isBasic
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.2)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: textColor,
                  opacity: 0.8,
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                🔒 This is a demo shop. No actual purchases are processed.
                Products shown are for illustration only.
              </p>
            </motion.div>
          </div>
        </IonContent>
      </div>

      {/* Cart Modal */}
      <IonModal
        isOpen={isCartOpen}
        onDidDismiss={() => setIsCartOpen(false)}
        breakpoints={[0, 0.6, 0.9]}
        initialBreakpoint={0.6}
        className={`glass-modal ${!isBasic ? "dark-theme" : ""}`}
      >
        <IonContent
          color="none"
          style={{ "--background": "transparent" }}
        >
          <div
            className="glass-modal-content"
            style={{ padding: 24 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: "800",
                  color: textColor,
                }}
              >
                Your Cart 🛒
              </p>
              <IonButton
                className={`glass-cart-btn ${!isBasic ? "dark-theme" : ""}`}
                fill="clear"
                onClick={() => setIsCartOpen(false)}
                style={{ width: 40, height: 40, color: textColor, margin: 0 }}
              >
                <IonIcon
                  icon={closeOutline}
                  style={{ fontSize: 24 }}
                />
              </IonButton>
            </div>

            <AnimatePresence>
              {checkedOut ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "60px 0" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: 72 }}
                  >
                    ✅
                  </motion.div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: "800",
                      color: textColor,
                      marginTop: 16,
                    }}
                  >
                    Order Placed!
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      color: textColor,
                      opacity: 0.7,
                      fontWeight: 500,
                    }}
                  >
                    Thank you for your purchase 💜
                  </p>
                </motion.div>
              ) : cart.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: "center", padding: "60px 0" }}
                >
                  <p style={{ fontSize: 56, margin: 0 }}>🛍️</p>
                  <p
                    style={{
                      color: textColor,
                      opacity: 0.7,
                      fontSize: 16,
                      fontWeight: 500,
                      marginTop: 16,
                    }}
                  >
                    Your cart is empty
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="items"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`glass-card ${!isBasic ? "dark-theme" : ""}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "12px 16px",
                        marginBottom: 12,
                        borderRadius: 16,
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: "700",
                            color: textColor,
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: 13,
                            color: textColor,
                            opacity: 0.7,
                            fontWeight: 500,
                          }}
                        >
                          {item.price} × {item.qty}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <IonButton
                          className={`glass-btn ${!isBasic ? "dark-theme" : ""}`}
                          fill="clear"
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            minWidth: 36,
                            height: 36,
                            margin: 0,
                            color: textColor,
                            fontSize: 18,
                          }}
                        >
                          −
                        </IonButton>
                        <span
                          style={{
                            color: textColor,
                            minWidth: 20,
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 15,
                          }}
                        >
                          {item.qty}
                        </span>
                        <IonButton
                          className={`glass-btn ${!isBasic ? "dark-theme" : ""}`}
                          fill="clear"
                          size="small"
                          onClick={() => addToCart(item)}
                          style={{
                            minWidth: 36,
                            height: 36,
                            margin: 0,
                            color: textColor,
                            fontSize: 18,
                          }}
                        >
                          +
                        </IonButton>
                      </div>
                    </motion.div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 24,
                      marginBottom: 24,
                      borderTop: `1px solid ${isBasic ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)"}`,
                      marginTop: 12,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: "700",
                        color: textColor,
                      }}
                    >
                      Total
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 22,
                        fontWeight: "900",
                        color: accentColor,
                      }}
                    >
                      ${cartTotal}
                    </p>
                  </div>

                  <motion.div whileTap={{ scale: 0.96 }}>
                    <IonButton
                      expand="block"
                      className="glass-badge"
                      onClick={handleCheckout}
                      style={{
                        "--border-radius": "16px",
                        minHeight: 52,
                        margin: 0,
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Checkout (Demo)
                    </IonButton>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default TabShop;
