pragma solidity >=0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {

    string public name = "DApp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    //Stake/Deposit Tokens
    function stakeTokens(uint _amount) public {
        //Sanity check
        require(_amount > 0, 'amount cannot be 0');

        //Transfer mock dai to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update staking balance
        stakingBalance[msg.sender] += _amount;

        //Add users to stakers array if they arent already staked
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;

    }

    //Unstake/Withdraw Tokens
    function unstakeTokens() public {
        address staker = msg.sender;
        uint amount = stakingBalance[staker];
        if (amount > 0) {
            daiToken.transfer(staker, amount);
        }

        //Reset values
       stakingBalance[staker] = 0;
       isStaking[staker] = false;
        
    }

    //Issue reward tokens
    function issueTokens() public {

        require(msg.sender == owner, 'only owner can issue tokens');

        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint amount = stakingBalance[staker];
            if (amount > 0) {
                dappToken.transfer(staker, amount);
            }
                        
        }
    }
}
