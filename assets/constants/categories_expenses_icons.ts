import BillsIcon from '../icons/categories/expenses/BillsIcon';
import ClothingIcon from '../icons/categories/expenses/ClothingIcon';
import FoodsIcon from '../icons/categories/expenses/FoodsIcon';
import ShoppingIcon from '../icons/categories/expenses/ShoppingIcon';
import TuitionIcon from '../icons/categories/expenses/TuitionIcon';


// Define an interface for your icon map for better type safety
interface SvgIconMap {
    [key: string]: React.FC<any>; // React.FC takes props, using 'any' for flexibility here
    // More specific types if your icons have consistent props:
    // [key: string]: React.FC<{ width: number; height: number; color: string }>;
}

export const CATEGORIES_EXPENSES_SVG_ICONS: SvgIconMap = {
    Bills: BillsIcon,
    Clothing: ClothingIcon,
    Foods: FoodsIcon,
    Shopping: ShoppingIcon,
    Tuition: TuitionIcon,
};