import { createHashRouter } from 'react-router-dom';
import { App } from '../App';
import { TermOfUse } from '../pages/TermOfUse/TermOfUse';
import { HomePage, SwapPage } from '../pages';
import { AboutUs } from '../pages/AboutUs/AboutUs';
import { ExchangeListing } from '../pages/ExchangeListings/ExchangeListing';
import {
  Dashboard,
  Staking,
  Team,
  Transactions,
  TransferFunds,
  User,
} from '../pages/User';
import { Rewards } from '../pages/User/Rewards/Rewards';
import Testimonials from '../pages/User/Testimonials/Testimonials';
import { ProtectedRoutes } from './ProtectedRoutes';
import { PrivacyPolicy } from '../pages/PrivacyPolicy/PrivacyPolicy';
import { Status } from '../pages/Status/Status';

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
        path: 'about-us',
        element: <AboutUs />,
      },
      {
        path: 'exchange-listings',
        element: <ExchangeListing />,
      },
      {
        path: 'testimonials',
        element: <Testimonials />,
      },
      {
        path: 'term-of-service',
        element: <TermOfUse />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'status',
        element: <Status />,
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
            path: 'team/:userAddress',
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
