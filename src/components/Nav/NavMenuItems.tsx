import { FaChartArea, FaPiggyBank, FaUsers } from "react-icons/fa";
import { TbArrowsDoubleNeSw } from "react-icons/tb";

export const navUser = [
  {
    name: "Dashboard",
    link: "/user",
    active: "#/user",
    icon: FaChartArea,
  },
  {
    name: "Staking",
    link: "/user/staking",
    active: "#/user/staking",
    icon: FaPiggyBank,
  },
  {
    name: "Team",
    link: "/user/team",
    active: "#/user/team",
    icon: FaUsers,
  },
  {
    name: "Transfer Funds",
    link: "/user/transferFunds",
    active: "#/user/TransferFunds",
    icon: TbArrowsDoubleNeSw,
  },
];
