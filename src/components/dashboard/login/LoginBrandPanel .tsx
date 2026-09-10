import { BarChart3, Boxes, PackageCheck, ShoppingBag } from "lucide-react";

const LoginBrandPanel = () => {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#020817] lg:flex lg:w-[48%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-[#ff1f8f]/10 blur-3xl" />
      <div className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-[#ff1f8f]/10 blur-3xl" />

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[#ff1f8f]">ShopHub</h1>

        <p className="mt-1 text-xs tracking-[0.35em] text-slate-400">
          ADMIN CONSOLE
        </p>
      </div>

      <div className="relative z-10 max-w-xl">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff1f8f] text-white">
          <ShoppingBag size={27} />
        </div>

        <h2 className="max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
          Everything you need to run your store.
        </h2>

        <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
          Manage orders, inventory, customers, analytics and more from one
          powerful dashboard.
        </p>

        <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <PackageCheck size={22} className="text-[#ff1f8f]" />

            <p className="mt-3 text-sm font-semibold text-white">Orders</p>

            <p className="mt-1 text-xs text-slate-400">Track sales</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <Boxes size={22} className="text-[#ff1f8f]" />

            <p className="mt-3 text-sm font-semibold text-white">Inventory</p>

            <p className="mt-1 text-xs text-slate-400">Manage stock</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <BarChart3 size={22} className="text-[#ff1f8f]" />

            <p className="mt-3 text-sm font-semibold text-white">Analytics</p>

            <p className="mt-1 text-xs text-slate-400">Grow smarter</p>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-500">
        © 2026 ShopHub. All rights reserved.
      </p>
    </div>
  );
};

export default LoginBrandPanel;
