import AddActiveIcon from '../icons/AddActiveIcon';
import AddIcon from '../icons/AddIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ButtonArrowDownIcon from '../icons/ButtonArrowDownIcon';
import DashboardActiveIcon from '../icons/DashboardActiveIcon';
import DashboardIcon from '../icons/DashboardIcon';
import GraphsActiveIcon from '../icons/GraphsActiveIcon';
import GraphsIcon from '../icons/GraphsIcon';
import InsightIcon from '../icons/InsightIcon';
import QuestsActiveIcon from '../icons/QuestsActiveIcon';
import QuestsIcon from '../icons/QuestsIcon';
import ReportsActiveIcon from '../icons/ReportsActiveIcon';
import ReportsIcon from '../icons/ReportsIcon';
import SideMenuIcon from '../icons/SideMenuIcon';


// Define an interface for your icon map for better type safety
interface SvgIconMap {
  [key: string]: React.FC<any>; // React.FC takes props, using 'any' for flexibility here
  // More specific types if your icons have consistent props:
  // [key: string]: React.FC<{ width: number; height: number; color: string }>;
}

export const SVG_ICONS: SvgIconMap = {
  Dashboard: DashboardIcon,
  DashboardActive: DashboardActiveIcon,
  Graphs: GraphsIcon,
  GraphsActive: GraphsActiveIcon,
  Add: AddIcon,
  AddActive: AddActiveIcon,
  Reports: ReportsIcon,
  ReportsActive: ReportsActiveIcon,
  Quests: QuestsIcon,
  QuestsActive: QuestsActiveIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  Insight: InsightIcon,
  SideMenu: SideMenuIcon,
  ButtonArrowDown: ButtonArrowDownIcon
};