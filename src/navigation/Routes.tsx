import { createHashRouter } from 'react-router-dom';
import { App } from '../App';
import { HomePage, SwapPage } from '../pages';
import {
  Dashboard,
  Staking,
  Team,
  Transactions,
  TransferFunds,
  User,
} from '../pages/User';
import { Rewards } from '../pages/User/Rewards/Rewards';
import { ProtectedRoutes } from './ProtectedRoutes';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'swap',
        element: <SwapPage />,
      },
      {
        path: 'swap/:referrerAddress',
        element: <SwapPage />,
      },
      {
        path: 'user',
        element: (
          <ProtectedRoutes>
            <User />
          </ProtectedRoutes>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'dashboard/:userAddress',
            element: <Dashboard />,
          },
          {
            path: 'mining',
            element: <Staking />,
          },
          {
            path: 'mining/:userAddress',
            element: <Staking />,
          },
          {
            path: 'team',
            element: <Team />,
          },
          {
            path: 'transactions',
            element: <Transactions />,
          },
          {
            path: 'rewards',
            element: <Rewards />,
          },
          {
            path: 'rewards/:userAddress',
            element: <Rewards />,
          },
          {
            path: 'transferFunds',
            element: <TransferFunds />,
          },
        ],
      },
    ],
  },
]);
