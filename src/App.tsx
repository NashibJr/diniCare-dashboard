import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminShell from "./components/layout/AdminShell";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import InventoryPage from "./pages/InventoryPage";
import CouponsPage from "./pages/CouponsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReviewsPage from "./pages/ReviewsPage";
import UsersPage from "./pages/UsersPage";
// import RolesPage from "./pages/RolesPage";
// import ShippingPage from "./pages/ShippingPage";
import PaymentsPage from "./pages/PaymentsPage";
import SupportPage from "./pages/SupportPage";
// import ReportsPage from "./pages/ReportsPage";
// import AuditLogsPage from "./pages/AuditLogsPage";
// import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import Auth from "./components/common/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="" element={<Auth />}>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AdminShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            {/* <Route path="/inventory" element={<InventoryPage />} /> */}
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/users" element={<UsersPage />} />
            {/* <Route path="/roles" element={<RolesPage />} /> */}
            {/* <Route path="/shipping" element={<ShippingPage />} /> */}
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/support" element={<SupportPage />} />
            {/* <Route path="/reports" element={<ReportsPage />} /> */}
            {/* <Route path="/audit-logs" element={<AuditLogsPage />} /> */}
            {/* <Route path="/notifications" element={<NotificationsPage />} /> */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
