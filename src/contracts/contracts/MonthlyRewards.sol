// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function decimals() external view returns (uint256);
}

interface IVariables {
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

    function isAdmin(address _address) external view returns (bool);
}

interface IReferral {
    function getUserAccount(
        address _address
    ) external view returns (Account memory userAccount);
}

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

struct StructAccountRewards {
    uint256 selfBusiness;
    uint256 directBusiness;
    uint256 teamBusiness;
    bool isListed;
}

struct StructMonthlyRewards {
    uint8 id;
    uint256 selfBusinessLimit;
    uint256 directBusinessLimit;
    uint256 teamBusinessLimit;
    string rewardName;
    uint256 appraisal;
    uint256 selfTopUpLimit;
    uint256 teamsToCount;
}

contract MonthlyRewardsUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 private _startDate;
    uint256 private _duration;
    address private _variablesContract;
    address[] private _users;

    bool private _isPayRewards;

    mapping(uint8 => StructMonthlyRewards) private _monthlyRewards;
    mapping(address => StructAccountRewards) private _accounts;

    // modifier onlyAdmins() {
    //     require(
    //         IVariables(_variablesContract).isAdmin(msg.sender),
    //         "You are not admin"
    //     );
    //     _;
    // }

    function initialize() public initializer {
        _startDate = block.timestamp;
        _duration = 31 days;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function getRewardsIDsCount() external view returns (uint8 rewardIDsCount) {
        for (uint8 i; i < 10; i++) {
            if (i > 0 && _monthlyRewards[i].selfBusinessLimit > 0) {
                rewardIDsCount = i;
            }
        }
    }

    function getRewardsByID(
        uint8 _id
    ) external view returns (StructMonthlyRewards memory) {
        return _monthlyRewards[_id];
    }

    function setMonthlyRewards(
        uint8 _id,
        uint256 _selfBusinessLimit,
        uint256 _directBusinessLimit,
        uint256 _teamBusinessLimit,
        string memory _rewardName,
        uint256 _appraisal,
        uint256 _selfTopUpLimit,
        uint256 _teamsToCount
    ) external onlyOwner {
        _monthlyRewards[_id] = StructMonthlyRewards({
            id: _id,
            selfBusinessLimit: _selfBusinessLimit,
            directBusinessLimit: _directBusinessLimit,
            teamBusinessLimit: _teamBusinessLimit,
            rewardName: _rewardName,
            appraisal: _appraisal,
            selfTopUpLimit: _selfTopUpLimit,
            teamsToCount: _teamsToCount
        });
    }

    function getUserBusiness(
        address _userAddress
    )
        external
        view
        returns (
            uint256 _selfBusiness,
            uint256 _directBusiness,
            uint256 _teamBusiness
        )
    {
        StructAccountRewards storage userRewardsAccount = _accounts[
            _userAddress
        ];
        _selfBusiness = userRewardsAccount.selfBusiness;
        _directBusiness = userRewardsAccount.directBusiness;
        _teamBusiness = userRewardsAccount.teamBusiness;
    }

    function updateSelfBusiness(
        address _userAddress,
        uint256 _selfBusiness
    ) external {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin"
        );
        if (_startDate + _duration > block.timestamp && _isPayRewards) {
            StructAccountRewards storage userRewardsAccount = _accounts[
                _userAddress
            ];
            userRewardsAccount.selfBusiness += _selfBusiness;
            if (!userRewardsAccount.isListed) {
                _users.push(_userAddress);
                userRewardsAccount.isListed = true;
            }
        }
    }

    function updateDirectBusiness(
        address _userAddress,
        uint256 _directBusiness
    ) external {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin"
        );
        if (_startDate + _duration > block.timestamp && _isPayRewards) {
            StructAccountRewards storage userRewardsAccount = _accounts[
                _userAddress
            ];
            userRewardsAccount.directBusiness += _directBusiness;
            if (!userRewardsAccount.isListed) {
                _users.push(_userAddress);
                userRewardsAccount.isListed = true;
            }
        }
    }

    function updateTeamBusiness(
        address _userAddress,
        uint256 _teamBusiness
    ) external {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin"
        );
        if (_startDate + _duration > block.timestamp && _isPayRewards) {
            StructAccountRewards storage userRewardsAccount = _accounts[
                _userAddress
            ];
            userRewardsAccount.teamBusiness += _teamBusiness;
            if (!userRewardsAccount.isListed) {
                _users.push(_userAddress);
                userRewardsAccount.isListed = true;
            }
        }
    }

    function getUserAccount(
        address _userAddress
    ) external view returns (StructAccountRewards memory) {
        return _accounts[_userAddress];
    }

    function _isUserTeamBusinessForRewards(
        Account memory userAccount,
        uint256 _value
    ) private view returns (bool isTrue) {
        uint256 totalBusiness;
        uint256 maxTotalBusiness;
        if (userAccount.referee.length > 2) {
            for (uint16 i; i < userAccount.referee.length; i++) {
                StructAccountRewards memory refereeRewardsAccount = _accounts[
                    userAccount.referee[i]
                ];

                totalBusiness += refereeRewardsAccount.teamBusiness;

                if (refereeRewardsAccount.teamBusiness > maxTotalBusiness) {
                    maxTotalBusiness = refereeRewardsAccount.teamBusiness;
                }
            }

            if (
                maxTotalBusiness >= _value &&
                (totalBusiness - maxTotalBusiness) >= _value
            ) {
                isTrue = true;
            }
        }
    }

    function getUserRewardQualified(
        address _address
    ) external view returns (uint8 rewardId) {
        Account memory userAccount = IReferral(
            IVariables(_variablesContract).referralContract()
        ).getUserAccount(_address);

        StructAccountRewards memory userRewardsAccount = _accounts[_address];

        for (uint8 i; i < 10; i++) {
            StructMonthlyRewards memory rewardsAccount = _monthlyRewards[i];

            if (i > 1 && rewardsAccount.selfBusinessLimit == 0) {
                break;
            }
            if (
                userRewardsAccount.selfBusiness >=
                rewardsAccount.selfBusinessLimit &&
                userRewardsAccount.directBusiness >=
                rewardsAccount.directBusinessLimit &&
                _isUserTeamBusinessForRewards(
                    userAccount,
                    rewardsAccount.teamBusinessLimit
                )
            ) {
                rewardId = i;
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
        address[] memory users = _users;

        for (_from; _from <= _to; _from++) {
            StructAccountRewards memory userRewardsAccount = _accounts[
                users[_from]
            ];
            StructMonthlyRewards memory rewardsAccount = _monthlyRewards[
                _rewardId
            ];
            Account memory userAccount = IReferral(
                IVariables(_variablesContract).referralContract()
            ).getUserAccount(users[_from]);

            if (
                userRewardsAccount.selfBusiness >=
                rewardsAccount.selfBusinessLimit &&
                userRewardsAccount.directBusiness >=
                rewardsAccount.directBusinessLimit &&
                _isUserTeamBusinessForRewards(
                    userAccount,
                    rewardsAccount.teamBusinessLimit
                )
            ) {
                _usersList[_achieversListCount] = users[_from];
                _achieversListCount++;
            }
        }
    }

    function getRewardQualifiedUsersList(
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

    function getUsersList()
        external
        view
        returns (address[] memory usersList, uint256 usersCount)
    {
        usersList = _users;
        usersCount = usersList.length;
    }

    function getDefaults()
        external
        view
        returns (
            uint256 startTime,
            uint256 duration,
            bool isPayRewards,
            address variablesContract
        )
    {
        startTime = _startDate;
        duration = _duration;
        isPayRewards = _isPayRewards;
        variablesContract = _variablesContract;
    }

    function setIsPayMonthlyRewards(bool _trueOrFalse) external {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin"
        );
        _isPayRewards = _trueOrFalse;
    }

    function setVariablesContract(address _contractAddress) external onlyOwner {
        _variablesContract = _contractAddress;
    }

    function setStartTime(uint256 _timeInEpoch) external onlyOwner {
        _startDate = _timeInEpoch;
    }

    function setDuration(uint256 _days) external onlyOwner {
        _duration = _days * 1 days;
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
}
