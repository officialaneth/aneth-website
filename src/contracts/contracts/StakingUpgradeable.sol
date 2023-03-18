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

interface IPresale {
    function getPricePerUSD() external view returns (uint256);
}

contract StakingUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _presaleContract;
    address private _referralContract;

    address[] private _stakers;
    uint256 private _totalValueStaked;
    uint256 private _totalRewardsDistributed;

    uint16 private _rewardRateDecimals;
    uint256 private _minStakingValue;

    bool private _isPayReferralOnStaking;
    uint256 private _rewardClaimTimeLimit;

    uint8 private _maxPackageLength;

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
        uint256 lastTimeRewardClaimed;
        uint256[] blockNumber;
    }

    struct Package {
        uint256 value;
        uint256 rewardRate;
        uint256 duration;
    }

    mapping(address => Account) private account;
    mapping(uint256 => StakeInfo) private stakeInfo;
    mapping(uint256 => Package) private package;

    event Stake(
        address indexed userAddress,
        uint256 indexed valueStaked,
        uint256 indexed duration,
        uint256 stakingID
    );
    event StakingRewardClaimed(
        address indexed userAddress,
        uint256 indexed reward,
        uint256 indexed stakingID
    );
    event Unstake(
        address indexed userAddress,
        uint256 indexed valueStaked,
        uint256 indexed stakingID
    );

    event UserWithdrawFunds(address indexed userAddress, uint256 indexed value);

    function initialize() public initializer {
        _presaleContract = 0xD15A7571030817b0C6cF84e7a130C492c4997A5f;
        _referralContract = 0x0F4B542493E591Bd817c5280D1F748510b39e624;

        _minStakingValue = 10000000000000000000;
        _isPayReferralOnStaking = true;
        _rewardRateDecimals = 100;
        _rewardClaimTimeLimit = 1 days;
        _maxPackageLength = 3;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    function _getPackage(
        uint256 _packageID
    ) private view returns (Package memory) {
        return package[_packageID];
    }

    function getPackages()
        external
        view
        returns (
            uint256[] memory valuesInDecimals,
            uint256[] memory rewardRateInPer,
            uint256[] memory durationInDays,
            uint256 count
        )
    {
        uint256[] memory _packageValues = new uint256[](_maxPackageLength);
        uint256[] memory _packageRates = new uint256[](_maxPackageLength);
        uint256[] memory _packageDurations = new uint256[](_maxPackageLength);

        for (uint256 i; i < _maxPackageLength; i++) {
            _packageValues[i] = _getPackage(i).value;
            _packageRates[i] = _getPackage(i).rewardRate;
            _packageDurations[i] = _getPackage(i).duration;
            count++;
        }

        valuesInDecimals = _packageValues;
        rewardRateInPer = _packageRates;
        durationInDays = _packageDurations;
    }

    function _setPackage(
        uint256[] memory _valuesInDecimals,
        uint256[] memory _rewardRateInPer,
        uint256[] memory _durationsInDays
    ) private {
        uint256 packageLength = _valuesInDecimals.length;
        require(packageLength <= _maxPackageLength, "Exceeding package length");

        for (uint256 i; i < packageLength; i++) {
            package[i].value = _valuesInDecimals[i];
            package[i].rewardRate = _rewardRateInPer[i];
            package[i].duration = _durationsInDays[i];
        }
    }

    function setPackage(
        uint256[] calldata _valuesInDecimals,
        uint256[] calldata _rewardRateInPer,
        uint256[] calldata _durationsInDays
    ) external onlyOwner {
        _setPackage(_valuesInDecimals, _rewardRateInPer, _durationsInDays);
    }

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

    function stake(
        address _referrerAddress,
        uint256 _packageID
    ) external payable whenNotPaused {
        address _msgSender = msg.sender;
        uint256 _msgValue = msg.value;
        require(
            _msgValue >= _minStakingValue,
            "Staking value should be >= minStakingValue."
        );
        Package storage packageInfo = package[_packageID];

        _stake(
            _msgSender,
            _msgValue,
            packageInfo.rewardRate,
            packageInfo.duration
        );

        if (_isPayReferralOnStaking) {
            IReferral(_referralContract).payReferralETHAdmin(
                _msgValue,
                _msgSender,
                _referrerAddress
            );
        }
    }

    function _getStakingReward(
        uint256 _stakingID
    ) private view returns (uint256 stakingReward) {
        uint256 currentTime = block.timestamp;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        uint256 stakingTimePassed = currentTime - userStakingInfo.startTime;

        uint256 baseReward = ((userStakingInfo.value *
            userStakingInfo.rewardRate) / _rewardRateDecimals) /
            userStakingInfo.duration;
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
        uint256 stakingReward,
        uint256 _currentBlock
    ) private returns (uint256) {
        userStakingInfo.rewardClaimed += stakingReward;
        userStakingInfo.lastTimeRewardClaimed = block.timestamp;
        userStakingInfo.blockNumber.push(_currentBlock);
        userAccount.blockNumber.push(_currentBlock);
        _totalRewardsDistributed += stakingReward;
        emit StakingRewardClaimed(_userAddress, stakingReward, _stakingID);

        return stakingReward;
    }

    function claimStakingReward(uint256 _stakingID) external {
        address _msgSender = msg.sender;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        Account storage userAccount = account[_msgSender];
        uint256 _currentBlock = block.number;
        require(
            !userAccount.isDisabled,
            "Your account is disabled. Please contract admin."
        );
        require(userStakingInfo.isStaked == true, "Staking is not active");
        require(userStakingInfo.owner == _msgSender, "Sorry you are not owner");
        require(
            userStakingInfo.lastTimeRewardClaimed + _rewardClaimTimeLimit >
                block.timestamp,
            "Your last reward claim time limit is not over yet."
        );
        uint256 stakingReward = _getStakingReward(_stakingID);
        _claimReward(
            _msgSender,
            _stakingID,
            userStakingInfo,
            userAccount,
            stakingReward,
            _currentBlock
        );
        payable(msg.sender).transfer(stakingReward);
    }

    function claimStakingRewardAdmin(
        uint256[] calldata _stakingIDs
    ) external onlyOwner {
        address userAddress;
        uint256 stakingID;
        StakeInfo storage userStakingInfo = stakeInfo[stakingID];
        Account storage userAccount = account[userAddress];
        uint256 _currentBlock = block.number;

        for (uint256 i; i < _stakingIDs.length; i++) {
            stakingID = _stakingIDs[i];
            userAddress = userStakingInfo.owner;
            _claimReward(
                userAddress,
                stakingID,
                userStakingInfo,
                userAccount,
                _getStakingReward(stakingID),
                _currentBlock
            );
        }
    }

    function _unStake(
        address _userAddress,
        uint256 _stakingID,
        StakeInfo storage _userStakingInfo,
        Account storage _userAccount,
        uint256 _currentBlock
    ) private returns (uint256) {
        _userStakingInfo.isStaked = false;
        _userStakingInfo.blockNumber.push(_currentBlock);
        _userAccount.blockNumber.push(_currentBlock);

        _totalValueStaked -= _userStakingInfo.value;

        emit Unstake(_userAddress, _userStakingInfo.value, _stakingID);
        return _userStakingInfo.value;
    }

    function unStake(uint256 _stakingID) external {
        address _msgSender = msg.sender;
        uint256 _currentBlock = block.number;
        uint256 _currentTime = block.timestamp;
        Account storage userAccount = account[_msgSender];
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        require(
            !userAccount.isDisabled,
            "Your account is disabled. Please contract admin."
        );
        require(userStakingInfo.isStaked, "Staking is not active");
        require(
            userStakingInfo.owner == _msgSender,
            "Sorry you are not owner of this staking"
        );
        require(
            userStakingInfo.startTime + userStakingInfo.duration > _currentTime,
            "You staking is not over yet"
        );

        uint256 stakingReward = _getStakingReward(_stakingID);
        _claimReward(
            _msgSender,
            _stakingID,
            userStakingInfo,
            userAccount,
            stakingReward,
            _currentBlock
        );
        _unStake(
            _msgSender,
            _stakingID,
            userStakingInfo,
            userAccount,
            _currentBlock
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

    function getPresaleContract() external view returns (address) {
        return _presaleContract;
    }

    function updatePresaleContract(
        address _presaleAddress
    ) external onlyOwner returns (address) {
        _presaleContract = _presaleAddress;
        return _presaleContract;
    }

    function getReferralContract() external view returns (address) {
        return _referralContract;
    }

    function updateReferralContract(
        address _referralAddress
    ) external onlyOwner returns (address) {
        _referralContract = _referralAddress;
        return _referralContract;
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
        returns (uint256)
    {
        return _totalRewardsDistributed;
    }

    function getStakingCappings()
        external
        view
        returns (
            uint256 minStakingValue,
            uint256 timeLimitRewardClaim,
            bool payReferralOnStaking,
            uint8 maxPackageLength,
            uint256 rewardRateDecimals
        )
    {
        minStakingValue = _minStakingValue;
        timeLimitRewardClaim = _rewardClaimTimeLimit;
        payReferralOnStaking = _isPayReferralOnStaking;
        maxPackageLength = _maxPackageLength;
        rewardRateDecimals = _rewardRateDecimals;
    }

    function setMinStakingValue(
        uint256 _value
    ) external onlyOwner returns (uint256) {
        _minStakingValue = _value;
        return _minStakingValue;
    }

    function setTimeLimitRewardClaim(
        uint256 _valueInSeconds
    ) external onlyOwner {
        _rewardClaimTimeLimit = _valueInSeconds;
    }

    function setIsPayReferralOnStaking(
        bool _value
    ) external onlyOwner returns (bool) {
        _isPayReferralOnStaking = _value;
        return _isPayReferralOnStaking;
    }

    function setMaxPackageLength(uint8 _valueInDecimals) external onlyOwner {
        _maxPackageLength = _valueInDecimals;
    }

    function setRewardRateDecimals(uint8 _valueInDecimals) external onlyOwner {
        _rewardRateDecimals = _valueInDecimals;
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

    /*Admin function*/

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
