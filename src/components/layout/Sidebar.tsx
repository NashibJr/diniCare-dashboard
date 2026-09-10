import {
  BarChart3,
  Boxes,
  ClipboardList,
  FolderTree,
  Headphones,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Percent,
  Settings,
  Star,
  Users,
  WalletCards,
  X,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const items = [
    [LayoutDashboard, "Dashboard", "/"],
    [ClipboardList, "Orders", "/orders"],
    [Boxes, "Products", "/products"],
    [FolderTree, "Categories", "/categories"],
    [Users, "Customers", "/customers"],
    [PackageSearch, "Inventory", "/inventory"],
    [Percent, "Coupons", "/coupons"],
    [BarChart3, "Analytics", "/analytics"],
    [Star, "Reviews", "/reviews"],
    // [Truck, "Shipping", "/shipping"],
    [WalletCards, "Payments", "/payments"],
    [Headphones, "Support", "/support"],
    // [UserCog, "Users & Roles", "/users"],
    // [ShieldCheck, "Permissions", "/roles"],
    // [FileText, "Reports", "/reports"],
    [History, "Audit logs", "/audit-logs"],
    // [Bell, "Notifications", "/notifications"],
    [Settings, "Settings", "/settings"],
  ] as const;
  return (
    <>
      <button
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gray-950 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <div className="text-lg font-black text-primary-400">ShopHub</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
              Admin console
            </div>
          </div>
          <button
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
          {items.map(([Icon, label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
