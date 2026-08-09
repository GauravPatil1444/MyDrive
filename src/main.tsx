import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'

const App = React.lazy(() => import('./App.tsx'));
const Authentication = React.lazy(() => import('./Components/Authentication.tsx'));
const Profile = React.lazy(() => import('./Components/Profile.tsx'));

const fallback = <div className="h-screen w-full flex items-center justify-center dark:text-white">Loading...</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={fallback}><App/></Suspense>,
  },
  {
    path: "/auth",
    element: <Suspense fallback={fallback}><Authentication/></Suspense>,
  },
  {
    path: "/profile",
    element: <Suspense fallback={fallback}><Profile/></Suspense>,
  },
]);

const root:any = document.getElementById("root");

ReactDOM.createRoot(root).render(
  
  <RouterProvider router={router} />,
);
