import { ethers } from "ethers";
import TOKEN_ABI from "../abi/Token.json";
import EXCHANGE_ABI from "../abi/Exchange.json";

function loadProvider(dispatch) {
  /*
    Connect to the blockchain using the provider of ethers.js.
    Now, we are using ethers.js to connect front-end of the app
    to the back-end.
  */

  let connection = new ethers.providers.Web3Provider(window.ethereum);

  dispatch({
    type: "PROVIDER_LOADED",
    connection: connection,
  });

  return connection;
}

async function loadNetwork(provider, dispatch) {
  /*
    Using the provider that we just loaded, now we read
    information from the blockchain. This is the confirmation
    that we are actually connected to the blockchian.
  */

  let network = await provider.getNetwork();
  let chainId = network.chainId;

  dispatch({
    type: "NETWORK_LOADED",
    chainId: chainId,
  });

  return chainId;
}

async function loadAccount(dispatch, provider) {
  /*
    window: Globally available object to JavaScript
    inside the browsers.
  */

  /*
    Step-01: MetaMask exposes its API at window.ethereum. We can
    use this API and ask MetaMask to fetch the info about
    the current user.

    MetaMask automatically detects what blockchain this user
    is connected to, requests the data from the blockchain
    and, finally, presents it to us in the console.
  */

  let account = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  account = account[0];

  dispatch({
    type: "ACCOUNT_LOADED",
    account: account,
  });

  let balance = await provider.getBalance(account);
  let formattedBalance = ethers.utils.formatEther(balance);

  dispatch({
    type: "BALANCE_LOADED",
    balance: formattedBalance,
  });

  return account;
}

async function loadCryptoCurrencies(addresses, provider, dispatch) {
  /*
    Connect to the specific smart contract (our CC)
    on that blockchain and read its symbol as a signal of
    confirmation of connection.
  */

  let token = new ethers.Contract(addresses[0], TOKEN_ABI, provider); // Connect to the token deployed on the blockchain
  let symbol = await token.symbol();

  dispatch({
    type: "TOKEN_LOADED_1",
    contract: token,
    symbol: symbol,
  });

  // Loading token 2 from the blockchain.

  token = new ethers.Contract(addresses[1], TOKEN_ABI, provider);
  symbol = await token.symbol();

  dispatch({
    type: "TOKEN_LOADED_2",
    contract: token,
    symbol: symbol,
  });
}

function loadExchange(address, provider, dispatch) {
  let exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);

  dispatch({
    type: "EXCHANGE_LOADED",
    exchange: exchange,
  });

  return exchange;
}

function subscribeToEvents(exchange, dispatch) {
  exchange.on("Deposit", (smartContract, user, amount, balance, event) => {
    dispatch({
      type: "TRANSFER_SUCCESS",
      event: event
    });
  });

  exchange.on("Withdraw", (smartContract, user, amount, balance, event) => {
    dispatch({
      type: "TRANSFER_SUCCESS",
      event: event
    });
  });

  exchange.on("Make", (orderID, user, tokenGive, amountGive, tokenGet, amountGet, time, event) => {
    let order = event.args;

    dispatch({
      type: "NEW_ORDER_SUCCESS",
      event: event,
      order: order
    });
  });
 
  exchange.on("Cancel", (orderID, user, tokenGive, amountGive, tokenGet, amountGet, time, event) => {    
    const order = event.args;

    dispatch({
      type: "CANCEL_ORDER_SUCCESSFUL", 
      order: order,
      event: event
    });
  });

  exchange.on("Trade", (orderID, maker, filler, tokenGive, amountGive, tokenGet, amountGet, time, event) => {    
    const trade = event.args;

    dispatch({
      type: "TRADE_SUCCESSFUL", 
      order: trade,
      event: event
    });
  });
}

async function loadBalances(cc, exchange, account, dispatch) {
  
  /*
    The following code checks if the user has purchased the 
    cryptocurrency 1 and 2 or not? If yes, their balance
    will be 0.0
  */

  let balance = await cc[0].balanceOf(account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "TOKEN_1_BALANCE_LOADED",
    balance: balance,
  });

  balance = await cc[1].balanceOf(account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "TOKEN_2_BALANCE_LOADED",
    balance: balance,
  });

  /*
    Has the user deposited any crypto funds for currency 01
    or for currency 02 in the exchange? If not, that user's
    balance will be 0.0
  */

  balance = await exchange.balanceOf(cc[0].address, account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "EXCHANGE_USER_1_BALANCE_LOADED",
    balance: balance,
  });

  balance = await exchange.balanceOf(cc[1].address, account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "EXCHANGE_USER_2_BALANCE_LOADED",
    balance: balance,
  });
}

async function transferTokens(transferType, cc, exchange, provider, amount, dispatch) {
  let signer, transaction;
  
  dispatch({
    type: "TRANSFER_REQUEST"
  });
  
  try {
    signer = provider.getSigner();
    amount = ethers.utils.parseUnits(amount.toString(), 18);

    if (transferType === "deposit") {
      transaction = await cc.connect(signer).approve(exchange.address, amount);
      await transaction.wait();
  
      transaction = await exchange.connect(signer).deposit(cc.address, amount);
      await transaction.wait();
    } 
    else {
      transaction = await exchange.connect(signer).withdraw(cc.address, amount);
      await transaction.wait();
    }
  }
  catch(error) {
    dispatch({
      type: "TRANSFER_FAILED"
    });
  }
  return;
}

async function makeBuyOrder(tokens, order, dispatch, provider, exchange) {
  let tokenGive = tokens[1].address; // Sell mETH or mDAI
  let tokenGet = tokens[0].address; // Get UZR
  let amountGive = ethers.utils.parseUnits((order.amount * order.price).toString(), 18);
  let amountGet = ethers.utils.parseUnits(order.amount, 18);

  dispatch({
    type: "NEW_ORDER_REQUEST"
  });

  try {
    let signer = provider.getSigner();
    let transaction = await exchange.connect(signer).make(tokenGive, amountGive, tokenGet, amountGet);
    await transaction.wait();
  }
  catch(error) {
    dispatch({
      type: "NEW_ORDER_FAILED"
    });
  }
}

async function makeSellOrder(tokens, order, dispatch, provider, exchange) {
  let tokenGive = tokens[0].address; // Sell UZR
  let tokenGet = tokens[1].address; // Get mETH or mDAI
  let amountGive = ethers.utils.parseUnits(order.amount, 18);
  let amountGet = ethers.utils.parseUnits((order.amount * order.price).toString(), 18);

  dispatch({
    type: "NEW_ORDER_REQUEST"
  });

  try {
    let signer = provider.getSigner();
    let transaction = await exchange.connect(signer).make(tokenGive, amountGive, tokenGet, amountGet);
    await transaction.wait();
  }
  catch(error) {
    dispatch({
      type: "NEW_ORDER_FAILED"
    });
  }
}

async function loadAllOrders(provider, dispatch, exchange) {
  const block = provider.getBlockNumber();
  
  /*
    Get all "Make" orders through the "Make" event.
  */
 
  let allOrders = await exchange.queryFilter("Make", 0, block); 
  allOrders = allOrders.map((event) => {
    return event.args;
  });

  dispatch({
    type: "ALL_ORDERS_LOADED", 
    allOrders: allOrders
  });

  let cancelledOrders = await exchange.queryFilter("Cancel", 0, block);
  cancelledOrders = cancelledOrders.map((event) => {
    return event.args;
  });

  dispatch({
    type: "CANCELLED_ORDERS_LOADED", 
    cancelledOrders: cancelledOrders
  });

  let trades = await exchange.queryFilter("Trade", 0, block);
  trades = trades.map((event) => {
    return event.args;
  });

  dispatch({
    type: "FILLED_ORDERS_LOADED", 
    trades: trades
  });
}

async function cancelOrder(orderID, dispatch, provider, exchange) {
  dispatch({
    type: "CANCEL_ORDER_REQUEST"
  });

  try {
    let signer = provider.getSigner();
    let transaction = await exchange.connect(signer).cancel(orderID);
    await transaction.wait();
  }
  catch(error) {
    dispatch({
      type: "CANCEL_ORDER_FAILED"
    });
  }
}

async function fillOrder(orderID, dispatch, provider, exchange) {
  dispatch({
    type: "TRADE_REQUEST"
  });

  try {
    let signer = provider.getSigner();
    let transaction = await exchange.connect(signer).fill(orderID);
    await transaction.wait();
  }
  catch(error) {
    dispatch({
      type: "TRADE_FAILED"
    });
  }
}

export {
  loadProvider, loadNetwork, loadAccount,
  loadCryptoCurrencies, loadExchange, loadBalances,
  transferTokens, subscribeToEvents, makeBuyOrder,
  makeSellOrder, loadAllOrders, cancelOrder, fillOrder
};
