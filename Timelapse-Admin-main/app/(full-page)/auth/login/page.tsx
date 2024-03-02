"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import React, { useContext, useState } from "react";
import { LayoutContext } from "../../../../layout/context/layoutcontext";
import { login } from "@/redux/actions/authActions";
import { useAppDispatch } from '@/redux/hooks';
import type { Page } from "../../../../types/types";

const Login: Page = () => {

  const dispatch = useAppDispatch();

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const dark = layoutConfig.colorScheme !== "light";

  const handleLogin = () => {
    if(email == '') {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "E-mail must not be empty",
        life: 3000,
      });
      return;
    }

    if(password.length < 8) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Password must be at least 8 characters.",
        life: 3000,
      });
      return;
    }
    setLoading(true);
    dispatch(login(email, password)).then((response: any) => {
      setLoading(false);
      if(response) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Success to login!",
          life: 3000,
        });
        router.push("/");
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to login!",
          life: 3000,
        });
      }
    }).catch(() => {
      setLoading(false);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to login!",
        life: 3000,
      });
    })
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 800"
        className="fixed left-0 top-0 min-h-screen min-w-screen"
        preserveAspectRatio="none"
      >
        <rect
          fill={dark ? "var(--primary-900)" : "var(--primary-500)"}
          width="1600"
          height="800"
        />
        <path
          fill={dark ? "var(--primary-800)" : "var(--primary-400)"}
          d="M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z"
        />
        <path
          fill={dark ? "var(--primary-700)" : "var(--primary-300)"}
          d="M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z"
        />
        <path
          fill={dark ? "var(--primary-600)" : "var(--primary-200)"}
          d="M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z"
        />
        <path
          fill={dark ? "var(--primary-500)" : "var(--primary-100)"}
          d="M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z"
        />
      </svg>
      <div className="px-5 min-h-screen flex justify-content-center align-items-center">
        <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
          <div className="mb-4">
            <div className="text-900 text-xl font-bold mb-2">Log in</div>
            <span className="text-600 font-medium">
              Please enter your details
            </span>
          </div>
          <div className="flex flex-column">
            <span className="p-input-icon-left w-full mb-4">
              <i className="pi pi-envelope"></i>
              <InputText
                id="email"
                type="text"
                className="w-full md:w-25rem"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>
            <span className="p-input-icon-left w-full mb-4">
              <i className="pi pi-lock"></i>
              <InputText
                id="password"
                type="password"
                className="w-full md:w-25rem"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={({which}) => { if(which == 13) handleLogin() }}
              />
            </span>
            <div className="mb-4 flex flex-wrap gap-3">
              <div>
                <Checkbox
                  name="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.checked ?? false)}
                  className="mr-2"
                ></Checkbox>
                <label htmlFor="checkbox" className="text-900 font-medium mr-8">
                  Remember Me
                </label>
              </div>
            </div>
            <Button
              label={`${loading ? '' : 'Log In'}`}
              className="w-full"
              onClick={handleLogin}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </>
  );
};

export default Login;