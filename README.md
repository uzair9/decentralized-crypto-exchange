# The Decentralized Cryptocurrency Exchange (DEX)

Let us ask ourselves one fundamental question: what is a stock exchange? Well, it is an online marketplace where one can exchange company stocks for fiat currency, like the USD. The entire process is centralized, i.e., a stock broker sits between you and the market and allows / aids you in making your trades.

With this background of the online financial markets in mind, let us try understanding what we have built: a DEX.

## DEX: What is It?

DEX literally stands for "Decentralized Exchange." It is an online exchange which is not centrally controlled by any brokerage firms, i.e., every trade one makes gets processed by the smart contracts deployed to the blockchain networks, and no human interaction takes place during the trade, ever. Such an automated process, controlled solely by computer code, is much more efficient, trustworthy and transparent. This is all there is to a decentralized exchange at a very fundamental level. Yes, it is that simple.

Given that this DEX has been built for cryptocurrency trading, therefore, one can only trade digital cryptocurrencies on such an exchange, not the stocks. For the latter, we have stock exchanges as described above in detail.

## Part-01: Creating a New Cryptocurrency

An exchange can only work if there are some currencies listed to be exchanged on it in the first place. That's why we created a smart contract to build an ERC-20 fungible token of our own. This token is essentially our own cryptocurrency that complies with the coding standards of the Ethereum blockchain. 

We used the best coding practices and complied with the industry standards. Also, we rigorously tested all the token functionality using Chai, Hardhat and JavaScript on our local single-node blockchain.

## Part-02: Creating the Decentralized Exchange (DEX)

The heart and soul of the project is the exchange itself. The exchange acts as a platform that allows two unknown parties - bound by the trust in the blockchain's immutability and robustness - two make their trade.

We implemented the following features in our exchange smart contract:

* **deposit( ... ):** The function allows users to deposit their crypto to the exchange. When they do that, their currency will be "listed" on the exchage for trading.

* **withdraw( ... ):** If for some reason after making a deposit they decide to not proceed further, they can easily withdraw their deposited financial assets with a single click.

* **make( ... ):** The function allows users to publicly list the trade that they want to make, i.e., write to the exchange the cryptocurrencies they want to give and receive with their respective quantities.

* **cancel( ... ):** Allows users to cancel their order before somebody fills it on the exchange.

* **fill( ... ):** If a user finds an order listed, they can choose to fulfill it. When the order is filled, the trade happens. When the trade happens, the exchange gets its 10% cut from the trade.

That's it for the exchange. That's how we implemented the code that enables users to trade their assets on the exchange.
