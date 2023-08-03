import axios from 'axios';
import { cryptoClient } from '@polygon.io/client-js';
import { CustomLogger } from 'src/myLogger';

const logger = new CustomLogger('Crypto Utils');

type duration =
  | '1h'
  | '3h'
  | '12h'
  | '24h'
  | '7d'
  | '30d'
  | '3m'
  | '1y'
  | '3y'
  | '5y'
  | 'all';

const formatDateFromTimestamp = (timestamp: number, duration: string) => {
  // const date = new Date(timestamp);
  const date = new Date(timestamp + 3600000);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  if (['1y', '3y', '5y', 'all'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} ${day}, ${year}`;
  }

  return `${capitalizedMonth} ${day}, ${year} ${hours}:${minutes}`;
};

const formatDateForChartFromTimestamp = (
  timestamp: number,
  duration: string,
) => {
  // const date = new Date(timestamp);
  const date = new Date(timestamp + 3600000);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  if (['1h', '3h', '12h', '24h'].indexOf(duration) !== -1) {
    return `${hours}:${minutes}`;
  }

  if (['7d'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} ${day} ${hours}:${minutes}`;
  }

  if (['30d', '3m'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} ${day}`;
  }

  if (['1y'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} `;
  }

  if (['3y'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} ${year}`;
  }

  return `${year}`;
};

const subtractDuration = (duration: string) => {
  const durationRegex = /^(\d+)([A-Za-z]+)$/; // Regex to extract the number and unit
  const [, amount, unit]: any = duration.match(durationRegex);

  const currentDate = new Date();
  let subtractedDate;

  switch (unit.toLowerCase()) {
    case 'h':
      subtractedDate = new Date(
        currentDate.getTime() - amount * 60 * 60 * 1000,
      );
      break;
    case 'd':
      subtractedDate = new Date(
        currentDate.getTime() - amount * 24 * 60 * 60 * 1000,
      );
      break;
    case 'm':
      subtractedDate = new Date(currentDate);
      subtractedDate.setMonth(subtractedDate.getMonth() - amount);
      break;
    case 'y':
      subtractedDate = new Date(currentDate);
      subtractedDate.setFullYear(subtractedDate.getFullYear() - amount);
      break;
    default:
      throw new Error('Invalid duration unit. Use "h", "d", "m", or "y".');
  }

  return {
    from: subtractedDate.toISOString(),
    to: new Date(currentDate).toISOString(),
  }; // Return the date in ISO 8601 format
};

const subtractOneDay = (dateString: string) => {
  // Parse the input date string to a Date object
  const date = new Date(dateString);

  // Subtract one day (24 hours) in milliseconds
  date.setTime(date.getTime() - 24 * 60 * 60 * 1000);

  // Format the date back to the desired format (yyyy-mm-dd)
  const formattedDate = date.toISOString().slice(0, 10);

  return formattedDate;
};

const formatCurrency = (value: string) => {
  let price = +value;
  let formatedPrice: string = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (formatedPrice.includes('.00')) {
    formatedPrice = formatedPrice.split('.')[0];
  }
  return formatedPrice;
};

const getCoinChartStatistics = (data: any) => {
  let coinChartData: any = {};
  let coinValues = [];
  for (let element of data) {
    coinValues.push(element.chartPrice);
  }

  const maxCoinValue = Math.max(...coinValues);
  const minCoinValue = Math.min(...coinValues);

  const average = (array) => array.reduce((a, b) => a + b) / array.length;
  const averageCoinValue = average(coinValues);
  const diffCoinValue =
    ((coinValues[coinValues.length - 1] - coinValues[0]) / coinValues[0]) * 100;

  coinChartData.chart = data;
  coinChartData.max = formatCurrency(`${maxCoinValue}`);
  coinChartData.min = formatCurrency(`${minCoinValue}`);
  coinChartData.average = formatCurrency(`${averageCoinValue}`);
  coinChartData.diff = diffCoinValue.toFixed(2);

  return coinChartData;
};

const coinRankingHistoryDate = async (
  coinrankingApiKey: string,
  duration: string,
  coinUuid: string,
) => {
  // logger.log('Crypto from CoinRanking');

  try {
    const options = {
      headers: {
        'x-access-token': coinrankingApiKey,
      },
    };

    const response = await axios.get(
      `https://api.coinranking.com/v2/coin/${coinUuid}/history/?timePeriod=${duration}`,
      options,
    );
    const coinDataHistory = response.data.data.history.reverse();

    let coinChartData = [];

    for (let element of coinDataHistory) {
      let payload: any = {};
      payload.chartPrice = +(+element.price).toFixed(2);
      payload.price = formatCurrency(element.price);
      payload.chartTime = formatDateForChartFromTimestamp(
        element.timestamp * 1000,
        duration,
      );
      payload.time = formatDateFromTimestamp(
        element.timestamp * 1000,
        duration,
      );

      coinChartData.push(payload);
    }

    return coinChartData;
  } catch (error) {
    logger.error('An error happened:', error);
  }
};

const polygonHistoryDate = async (
  polygonApiKey: string,
  duration: string,
  coinSymbol: string,
) => {
  // logger.log('Crypto from Polygon');

  try {
    const CryptoClient = cryptoClient(polygonApiKey);

    let isSameDay = false;
    let fromTime = subtractDuration(duration).from.split('T')[0];
    let toTime = subtractDuration(duration).to.split('T')[0];

    if (fromTime === toTime) {
      isSameDay = true;
      fromTime = subtractOneDay(fromTime);
    }

    const filterList = [
      { duration: '1h', unit: 'minute', quantity: 60, step: 1 },
      { duration: '3h', unit: 'minute', quantity: 180, step: 1 },
      { duration: '12h', unit: 'minute', quantity: 145, step: 5 },
      { duration: '24h', unit: 'minute', quantity: 288, step: 5 },
    ];

    const filter = filterList.filter((e) => e.duration === duration)[0];

    const result = await CryptoClient.aggregates(
      `X:${coinSymbol}USD`,
      filter.step,
      filter.unit,
      fromTime,
      toTime,
      { limit: 5000 },
    );

    logger.log(coinSymbol);

    // logger.log('all data length : ', data.results.length);

    let coinDataHistory = [];

    if (isSameDay) {
      coinDataHistory = result.results
        .reverse()
        .slice(0, filter.quantity)
        .reverse();
    } else {
      coinDataHistory = result.results.slice(0, filter.quantity);
    }

    // logger.log('extracted data length : ', coinDataHistory.length);

    let coinChartData = [];

    for (let element of coinDataHistory) {
      let payload: any = {};
      payload.chartPrice = +element.c.toFixed(2);
      payload.price = formatCurrency(element.c);
      payload.time = formatDateFromTimestamp(element.t, duration);
      payload.chartTime = formatDateForChartFromTimestamp(element.t, duration);
      coinChartData.push(payload);
    }

    return coinChartData;
  } catch (error) {
    logger.error('An error happened:', error);
  }
};

export const getLastestCoinPrice = async (apiKey: string, coin: any) => {
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
};

export const getCoinChartData = async (
  coinrankingApiKey: string,
  polygonApiKey: string,
  coin: any,
  duration: duration,
) => {
  const polygonList = [];
  const coinRankingList = [
    '1h',
    '3h',
    '12h',
    '24h',
    '7d',
    '30d',
    '3m',
    '1y',
    '3y',
    '5y',
    'all',
  ];

  if (polygonList.indexOf(duration) !== -1) {
    const chartData = await polygonHistoryDate(
      polygonApiKey,
      duration,
      coin.symbol,
    );

    return getCoinChartStatistics(chartData);
  } else if (coinRankingList.indexOf(duration) !== -1) {
    const chartData = await coinRankingHistoryDate(
      coinrankingApiKey,
      duration,
      coin.coinrankingId,
    );
    return getCoinChartStatistics(chartData);
  } else {
    // logger.log('Invalid duration');
    throw Error(
      'Invalid duration. Queryparams should have duration in [ 1h,3h,12h,24h,7d,30d,3m,1y,3y,5y,all]',
    );
  }
};
