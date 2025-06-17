// src/constants/icons.ts
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

// Import your SVG files
import Add from '../icons/add.svg';
import DashboardActive from '../icons/dashboard_active.svg';
import DashboardNormal from '../icons/dashboard_normal.svg';
import GraphsActive from '../icons/graphs_active.svg';
import GraphsNormal from '../icons/graphs_normal.svg';
import QuestsActive from '../icons/quests_active.svg';
import QuestsNormal from '../icons/quests_normal.svg';
import ReportsActive from '../icons/reports_active.svg';
import ReportsNormal from '../icons/reports_normal.svg';

// Define a type for your icon components
export type IconComponentType = FC<SvgProps>;

interface AppIcons {
  dashboard_normal: IconComponentType;
  dashboard_active: IconComponentType;
  graphs_normal: IconComponentType;
  graphs_active: IconComponentType;
  reports_normal: IconComponentType;
  reports_active: IconComponentType;
  quests_normal: IconComponentType;
  quests_active: IconComponentType;
  add: IconComponentType;
  
}

export const AppIcons: AppIcons = {
  dashboard_normal: DashboardNormal,
  dashboard_active: DashboardActive,
  graphs_normal: GraphsNormal,
  graphs_active: GraphsActive,
  reports_normal: ReportsNormal,
  reports_active: ReportsActive,
  quests_normal: QuestsNormal,
  quests_active: QuestsActive,
  add: Add
};

// You can also create a type for icon names for better autocomplete and type safety
export type IconName = keyof typeof AppIcons;