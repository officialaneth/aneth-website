import { ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Divider, Heading, Text, VStack, Wrap } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { useNavigate, useParams } from 'react-router-dom';
import { BalancesCard, CardContainer } from '../../../components/UI';
import { TokenSymbol, useSupportedNetworkInfo } from '../../../constants';
import {
  useGetAllStakingRewards,
  useGetUserTotalPrincipalClaimed,
  useGetUserTotalRewardClaimedANUSD,
  useGetUserTotalRewardClaimedToken,
  useGetUserTotalStakedValue,
  useStakingUserAccountMap,
} from '../../../hooks/StakingHooks';
import { StakingIDCard } from './StakingIDCard/StakingIDCard';
import { StakingIDCardV2 } from './StakingIDCard/StakingIDCardV2';

export const Staking = () => {
  const { account, chainId } = useEthers();
  const { userAddress } = useParams();

  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const userAccountMapStaking = useStakingUserAccountMap(
    userAddress ?? account!
  );

  //V1
  const userTotalValueStaked = useGetUserTotalStakedValue(
    userAddress ?? account!
  );
  const userTotalPendingRewards = useGetAllStakingRewards(
    userAddress ?? account!
  );
  const userTotalRewardClaimedToken = useGetUserTotalRewardClaimedToken(
    userAddress ?? account!
  );
  const userTotalRewardClaimedANUSD = useGetUserTotalRewardClaimedANUSD(
    userAddress ?? account!
  );
  const userTotalPrincipalAmountClaimed = useGetUserTotalPrincipalClaimed(
    userAddress ?? account!
  );

  //V2

  const userAccountMapStakingV2 = useStakingUserAccountMap(
    userAddress ?? account!,
    true
  );

  const userTotalValueStakedV2 = useGetUserTotalStakedValue(
    userAddress ?? account!,
    true
  );
  const userTotalPendingRewardsV2 = useGetAllStakingRewards(
    userAddress ?? account!,
    true
  );
  const userTotalRewardClaimedTokenV2 = useGetUserTotalRewardClaimedToken(
    userAddress ?? account!,
    true
  );
  const userTotalRewardClaimedANUSDV2 = useGetUserTotalRewardClaimedANUSD(
    userAddress ?? account!,
    true
  );
  const userTotalPrincipalAmountClaimedV2 = useGetUserTotalPrincipalClaimed(
    userAddress ?? account!,
    true
  );

  const navigate = useNavigate();
  return (
    <VStack w="full" spacing={10}>
      <VStack w="full">
        <Heading>Staking V1</Heading>
        {userAccountMapStaking?.stakingIDs?.length > 0 ? (
          <VStack spacing={10}>
            <Heading>Mining Stats</Heading>
            <Wrap w="full" justify="center" spacing={10}>
              <CardContainer>
                <Heading size="sm">Total Minings</Heading>
                <BalancesCard
                  currencyName={'No of mining'}
                  // logo={currentNetwork?.Token?.Logo}
                  currencyValue={userAccountMapStaking?.stakingIDs?.length.toString()}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Value Locked</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={userTotalValueStaked?.token.toFixed(3)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Remaining Value Locked</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={(
                    userTotalValueStaked?.token -
                    userTotalPrincipalAmountClaimed
                  ).toFixed(5)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Total Max Mining Bonus</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.ANUSD?.Symbol}
                  logo={currentNetwork?.ANUSD?.Logo}
                  currencyValue={userTotalValueStaked.anusd?.toFixed(3)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Mining Bonus Claimed</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={userTotalRewardClaimedToken?.toFixed(5)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Pending Max Mining Bonus</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.ANUSD?.Symbol}
                  logo={currentNetwork?.ANUSD?.Logo}
                  currencyValue={(
                    userTotalValueStaked.anusd - userTotalRewardClaimedANUSD
                  )?.toFixed(5)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Pending Mining Rewards</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.ANUSD?.Symbol}
                  logo={currentNetwork?.ANUSD?.Logo}
                  currencyValue={userTotalPendingRewards?.toFixed(5)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Principal Claimed</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={userTotalPrincipalAmountClaimed?.toFixed(5)}
                ></BalancesCard>
              </CardContainer>
            </Wrap>
            <Divider />
            <Heading>Mining Details</Heading>
            <StakingIDCard
              tokenSymbol={currentNetwork?.Token?.Symbol}
              anusdSymbol={currentNetwork?.ANUSD?.Symbol}
              stakingIDs={userAccountMapStaking?.stakingIDs}
            ></StakingIDCard>
          </VStack>
        ) : (
          <VStack>
            <Heading color="red">You have no mining yet.</Heading>
            <Text>Please buy some {TokenSymbol} be miner.</Text>
            <Button
              onClick={() => navigate('/swap')}
              rightIcon={<ChevronRightIcon />}
              colorScheme="twitter"
            >
              Swap Now
            </Button>
          </VStack>
        )}
      </VStack>
      <Divider />
      <VStack w="full">
        <Heading>Staking V2</Heading>
        {userAccountMapStakingV2?.stakingIDs?.length > 0 ? (
          <VStack spacing={10}>
            <Heading>Mining Stats</Heading>
            <Wrap w="full" justify="center" spacing={10}>
              <CardContainer>
                <Heading size="sm">Total Minings</Heading>
                <BalancesCard
                  currencyName={'No of mining'}
                  // logo={currentNetwork?.Token?.Logo}
                  currencyValue={userAccountMapStakingV2?.stakingIDs?.length.toString()}
                ></BalancesCard>
              </CardContainer>
              {/* <CardContainer>
                <Heading size="sm">Value Locked</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={userTotalValueStaked?.token.toFixed(3)}
                ></BalancesCard>
              </CardContainer> */}
              {/* <CardContainer>
                <Heading size="sm">Remaining Value Locked</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={(
                    userTotalValueStaked?.token -
                    userTotalPrincipalAmountClaimed
                  ).toFixed(5)}
                ></BalancesCard>
              </CardContainer> */}
              <CardContainer>
                <Heading size="sm">Total Max Mining Value</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.ANUSD?.Symbol}
                  logo={currentNetwork?.ANUSD?.Logo}
                  currencyValue={userTotalValueStakedV2.anusd?.toFixed(3)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Claimed Value</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={userTotalRewardClaimedTokenV2?.toFixed(5)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Pending Value</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.ANUSD?.Symbol}
                  logo={currentNetwork?.ANUSD?.Logo}
                  currencyValue={(
                    userTotalValueStakedV2.anusd - userTotalRewardClaimedANUSDV2
                  )?.toFixed(5)}
                ></BalancesCard>
              </CardContainer>
              <CardContainer>
                <Heading size="sm">Pending Mining Rewards</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.ANUSD?.Symbol}
                  logo={currentNetwork?.ANUSD?.Logo}
                  currencyValue={userTotalPendingRewardsV2?.toFixed(5)}
                ></BalancesCard>
              </CardContainer>
              {/* <CardContainer>
                <Heading size="sm">Principal Claimed</Heading>
                <BalancesCard
                  currencyName={currentNetwork?.Token?.Symbol}
                  logo={currentNetwork?.Token?.Logo}
                  currencyValue={userTotalPrincipalAmountClaimed?.toFixed(5)}
                ></BalancesCard>
              </CardContainer> */}
            </Wrap>
            <Divider />
            <Heading>Mining Details</Heading>
            <StakingIDCardV2
              tokenSymbol={currentNetwork?.Token?.Symbol}
              anusdSymbol={currentNetwork?.ANUSD?.Symbol}
              stakingIDs={userAccountMapStakingV2?.stakingIDs}
            ></StakingIDCardV2>
          </VStack>
        ) : (
          <VStack>
            <Heading color="red">You have no mining yet.</Heading>
            <Text>Please buy some {TokenSymbol} be miner.</Text>
            <Button
              onClick={() => navigate('/swap')}
              rightIcon={<ChevronRightIcon />}
              colorScheme="twitter"
            >
              Swap Now
            </Button>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};
