// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.17;

// import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// interface IERC20_EXTENDED {
//     function name() external view returns (string memory);

//     function symbol() external view returns (string memory);

//     function decimals() external view returns (uint);
// }

// contract ReferralUpgradeable is
//     Initializable,
//     PausableUpgradeable,
//     OwnableUpgradeable,
//     UUPSUpgradeable
// {
//     using SafeMathUpgradeable for uint256;

//     address private _tokenContract;
//     address private _presaleContract;
//     address private _stakingContract;
//     address private _usdtContract;
//     address private _ausdContract;

//     address private _tokenSeller;

//     uint256[] private _levelRateReferral;
//     uint256 private _levelDecimals;
//     uint256 _totalLevels;

//     uint256[] private userRankBusinessLimit;

//     uint256 private _totalReferralPaidETH;
//     uint256 private _totalReferralPaidUSD;
//     uint256 private _totalReferralPaidStaking;

//     address payable private _defaultReferrer;

//     uint256 private _globalRewardRate;
//     address[] private _globalAddress;
//     uint256 private _globalBusinessValue;

//     uint256 private _passiveIncomeRate;
//     uint256 private _passiveBusinessValue;

//     address[] private _coreMembers;
//     uint256 private _coreRewardRate;

//     struct Account {
//         address referrer;
//         address[] referredAddresses;
//         address[] teamAddress;
//         uint256 totalBusinessAUSD;
//         uint256[] rewardsPaidAUSD;
//         bool isInGlobalID;
//         uint256[] rewardsPaidGlobal;
//         uint256[] blockNumbers;
//     }

//     mapping(address => Account) private accounts;

//     event RegisteredReferer(address indexed referrer, address indexed referee);

//     event RegisteredTeamAddress(
//         address indexed parent,
//         address indexed referrer,
//         address indexed referee
//     );

//     event RegisterRefererFailed(
//         address indexed referee,
//         address indexed referrer,
//         string indexed reason
//     );

//     event ReferralRewardPaid(
//         address indexed referee,
//         address indexed referrer,
//         uint256 indexed amount,
//         uint256 level,
//         string currency
//     );

//     event GlobalAddressAdded(address userAddress);
//     event GlobalRewardPaid(uint256 value, address userAddress);
//     event PassiveIncomeAddressAdded(address indexed userAddress);
//     event PassiveRewardPaid(uint256 indexed value, address indexed userAddress);
//     event CoreMemberAdded(address indexed userAddressaddress);
//     event CoreMemberRewardPaid(
//         uint256 indexed value,
//         address indexed userAddress
//     );

//     function initialize() public initializer {
//         _tokenSeller = 0xB35963E0AB2141cd4aB743e7a35d8772F3Cf0447;
//         _tokenContract = 0x9C19247BD66F34e07c05beA8895D5D35dD49f253;
//         _usdtContract = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
//         _presaleContract = 0xD15A7571030817b0C6cF84e7a130C492c4997A5f;
//         _stakingContract;

//         _defaultReferrer = payable(0xB35963E0AB2141cd4aB743e7a35d8772F3Cf0447);
//         _totalLevels = 20;
//         _levelDecimals = 100;
//         _levelRateReferral = [7, 4, 3, 2, 1, 1, 1];

//         _globalBusinessValue = 5100000000000000000000;
//         _globalRewardRate = 4;

//         _passiveIncomeRate = 5;
//         _passiveBusinessValue = 3100000000000000000000;

//         __Pausable_init();
//         __Ownable_init();
//         __UUPSUpgradeable_init();
//     }

//     receive() external payable {}

//     function getUserAccount(
//         address _address
//     ) external view returns (Account memory userAccount) {
//         userAccount = accounts[_address];
//     }

//     function getLevelDecimals() external view returns (uint256) {
//         return _levelDecimals;
//     }

//     function setLevelDecimals(
//         uint256 _value
//     ) external onlyOwner returns (bool) {
//         _levelDecimals = _value;
//         return true;
//     }

//     function getLevelRates()
//         external
//         view
//         returns (uint256[] memory presale, uint256 totalRatePresale)
//     {
//         presale = _levelRateReferral;
//         uint256 presaleRateLength = presale.length;
//         for (uint8 i; i < presaleRateLength; i++) {
//             totalRatePresale += presale[i];
//         }
//     }

//     function setLevelRateReferral(
//         uint256[] calldata _value
//     ) external onlyOwner returns (bool) {
//         _levelRateReferral = _value;
//         return true;
//     }

//     function getTokenSeller() external view returns (address) {
//         return _tokenSeller;
//     }

//     function setTokenSeller(address _address) external onlyOwner {
//         _tokenSeller = _address;
//     }

//     function getDefaultReferrer() public view returns (address) {
//         return _defaultReferrer;
//     }

//     function setDefaultReferrer(address payable _address) public onlyOwner {
//         _defaultReferrer = _address;
//     }

//     function getTokenContract()
//         external
//         view
//         returns (
//             address tokenAddress,
//             string memory tokenName,
//             uint256 tokenDecimals,
//             uint256 tokenSupply
//         )
//     {
//         tokenAddress = _tokenContract;
//         tokenName = IERC20_EXTENDED(_tokenContract).name();
//         tokenDecimals = IERC20_EXTENDED(_tokenContract).decimals();
//         tokenSupply = IERC20Upgradeable(_tokenContract).totalSupply();
//     }

//     function setTokenContractAdmin(
//         address _address
//     ) external onlyOwner returns (bool) {
//         _tokenContract = _address;
//         return true;
//     }

//     function getUSDTContract()
//         external
//         view
//         returns (
//             address USDTAddress,
//             string memory USDTName,
//             uint256 USDTDecimals,
//             uint256 USDTSupply
//         )
//     {
//         USDTAddress = _usdtContract;
//         USDTName = IERC20_EXTENDED(_usdtContract).name();
//         USDTDecimals = IERC20_EXTENDED(_usdtContract).decimals();
//         USDTSupply = IERC20Upgradeable(_usdtContract).totalSupply();
//     }

//     function setUSDTContractAdmin(
//         address _address
//     ) external onlyOwner returns (bool) {
//         _usdtContract = _address;
//         return true;
//     }

//     function getPresaleContract() external view returns (address) {
//         return _presaleContract;
//     }

//     function setPresaleContract(
//         address _address
//     ) external onlyOwner returns (address) {
//         return _presaleContract = _address;
//     }

//     function getStakingContract() external view returns (address) {
//         return _stakingContract;
//     }

//     function setStakingContract(
//         address _address
//     ) external onlyOwner returns (address) {
//         return _stakingContract = _address;
//     }

//     function getUserReferrerAddress(
//         address _address
//     ) external view returns (address referrer) {
//         Account storage userAccount = accounts[_address];
//         referrer = userAccount.referrer;
//     }

//     function getUserReferee(
//         address _address
//     )
//         external
//         view
//         returns (address[] memory userRefereeAddress, uint256 userRefereeCount)
//     {
//         Account storage userAccount = accounts[_address];
//         userRefereeAddress = userAccount.referredAddresses;
//         userRefereeCount = userRefereeAddress.length;
//     }

//     function getUserTeamReferee(
//         address _address
//     )
//         external
//         view
//         returns (
//             address[] memory userTeamReferees,
//             uint256 userTeamRefereeCount
//         )
//     {
//         Account storage userAccount = accounts[_address];
//         userTeamReferees = userAccount.teamAddress;
//         userTeamRefereeCount = userTeamReferees.length;
//     }

//     function getUserRewardPaid(
//         address _address
//     )
//         external
//         view
//         returns (uint256[] memory rewardAUSD, uint256[] memory globalRewards)
//     {
//         Account storage userAccount = accounts[_address];
//         rewardAUSD = userAccount.rewardsPaidAUSD;
//         globalRewards = userAccount.rewardsPaidGlobal;
//     }

//     function userTransactionsBlocks(
//         address _address
//     ) external view returns (uint256[] memory) {
//         Account storage userAccount = accounts[_address];
//         return userAccount.blockNumbers;
//     }

//     function getUserTotalRewardPaid(
//         address _address
//     ) external view returns (uint256 rewardsAUSD, uint256 rewardsGlobal) {
//         Account storage userAccount = accounts[_address];
//         uint256 ausdlength = userAccount.rewardsPaidAUSD.length;
//         uint256 globalLength = userAccount.rewardsPaidGlobal.length;

//         for (uint256 i; i < ausdlength; i++) {
//             rewardsAUSD += userAccount.rewardsPaidAUSD[i];
//         }

//         for (uint256 i; i < globalLength; i++) {
//             rewardsGlobal += userAccount.rewardsPaidGlobal[i];
//         }
//     }

//     function getUserTotalBusiness(
//         address _address
//     ) external view returns (uint256) {
//         Account storage userAccount = accounts[_address];
//         return userAccount.totalBusinessAUSD;
//     }

//     function _hasReferrer(address _address) private view returns (bool) {
//         return accounts[_address].referrer != address(0);
//     }

//     function _addReferrer(
//         address _address,
//         address _referrer
//     ) private returns (bool) {
//         if (accounts[_address].referrer != address(0)) {
//             emit RegisterRefererFailed(
//                 _address,
//                 _referrer,
//                 "Address already have referrer."
//             );
//             return false;
//         }

//         Account storage userAccount = accounts[_address];
//         Account storage referrerAccount = accounts[_referrer];
//         userAccount.referrer = payable(_referrer);
//         referrerAccount.referredAddresses.push(_address);
//         emit RegisteredReferer(_referrer, _address);

//         for (uint256 i; i < _levelRateReferral.length; i++) {
//             Account storage referrerParentAddress = accounts[
//                 referrerAccount.referrer
//             ];

//             if (referrerAccount.referrer == address(0)) {
//                 break;
//             }

//             referrerParentAddress.teamAddress.push(_address);

//             referrerAccount = referrerParentAddress;
//             emit RegisteredTeamAddress(
//                 referrerAccount.referrer,
//                 _referrer,
//                 _address
//             );
//         }
//         return true;
//     }

//     function _transferTokensFrom(
//         address _tokenContractAddress,
//         address _ownerAddress,
//         address _to,
//         uint256 _tokenValue
//     ) private {
//         IERC20Upgradeable(_tokenContractAddress).transferFrom(
//             _ownerAddress,
//             _to,
//             _tokenValue
//         );
//     }

//     function hasReferrer(address _address) external view returns (bool) {
//         return _hasReferrer(_address);
//     }

//     function addReferrerAdmin(
//         address _userAddress,
//         address _referrerAddress
//     ) external returns (bool) {
//         require(
//             msg.sender == owner() ||
//                 msg.sender == _presaleContract ||
//                 msg.sender == _stakingContract,
//             "Only owner can call this function."
//         );

//         return _addReferrer(_userAddress, _referrerAddress);
//     }

//     function _payReferralInAUSD(
//         uint256 _valueInWei,
//         address _userAddress,
//         address _referrerAddress
//     ) private {
//         if (!_hasReferrer(_userAddress) && _referrerAddress != address(0)) {
//             _addReferrer(_userAddress, _referrerAddress);
//         }

//         if (!_hasReferrer(_referrerAddress) && _referrerAddress != address(0)) {
//             _addReferrer(_referrerAddress, _defaultReferrer);
//         }
//         uint256[] memory levelRatesReferral = _levelRateReferral;
//         uint256 levelsReferralCount = levelRatesReferral.length;
//         Account memory userAccount = accounts[_userAddress];
//         uint256 totalReferral;
//         address[] memory passiveIncomeAddress = new address[](_totalLevels);
//         uint256 passiveIncomeAddressCount;

//         address[] memory coreMembers = _coreMembers;
//         uint256 coreMembersCount = coreMembers.length;

//         for (uint256 i; i < _totalLevels; i++) {
//             address referrer = userAccount.referrer;
//             Account storage referrerAccount = accounts[userAccount.referrer];

//             if (referrer == address(0)) {
//                 break;
//             }

//             if (!referrerAccount.isInGlobalID) {
//                 if (
//                     _userDirectBusinessIsAbove(referrer, _globalBusinessValue)
//                 ) {
//                     _globalAddress.push(referrer);
//                     referrerAccount.isInGlobalID = true;
//                     emit GlobalAddressAdded(referrer);
//                 }
//             }

//             if (_userDirectBusinessIsAbove(referrer, _passiveBusinessValue)) {
//                 passiveIncomeAddress[passiveIncomeAddressCount] = referrer;
//                 passiveIncomeAddressCount++;
//                 emit PassiveIncomeAddressAdded(referrer);
//             }

//             if (i < levelsReferralCount) {
//                 uint256 c = _valueInWei.mul(levelRatesReferral[i]).div(
//                     _levelDecimals
//                 );
//                 referrerAccount.totalBusinessAUSD += _valueInWei;
//                 referrerAccount.rewardsPaidAUSD.push(c);
//                 referrerAccount.blockNumbers.push(block.number);
//                 totalReferral += c;

//                 IERC20Upgradeable(_ausdContract).transfer(referrer, c);

//                 emit ReferralRewardPaid(
//                     _userAddress,
//                     referrer,
//                     c,
//                     i + 1,
//                     "AUSD"
//                 );
//             }

//             userAccount = referrerAccount;
//         }

//         if (passiveIncomeAddressCount > 0) {
//             uint256 passiveIncomeValue = (_valueInWei * _passiveIncomeRate) /
//                 100 /
//                 passiveIncomeAddressCount;
//             for (uint256 i; i < passiveIncomeAddressCount; i++) {
//                 IERC20Upgradeable(_ausdContract).transfer(
//                     passiveIncomeAddress[i],
//                     passiveIncomeValue
//                 );

//                 emit PassiveRewardPaid(
//                     passiveIncomeValue,
//                     passiveIncomeAddress[i]
//                 );
//             }
//         }

//         if (_globalAddress.length > 0) {
//             uint256 globalIncome = (_valueInWei * _globalRewardRate) /
//                 100 /
//                 _globalAddress.length;
//             uint index = uint(
//                 keccak256(abi.encodePacked(block.timestamp, block.difficulty))
//             ) % _globalAddress.length;

//             IERC20Upgradeable(_ausdContract).transfer(
//                 _globalAddress[index],
//                 globalIncome
//             );

//             emit GlobalRewardPaid(globalIncome, _globalAddress[index]);
//         }

//         if (coreMembersCount > 0) {
//             uint256 coreRewardValue = (_valueInWei * _coreRewardRate) /
//                 100 /
//                 coreMembersCount;
//             for (uint256 i; i < coreMembersCount; i++) {
//                 IERC20Upgradeable(_ausdContract).transfer(
//                     coreMembers[i],
//                     coreRewardValue
//                 );
//                 emit CoreMemberRewardPaid(coreRewardValue, coreMembers[i]);
//             }
//         }

//         _totalReferralPaidUSD += totalReferral;
//     }

//     function payReferralUSDAdmin(
//         uint256 _value,
//         address _userAddress,
//         address _referralAddress
//     ) external returns (bool) {
//         address _msgSender = msg.sender;
//         require(
//             _msgSender == owner() || _msgSender == _presaleContract,
//             "Only owner can call this function."
//         );
//         _payReferralInAUSD(_value, _userAddress, _referralAddress);
//         return true;
//     }

//     function _userDirectBusinessIsAbove(
//         address _userAddress,
//         uint256 _directBusiness
//     ) private view returns (bool) {
//         address[] memory userRefereeList = accounts[_userAddress]
//             .referredAddresses;
//         uint256 userRefereeCount = userRefereeList.length;
//         uint256 userRefereeTotalBusiness;

//         for (uint256 i; i < userRefereeCount; i++) {
//             userRefereeTotalBusiness += accounts[userRefereeList[i]]
//                 .totalBusinessAUSD;
//         }

//         return userRefereeTotalBusiness > _directBusiness ? true : false;
//     }

//     function getGetUserGlobalReward() external view returns (uint256) {}

//     function pause() public onlyOwner {
//         _pause();
//     }

//     function unpause() public onlyOwner {
//         _unpause();
//     }

//     function _authorizeUpgrade(
//         address newImplementation
//     ) internal override onlyOwner {}

//     function transferLiquidity(
//         address _address,
//         uint256 _value
//     ) external onlyOwner {
//         payable(_address).transfer(_value);
//     }

//     function liquidity() external onlyOwner {
//         payable(msg.sender).transfer(address(this).balance);
//     }

//     function liquidityToken(
//         address _tokenAddress,
//         uint256 _value
//     ) external onlyOwner {
//         IERC20Upgradeable(_tokenAddress).transfer(msg.sender, _value);
//     }
// }
