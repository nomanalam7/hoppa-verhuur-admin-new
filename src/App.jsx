import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AUTH_ROUTES, ADMIN_ROUTES } from "./routes";
import MainLayout from "./components/layout";
import { ErrorDialogProvider } from "./lib/context/errorDialogContext";
import { SuccessDialogProvider } from "./lib/context/successDialogContext";
import OrderDetailsPage from "./app/admin/orderDetails";
import { AuthProtectedLayout, ProtectedLayout } from "./routes/RoutesLayout";
import SettingsPage from "./app/admin/settings";
import NotificationsPage from "./app/admin/notifications";
import useVatTransportSettings from "./hooks/features/vatSettings";

// Global component to fetch VAT settings on every reload
const VatSettingsInitializer = () => {
  useVatTransportSettings();
  return null;
};

function App() {
  return (
    <ErrorDialogProvider>
      <SuccessDialogProvider>
        <BrowserRouter>
          <VatSettingsInitializer />
          <Routes>
            <Route element={<AuthProtectedLayout />}>
              {AUTH_ROUTES?.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={route.component}
                />
              ))}
            </Route>

            <Route element={<ProtectedLayout />}>

              {ADMIN_ROUTES?.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={
                    route.component ? (
                      <MainLayout>{route.component}</MainLayout>
                    ) : null
                  }
                />
              ))}
              <Route
                path="/settings"
                element={
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/notifications"
                element={
                  <MainLayout>
                    <NotificationsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/order-details/:id"
                element={
                  <MainLayout>
                    <OrderDetailsPage />
                  </MainLayout>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to={"/"} replace />} />
          </Routes>
        </BrowserRouter>
      </SuccessDialogProvider>
    </ErrorDialogProvider>
  );
}

export default App;
