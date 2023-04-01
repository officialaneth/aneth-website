import { createHashRouter } from "react-router-dom";
import { App } from "../App";
import { HomePage, Stake, SwapPage } from "../pages";

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
    ],
  },
]);
