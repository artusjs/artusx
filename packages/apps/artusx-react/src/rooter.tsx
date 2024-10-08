import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Root from './pages/root';
import Home from './pages/home';
import Info from './pages/info';
import List from './pages/list';

const STRICT_MODE = false;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/info',
        element: <Info />,
      },
      {
        path: '/list',
        element: <List />,
      },
    ],
  },
]);

export default () => {
  return STRICT_MODE ? (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  ) : (
    <RouterProvider router={router} />
  );
};
