import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "../components/user/UserHeader";
import UserNavbar from "../components/user/UserNavbar";
import Footer from "../components/user/Footer";

function UserLayout() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <UserHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <UserNavbar/>
      <Outlet context={{ searchTerm }} />
      <Footer />
    </>
  );
}

export default UserLayout;
