export interface ColorConstant {
  id: number;
  name: string;
  hex: string;
}

export const COLOR_OPTIONS: ColorConstant[] = [
  { id: 1, name: "Pale Lavender", hex: "#C7A8F5" },
  { id: 2, name: "Deep Violet", hex: "#5A1B99" },
  { id: 3, name: "Soft Peach", hex: "#F6C78D" },
  { id: 4, name: "Rich Amber", hex: "#D87B00" },
  { id: 5, name: "Light Mint", hex: "#A5F2CE" },
  { id: 6, name: "Forest Mint", hex: "#1F9C6D" },
  { id: 7, name: "Dusty Lilac", hex: "#9C7FBA" },
  { id: 8, name: "Burnt Apricot", hex: "#C8712A" },
  { id: 9, name: "Seafoam Green", hex: "#6BE6B0" },
  { id: 10, name: "Night Orchid", hex: "#6C3BB7" },
];
