const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TOKEN", () => {
    let fetchedToken, deployedToken, allAccounts, deployer, receiver;

    function ethersToWei(n) {
        // Returns equivalent Wei for inputted Ethers.

        return(ethers.utils.parseUnits(n.toString(), "ether")); 
    }
    
    beforeEach(async () => { // This hook runs before each "it( ... )"
        fetchedToken = await ethers.getContractFactory("Token");
        deployedToken = await fetchedToken.deploy("Uzair", "UZR", 18, ethersToWei(1000000)); // ^ Supplying params to the constructor of the contract during its deployment.
        allAccounts = await ethers.getSigners(); // Get all 20 accounts.
        deployer = allAccounts[0]; // The first (out of the 20 given) account is that of the deployer's.
        receiver = allAccounts[1];
    });
    
    describe("DEPLOYMENT:", () => {
        const name = "Uzair";
        const symbol = "UZR";
        const decimals = "18";
        const totalSupply = ethersToWei(1000000);
        
        it(`has correct name`, async () => {
            expect(await deployedToken.name()).to.equal(name);
        });
    
        it(`has correct symbol`, async () => {
            expect(await deployedToken.symbol()).to.equal(symbol);
        });
    
        it('has correct decimals', async () => {
            expect(await deployedToken.decimals()).to.equal(decimals);
        });
    
        it('has correct total supply', async () => {
            expect(await deployedToken.totalSupply()).to.equal(totalSupply); // Equal to this many Wei: "1000000000000000000000000"
        });

        it('has assigned total supply to the deployer', async() => {
            expect(await deployedToken.balanceOf(deployer.address)).to.equal(totalSupply);
        });
    });

    describe("SENDING TOKENS:", () => {
        let transaction, result;
        
        describe("SUCCESS", () => {
            beforeEach(async() => {
                transaction = await deployedToken.transfer(receiver.address, ethersToWei(100));
                result = await transaction.wait();
            });
    
            it("implements transfer ( ... ) correctly", async() => {            
                expect(await deployedToken.balanceOf(deployer.address)).to.equal(ethersToWei(1000000 - 100));
                expect(await deployedToken.balanceOf(receiver.address)).to.equal(ethersToWei(100));
            });
    
            it(`emits the "Transfer" event with correct details`, async() => {
                const emittedEvent = result.events[0];
    
                expect(emittedEvent.event).to.equal("Transfer");
                expect(emittedEvent.args.from).to.equal(deployer.address);
                expect(emittedEvent.args.to).to.equal(receiver.address);
                expect(emittedEvent.args.value).to.equal(ethersToWei(100));
            });
        });

        describe("FAILURE", () => {
            it('rejects insufficient funds', async() => {
                await expect(deployedToken.transfer(receiver.address, ethersToWei(1000000000))).to.be.reverted;
            });
        });
    });
});
