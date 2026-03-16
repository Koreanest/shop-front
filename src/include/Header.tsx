"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import type { MenuNode } from "@/types/menu";
import "./header.css";

type Props = {
  isLogin: boolean | null;
  setIsLogin: (value: boolean) => void;
};

export default function Header({ isLogin, setIsLogin }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [menus, setMenus] = useState<MenuNode[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await api.get<MenuNode[]>("/nav-menus/tree");
        setMenus(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("menu load error", e);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const featuredMenus = useMemo(() => menus.slice(0, 6), [menus]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setIsLogin(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("logout error", e);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__left">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          <Link href="/" className="site-logo">
            TENNIS SHOP
          </Link>
        </div>

        <nav className="site-nav">
          {featuredMenus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.path || "#"}
              className="site-nav__link"
            >
              {menu.name}
            </Link>
          ))}
        </nav>

        <div className="site-header__right">
          <Link href="/cart" className="site-action site-action--ghost">
            장바구니
          </Link>

          {isLogin ? (
            <>
              <Link href="/orders" className="site-action site-action--ghost">
                주문
              </Link>
              <button
                type="button"
                className="site-action site-action--primary"
                onClick={logout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="site-action site-action--ghost">
                회원가입
              </Link>
              <Link href="/login" className="site-action site-action--primary">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="mega-panel">
          <div className="mega-panel__inner">
            {menus.map((menu) => (
              <div key={menu.id} className="mega-panel__column">
                <div className="mega-panel__title">
                  {menu.path ? (
                    <Link href={menu.path} className="mega-panel__title-link">
                      {menu.name}
                    </Link>
                  ) : (
                    menu.name
                  )}
                </div>

                <div className="mega-panel__children">
                  {(menu.children ?? []).map((child) => (
                    <Link
                      key={child.id}
                      href={child.path || "#"}
                      className="mega-panel__item"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}