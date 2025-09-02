import BankTransferIcon from '../icons/accounts/BankTransferIcon';
import CardIcon from '../icons/accounts/CardIcon';
import CashIcon from '../icons/accounts/CashIcon';
import CryptocurrencyIcon from '../icons/accounts/CryptocurrencyIcon';
import MastercardIcon from '../icons/accounts/MastercardIcon';
import PaypalIcon from '../icons/accounts/PaypalIcon';


// Define an interface for your icon map for better type safety
interface SvgIconMap {
  [key: string]: React.FC<any>; // React.FC takes props, using 'any' for flexibility here
  // More specific types if your icons have consistent props:
  // [key: string]: React.FC<{ width: number; height: number; color: string }>;
}

export const ACCOUNTS_SVG_ICONS: SvgIconMap = {
  BankTransfer: BankTransferIcon,
  Card: CardIcon,
  Cash: CashIcon,
  Cryptocurrency: CryptocurrencyIcon,
  Mastercard: MastercardIcon,
  Paypal: PaypalIcon,
};