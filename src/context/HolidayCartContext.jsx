import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { computeUnitPrice, describeSelections, getDisplayImage } from "../data/holidayMenu";

const STORAGE_KEY = "sulys-holiday-cart";

const HolidayCartContext = createContext(null);

function loadInitialState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function HolidayCartProvider({ children }) {
  const initial = loadInitialState();

  const [items, setItems] = useState(initial?.items ?? []);
  const [fulfillment, setFulfillment] = useState(initial?.fulfillment ?? "pickup");
  const [deliveryAddress, setDeliveryAddress] = useState(initial?.deliveryAddress ?? "");
  const [scheduledDate, setScheduledDate] = useState(initial?.scheduledDate ?? "");
  const [scheduledTime, setScheduledTime] = useState(initial?.scheduledTime ?? "");
  const [customer, setCustomer] = useState(initial?.customer ?? { name: "", email: "", phone: "" });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, fulfillment, deliveryAddress, scheduledDate, scheduledTime, customer }),
    );
  }, [items, fulfillment, deliveryAddress, scheduledDate, scheduledTime, customer]);

  const addItem = (product, selections, quantity = 1) => {
    const key = `${product.id}::${JSON.stringify(selections)}`;
    const unitPrice = computeUnitPrice(product, selections);
    const selectionLabel = describeSelections(product, selections);
    const image = getDisplayImage(product, selections);

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          image,
          selections,
          selectionLabel,
          unitPrice,
          quantity,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const removeItem = (key) => setItems((prev) => prev.filter((item) => item.key !== key));

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeItem(key);
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setItems([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );
  const depositDue = subtotal / 2;
  const remainingBalance = subtotal - depositDue;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    depositDue,
    remainingBalance,
    fulfillment,
    setFulfillment,
    deliveryAddress,
    setDeliveryAddress,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    customer,
    setCustomer,
    drawerOpen,
    setDrawerOpen,
  };

  return <HolidayCartContext.Provider value={value}>{children}</HolidayCartContext.Provider>;
}

export function clearStoredCart() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function useHolidayCart() {
  const ctx = useContext(HolidayCartContext);
  if (!ctx) throw new Error("useHolidayCart must be used within a HolidayCartProvider");
  return ctx;
}
