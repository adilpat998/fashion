import { Outlet, useLocation } from "react-router-dom";
import { ModalProvider, Modal } from "../context/Modal";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
  const location = useLocation();
  // Hide Navigation on /admin/manage
  const hideNav = location.pathname === "/admin/manage";
  return (
    <>
      <ModalProvider>
        {!hideNav && <Navigation />}
        <Outlet />
        <Modal />
      </ModalProvider>
    </>
  );
}
