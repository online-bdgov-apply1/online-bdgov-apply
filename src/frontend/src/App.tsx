import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminApplicationsPage } from "./pages/AdminApplicationsPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPaymentsPage } from "./pages/AdminPaymentsPage";
import { CustomerPortalPage } from "./pages/CustomerPortalPage";
import { StatusCheckPage } from "./pages/StatusCheckPage";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Customer routes
const customerPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: CustomerPortalPage,
});

const statusCheckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/status",
  component: StatusCheckPage,
});

// Admin routes
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <ProtectedRoute>
      <AdminDashboardPage />
    </ProtectedRoute>
  ),
});

const adminApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/applications",
  component: () => (
    <ProtectedRoute>
      <AdminApplicationsPage />
    </ProtectedRoute>
  ),
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/payments",
  component: () => (
    <ProtectedRoute>
      <AdminPaymentsPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  customerPortalRoute,
  statusCheckRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminApplicationsRoute,
  adminPaymentsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
