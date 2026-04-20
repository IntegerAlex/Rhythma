import { useContext, useState } from "react";
import {
  IonContent,
  IonPage,
  IonBadge,
  IonButton,
  IonIcon,
  IonModal,
  IonChip,
} from "@ionic/react";
import { cartOutline, closeOutline, starOutline, star, checkmarkCircleOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
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
    description: "Medical-grade silicone, reusable for up to 10 years. Holds 3× more than a tampon. Eco-friendly and cost-saving.",
    price: "$29.99",
    emoji: "🌸",
    category: "Period Care",
    rating: 4.8,
    reviews: 2341,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Herbal Pain Relief Patches",
    description: "Natural menthol & lavender heat patches. Provides 8 hours of targeted cramp relief without medication.",
    price: "$14.99",
    emoji: "🌿",
    category: "Pain Relief",
    rating: 4.6,
    reviews: 876,
  },
  {
    id: 3,
    name: "Period Tracking Journal",
    description: "Beautiful wellness journal for tracking mood, symptoms, flow, and self-care rituals throughout your cycle.",
    price: "$18.99",
    emoji: "📔",
    category: "Wellness",
    rating: 4.9,
    reviews: 512,
    badge: "New",
  },
  {
    id: 4,
    name: "Magnesium Supplement",
    description: "High-absorption magnesium glycinate. Clinically shown to reduce PMS symptoms, cramping, and mood fluctuations.",
    price: "$24.99",
    emoji: "💊",
    category: "Supplements",
    rating: 4.7,
    reviews: 1203,
  },
  {
    id: 5,
    name: "Leak-Proof Period Underwear",
    description: "Ultra-absorbent, odor-neutralizing fabric. Holds the equivalent of 3 tampons. Machine washable.",
    price: "$34.99",
    emoji: "🩲",
    category: "Period Care",
    rating: 4.5,
    reviews: 3104,
    badge: "Top Rated",
  },
  {
    id: 6,
    name: "Cycle Wellness Tea Bundle",
    description: "4-tea blend supporting each cycle phase: raspberry leaf, ginger, chamomile & spearmint. USDA organic.",
    price: "$22.99",
    emoji: "🍵",
    category: "Wellness",
    rating: 4.7,
    reviews: 689,
  },
  {
    id: 7,
    name: "Reusable Organic Pads",
    description: "Soft bamboo flannel, chemical-free. Set of 5 pads in various absorbencies. Reduces waste by 99%.",
    price: "$19.99",
    emoji: "🌱",
    category: "Period Care",
    rating: 4.6,
    reviews: 1456,
  },
  {
    id: 8,
    name: "PMS Relief Roller",
    description: "Aromatherapy roller with clary sage, ylang ylang, and marjoram essential oils. Apply to wrists and temples.",
    price: "$16.99",
    emoji: "✨",
    category: "Pain Relief",
    rating: 4.4,
    reviews: 328,
    badge: "New",
  },
];

const CATEGORIES = ["All", "Period Care", "Pain Relief", "Wellness", "Supplements"];

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
  const { t } = useTranslation();
  const theme = useContext(ThemeContext).theme;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [checkedOut, setCheckedOut] = useState(false);

  const isBasic = theme === "basic";
  const bgColor = `var(--ion-color-background-${theme})`;
  const cardBg = isBasic ? "#fff" : "var(--ion-color-calendar-dark)";
  const textColor = `var(--ion-color-text-${theme})`;
  const accentColor = `var(--ion-color-dark-${theme})`;

  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart
    .reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")) * item.qty, 0)
    .toFixed(2);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      setCart([]);
      setCheckedOut(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <IonPage style={{ backgroundColor: bgColor }}>
      <div id="wide-screen" className={theme}>
        <IonContent color={`transparent-${theme}`}>
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
                marginBottom: 16,
                paddingTop: 8,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: "bold",
                    color: textColor,
                  }}
                >
                  Wellness Shop 🛍️
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--ion-color-medium)" }}>
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
                  fill="outline"
                  color={`dark-${theme}`}
                  style={{ "--border-radius": "50%", width: 44, height: 44 }}
                >
                  <IonIcon icon={cartOutline} />
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
                      <IonBadge color="danger">{cartCount}</IonBadge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Category filter */}
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 8,
                marginBottom: 16,
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
                    outline={selectedCategory !== cat}
                    color={`dark-${theme}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      fontWeight: selectedCategory === cat ? "bold" : "normal",
                      transition: "all 0.2s",
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
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                    style={{
                      background: cardBg,
                      borderRadius: 16,
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: accentColor,
                          color: "#fff",
                          borderRadius: 8,
                          padding: "2px 7px",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {product.badge}
                      </div>
                    )}

                    <div style={{ fontSize: 40, textAlign: "center", lineHeight: 1.2 }}>
                      {product.emoji}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: "bold",
                        color: textColor,
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <StarRating rating={product.rating} />
                      <span style={{ fontSize: 10, color: "var(--ion-color-medium)" }}>
                        ({product.reviews.toLocaleString()})
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: "bold",
                        color: accentColor,
                      }}
                    >
                      {product.price}
                    </p>

                    <motion.div whileTap={{ scale: 0.92 }}>
                      <IonButton
                        expand="block"
                        color={`dark-${theme}`}
                        size="small"
                        onClick={() => addToCart(product)}
                        style={{ "--border-radius": "10px" }}
                      >
                        <AnimatePresence mode="wait">
                          {addedId === product.id ? (
                            <motion.span
                              key="added"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              style={{ display: "flex", alignItems: "center", gap: 4 }}
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: 20,
                fontSize: 11,
                color: "var(--ion-color-medium)",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              🔒 This is a demo shop. No actual purchases are processed. Products shown are for illustration only.
            </motion.p>
          </div>
        </IonContent>
      </div>

      {/* Cart Modal */}
      <IonModal
        isOpen={isCartOpen}
        onDidDismiss={() => setIsCartOpen(false)}
        breakpoints={[0, 0.6, 0.9]}
        initialBreakpoint={0.6}
      >
        <IonContent color={`transparent-${theme}`}>
          <div style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <p style={{ margin: 0, fontSize: 20, fontWeight: "bold", color: textColor }}>
                Your Cart 🛒
              </p>
              <IonButton
                fill="clear"
                color={`dark-${theme}`}
                onClick={() => setIsCartOpen(false)}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <AnimatePresence>
              {checkedOut ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: 60 }}
                  >
                    ✅
                  </motion.div>
                  <p style={{ fontSize: 18, fontWeight: "bold", color: textColor }}>
                    Order Placed!
                  </p>
                  <p style={{ fontSize: 14, color: "var(--ion-color-medium)" }}>
                    Thank you for your purchase 💜
                  </p>
                </motion.div>
              ) : cart.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <p style={{ fontSize: 40 }}>🛍️</p>
                  <p style={{ color: "var(--ion-color-medium)" }}>Your cart is empty</p>
                </motion.div>
              ) : (
                <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom: `1px solid var(--ion-color-light-${theme})`,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: "bold", color: textColor }}>
                          {item.name}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: "var(--ion-color-medium)" }}>
                          {item.price} × {item.qty}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <IonButton
                          fill="outline"
                          color={`dark-${theme}`}
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          style={{ "--padding-start": "8px", "--padding-end": "8px", minWidth: 32 }}
                        >
                          −
                        </IonButton>
                        <span style={{ color: textColor, minWidth: 20, textAlign: "center" }}>
                          {item.qty}
                        </span>
                        <IonButton
                          fill="outline"
                          color={`dark-${theme}`}
                          size="small"
                          onClick={() => addToCart(item)}
                          style={{ "--padding-start": "8px", "--padding-end": "8px", minWidth: 32 }}
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
                      paddingTop: 16,
                      marginBottom: 16,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 16, fontWeight: "bold", color: textColor }}>
                      Total
                    </p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: "bold", color: accentColor }}>
                      ${cartTotal}
                    </p>
                  </div>

                  <motion.div whileTap={{ scale: 0.96 }}>
                    <IonButton
                      expand="block"
                      color={`dark-${theme}`}
                      onClick={handleCheckout}
                      style={{ "--border-radius": "14px" }}
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
