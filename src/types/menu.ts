export type MenuNode = {
  id: number;
  name: string;
  path?: string | null;
  children?: MenuNode[];
};