import { Sidebar } from "primereact/sidebar";
import { useContext } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signout } from "@/redux/actions/authActions";
import { useRouter } from "next/navigation";


const AppProfileSidebar = () => {
  const { layoutState, setLayoutState } = useContext(LayoutContext);
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onProfileSidebarHide = () => {
    setLayoutState((prevState) => ({
      ...prevState,
      profileSidebarVisible: false,
    }));
  };

  const logOut = () => {
    router.push('/auth/login');
    dispatch(signout());
  }

  return (
    <Sidebar
      visible={layoutState.profileSidebarVisible}
      onHide={onProfileSidebarHide}
      position="right"
      className="layout-profile-sidebar w-full sm:w-25rem"
    >
      <div className="flex flex-column mx-auto md:mx-0">
        <span className="mb-2 font-semibold">Welcome</span>
        <span className="text-color-secondary font-medium mb-5">
          { auth?.user?.first_name } { auth?.user?.last_name }
        </span>

        <ul className="list-none m-0 p-0">
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-user text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">Profile</span>
              </div>
            </a>
          </li>
          {/* <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-money-bill text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">Billing</span>
                <p className="text-color-secondary m-0">Amet mimin mıollit</p>
              </div>
            </a>
          </li> */}
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-cog text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">Settings</span>
              </div>
            </a>
          </li>
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-power-off text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold" onClick={logOut}>Sign Out</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </Sidebar>
  );
};

export default AppProfileSidebar;
