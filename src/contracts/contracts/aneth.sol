// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @custom:security-contact security@aneth.io
contract aneth is ERC20 {
    constructor() ERC20("an.eth", "an.eth") {
        _mint(
            0xF3Ba579d4aFD4dAd8a8C2d1bcbdd1405688e492f,
            210000000 * 10 ** decimals()
        );
    }
}
