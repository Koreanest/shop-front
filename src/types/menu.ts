export type MenuNode = {
  id: number;
  parentId: number | null;
  name: string;
  path: string | null;
  visibleYn: string;
  sortOrder: number;
  depth: number;
  children: MenuNode[];
};