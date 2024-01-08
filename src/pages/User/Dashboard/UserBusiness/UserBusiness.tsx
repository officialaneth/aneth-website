import { Button, Heading } from '@chakra-ui/react';
import { useContractFunction, useEthers } from '@usedapp/core';
import React, { useEffect } from 'react';
import { BalancesCard, CardContainer } from '../../../../components/UI';
import { useSupportedNetworkInfo } from '../../../../constants';
import {
  useIs20LevelsBusinessUpdated,
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
  const isUser20LevelBusinessUpdated = useIs20LevelsBusinessUpdated(account!);

  console.log('User 20 levels status', isUser20LevelBusinessUpdated);

  const { send, state, resetState } = useContractFunction(
    currentNetwork[chainId]?.referralContractInterface,
    'resetSelfTeamBusiness'
  );

  const {
    send: send20Levels,
    state: state20Levels,
    resetState: resetState20Levels,
  } = useContractFunction(
    currentNetwork[chainId]?.referralContractInterface,
    'updateUplineTeamLevels20'
  );

  const isLoading =
    state?.status === 'PendingSignature' ?? state?.status === 'Mining';
  const isLoading20Levels =
    state20Levels?.status === 'PendingSignature' ??
    state20Levels?.status === 'Mining';

  const proceedTransaction = async () => {
    try {
      await send(account, {
        value: 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const proceedTransaction20Levels = async () => {
    try {
      await send20Levels(account, {
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

    if (state20Levels?.status === 'Success') {
      resetState20Levels();
    }
  }, [state?.status, resetState, resetState20Levels, state20Levels?.status]);

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

      <Button
        size="lg"
        colorScheme="green"
        onClick={proceedTransaction}
        isLoading={isLoading}
        fontWeight="extrabold"
        loadingText={state?.status}
      >
        Update Total Business
      </Button>
      {!isUser20LevelBusinessUpdated && (
        <Button
          size="lg"
          colorScheme="pink"
          onClick={proceedTransaction20Levels}
          isLoading={isLoading20Levels}
          fontWeight="extrabold"
          loadingText={state20Levels?.status}
        >
          Update Business 20 Levels
        </Button>
      )}
    </CardContainer>
  );
};
