import AppSubMenu from "./AppSubMenu";
import type { MenuModel } from "../types/types";

const AppMenu = () => {
  const model: MenuModel[] = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-fw pi-home",
          to: "/",
        },
      ],
    },
    {
      label: 'Management',
      icon: 'pi pi-list',
      items: [
        {
          label: "Manage Users",
          icon: "pi pi-fw pi-users",
          items: [
            {
              label: "Administrators",
              icon: '',
              to: "/management/manage_users/administrators"
            },
            {
              label: "Users",
              icon: '',
              to: '/management/manage_users/users'
            }
          ]
        }
      ]
    }
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
