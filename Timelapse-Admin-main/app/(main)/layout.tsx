"use client"
import Layout from "../../layout/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { check_login } from "@/redux/actions/authActions";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {

  const [token, setToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const _token: any = sessionStorage.getItem('_token');
    dispatch(check_login(_token));
    setToken(_token);
    if(!_token) {
      router.push('/auth/login');
    }
  }, [])

  return token ? <Layout>{children}</Layout> : <></>;

}
