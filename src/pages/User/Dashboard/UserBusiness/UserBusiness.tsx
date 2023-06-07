import { Heading } from '@chakra-ui/react';
import React from 'react';
import { BalancesCard, CardContainer } from '../../../../components/UI';
import { useSupportedNetworkInfo } from '../../../../constants';
import {
  useReferralUserAccount,
  useUserTotalBusiness,
} from '../../../../hooks/ReferralHooks';

export const UserBusiness = ({
  account,
  chainId,
  currentNetwork,
}: {
  account: string;
  chainId: number;
  currentNetwork: typeof useSupportedNetworkInfo;
}) => {
  const userTotalBusiness = useUserTotalBusiness(account!);
  const referralAccountMap = useReferralUserAccount(account!);
  return (
    <CardContainer>
      <Heading size="sm">Your Business</Heading>
      <BalancesCard
        currencyName={'Self Business'}
        currencyValue={referralAccountMap?.selfBusiness?.toFixed(3)}
        logo={currentNetwork[chainId]?.ANUSD?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={'Direct Business'}
        currencyValue={userTotalBusiness?.directBusiness.toFixed(3)}
        logo={currentNetwork[chainId]?.ANUSD?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={'Team Business'}
        currencyValue={(
          userTotalBusiness?.totalBusiness - userTotalBusiness?.directBusiness
        ).toFixed(3)}
        logo={currentNetwork[chainId]?.ANUSD?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={'Total Business'}
        currencyValue={(userTotalBusiness?.totalBusiness).toFixed(3)}
        logo={currentNetwork[chainId]?.ANUSD?.Logo}
      ></BalancesCard>
    </CardContainer>
  );
};
