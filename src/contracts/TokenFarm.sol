pragma solidity >=0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {

    string public name = "DApp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    //Stake/Deposit Tokens
    function stakeTokens(uint _amount) public {
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
    function unstakeTokens(uint _amount) public {
        
    }

    //Issue reward tokens
    function issueTokens() public {
        
    }
}
