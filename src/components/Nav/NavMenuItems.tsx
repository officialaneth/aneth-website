import { FaChartArea, FaPiggyBank, FaUsers } from "react-icons/fa";

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
  // {
  //   name: "Transactions",
  //   link: "transactions",
  //   active: "#/user/transactions",
  //   icon: TbArrowsDoubleNeSw,
  // },
];
