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

contract ReferralUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;

    address private _tokenContract;
    address private _presaleContract;
    address private _stakingContract;
    address private _usdtContract;

    address private _tokenSeller;

    uint256[] private _levelRateReferral;
    uint256[] private _levelRateStaking;
    uint256 private _levelDecimals;
    uint256 private _circularReferenceLevels;

    uint256 private _totalReferralPaidETH;
    uint256 private _totalReferralPaidUSD;
    uint256 private _totalReferralPaidStaking;

    address payable private _defaultReferrer;

    struct Account {
        address referrer;
        address[] referredAddresses;
        address[] teamAddress;
        uint256 totalBusinessETH;
        uint256 totalBusinessUSD;
        uint256[] rewardPaidETH;
        uint256[] rewardPaidUSD;
        uint256[] rewardPaidStaking;
        uint256[] rewardPaidTimeETH;
        uint256[] rewardPaidTimeUSD;
        uint256[] rewardPaidTimeStaking;
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

    function initialize() public initializer {
        _tokenSeller = 0xB35963E0AB2141cd4aB743e7a35d8772F3Cf0447;
        _tokenContract = 0x9C19247BD66F34e07c05beA8895D5D35dD49f253;
        _usdtContract = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
        _presaleContract = 0xD15A7571030817b0C6cF84e7a130C492c4997A5f;
        _stakingContract;

        _defaultReferrer = payable(0xB35963E0AB2141cd4aB743e7a35d8772F3Cf0447);
        _levelDecimals = 1000;
        _levelRateReferral = [50, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
        _levelRateStaking = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
        _circularReferenceLevels = 11;

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

    function getLevelDecimals() external view returns (uint256) {
        return _levelDecimals;
    }

    function setLevelDecimals(
        uint256 _value
    ) external onlyOwner returns (bool) {
        _levelDecimals = _value;
        return true;
    }

    function getLevelRates()
        external
        view
        returns (
            uint256[] memory presale,
            uint256 totalRatePresale,
            uint256[] memory staking,
            uint256 totalRateStaking
        )
    {
        presale = _levelRateReferral;
        uint256 presaleRateLength = presale.length;
        for (uint8 i; i < presaleRateLength; i++) {
            totalRatePresale += presale[i];
        }
        staking = _levelRateStaking;
        uint256 stakingRateLength = staking.length;
        for (uint8 i; i < stakingRateLength; i++) {
            totalRateStaking += staking[i];
        }
    }

    function setLevelRateReferral(
        uint256[] calldata _value
    ) external onlyOwner returns (bool) {
        _levelRateReferral = _value;
        return true;
    }

    function setLevelRateStaking(
        uint256[] calldata _value
    ) external onlyOwner returns (bool) {
        _levelRateStaking = _value;
        return true;
    }

    function getCircularReferenceLevels() external view returns (uint256) {
        return _circularReferenceLevels;
    }

    function setCircularReferenceLevels(
        uint256 _value
    ) external onlyOwner returns (uint256) {
        return _circularReferenceLevels = _value;
    }

    function getTokenSeller() external view returns (address) {
        return _tokenSeller;
    }

    function setTokenSeller(address _address) external onlyOwner {
        _tokenSeller = _address;
    }

    function getDefaultReferrer() public view returns (address) {
        return _defaultReferrer;
    }

    function setDefaultReferrer(address payable _address) public onlyOwner {
        _defaultReferrer = _address;
    }

    function getTokenContract()
        external
        view
        returns (
            address tokenAddress,
            string memory tokenName,
            uint256 tokenDecimals,
            uint256 tokenSupply
        )
    {
        tokenAddress = _tokenContract;
        tokenName = IERC20_EXTENDED(_tokenContract).name();
        tokenDecimals = IERC20_EXTENDED(_tokenContract).decimals();
        tokenSupply = IERC20Upgradeable(_tokenContract).totalSupply();
    }

    function setTokenContractAdmin(
        address _address
    ) external onlyOwner returns (bool) {
        _tokenContract = _address;
        return true;
    }

    function getUSDTContract()
        external
        view
        returns (
            address USDTAddress,
            string memory USDTName,
            uint256 USDTDecimals,
            uint256 USDTSupply
        )
    {
        USDTAddress = _usdtContract;
        USDTName = IERC20_EXTENDED(_usdtContract).name();
        USDTDecimals = IERC20_EXTENDED(_usdtContract).decimals();
        USDTSupply = IERC20Upgradeable(_usdtContract).totalSupply();
    }

    function setUSDTContractAdmin(
        address _address
    ) external onlyOwner returns (bool) {
        _usdtContract = _address;
        return true;
    }

    function getPresaleContract() external view returns (address) {
        return _presaleContract;
    }

    function setPresaleContract(
        address _address
    ) external onlyOwner returns (address) {
        return _presaleContract = _address;
    }

    function getStakingContract() external view returns (address) {
        return _stakingContract;
    }

    function setStakingContract(
        address _address
    ) external onlyOwner returns (address) {
        return _stakingContract = _address;
    }

    function getUserReferrerAddress(
        address _address
    ) external view returns (address referrer) {
        Account storage userAccount = accounts[_address];
        referrer = userAccount.referrer;
    }

    function getUserReferee(
        address _address
    )
        external
        view
        returns (address[] memory userRefereeAddress, uint256 userRefereeCount)
    {
        Account storage userAccount = accounts[_address];
        userRefereeAddress = userAccount.referredAddresses;
        userRefereeCount = userRefereeAddress.length;
    }

    function getUserTeamReferee(
        address _address
    )
        external
        view
        returns (
            address[] memory userTeamReferees,
            uint256 userTeamRefereeCount
        )
    {
        Account storage userAccount = accounts[_address];
        userTeamReferees = userAccount.teamAddress;
        userTeamRefereeCount = userTeamReferees.length;
    }

    function getUserRewardPaid(
        address _address
    )
        external
        view
        returns (
            uint256[] memory rewardPaidETH,
            uint256[] memory rewardPaidUSD,
            uint256[] memory rewardPaidStaking
        )
    {
        Account storage userAccount = accounts[_address];
        rewardPaidETH = userAccount.rewardPaidETH;
        rewardPaidUSD = userAccount.rewardPaidUSD;
        rewardPaidStaking = userAccount.rewardPaidStaking;
    }

    function getUserRewardPaidTimestamp(
        address _address
    )
        external
        view
        returns (
            uint256[] memory rewardPaidTimeETH,
            uint256[] memory rewardPaidTimeUSD,
            uint256[] memory rewardPaidTimeStaking
        )
    {
        Account storage userAccount = accounts[_address];
        rewardPaidTimeETH = userAccount.rewardPaidTimeETH;
        rewardPaidTimeUSD = userAccount.rewardPaidTimeUSD;
        rewardPaidTimeStaking = userAccount.rewardPaidTimeStaking;
    }

    function getUserTotalRewardPaid(
        address _address
    )
        external
        view
        returns (
            uint256 rewardPaidETH,
            uint256 rewardPaidUSD,
            uint256 rewardPaidStaking
        )
    {
        Account storage userAccount = accounts[_address];
        uint256 ethLength = userAccount.rewardPaidETH.length;
        uint256 USDLength = userAccount.rewardPaidUSD.length;
        uint256 stakingLength = userAccount.rewardPaidStaking.length;

        for (uint256 i; i < ethLength; i++) {
            rewardPaidETH += userAccount.rewardPaidETH[i];
        }

        for (uint256 i; i < USDLength; i++) {
            rewardPaidUSD += userAccount.rewardPaidUSD[i];
        }

        for (uint256 i; i < stakingLength; i++) {
            rewardPaidStaking += userAccount.rewardPaidStaking[i];
        }
    }

    function getUserTotalBusiness(
        address _address
    ) external view returns (uint256 businessETH, uint256 businessUSD) {
        Account storage userAccount = accounts[_address];
        businessETH = userAccount.totalBusinessETH;
        businessUSD = userAccount.totalBusinessUSD;
    }

    function _hasReferrer(address _address) private view returns (bool) {
        return accounts[_address].referrer != address(0);
    }

    function _isCircularReference(
        address referrer,
        address referee
    ) private view returns (bool) {
        require(referrer != address(0), "Address cannot be 0x0.");
        address parent = referrer;

        for (uint256 i; i < _circularReferenceLevels; i++) {
            if (parent == referee) {
                return true;
            }

            parent = accounts[parent].referrer;
        }

        return false;
    }

    function _addReferrer(
        address _address,
        address _referrer
    ) private returns (bool) {
        if (_isCircularReference(_referrer, _address)) {
            emit RegisterRefererFailed(
                _address,
                _referrer,
                "Referee cannot be one of referrer uplines."
            );
            return false;
        } else if (accounts[_address].referrer != address(0)) {
            emit RegisterRefererFailed(
                _address,
                _referrer,
                "Address already have referrer."
            );
            return false;
        }

        Account storage userAccount = accounts[_address];
        Account storage referrerAccount = accounts[_referrer];
        userAccount.referrer = payable(_referrer);
        referrerAccount.referredAddresses.push(_address);
        emit RegisteredReferer(_referrer, _address);

        for (uint256 i; i < _levelRateStaking.length; i++) {
            Account storage referrerParentAddress = accounts[
                referrerAccount.referrer
            ];

            if (referrerAccount.referrer == address(0)) {
                break;
            }

            referrerParentAddress.teamAddress.push(_address);

            referrerAccount = referrerParentAddress;
            emit RegisteredTeamAddress(
                referrerAccount.referrer,
                _referrer,
                _address
            );
        }
        return true;
    }

    function _transferTokensFrom(
        address _tokenContractAddress,
        address _ownerAddress,
        address _to,
        uint256 _tokenValue
    ) private {
        IERC20Upgradeable(_tokenContractAddress).transferFrom(
            _ownerAddress,
            _to,
            _tokenValue
        );
    }

    function _payReferralInETH(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) private {
        if (!_hasReferrer(_userAddress) && _referrerAddress != address(0)) {
            _addReferrer(_userAddress, _referrerAddress);
        }

        if (!_hasReferrer(_referrerAddress) && _referrerAddress != address(0)) {
            _addReferrer(_referrerAddress, _defaultReferrer);
        }
        Account memory userAccount = accounts[_userAddress];
        uint256 totalReferral;

        for (uint256 i; i < _levelRateReferral.length; i++) {
            address referrer = userAccount.referrer;

            Account storage referrerAccount = accounts[userAccount.referrer];

            if (referrer == address(0)) {
                break;
            }

            uint256 c = _value.mul(_levelRateReferral[i]).div(_levelDecimals);
            referrerAccount.totalBusinessETH += _value;
            referrerAccount.rewardPaidETH.push(c);
            referrerAccount.rewardPaidTimeETH.push(block.timestamp);
            totalReferral += c;
            payable(referrer).transfer(c);

            emit ReferralRewardPaid(_userAddress, referrer, c, i + 1, "ETH");

            userAccount = referrerAccount;
        }

        _totalReferralPaidETH += totalReferral;
    }

    function hasReferrer(address _address) external view returns (bool) {
        return _hasReferrer(_address);
    }

    function addReferrerAdmin(
        address _userAddress,
        address _referrerAddress
    ) external returns (bool) {
        require(
            msg.sender == owner() ||
                msg.sender == _presaleContract ||
                msg.sender == _stakingContract,
            "Only owner can call this function."
        );

        return _addReferrer(_userAddress, _referrerAddress);
    }

    function payReferralETHAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external returns (bool) {
        address _msgSender = msg.sender;
        require(
            _msgSender == owner() || _msgSender == _presaleContract,
            "Only owner can call this function."
        );
        _payReferralInETH(_value, _userAddress, _referrerAddress);
        return true;
    }

    function _payReferralInUSD(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) private {
        if (!_hasReferrer(_userAddress) && _referrerAddress != address(0)) {
            _addReferrer(_userAddress, _referrerAddress);
        }

        if (!_hasReferrer(_referrerAddress) && _referrerAddress != address(0)) {
            _addReferrer(_referrerAddress, _defaultReferrer);
        }
        Account memory userAccount = accounts[_userAddress];
        uint256 totalReferral;

        for (uint256 i; i < _levelRateReferral.length; i++) {
            address referrer = userAccount.referrer;
            Account storage referrerAccount = accounts[userAccount.referrer];

            if (referrer == address(0)) {
                break;
            }

            uint256 c = _value.mul(_levelRateReferral[i]).div(_levelDecimals);

            referrerAccount.totalBusinessUSD += _value;
            referrerAccount.rewardPaidUSD.push(c);
            referrerAccount.rewardPaidTimeUSD.push(block.timestamp);
            totalReferral += c;

            IERC20Upgradeable(_usdtContract).transfer(referrer, c);

            emit ReferralRewardPaid(_userAddress, referrer, c, i + 1, "USDT");
            userAccount = referrerAccount;
        }

        _totalReferralPaidUSD += totalReferral;
    }

    function payReferralUSDAdmin(
        uint256 _value,
        address _userAddress,
        address _referralAddress
    ) external returns (bool) {
        address _msgSender = msg.sender;
        require(
            _msgSender == owner() || _msgSender == _presaleContract,
            "Only owner can call this function."
        );
        _payReferralInUSD(_value, _userAddress, _referralAddress);
        return true;
    }

    function _payReferralStaking(
        uint256 value,
        address _referee,
        address _payReferralInStakingContract
    ) private {
        Account memory userAccount = accounts[_referee];
        uint256 totalReferral;

        for (uint256 i; i < _levelRateStaking.length; i++) {
            address referrer = userAccount.referrer;
            Account storage referrerAccount = accounts[userAccount.referrer];

            if (referrer == address(0)) {
                break;
            }

            uint256 c = value.mul(_levelRateStaking[i]).div(_levelDecimals);

            referrerAccount.rewardPaidStaking.push(c);
            referrerAccount.rewardPaidTimeStaking.push(block.timestamp);
            totalReferral += c;

            _transferTokensFrom(
                _payReferralInStakingContract,
                _tokenSeller,
                referrer,
                c
            );

            emit ReferralRewardPaid(_referee, referrer, c, i + 1, "Staking");
            userAccount = referrerAccount;
        }

        _totalReferralPaidStaking += totalReferral;
    }

    function payStakingReferralAdmin(
        uint256 _value,
        address _referee
    ) external returns (bool) {
        address _msgSender = msg.sender;
        require(
            _msgSender == owner() || _msgSender == _stakingContract,
            "Only owner can call this function."
        );
        _payReferralStaking(_value, _referee, _tokenContract);
        return true;
    }

    function payStakingReferralInUSDTAdmin(
        uint256 _value,
        address _referee
    ) external returns (bool) {
        address _msgSender = msg.sender;
        require(
            _msgSender == owner() || _msgSender == _stakingContract,
            "Only owner can call this function."
        );
        _payReferralStaking(_value, _referee, _usdtContract);
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

    function transferLiquidity(
        address _address,
        uint256 _value
    ) external onlyOwner {
        payable(_address).transfer(_value);
    }

    function liquidity() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function liquidityToken(
        address _tokenAddress,
        uint256 _value
    ) external onlyOwner {
        IERC20Upgradeable(_tokenAddress).transfer(msg.sender, _value);
    }
}
