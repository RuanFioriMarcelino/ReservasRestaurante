/* import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react";
import { Dashboard } from "../screen/dashboard";

import Login from "../screen/login";
import { List } from "../screen/list";
import App from "../App";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
 */

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Dashboard } from "../screen/dashboard";
import { List } from "../screen/list";
import Details from "../screen/details";
import ErrorPage from "../screen/ErrorPage";

export const RouterApp = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/list",
        element: <List />,
      },
      {
        path: "/details",
        element: <Details />,
      },
    ],
  },
]);
