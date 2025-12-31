import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/router";
import { CookiesProvider } from "react-cookie";
const App: React.FC = () => {
  return (
    <CookiesProvider>
      <BrowserRouter> 
        <AppRoutes />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
