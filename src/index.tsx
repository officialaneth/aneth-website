import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { DappConfig } from "./constants/DappConfig";
import { router } from "./navigation/Routes";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <DAppProvider config={DappConfig}>
      <ColorModeScript />
      <ChakraProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
    </DAppProvider>
  </React.StrictMode>
);

serviceWorker.unregister();
