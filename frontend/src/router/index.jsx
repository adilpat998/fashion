import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Splash from '../components/Splash';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Splash />,
      }
    ],
  },
]);
