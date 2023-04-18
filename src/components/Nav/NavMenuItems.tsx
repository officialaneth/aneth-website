import { FaChartArea, FaPiggyBank, FaUsers } from "react-icons/fa";
import { HiOutlineCube } from "react-icons/hi";
import { TbArrowsDoubleNeSw } from "react-icons/tb";

export const navUser = [
  {
    name: "Dashboard",
    link: "/user",
    icon: FaChartArea,
  },
  {
    name: "Mining",
    link: "/user/mining",
    icon: HiOutlineCube,
  },
  {
    name: "Team",
    link: "/user/team",
    icon: FaUsers,
  },
  {
    name: "Transfer Funds",
    link: "/user/transferFunds",
    icon: TbArrowsDoubleNeSw,
  },
];
