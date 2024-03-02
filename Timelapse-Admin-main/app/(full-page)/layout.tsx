"use client"
import React, { useEffect } from "react";
import AppConfig from "../../layout/AppConfig";
import { useRouter } from "next/navigation";

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export default function FullPageLayout({ children }: FullPageLayoutProps) {

  const router = useRouter();
  useEffect(() => {
    const _token = sessionStorage.getItem('_token');
    if(_token) {
      router.push('/');
    }
  }, [])
  return (
    <React.Fragment>
      {children}
      <AppConfig minimal />
    </React.Fragment>
  );
}
