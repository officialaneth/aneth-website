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
        uint256 totalBusinessANUSD;
        uint256[] rewardsPaidANUSD;
        bool isInGlobalID;
        uint256[] rewardsPaidGlobal;
        uint256[] blockNumbers;
    }

    mapping(address => Account) private accounts;

    event RegisteredReferer(address indexed referrer, address indexed referee);

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

    function initialize() public initializer {
        _variablesContract = 0xbE5153baa3756402b08fD830E7b5F00a76E68231;
        _defaultReferrer = payable(0xB35963E0AB2141cd4aB743e7a35d8772F3Cf0447);
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

    function getUserRewardPaid(
        address _address
    )
        external
        view
        returns (uint256[] memory rewardANUSD, uint256[] memory globalRewards)
    {
        Account storage userAccount = accounts[_address];
        rewardANUSD = userAccount.rewardsPaidANUSD;
        globalRewards = userAccount.rewardsPaidGlobal;
    }

    function userTransactionsBlocks(
        address _address
    ) external view returns (uint256[] memory) {
        Account storage userAccount = accounts[_address];
        return userAccount.blockNumbers;
    }

    function getUserTotalRewardPaid(
        address _address
    ) external view returns (uint256 rewardsAUSD, uint256 rewardsGlobal) {
        Account storage userAccount = accounts[_address];
        uint256 ausdlength = userAccount.rewardsPaidANUSD.length;
        uint256 globalLength = userAccount.rewardsPaidGlobal.length;

        for (uint256 i; i < ausdlength; i++) {
            rewardsAUSD += userAccount.rewardsPaidANUSD[i];
        }

        for (uint256 i; i < globalLength; i++) {
            rewardsGlobal += userAccount.rewardsPaidGlobal[i];
        }
    }

    function getUserTotalBusiness(
        address _address
    ) external view returns (uint256) {
        Account storage userAccount = accounts[_address];
        return userAccount.totalBusinessANUSD;
    }

    function _hasReferrer(address _address) private view returns (bool) {
        return accounts[_address].referrer != address(0);
    }

    function _addReferrer(address _address, address _referrer) private {
        if (accounts[_address].referrer != address(0)) {
            emit RegisterRefererFailed(
                _address,
                _referrer,
                "Address already have referrer."
            );
        }

        Account storage userAccount = accounts[_address];
        Account storage referrerAccount = accounts[_referrer];
        userAccount.referrer = payable(_referrer);
        referrerAccount.referee.push(_address);
        emit RegisteredReferer(_referrer, _address);

        for (uint256 i; i < _levelRates.length; i++) {
            Account storage referrerParentAddress = accounts[
                referrerAccount.referrer
            ];

            if (referrerAccount.referrer == address(0)) {
                break;
            }

            referrerParentAddress.team.push(_address);

            referrerAccount = referrerParentAddress;
            emit RegisteredTeamAddress(
                referrerAccount.referrer,
                _referrer,
                _address
            );
        }
    }

    function hasReferrer(address _address) external view returns (bool) {
        return _hasReferrer(_address);
    }

    function addReferrerAdmin(
        address _userAddress,
        address _referrerAddress
    ) external {
        IVariables variables = IVariables(_variablesContract);
        require(
            msg.sender == owner() || msg.sender == variables.presaleContract(),
            "Only owner can call this function."
        );

        _addReferrer(_userAddress, _referrerAddress);
    }

    function _payReferralInANUSD(
        uint256 _valueInWei,
        address _userAddress
    ) private {
        IVariables variables = IVariables(_variablesContract);

        uint256[] memory levelRates = _levelRates;

        Account memory userAccount = accounts[_userAddress];

        address[] memory passiveIncomeAddress = new address[](
            _passiveIncomeLevels
        );

        uint256 passiveIncomeAddressCount;

        address[] memory coreMembers = _coreMembers;
        uint256 coreMembersCount = coreMembers.length;

        uint256 totalReferral;

        for (uint256 i; i < _passiveIncomeLevels; i++) {
            address referrer = userAccount.referrer;
            Account storage referrerAccount = accounts[userAccount.referrer];
            if (referrer == address(0)) {
                break;
            }

            if (!referrerAccount.isInGlobalID) {
                if (
                    _userDirectBusinessIsAbove(referrer, _globalBusinessValue)
                ) {
                    _globalAddress.push(referrer);
                    referrerAccount.isInGlobalID = true;
                    emit GlobalAddressAdded(referrer);
                }
            }

            if (_userDirectBusinessIsAbove(referrer, _passiveBusinessValue)) {
                passiveIncomeAddress[passiveIncomeAddressCount] = referrer;
                passiveIncomeAddressCount++;
            }

            if (i < levelRates.length) {
                uint256 c = (_valueInWei * levelRates[i]) / 100;
                referrerAccount.totalBusinessANUSD += _valueInWei;
                referrerAccount.rewardsPaidANUSD.push(c);
                referrerAccount.blockNumbers.push(block.number);
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
            }

            userAccount = referrerAccount;
        }

        if (passiveIncomeAddressCount > 0) {
            uint256 passiveIncomeValue = (_valueInWei * _passiveIncomeRate) /
                100 /
                passiveIncomeAddressCount;
            for (uint256 i; i < passiveIncomeAddressCount; i++) {
                IERC20Upgradeable(variables.anusdContract()).transfer(
                    passiveIncomeAddress[i],
                    passiveIncomeValue
                );

                emit PassiveRewardPaid(
                    passiveIncomeValue,
                    passiveIncomeAddress[i]
                );
            }
        }

        if (_globalAddress.length > 0) {
            uint256 globalIncome = (_valueInWei * _globalRewardRate) /
                100 /
                _globalAddress.length;
            uint index = uint(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % _globalAddress.length;

            IERC20Upgradeable(variables.anusdContract()).transfer(
                _globalAddress[index],
                globalIncome
            );

            emit GlobalRewardPaid(globalIncome, _globalAddress[index]);
        }

        if (coreMembersCount > 0) {
            uint256 coreRewardValue = (_valueInWei * _coreRewardRate) /
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
        uint256 _value,
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

        if (!_hasReferrer(_referrerAddress) && _referrerAddress != address(0)) {
            _addReferrer(_referrerAddress, _defaultReferrer);
        }

        _payReferralInANUSD(_value, _userAddress);
    }

    function _userDirectBusinessIsAbove(
        address _userAddress,
        uint256 _valueToCompare
    ) public view returns (bool) {
        address[] memory userRefereeList = accounts[_userAddress].referee;
        uint256 userRefereeCount = userRefereeList.length;
        uint256 userRefereeTotalBusiness;

        for (uint256 i; i < userRefereeCount; i++) {
            userRefereeTotalBusiness += accounts[userRefereeList[i]]
                .totalBusinessANUSD;
        }

        return userRefereeTotalBusiness > _valueToCompare ? true : false;
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
