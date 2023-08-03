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
        coinrankingId: coin.uuid,
        marketCap: coin.marketCap,
        lastDayVolume: coin['24hVolume'],
        numberOfMarkets: coin.numberOfMarkets,
        numberOfExchanges: coin.numberOfExchanges,
        allTimeHigh: JSON.stringify(coin.allTimeHigh),
      };
      console.log(
        `Posting coin ${coin.name}: ${coin.symbol} with rank ${coin.rank}`,
      );
      await axios.post('http://localhost:3000/api/coins', coinBody);
    }
  } catch (error) {
    //console.log(error);
    console.log(error.response.data);
  }
};

const patchCoins = async () => {
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

    let dbCoins = await axios.get('http://localhost:3000/api/coins');

    // patch db coins
    for (let dbCoin of dbCoins.data) {
      try {
        const remoreCoin = coins.filter(
          (c) => c.name === dbCoin.name && c.symbol === dbCoin.symbol,
        )[0];

        const payload = { coinrankingId: remoreCoin.uuid };

        console.log(`patching coin ${dbCoin.name} with rank ${dbCoin.rank}`);
        await axios.patch(
          `http://localhost:3000/api/coins/${dbCoin.id}`,
          payload,
        );
      } catch (error) {
        console.log(`failed to patch coin ${dbCoin.name} with rank ${dbCoin.rank} reason is :`);
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

postCoins();
//patchCoins();
