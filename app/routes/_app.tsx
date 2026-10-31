import { Outlet, useLocation } from "react-router";
import { AppBar } from "~/components/AppBar";
import { ProgressBar } from "~/components/ProgressBar";
import { ToastProvider } from "~/components/Toast";

export default function AppLayout() {
  const { pathname } = useLocation();
  // The page eases in on every navigation, except while moving around inside the kitab (selecting a line is not a new page).
  const viewKey = pathname.startsWith("/kitab") ? "/kitab" : pathname;
  return (
    <ToastProvider>
      <ProgressBar />
      <AppBar />
      <main>
        <div className="view" key={viewKey}>
          <Outlet />
        </div>
      </main>
      <footer>Ketuk, pilih, bagikan. Setiap halaman punya tautannya sendiri.</footer>
    </ToastProvider>
  );
}
