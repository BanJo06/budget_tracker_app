import AllowanceIcon from "../icons/categories/income/AllowanceIcon";
import LotteryIcon from "../icons/categories/income/LotteryIcon";
import OtherIncomeIcon from "../icons/categories/income/OtherIncomeIcon";
import RefundsIcon from "../icons/categories/income/RefundsIcon";
import SalaryIcon from "../icons/categories/income/SalaryIcon";
import SidelineIcon from "../icons/categories/income/SidelineIcon";

// Define an interface for your icon map for better type safety
interface SvgIconMap {
  [key: string]: React.FC<any>; // React.FC takes props, using 'any' for flexibility here
  // More specific types if your icons have consistent props:
  // [key: string]: React.FC<{ width: number; height: number; color: string }>;
}

export const CATEGORIES_INCOME_SVG_ICONS: SvgIconMap = {
  Allowance: AllowanceIcon,
  Lottery: LotteryIcon,
  Refunds: RefundsIcon,
  Salary: SalaryIcon,
  Sideline: SidelineIcon,
  OtherIncome: OtherIncomeIcon,
};
