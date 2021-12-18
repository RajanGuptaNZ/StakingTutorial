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
    

})