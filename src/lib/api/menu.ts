import api from "@/lib/api";
import type { MenuNode } from "@/types/menu";

export async function getMenuTree() {
  const res = await api.get<MenuNode[]>("/nav-menus/tree");
  return res.data;
}