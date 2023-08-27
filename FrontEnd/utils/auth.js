'use client';
import { useCookies } from "react-cookie";
import { redirect } from "next/navigation";
export default function redirToSignInIfNoToken() {
  const userData = localStorage.getItem("UserDetails");
    const [cookie, setCookie] = useCookies(["token"]);
  if (!cookie.token || !userData) {
    return redirect("/login");
  }
};

export const redirectToHome = () => {
  const userData = localStorage.getItem("UserDetails");
  const [cookie, setCookie] = useCookies(["token"]);
  if (cookie.token || userData) {
    return redirect("/home");
  }
}
