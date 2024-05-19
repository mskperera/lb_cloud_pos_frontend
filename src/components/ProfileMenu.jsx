import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { logout } from "../functions/auth";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const navigate=useNavigate();
  const menuRight = useRef(null);
  const toast = useRef(null);
  
  const handleLogout =() => {
    // Add your logout logic here
    console.log("Logout clicked");
    logout();
    navigate('/login');
  };

  const items = [
    {
      command: () => {
        toast.current.show({ severity: "info", summary: "Info", detail: "Item Selected", life: 3000 });
      },
      template: (item, options) => {
        return (
          <button onClick={(e) => options.onClick(e)} className={classNames(options.className, "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround")}>
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="mr-2" shape="circle" />
            <div className="flex flex-column align">
              <span className="font-bold">Amy Elsner</span>
              <span className="text-sm">Agent</span>
            </div>
          </button>
        );
      }
    },
    { separator: true },
    { label: "Settings", icon: "pi pi-fw pi-cog" },
    {
      label: "details",
      items: [{ label: "Profile", icon: "pi pi-fw pi-user" }]
    },
    {
      label: "Logout",
      icon: "pi pi-fw pi-power-off",
      command: handleLogout // Assigning handleLogout function to the logout button
    }
  ];

  return (
    <div style={{ margin: "1px" }}>
      <Button
        icon="pi pi-user"
        className="button-primary"
        rounded
        severity="primary"
        aria-label="User"
        onClick={(event) => menuRight.current.toggle(event)}
        aria-controls="profileMenu"
        aria-haspopup
      />
      <div className="card flex justify-content-center" id="profileMenu">
        <Menu
          model={items}
          popup
          ref={menuRight}
          id="popup_menu_right"
          popupAlignment="right"
        />
      </div>
    </div>
  );
}
