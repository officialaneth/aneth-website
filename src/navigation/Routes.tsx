import { createHashRouter } from "react-router-dom";
import { App } from "../App";
import { HomePage, SwapPage } from "../pages";
import { Dashboard, Staking, Team, Transactions, User } from "../pages/User";
import { ProtectedRoutes } from "./ProtectedRoutes";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "swap",
        element: <SwapPage />,
      },
      {
        path: "swap/:referrerAddress",
        element: <SwapPage />,
      },
      {
        path: "user",
        element: (
          <ProtectedRoutes>
            <User />
          </ProtectedRoutes>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "staking",
            element: <Staking />,
          },
          {
            path: "team",
            element: <Team />,
          },
          {
            path: "transactions",
            element: <Transactions />,
          },
        ],
      },
    ],
  },
]);
