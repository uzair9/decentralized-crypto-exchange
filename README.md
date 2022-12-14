# The Decentralized Cryptocurrency Exchange (DEX)

Let us ask ourselves one fundamental question: what is a stock exchange? Well, it is an online marketplace where one can exchange company stocks for fiat currency, like the USD. The entire process is centralized, i.e., a stock broker sits between you and the market and allows / aids you in making your trades.

With this background of the online financial markets in mind, let us try understanding what we have built: a DEX.

## DEX: What is It?

DEX literally stands for "Decentralized Exchange." It is an online exchange which is not centrally controlled by any brokerage firms, i.e., every trade one makes gets processed by the smart contracts deployed to the blockchain networks, and no human interaction takes place during the trade, ever. Such an automated process, controlled solely by computer code, is much more efficient, trustworthy and transparent. This is all there is to a decentralized exchange at a very fundamental level. Yes, it is that simple.

Given that this DEX has been built for cryptocurrency trading, therefore, one can only trade digital cryptocurrencies on such an exchange, not the stocks. For the latter, we have stock exchanges as described above in detail.

## The Project Timeline

At first, I learnt the basics of the blockchain technology. I understood the theoretical as well as technical concepts of the 1st, 2nd and 3rd generation blockchains. I also developed a foundation for Solidity, MetaMask, Hardhat and Ethers.js.

After meeting all the pre-requisites I started building the project. It took me **03 months (~ Mid April -- ~ Mid October)** to completely learn the pre-requisites and implement the project locally and deploy it to the Kovan test network.

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


## Part-03: Creating the Front End

Uptill now, everything that we had done was on the backend, i.e., the custom cryptocurrency as well as the crypto exchange were implemented in the form of smart contracts. Now, we moved to the front-end.

At the front end, we used React.js, Redux, MetaMask and Ethers.js in order to create a GUI for the customers. The front-end containes the following sections on the page:

* **Blockchain:** An option to change the chain to localhost (Hardhat) or Kovan test network

* **Markets:** An option to toggle the trading currency pair from UZR / mETH to UZR / mDAI

* **Metamask Connection:** An option to connect your wallet with the app

* **Balance:** An option to see and change your balance (by depositing or withdrawing your cryptocurrency from the exchange) on the GUI

* **Order:** An option to place a new buy order or sell order on the exchange for the whole order

* **My History:** An option to see your open orders as well as your open past trades. You can cancel your open orders as well.

* **Public Trading History:** An option to see what trades public has made recently.

* **Order Book:** An option to see all open public orders that can be filled by anyone.

* **Candlestick Chart:** A chart that captures the opening, closing, high and low values of the trades for a specific currency pairt (market) at a specific hour. We implementd this using MOMENT library and APEX CHARTS library for React.js.

* **Transaction Alerts:** Also, to make our project really professional and compliant with modern standards, we added an alert feature. A pop up that shows up at the corner of the screen whenever you are engaged in any kind of transaction, i.e., make, cancel, fill, deposit, withdraw etc., really uplifts the UX. Also, the pop up shows any errors to the users as well, so that they can know what went wrong and whose end.
