import axios from "axios";


export const getLastestCoinPrice = async(apiKey: string, coin:any) => {
 const options = {
   headers: {
     'x-access-token': apiKey,
   },
 };
 const response = await axios.get(
   `https://api.coinranking.com/v2/coins?symbols=${coin.symbol}&search=${coin.name}`,
   options,
 );
 return response.data.data.coins[0].price;
}

