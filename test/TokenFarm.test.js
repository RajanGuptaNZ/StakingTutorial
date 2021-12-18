const { assert } = require('chai');
const _deploy_contracts = require('../migrations/2_deploy_contracts');

const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');

require ('chai')
    .use(require('chai-as-promised'))
    .should()


function tokens(n) {
    return  web3.utils.toWei(n, 'Ether')
}

contract('TokenFarm', ([owner, investor]) => {

    let daiToken, dappToken, tokenFarm;

    before(async() => {
        //Load contracts
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
        
        //Transfer all dappTokens to farm (1mil)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        //Send Dai tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner });


    })

    describe('Mock Dai Deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        })
    })

    describe('Dapp Deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        })
    })

    describe('TokenFarm Deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name();
            assert.equal(name, 'DApp Token Farm');
        })

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'));
        })
    })
    
    describe('Farming Tokens', async () => {
        it('rewards investors for staking mDai', async () => {
            let result;

            //Check investor balance for staking
            result = await daiToken.balanceOf(investor);

            assert.equal(result.toString(), tokens('100'), 'investor mDai balance incorrect BEFORE staking');

            //Stake mock dai
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            await tokenFarm.stakeTokens(tokens('100'), { from: investor });

            //Check staking result
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'investor mDai balance incorrect AFTER staking');

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('100'), 'token farm balance incorrect AFTER staking');

            result = await tokenFarm.isStaking(investor);
            assert.equal(result.toString(), 'true', 'token farm isStaking correct AFTER staking');

            //Issue tokens
            await tokenFarm.issueTokens({ from: owner });

            //Check balances
            result = await dappToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investpr DApp balance correct after issuing tokens')

            //Ensure only owner can issue
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            //Unstake
            await tokenFarm.unstakeTokens({ from: investor });

            //Check balances
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor mDai wallet balance correct after unstaking' )

            //Check Balances
            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('0'), 'investor staking (mDai) balance correct after unstaking' )

        })
    })

})