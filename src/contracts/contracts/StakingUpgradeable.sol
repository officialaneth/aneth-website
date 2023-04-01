// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint);
}

interface IReferral {
    function payReferralETHAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function payStakingReferralAdmin(
        uint256 _value,
        address _referee
    ) external returns (bool);

    function payStakingReferralInUSDTAdmin(
        uint256 _value,
        address _referee
    ) external returns (bool);
}

interface IVariables {
    function presaleContract() external view returns (address);

    function referralContract() external view returns (address);

    function stakingContract() external view returns (address);

    function tokenContract() external view returns (address);

    function anusdContract() external view returns (address);

    function usdtContract() external view returns (address);

    function uniswapV2RouterContract() external view returns (address);

    function tokenContractOwner() external view returns (address);

    function rewardContract() external view returns (address);

    function rewardContractOwner() external view returns (address);

    function adminFees() external view returns (uint256);
}

interface IUniswapRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory);

    function quote(
        uint amountA,
        uint reserveA,
        uint reserveB
    ) external pure returns (uint amountB);

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountOut);

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountIn);

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);

    function getAmountsIn(
        uint amountOut,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

contract StakingUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;
    address[] private _stakers;
    uint256 private _totalValueStaked;
    uint256 private _totalTokenRewards;
    uint256 private _totalANUSDRewards;

    uint256 private _minStakingValue;

    uint256 private _stakingRewardRate;
    uint256 private _stakingDuration;
    uint256 private _stakingRewardClaimTimeLimit;

    struct Account {
        uint256[] stakingID;
        uint256[] blockNumber;
        bool isDisabled;
    }

    struct StakeInfo {
        bool isStaked;
        address owner;
        uint256 value;
        uint256 rewardRate;
        uint256 startTime;
        uint256 duration;
        uint256 rewardClaimed;
        uint256 rewardClaimedAUSD;
        uint256 lastTimeRewardClaimed;
        uint256[] blockNumber;
    }

    mapping(address => Account) private account;
    mapping(uint256 => StakeInfo) private stakeInfo;

    event Stake(
        address indexed userAddress,
        uint256 indexed valueStaked,
        uint256 indexed duration,
        uint256 stakingID
    );
    event StakingRewardClaimed(
        address indexed userAddress,
        uint256 indexed reward,
        uint256 indexed stakingID,
        address tokenAddress
    );
    event Unstake(
        address indexed userAddress,
        uint256 indexed valueStaked,
        uint256 indexed stakingID
    );

    function initialize() public initializer {
        _variablesContract = 0xbE5153baa3756402b08fD830E7b5F00a76E68231;
        _minStakingValue = 10000000000000000000;
        _stakingRewardRate = 200;
        _stakingDuration = 730 days;
        _stakingRewardClaimTimeLimit = 30 days;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    function _stakeInfoMap(
        uint256 _stakingID
    ) private view returns (StakeInfo memory) {
        return stakeInfo[_stakingID];
    }

    function stakeInfoMap(
        uint256 _stakingID
    ) external view returns (StakeInfo memory) {
        return stakeInfo[_stakingID];
    }

    function _userAccountMap(
        address _userAddress
    ) private view returns (Account memory) {
        return account[_userAddress];
    }

    function userAccountMap(
        address _userAddress
    ) external view returns (Account memory) {
        return account[_userAddress];
    }

    function _stake(
        address _address,
        uint256 _value,
        uint256 _rewardRate,
        uint256 _duration
    ) private returns (bool) {
        _stakers.push(_address);

        uint256 stakingID = _stakers.length;
        uint256 currentTime = block.timestamp;
        uint256 currentBlock = block.number;

        Account storage userAccount = account[_address];
        StakeInfo storage userStakingInfo = stakeInfo[stakingID];

        userAccount.stakingID.push(stakingID);
        userAccount.blockNumber.push(currentBlock);

        userStakingInfo.isStaked = true;
        userStakingInfo.owner = _address;
        userStakingInfo.startTime = currentTime;
        userStakingInfo.duration = _duration;
        userStakingInfo.value = _value;
        userStakingInfo.rewardRate = _rewardRate;
        userStakingInfo.blockNumber.push(currentBlock);

        _totalValueStaked += _value;

        emit Stake(_address, _value, _duration, stakingID);

        return true;
    }

    function stake(uint256 _valueInWei) external whenNotPaused {
        address _msgSender = msg.sender;
        uint256 _msgValue = _valueInWei;
        IVariables variables = IVariables(_variablesContract);

        IERC20Upgradeable(variables.tokenContract()).transferFrom(
            _msgSender,
            address(this),
            _msgValue
        );

        IERC20Upgradeable(variables.anusdContract()).transferFrom(
            _msgSender,
            address(this),
            variables.adminFees()
        );

        _stake(_msgSender, _msgValue, _stakingRewardRate, _stakingDuration);
    }

    function stakeByAdmin(address _userAddress, uint256 _valueInWei) external {
        address _msgSender = msg.sender;
        IVariables variables = IVariables(_variablesContract);
        require(
            _msgSender == owner() || _msgSender == variables.presaleContract(),
            "Only owner can call this function."
        );

        _stake(_userAddress, _valueInWei, _stakingRewardRate, _stakingDuration);
    }

    function _getStakingReward(
        uint256 _stakingID
    ) private view returns (uint256 stakingReward) {
        uint256 currentTime = block.timestamp;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        uint256 stakingTimePassed = currentTime - userStakingInfo.startTime;

        uint256 baseReward = ((userStakingInfo.value *
            userStakingInfo.rewardRate) / 100) / userStakingInfo.duration;
        stakingReward =
            baseReward *
            _min(stakingTimePassed, userStakingInfo.duration) -
            userStakingInfo.rewardClaimed;

        return stakingReward;
    }

    function getStakingReward(
        uint256 _stakingID
    ) external view returns (uint256) {
        return _getStakingReward(_stakingID);
    }

    function getUserAllStakingsRewards(
        address _userAddress
    ) external view returns (uint256) {
        uint256[] memory userStakingIDs = account[_userAddress].stakingID;
        uint256 stakingIDLength = userStakingIDs.length;
        uint256 userAllStakingRewards;

        for (uint8 i; i < stakingIDLength; i++) {
            if (_stakeInfoMap(userStakingIDs[i]).isStaked == true) {
                userAllStakingRewards += _getStakingReward(userStakingIDs[i]);
            }
        }

        return userAllStakingRewards;
    }

    function _claimReward(
        address _userAddress,
        uint256 _stakingID,
        StakeInfo storage userStakingInfo,
        Account storage userAccount,
        uint256 _stakingTokenReward,
        uint256 _stakingAUSDReward,
        uint256 _currentTime,
        uint256 _currentBlock
    ) private {
        userStakingInfo.rewardClaimed += _stakingTokenReward;
        userStakingInfo.rewardClaimedAUSD += _stakingAUSDReward;
        userStakingInfo.lastTimeRewardClaimed = _currentTime;
        userStakingInfo.blockNumber.push(_currentBlock);
        userAccount.blockNumber.push(_currentBlock);
        _totalTokenRewards += _stakingTokenReward;
        _totalANUSDRewards += _stakingAUSDReward;
        emit StakingRewardClaimed(
            _userAddress,
            _stakingTokenReward,
            _stakingID,
            IVariables(_variablesContract).tokenContract()
        );
        emit StakingRewardClaimed(
            _userAddress,
            _stakingAUSDReward,
            _stakingID,
            IVariables(_variablesContract).anusdContract()
        );
    }

    function claimStakingReward(uint256 _stakingID) external {
        uint256 stakingReward = _getStakingReward(_stakingID);
        require(stakingReward > 0, "You have no staking on ended");
        IVariables variables = IVariables(_variablesContract);

        uint256 tokenRewards = stakingReward / 2;
        uint256 anusdRewards = _token_usd_out_value(
            stakingReward / 2,
            variables.tokenContract(),
            variables.anusdContract()
        );

        address _msgSender = msg.sender;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        Account storage userAccount = account[_msgSender];
        uint256 _currentBlock = block.number;
        uint256 _currentTime = block.timestamp;

        require(
            userStakingInfo.owner == _msgSender,
            "Sorry staking id doen't belongs to you."
        );

        require(
            !userAccount.isDisabled,
            "Your account is disabled. Please contact admin."
        );

        require(
            userStakingInfo.lastTimeRewardClaimed +
                _stakingRewardClaimTimeLimit >
                block.timestamp,
            "You cannot claim reward before timelimit."
        );

        _claimReward(
            _msgSender,
            _stakingID,
            userStakingInfo,
            userAccount,
            tokenRewards,
            anusdRewards,
            _currentTime,
            _currentBlock
        );

        if (_getStakingReward(_stakingID) == 0) {
            userStakingInfo.isStaked = false;
        }

        IERC20Upgradeable(variables.tokenContract()).transfer(
            _msgSender,
            tokenRewards
        );
        IERC20Upgradeable(variables.anusdContract()).transfer(
            _msgSender,
            anusdRewards
        );
    }

    function isStaked(address _userAddress) public view returns (bool) {
        Account storage userAccount = account[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingID;
        uint256 userStakingIDsLength = userStakingIDs.length;

        for (uint256 i; i < userStakingIDsLength; i++) {
            if (_stakeInfoMap(userStakingIDs[i]).isStaked) {
                return true;
            }
        }

        return false;
    }

    function getUserTotalStakedValue(
        address _userAddress
    ) external view returns (uint256 userTotalValueStaked) {
        Account storage userAccount = account[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingID;
        uint256 userStakingIDsLength = userStakingIDs.length;

        for (uint256 i; i < userStakingIDsLength; i++) {
            if (_stakeInfoMap(userStakingIDs[i]).isStaked) {
                userTotalValueStaked += _stakeInfoMap(userStakingIDs[i]).value;
            }
        }
    }

    function getUserStakingIDs(
        address _userAddress
    ) public view returns (uint256[] memory) {
        return account[_userAddress].stakingID;
    }

    function getUserTotalRewardClaimed(
        address _userAddress
    ) external view returns (uint256 totalRewardClaim) {
        Account storage userAccount = account[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingID;
        uint256 userStakingIDsLength = userStakingIDs.length;

        for (uint256 i; i < userStakingIDsLength; i++) {
            totalRewardClaim += _stakeInfoMap(userStakingIDs[i]).rewardClaimed;
        }
    }

    function getStakingTimeRemaining(
        uint256 _stakingID
    ) external view returns (uint256) {
        uint256 _currentTime = block.timestamp;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        uint256 endTime = userStakingInfo.startTime + userStakingInfo.duration;
        if (_currentTime < endTime) {
            return
                userStakingInfo.startTime +
                userStakingInfo.duration -
                _currentTime;
        }

        return 0;
    }

    function isAccountDisabled(
        address _userAddress
    ) public view returns (bool) {
        Account storage userAccount = account[_userAddress];
        return userAccount.isDisabled;
    }

    function getDisabledAccountsList()
        external
        view
        returns (address[] memory)
    {
        address userAddress;
        Account storage userAccount = account[userAddress];
        address[] memory stakers = _stakers;
        uint256 totalStakers = stakers.length;
        address[] memory disabledAddressArray = new address[](totalStakers);
        uint256 disabledStakersLength;

        for (uint256 i; i < totalStakers; i++) {
            userAddress = stakers[i];
            if (_isAddressInList(disabledAddressArray, userAddress) == true) {
                continue;
            }

            if (userAccount.isDisabled == true) {
                disabledAddressArray[disabledStakersLength] = userAddress;
                disabledStakersLength++;
            }
        }

        return disabledAddressArray;
    }

    function disableAccounts(
        address[] calldata _userAddress
    ) external onlyOwner {
        address userAddress;
        Account storage userAccount = account[userAddress];
        uint256 userAddressLength = _userAddress.length;

        for (uint256 i; i < userAddressLength; i++) {
            userAddress = _userAddress[i];
            userAccount.isDisabled = true;
        }
    }

    function enableAccounts(
        address[] calldata _userAddress
    ) external onlyOwner {
        address userAddress;
        Account storage userAccount = account[userAddress];
        uint256 userAddressLength = _userAddress.length;

        for (uint256 i; i < userAddressLength; i++) {
            userAddress = _userAddress[i];
            userAccount.isDisabled = false;
        }
    }

    function getActiveStakingIDs()
        public
        view
        returns (uint256[] memory activeStakingIDs)
    {
        uint256 stakingIDsLength = _stakers.length;
        uint256 activeStakingIDCount;
        for (uint256 i; i < stakingIDsLength; i++) {
            if (_stakeInfoMap(i).isStaked == true) {
                activeStakingIDCount++;
            }
        }

        uint256[] memory stakingIDsArray = new uint256[](activeStakingIDCount);
        address[] memory activeStakersArray = new address[](
            activeStakingIDCount
        );

        for (uint256 i; i < stakingIDsLength; i++) {
            if (_stakeInfoMap(i).isStaked == true) {
                stakingIDsArray[i] = i + 1;
            }

            activeStakersArray[i] = _stakeInfoMap(i).owner;
        }

        activeStakingIDs = stakingIDsArray;
    }

    function activeStakersList() external view returns (address[] memory) {
        address[] memory stakers = _stakers;
        uint256 totalStakers = stakers.length;
        address[] memory activeStakersArray = new address[](totalStakers);
        uint256 activeStakersLength;

        for (uint256 i; i < totalStakers; i++) {
            if (_isAddressInList(activeStakersArray, stakers[i]) == true) {
                continue;
            }

            if (isStaked(stakers[i])) {
                activeStakersArray[activeStakersLength] = stakers[i];
                activeStakersLength++;
            }
        }

        return activeStakersArray;
    }

    function allStakersList() external view returns (address[] memory) {
        address[] memory stakers = _stakers;
        uint256 totalStakers = stakers.length;
        address[] memory stakersArray = new address[](totalStakers);
        uint256 stakersArrayLength;

        for (uint256 i; i < totalStakers; i++) {
            if (_isAddressInList(stakersArray, stakers[i]) == true) {
                continue;
            }

            stakersArray[stakersArrayLength] = stakers[i];
            stakersArrayLength++;
        }

        return stakersArray;
    }

    function getTotalValueStaked() external view returns (uint256) {
        return _totalValueStaked;
    }

    function getTotalStakingRewardDistributed()
        external
        view
        returns (uint256 _tokenRewards, uint256 _ansudRewards)
    {
        _tokenRewards = _tokenRewards;
        _ansudRewards = _totalANUSDRewards;
    }

    function getStakingCappings()
        external
        view
        returns (
            uint256 minStakingValue,
            uint256 stakingRewardRate,
            uint256 stakingDuration,
            uint256 stakingRewardClaimTimeLimit
        )
    {
        minStakingValue = _minStakingValue;
        stakingRewardRate = _stakingRewardRate;
        stakingDuration = _stakingDuration;
        stakingRewardClaimTimeLimit = _stakingRewardClaimTimeLimit;
    }

    function setMinStakingValue(
        uint256 _value
    ) external onlyOwner returns (uint256) {
        _minStakingValue = _value;
        return _minStakingValue;
    }

    function setStakingRewardRate(uint256 _valueInPer) external onlyOwner {
        _stakingRewardRate = _valueInPer;
    }

    function setStakingDuration(uint256 _valueInDays) external onlyOwner {
        _stakingDuration = _valueInDays * 1 days;
    }

    function setStakingRewardClaimTimeLimity(
        uint256 _valueInDays
    ) external onlyOwner {
        _stakingRewardClaimTimeLimit = _valueInDays * 1 days;
    }

    function _isAddressInList(
        address[] memory _addressList,
        address _addressToSearch
    ) private pure returns (bool) {
        for (uint256 i; i < _addressList.length; i++) {
            if (_addressList[i] == _addressToSearch) {
                return true;
            }
        }

        return false;
    }

    function _token_usd_out_value(
        uint256 _tokenValueIn,
        address _tokenContract,
        address _usdContract
    ) private view returns (uint256) {
        address[] memory tokenArray = new address[](2);
        tokenArray[0] = _tokenContract;
        tokenArray[1] = _usdContract;

        IVariables variables = IVariables(_variablesContract);

        uint256[] memory amounts = IUniswapRouter(
            variables.uniswapV2RouterContract()
        ).getAmountsOut(_tokenValueIn, tokenArray);

        return amounts[1];
    }

    function withdrawTokens(
        address _tokenAddress,
        address _receiver,
        uint256 _value
    ) external onlyOwner returns (bool) {
        IERC20Upgradeable(_tokenAddress).transfer(_receiver, _value);
        return true;
    }

    function withdrawNativeFunds(
        address _receiver,
        uint256 _value
    ) external onlyOwner returns (bool) {
        payable(_receiver).transfer(_value);
        return true;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function _getCurrentTime() private view returns (uint256 currentTime) {
        currentTime = block.timestamp;
        return currentTime;
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}
