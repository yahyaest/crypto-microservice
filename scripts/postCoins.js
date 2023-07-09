const axios = require('axios');

const postCoins = async () => {
  try {
    // get coins from coinranking
    const api_key =
      'coinranking6ec81f6096754540faabae42469f5cb945f9652a5b92c509';

    const options = {
      headers: {
        'x-access-token': api_key,
      },
    };

    const response = await axios.get(
      'https://api.coinranking.com/v2/coins?limit=100',
      options,
    );
    const coins = response.data.data.coins;

    // post coins
    for (let c of coins) {
      // get coin detail
      const response = await axios.get(
        'https://api.coinranking.com/v2/coin/' + c.uuid,
        options,
      );
      const coin = response.data.data.coin;
      // post coin detail
      let coinBody = {
        symbol: coin.symbol,
        name: coin.name,
        price: coin.price,
        rank: coin.rank,
        description: coin.description,
        iconUrl: coin.iconUrl,
        websiteUrl: coin.websiteUrl,
        coinrankingUrl: coin.coinrankingUrl,
        marketCap: coin.marketCap,
        lastDayVolume: coin['24hVolume'],
        numberOfMarkets: coin.numberOfMarkets,
        numberOfExchanges: coin.numberOfExchanges,
        allTimeHigh: coin.allTimeHigh,
      };
      console.log(`Posting coin ${coin.name} with rank ${coin.rank}`);
      await axios.post('http://localhost:3000/api/coins', coinBody);
    }
  } catch (error) {
    console.log(error);
  }
};

postCoins();
