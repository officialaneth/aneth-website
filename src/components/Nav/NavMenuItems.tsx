import { FaChartArea, FaPiggyBank, FaUser, FaUsers } from "react-icons/fa";
import { TbArrowsDoubleNeSw } from "react-icons/tb";

export const navNoAuth = [{}];
export const navUser = [
  {
    name: "Dashboard",
    link: "",
    active: "#/user",
    icon: FaChartArea,
  },
  {
    name: "Staking",
    link: "staking",
    active: "#/user/staking",
    icon: FaPiggyBank,
  },
  {
    name: "Team",
    link: "team",
    active: "#/user/team",
    icon: FaUsers,
  },
  // {
  //   name: "Transactions",
  //   link: "transactions",
  //   active: "#/user/transactions",
  //   icon: TbArrowsDoubleNeSw,
  // },
];
