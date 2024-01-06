import { Button, Heading } from '@chakra-ui/react';
import { useContractFunction, useEthers } from '@usedapp/core';
import React, { useEffect } from 'react';
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

  const { send, state, resetState, events } = useContractFunction(
    currentNetwork[chainId]?.referralContractInterface,
    'resetSelfTeamBusiness'
  );

  const proceedTransaction = async () => {
    try {
      await send(account, {
        value: 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (state?.status === 'Success') {
      resetState();
    }
  }, [state?.status, resetState]);

  return (
    <CardContainer>
      <Heading size="sm">Your Business</Heading>
      <BalancesCard
        currencyName={'Self Business'}
        currencyValue={referralAccountMap?.selfBusiness?.toFixed(3)}
        logo={currentNetwork[chainId]?.USDT?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={'Direct Business'}
        currencyValue={userTotalBusiness?.directBusiness.toFixed(3)}
        logo={currentNetwork[chainId]?.USDT?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={'Team Business'}
        currencyValue={(
          userTotalBusiness?.totalBusiness - userTotalBusiness?.directBusiness
        ).toFixed(3)}
        logo={currentNetwork[chainId]?.USDT?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={'Total Business'}
        currencyValue={(userTotalBusiness?.totalBusiness).toFixed(3)}
        logo={currentNetwork[chainId]?.USDT?.Logo}
      ></BalancesCard>
      {userTotalBusiness?.totalBusiness === 0 &&
      userTotalBusiness.selfBusiness > 0 ? (
        <Button
          size="lg"
          colorScheme="green"
          onClick={proceedTransaction}
          isLoading={state?.status === 'Mining'}
          fontWeight="extrabold"
        >
          Update Total Business
        </Button>
      ) : null}
    </CardContainer>
  );
};
