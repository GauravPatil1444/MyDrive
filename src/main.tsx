import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import './index.css'
import App from './App.tsx'
import Authentication from "./Components/Authentication.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/auth",
    element: <Authentication/>,
  },
]);

const root:any = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
