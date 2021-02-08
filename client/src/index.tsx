import React from "react";
import ReactDOM from "react-dom";
// Components
import App from "./components/App";
// Chakra UI
import { ChakraProvider } from "@chakra-ui/react";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
