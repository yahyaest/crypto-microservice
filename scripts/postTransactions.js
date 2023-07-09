const axios = require('axios');

const postTransactions = async () => {
  // Post transaction
  try {
    // get local coins
    let coins = await axios.get('http://localhost:3000/api/coins');
    coins = coins.data.slice(0, 10);

    for (let coin of coins) {
      // get latest coin price
      const api_key =
        'coinranking6ec81f6096754540faabae42469f5cb945f9652a5b92c509';
      const options = {
        headers: {
          'x-access-token': api_key,
        },
      };
      const response = await axios.get(
        `https://api.coinranking.com/v2/coins?symbols=${coin.symbol}&search=${coin.name}`,
        options,
      );
      const coin_price = response.data.data.coins[0].price;
      const amount = Math.floor(Math.random() * 10);

      let payload = {
        action: 'BUY',
        username: 'azerty@test.com',
        wallet: 'crypto_wallet',
        name: coin.name,
        symbol: coin.symbol,
        unit_price: coin_price,
        amount: amount,
        value: (coin_price * amount).toString(),
      };

      // post transaction
      console.log(
        `Posting transaction for coin ${coin.name} with latest price ${coin_price}`,
      );
      await axios.post('http://localhost:3000/api/transactions', payload);
    }
  } catch (error) {
    console.log(error.response.data);
  }
};

postTransactions();
