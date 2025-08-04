import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Splash from '../components/Splash';
import AdminClothingManager from '../components/AdminClothingManager/AdminClothingManager';
import RequireAdmin from './RequireAdmin';
import ClothingDetail from '../components/ClothingDetail/ClothingDetail';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Splash />,
      },
      {
        path: "/admin/manage",
        element: (
          <RequireAdmin>
            <AdminClothingManager />
          </RequireAdmin>
        ),
      },
      {
        path: "/clothes/:id",
        element: <ClothingDetail />
      }
    ],
  },
]);
