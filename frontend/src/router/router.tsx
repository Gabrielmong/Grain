import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Dashboard from '../components/Dashboard/Dashboard';
import LumberTab from '../components/Lumber/LumberTab';
import Account from '../components/Account/Account';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import SharedProject from '../pages/SharedProject';
import TermsAndConditions from '../pages/TermsAndConditions';
import FeedPage from '../pages/FeedPage';
import UserProfilePage from '../pages/UserProfilePage';
import CustomerDetailPage from '../pages/CustomerDetail';
import { ConsumableTab, FinishTab, PrivateRoute, ProjectDetails, ProjectTab, SheetGoodTab, ToolTab } from '../components';
import { CutListPage } from '../components/CutList';
import { CustomerTab } from '../components/Customer/CustomerTab';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/shared/:id',
    element: <SharedProject />,
  },
  {
    path: '/feed',
    element: <FeedPage />,
  },
  {
    path: '/u/:username',
    element: <UserProfilePage />,
  },
  {
    path: '/terms',
    element: <TermsAndConditions />,
  },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'lumber',
        element: <LumberTab />,
      },
      {
        path: 'finishes',
        element: <FinishTab />,
      },
      {
        path: 'sheet-goods',
        element: <SheetGoodTab />,
      },
      {
        path: 'consumables',
        element: <ConsumableTab />,
      },
      {
        path: 'tools',
        element: <ToolTab />,
      },
      {
        path: 'projects',
        element: <ProjectTab />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetails />,
      },
      {
        path: 'projects/:id/cutlist',
        element: <CutListPage />,
      },
      {
        path: 'customers',
        element: <CustomerTab />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
      },
      {
        path: 'account',
        element: <Account />,
      },
    ],
  },
]);
