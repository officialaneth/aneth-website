// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint);
}

interface IVariables {
    function presaleContract() external view returns (address);

    function referralContract() external view returns (address);

    function stakingContract() external view returns (address);

    function tokenContract() external view returns (address);

    function anusdContract() external view returns (address);
}

contract ReferralUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;

    address private _variablesContract;

    uint256[] private _levelRates;
    uint256 private _levelDecimals;

    uint256[] private userRankBusinessLimit;

    uint256 private _totalReferralPaidANUSD;

    address private _defaultReferrer;

    uint256 private _globalRewardRate;
    address[] private _globalAddress;
    uint256 private _globalBusinessValue;

    uint256 private _passiveIncomeRate;
    uint256 private _passiveBusinessValue;
    uint256 private _passiveIncomeLevels;

    address[] private _coreMembers;
    uint256 private _coreRewardRate;

    struct Account {
        address referrer;
        address[] referee;
        address[] team;
        uint256[] topUp;
        uint256 selfBusiness;
        uint256 directBusiness;
        uint256 totalBusiness;
        uint256[] rewardsPaidReferral;
        uint256[] rewardsPaidGlobal;
        uint256[] rewardPaidPassive;
        bool isInGlobalID;
    }

    struct RewardsAccount {
        address userAdddress;
        uint8[] rewardId;
        uint8 lastRewardId;
    }

    struct Rewards {
        uint8 id;
        uint256 selfBusinessLimit;
        uint256 directBusinessLimit;
        uint256 teamBusinessLimit;
        string rankName;
        string rewardName;
        uint256 appraisal;
    }

    mapping(address => Account) private accounts;
    mapping(address => RewardsAccount) public rewardAccount;
    mapping(uint8 => Rewards) public rewards;
    mapping(uint16 => address) public idToAddress;
    mapping(address => uint16) public addressToId;

    address[] public usersList;
    uint16 public totalUsers;

    event RegisteredReferer(address indexed referee, address indexed referrer);

    event RegisteredTeamAddress(
        address indexed parent,
        address indexed referrer,
        address indexed referee
    );

    event RegisterRefererFailed(
        address indexed referee,
        address indexed referrer,
        string indexed reason
    );

    event ReferralRewardPaid(
        address indexed referee,
        address indexed referrer,
        uint256 indexed amount,
        uint256 level,
        string currency
    );

    event GlobalAddressAdded(address userAddress);
    event GlobalAddressRemoved(address userAddress);
    event GlobalRewardPaid(uint256 value, address userAddress);
    event PassiveRewardPaid(uint256 indexed value, address indexed userAddress);
    event CoreMemberAdded(address indexed userAddressaddress);
    event CoreMemberRemoved(address userAddress);
    event CoreMemberRewardPaid(
        uint256 indexed value,
        address indexed userAddress
    );
    event RewardAdded(
        uint8 id,
        uint256 selfBusinessLimit,
        uint256 directBusinessLimit,
        uint256 teamBusinessLimit,
        string rankName,
        string rewardName,
        uint256 appraisal
    );

    event RewardAccountAdded(address userAddress, uint8 rewardId);
    event RewardAccountPaid(address userAddress, uint8 rewardId);

    function initialize() public initializer {
        _variablesContract = 0x77daaFc7411C911b869C71bf70FE36cCE507845d;
        _defaultReferrer = 0xF3Ba579d4aFD4dAd8a8C2d1bcbdd1405688e492f;
        _levelRates = [7, 4, 3, 2, 1, 1, 1];
        _levelDecimals = 100;

        _passiveIncomeLevels = 20;

        _globalBusinessValue = 5100000000000000000000;
        _globalRewardRate = 4;

        _passiveIncomeRate = 5;
        _passiveBusinessValue = 3100000000000000000000;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    function _includeUserInList(address _userAddress) private {
        if (addressToId[_userAddress] == 0) {
            uint16 _totalUsers = totalUsers + 1;
            addressToId[_userAddress] = _totalUsers;
            idToAddress[_totalUsers] = _userAddress;

            usersList.push(_userAddress);
            totalUsers++;
        }
    }

    function includeUsersInList(
        address[] calldata _userAddress
    ) external onlyOwner {
        for (uint i; i < _userAddress.length; i++) {
            _includeUserInList(_userAddress[i]);
        }
    }

    function getUserAccount(
        address _address
    ) external view returns (Account memory userAccount) {
        userAccount = accounts[_address];
    }

    function contractDefaults()
        external
        view
        returns (
            uint256 levelDecimals,
            uint256[] memory levelRates,
            uint256 totalLevelRate,
            address defaultReferrer
        )
    {
        levelDecimals = _levelDecimals;
        levelRates = _levelRates;
        uint256 levelRatesLength = _levelRates.length;
        for (uint8 i; i < levelRatesLength; i++) {
            totalLevelRate += _levelRates[i];
        }

        defaultReferrer = _defaultReferrer;
    }

    function setLevelDecimals(
        uint256 _value
    ) external onlyOwner returns (bool) {
        _levelDecimals = _value;
        return true;
    }

    function setLevelRates(
        uint256[] calldata _valueInArray
    ) external onlyOwner {
        _levelRates = _valueInArray;
    }

    function setDefaultReferrer(address payable _address) public onlyOwner {
        _defaultReferrer = _address;
    }

    function setRewards(
        uint8[] memory _id,
        uint256[] memory _selfBusinessLimit,
        uint256[] memory _directBusinessLimit,
        uint256[] memory _teamBusinessLimit,
        string[] memory _rankName,
        string[] memory _rewardName,
        uint256[] memory _appraisal
    ) external onlyOwner {
        for (uint i; i < _id.length; i++) {
            rewards[_id[i]] = Rewards({
                id: _id[i],
                selfBusinessLimit: _selfBusinessLimit[i],
                directBusinessLimit: _directBusinessLimit[i],
                teamBusinessLimit: _teamBusinessLimit[i],
                rankName: _rankName[i],
                rewardName: _rewardName[i],
                appraisal: _appraisal[i]
            });

            emit RewardAdded(
                _id[i],
                _selfBusinessLimit[i],
                _directBusinessLimit[i],
                _teamBusinessLimit[i],
                _rankName[i],
                _rewardName[i],
                _appraisal[i]
            );
        }
    }

    function _getUserTopUp(
        Account memory userAccount
    ) private pure returns (uint256 userTopUp) {
        if (userAccount.topUp.length > 1) {
            for (uint16 i = 1; i < userAccount.topUp.length; i++) {
                userTopUp += userAccount.topUp[i];
            }
        } else if (userAccount.topUp.length == 1) {
            userTopUp = userAccount.topUp[0];
        }
    }

    function _isUserTeamBusinessForRewards(
        Account memory userAccount,
        uint256 _value
    ) private view returns (bool isTrue) {
        uint8 qualifyCount;
        if (userAccount.referee.length > 2) {
            for (uint16 i; i < userAccount.referee.length; i++) {
                Account memory refereeAccount = accounts[
                    userAccount.referee[i]
                ];
                if (refereeAccount.totalBusiness >= _value) {
                    qualifyCount++;
                }

                if (qualifyCount >= 2) {
                    isTrue = true;
                    break;
                }
            }
        }
    }

    function _getRewardQualifiedUsers(
        uint8 _rewardId,
        uint16 _from,
        uint16 _to
    )
        private
        view
        returns (address[] memory _usersList, uint16 _achieversListCount)
    {
        _usersList = new address[](_to - _from);

        for (_from; _from <= _to; _from++) {
            address userAddress = idToAddress[_from];
            Account memory userAccount = accounts[userAddress];
            Rewards memory rewardsAccount = rewards[_rewardId];

            if (
                _getUserTopUp(userAccount) >=
                rewardsAccount.selfBusinessLimit &&
                userAccount.directBusiness >=
                rewardsAccount.directBusinessLimit &&
                _isUserTeamBusinessForRewards(
                    userAccount,
                    rewardsAccount.teamBusinessLimit
                )
            ) {
                _usersList[_achieversListCount] = userAddress;
                _achieversListCount++;
            }
        }
    }

    function getRewardQualifiedUsers(
        uint8 _rewardId,
        uint16 _from,
        uint16 _to
    )
        external
        view
        returns (address[] memory _userAddress, uint16 _achieversListCount)
    {
        (
            address[] memory _usersList,
            uint16 _usersCount
        ) = _getRewardQualifiedUsers(_rewardId, _from, _to);
        _achieversListCount = _usersCount;

        _userAddress = new address[](_usersCount);

        for (uint16 i; i < _usersCount; i++) {
            _userAddress[i] = _usersList[i];
        }
    }

    function getUserRewardQualified(
        address _userAddress
    ) external view returns (uint8 rewardId) {
        Account memory userAccount = accounts[_userAddress];
        uint8 rewardsCount;

        for (uint8 i; i < 20; i++) {
            Rewards memory rewardsAccount = rewards[i];

            if (i > 2 && rewardsAccount.selfBusinessLimit == 0) {
                break;
            }

            if (
                _getUserTopUp(userAccount) >=
                rewardsAccount.selfBusinessLimit &&
                userAccount.directBusiness >=
                rewardsAccount.directBusinessLimit &&
                _isUserTeamBusinessForRewards(
                    userAccount,
                    rewardsAccount.teamBusinessLimit
                )
            ) {
                rewardsCount = i;
            }
        }

        return rewardsCount;
    }

    function payReward(address _userAddress) external onlyOwner {}

    function getUserReferrerAddress(
        address _address
    ) external view returns (address referrer) {
        Account storage userAccount = accounts[_address];
        referrer = userAccount.referrer;
    }

    function getUserTeam(
        address _address
    )
        external
        view
        returns (
            address[] memory userReferee,
            uint256 userRefereeCount,
            address[] memory userTeamAddress,
            uint256 userTeamCount
        )
    {
        Account storage userAccount = accounts[_address];
        userReferee = userAccount.referee;
        userRefereeCount = userReferee.length;
        userTeamAddress = userAccount.team;
        userTeamCount = userTeamAddress.length;
    }

    function getUserTotalRewardPaid(
        address _address
    )
        external
        view
        returns (
            uint256 rewardsAUSD,
            uint256 rewardsGlobal,
            uint256 rewardsPassive
        )
    {
        Account storage userAccount = accounts[_address];
        uint256 ausdlength = userAccount.rewardsPaidReferral.length;
        uint256 globalLength = userAccount.rewardsPaidGlobal.length;
        uint256 passiveLength = userAccount.rewardPaidPassive.length;

        for (uint256 i; i < ausdlength; i++) {
            rewardsAUSD += userAccount.rewardsPaidReferral[i];
        }

        for (uint256 i; i < globalLength; i++) {
            rewardsGlobal += userAccount.rewardsPaidGlobal[i];
        }

        for (uint256 i; i < passiveLength; i++) {
            rewardsPassive += userAccount.rewardPaidPassive[i];
        }
    }

    function getUserTotalBusiness(
        address _address
    )
        external
        view
        returns (
            uint256 selfBusiness,
            uint256 directBusiness,
            uint256 refereeTeamBusiness,
            uint256 totalBusiness
        )
    {
        Account storage userAccount = accounts[_address];
        uint256 refereeLength = userAccount.referee.length;

        selfBusiness = userAccount.selfBusiness;

        for (uint256 i; i < refereeLength; i++) {
            Account memory refereeAccount = accounts[userAccount.referee[i]];
            directBusiness += refereeAccount.selfBusiness;
        }

        for (uint256 i; i < refereeLength; i++) {
            Account memory refereeAccount = accounts[userAccount.referee[i]];
            refereeTeamBusiness += refereeAccount.totalBusiness;
        }

        totalBusiness = userAccount.totalBusiness;
    }

    function _hasReferrer(address _address) private view returns (bool) {
        return accounts[_address].referrer != address(0);
    }

    function _addReferrer(
        address _userAddress,
        address _referrerAddress
    ) private {
        Account storage userAccount = accounts[_userAddress];
        userAccount.referrer = _referrerAddress;
        emit RegisteredReferer(_userAddress, _referrerAddress);

        uint256 levelRatesLength = _levelRates.length;

        for (uint256 i; i < levelRatesLength; i++) {
            Account storage referrerAccount = accounts[userAccount.referrer];
            if (i == 0) {
                referrerAccount.referee.push(_userAddress);
            }

            if (userAccount.referrer == address(0)) {
                break;
            }

            referrerAccount.team.push(_userAddress);

            emit RegisteredTeamAddress(
                userAccount.referrer,
                _referrerAddress,
                _userAddress
            );

            userAccount = referrerAccount;
        }
    }

    function addReferrerAdmin(
        address[] calldata _userAddress,
        address[] calldata _referrerAddress
    ) external onlyOwner {
        require(
            _userAddress.length == _referrerAddress.length,
            "Length is not equal please check."
        );

        for (uint256 i; i < _userAddress.length; i++) {
            _addReferrer(_userAddress[i], _referrerAddress[i]);
        }
    }

    function hasReferrer(address _address) external view returns (bool) {
        return _hasReferrer(_address);
    }

    function _payReferralInANUSD(
        uint256 _valueInUSD,
        address _userAddress
    ) private {
        IVariables variables = IVariables(_variablesContract);

        uint256[] memory levelRates = _levelRates;

        Account storage userAccount = accounts[_userAddress];
        userAccount.topUp.push(_valueInUSD);
        userAccount.selfBusiness += _valueInUSD;

        address[] memory passiveIncomeAddress = new address[](
            _passiveIncomeLevels
        );

        uint256 passiveIncomeAddressCount;

        address[] memory coreMembers = _coreMembers;
        uint256 coreMembersCount = coreMembers.length;

        uint256 totalReferral;

        for (uint256 i; i < _passiveIncomeLevels; i++) {
            address referrer = userAccount.referrer;
            Account storage referrerAccount = accounts[referrer];
            if (referrer == address(0)) {
                break;
            }

            if (i < levelRates.length) {
                uint256 c = (_valueInUSD * levelRates[i]) / 100;
                if (i == 0) {
                    referrerAccount.directBusiness += _valueInUSD;
                }
                referrerAccount.totalBusiness += _valueInUSD;
                referrerAccount.rewardsPaidReferral.push(c);
                totalReferral += c;

                IERC20Upgradeable(variables.anusdContract()).transfer(
                    referrer,
                    c
                );

                emit ReferralRewardPaid(
                    _userAddress,
                    referrer,
                    c,
                    i + 1,
                    "ANUSD"
                );

                if (!referrerAccount.isInGlobalID) {
                    if (referrerAccount.directBusiness > _globalBusinessValue) {
                        _globalAddress.push(referrer);
                        referrerAccount.isInGlobalID = true;
                        emit GlobalAddressAdded(referrer);
                    }
                }
            }

            if (referrerAccount.directBusiness > _passiveBusinessValue) {
                passiveIncomeAddress[passiveIncomeAddressCount] = referrer;
                passiveIncomeAddressCount++;
            }

            userAccount = referrerAccount;
        }

        if (passiveIncomeAddressCount > 0) {
            uint256 passiveIncomeValue = (_valueInUSD * _passiveIncomeRate) /
                100 /
                passiveIncomeAddressCount;
            for (uint256 i; i < passiveIncomeAddressCount; i++) {
                if (passiveIncomeAddress[i] == address(0)) {
                    break;
                }
                Account storage passiveAddressAccount = accounts[
                    passiveIncomeAddress[i]
                ];

                IERC20Upgradeable(variables.anusdContract()).transfer(
                    passiveIncomeAddress[i],
                    passiveIncomeValue
                );

                emit PassiveRewardPaid(
                    passiveIncomeValue,
                    passiveIncomeAddress[i]
                );

                passiveAddressAccount.rewardPaidPassive.push(
                    passiveIncomeValue
                );
            }
        }

        if (_globalAddress.length > 0) {
            uint256 globalIncome = (_valueInUSD * _globalRewardRate) / 100;
            uint index = uint(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % _globalAddress.length;

            address globalAddress = _globalAddress[index];

            Account storage globalAddressAccount = accounts[globalAddress];

            IERC20Upgradeable(variables.anusdContract()).transfer(
                globalAddress,
                globalIncome
            );

            globalAddressAccount.rewardsPaidGlobal.push(globalIncome);

            emit GlobalRewardPaid(globalIncome, globalAddress);
        }

        if (coreMembersCount > 0) {
            uint256 coreRewardValue = (_valueInUSD * _coreRewardRate) /
                100 /
                coreMembersCount;
            for (uint256 i; i < coreMembersCount; i++) {
                IERC20Upgradeable(variables.anusdContract()).transfer(
                    coreMembers[i],
                    coreRewardValue
                );
                emit CoreMemberRewardPaid(coreRewardValue, coreMembers[i]);
            }
        }

        _totalReferralPaidANUSD += totalReferral;
    }

    function payReferralANUSDAdmin(
        uint256 _valueInUSD,
        address _userAddress,
        address _referrerAddress
    ) external {
        address _msgSender = msg.sender;
        require(
            _msgSender == owner() ||
                _msgSender == IVariables(_variablesContract).presaleContract(),
            "Only owner can call this function."
        );

        if (!_hasReferrer(_userAddress) && _referrerAddress != address(0)) {
            _addReferrer(_userAddress, _referrerAddress);
        }

        if (
            !_hasReferrer(_referrerAddress) &&
            _referrerAddress != address(0) &&
            _referrerAddress != _defaultReferrer
        ) {
            _addReferrer(_referrerAddress, _defaultReferrer);
        }

        _payReferralInANUSD(_valueInUSD, _userAddress);

        if (
            IERC20Upgradeable(0x7F9fD63932babC508FAD2f324EB534D09cfE86F0)
                .balanceOf(address(this)) > (_valueInUSD / 1000)
        ) {
            IERC20Upgradeable(0x7F9fD63932babC508FAD2f324EB534D09cfE86F0)
                .transfer(_userAddress, (_valueInUSD / 1000));
        }

        _includeUserInList(_userAddress);
    }

    function getVariablesContract() external view returns (address) {
        return _variablesContract;
    }

    function setVariablesContract(address _contractAddress) external onlyOwner {
        _variablesContract = _contractAddress;
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

    function transferNative(
        address _address,
        uint256 _value
    ) external onlyOwner {
        payable(_address).transfer(_value);
    }

    function withdrawNative() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawtokens(
        address _tokenAddress,
        uint256 _value
    ) external onlyOwner {
        IERC20Upgradeable(_tokenAddress).transfer(msg.sender, _value);
    }
}
