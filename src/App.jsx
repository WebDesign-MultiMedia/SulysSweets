import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const HolidayOrder = lazy(() => import("./pages/HolidayOrder"));
const HolidayOrderSuccess = lazy(() => import("./pages/HolidayOrderSuccess"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/holiday-order" element={<HolidayOrder />} />
        <Route path="/holiday-order/success" element={<HolidayOrderSuccess />} />
      </Routes>
    </Suspense>
  );
}
