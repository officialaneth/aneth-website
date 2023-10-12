// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// interface IERC20_EXTENDED {
//     function name() external view returns (string memory);

//     function decimals() external view returns (uint256);
// }

interface IVariables {
    function referralContract() external view returns (address);

    // function stakingContract() external view returns (address);

    // function tokenContract() external view returns (address);

    // function anusdContract() external view returns (address);

    // function usdtContract() external view returns (address);

    // function tokenContractOwner() external view returns (address);

    // function rewardContract() external view returns (address);

    // function rewardContractOwner() external view returns (address);

    // function adminFees() external view returns (uint256);

    function isAdmin(address _address) external view returns (bool);
}

interface IReferral {
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
        );
}

struct StructTeam {
    address userAddress;
    uint256 teamLevel;
}

struct StructAccount {
    address referrer;
    address[] referee;
    StructTeam[] team;
    uint256[] topUp;
    uint256 selfBusiness;
    uint256 directBusiness;
    uint256 teamBusiness;
    uint256[] rewardsPaidReferral;
    uint256[] rewardsPaidGlobal;
    uint256[] rewardPaidPassive;
    bool isInGlobalID;
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

    mapping(uint8 => StructMonthlyRewards) private _monthlyRewards;
    mapping(address => StructAccount) private _accounts;

    function initialize() public initializer {
        _startDate = block.timestamp;
        _duration = 50 days;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _isMonthRewardActive() private view returns (bool isActive) {
        if (block.timestamp < _startDate + _duration) {
            isActive = true;
        }
    }

    function isMonthRewardActive() public view returns (bool) {
        return _isMonthRewardActive();
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
            uint256 selfBusiness,
            uint256 directBusiness,
            uint256 teamBusinessMain,
            uint256 teamBusinessOther,
            uint256 totalTeamBusiness
        )
    {
        StructAccount storage userRewardsAccount = _accounts[_userAddress];
        selfBusiness = userRewardsAccount.selfBusiness;
        directBusiness = userRewardsAccount.directBusiness;
        totalTeamBusiness =
            userRewardsAccount.teamBusiness -
            userRewardsAccount.directBusiness;

        uint256 totalBusiness;

        (
            address[] memory userReferee,
            uint256 userRefereeCount,
            address[] memory userTeamAddress,
            uint256 userTeamCount
        ) = IReferral(IVariables(_variablesContract).referralContract())
                .getUserTeam(_userAddress);

        

        if (userRefereeCount >= 2) {
            for (uint16 i; i < userRefereeCount; i++) {
                StructAccount memory refereeAccount = _accounts[
                    userReferee[i]
                ];

                if (refereeAccount.teamBusiness > teamBusinessMain) {
                    teamBusinessMain = refereeAccount.teamBusiness;
                }

                totalBusiness += refereeAccount.teamBusiness;
            }

            teamBusinessOther = totalBusiness - teamBusinessMain;
        }
    }

    function updateSelfBusiness(
        address _userAddress,
        uint256 _selfBusiness
    ) external {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin"
        );

        if (_isMonthRewardActive()) {
            StructAccount storage userRewardsAccount = _accounts[_userAddress];
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
        if (_isMonthRewardActive()) {
            StructAccount storage userRewardsAccount = _accounts[_userAddress];
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
        if (_isMonthRewardActive()) {
            StructAccount storage userRewardsAccount = _accounts[_userAddress];
            userRewardsAccount.teamBusiness += _teamBusiness;
            if (!userRewardsAccount.isListed) {
                _users.push(_userAddress);
                userRewardsAccount.isListed = true;
            }
        }
    }

    function updateReferee(
        address _userAddress,
        address _refreeAddress
    ) external {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin"
        );

        if (_isMonthRewardActive()) {
            StructAccount storage userRewardsAccount = _accounts[_userAddress];

            userRewardsAccount.referee.push(_refreeAddress);
            if (!userRewardsAccount.isListed) {
                _users.push(_userAddress);
                userRewardsAccount.isListed = true;
            }
        }
    }

    function updateTeam(
        address _userAddress,
        address _teamAddress,
        uint256 _index
    ) external {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin"
        );

        if (_isMonthRewardActive()) {
            StructAccount storage userRewardsAccount = _accounts[_userAddress];

            userRewardsAccount.team.push(
                StructTeam({userAddress: _teamAddress, teamLevel: _index})
            );

            if (!userRewardsAccount.isListed) {
                _users.push(_userAddress);
                userRewardsAccount.isListed = true;
            }
        }
    }

    function getUserAccount(
        address _userAddress
    ) external view returns (StructAccount memory) {
        return _accounts[_userAddress];
    }

    function _isUserTeamBusinessForRewards(
        StructAccount memory userAccount,
        uint256 _value
    ) private view returns (bool isTrue) {
        uint256 totalBusiness;
        uint256 maxTotalBusiness;
        if (userAccount.referee.length > 2) {
            for (uint16 i; i < userAccount.referee.length; i++) {
                StructAccount memory refereeRewardsAccount = _accounts[
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

    // function getUserRewardQualified(
    //     address _address
    // ) external view returns (uint8 rewardId) {
    //     StructAccount memory userAccount = IReferral(
    //         IVariables(_variablesContract).referralContract()
    //     ).getUserAccount(_address);

    //     StructAccountRewards memory userRewardsAccount = _accounts[_address];

    //     for (uint8 i; i < 10; i++) {
    //         StructMonthlyRewards memory rewardsAccount = _monthlyRewards[i];

    //         if (i > 1 && rewardsAccount.selfBusinessLimit == 0) {
    //             break;
    //         }
    //         if (
    //             userRewardsAccount.selfBusiness >=
    //             rewardsAccount.selfBusinessLimit &&
    //             userRewardsAccount.directBusiness >=
    //             rewardsAccount.directBusinessLimit &&
    //             _isUserTeamBusinessForRewards(
    //                 userAccount,
    //                 rewardsAccount.teamBusinessLimit
    //             )
    //         ) {
    //             rewardId = i;
    //         }
    //     }
    // }

    // function _getRewardQualifiedUsers(
    //     uint8 _rewardId,
    //     uint16 _from,
    //     uint16 _to
    // )
    //     private
    //     view
    //     returns (address[] memory _usersList, uint16 _achieversListCount)
    // {
    //     _usersList = new address[](_to - _from);
    //     address[] memory users = _users;

    //     for (_from; _from <= _to; _from++) {
    //         StructAccount memory userRewardsAccount = _accounts[
    //             users[_from]
    //         ];
    //         StructMonthlyRewards memory rewardsAccount = _monthlyRewards[
    //             _rewardId
    //         ];
    //         StructAccount memory userAccount = IReferral(
    //             IVariables(_variablesContract).referralContract()
    //         ).getUserAccount(users[_from]);

    //         if (
    //             userRewardsAccount.selfBusiness >=
    //             rewardsAccount.selfBusinessLimit &&
    //             userRewardsAccount.directBusiness >=
    //             rewardsAccount.directBusinessLimit &&
    //             _isUserTeamBusinessForRewards(
    //                 userAccount,
    //                 rewardsAccount.teamBusinessLimit
    //             )
    //         ) {
    //             _usersList[_achieversListCount] = users[_from];
    //             _achieversListCount++;
    //         }
    //     }
    // }

    // function getRewardQualifiedUsersList(
    //     uint8 _rewardId,
    //     uint16 _from,
    //     uint16 _to
    // )
    //     external
    //     view
    //     returns (address[] memory _userAddress, uint16 _achieversListCount)
    // {
    //     (
    //         address[] memory _usersList,
    //         uint16 _usersCount
    //     ) = _getRewardQualifiedUsers(_rewardId, _from, _to);
    //     _achieversListCount = _usersCount;

    //     _userAddress = new address[](_usersCount);

    //     for (uint16 i; i < _usersCount; i++) {
    //         _userAddress[i] = _usersList[i];
    //     }
    // }

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
        isPayRewards = _isMonthRewardActive();
        variablesContract = _variablesContract;
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
