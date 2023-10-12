import { VStack, Wrap } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSupportedNetworkInfo } from '../../../constants';
import { ReferralLink } from './ReferralLink/ReferralLink';
import { UserBalances } from './UserBalances/UserBalances';
import { UserBusiness } from './UserBusiness/UserBusiness';
import { UserIncome } from './UserIncome/UserIncome';
import { UserStaking } from './UserStaking/UserStaking';
import { UserTeam } from './UserTeam/UserTeam';

export const Dashboard = () => {
  const { account, chainId } = useEthers();
  const { userAddress } = useParams();
  // console.log(userAddress);
  const currentNetwork = useSupportedNetworkInfo;
  return (
    <VStack w="full" spacing={10}>
      <Wrap w="full" spacing={10} justify="center" p={2}>
        <UserBalances
          account={userAddress ?? account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        ></UserBalances>
        <UserBusiness
          account={userAddress ?? account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        />
        <UserIncome
          account={userAddress ?? account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        ></UserIncome>
        {/* <UserStaking
          account={userAddress ?? account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        /> */}
      </Wrap>
      <UserTeam
        account={userAddress ?? account!}
        chainId={chainId!}
        currentNetwork={currentNetwork}
      />
      <ReferralLink account={account!} />
    </VStack>
  );
};
