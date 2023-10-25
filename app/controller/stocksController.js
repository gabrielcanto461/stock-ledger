const Joi = require('joi');
const axios = require('axios');
const apiKey = process.env.BRAPI_API_KEY;
const baseUrl = "https://brapi.dev/api";

const positionSchema = Joi.object().keys(
    {
        ticker: Joi.string().required().min(1).max(7),
        quantity: Joi.number().required().min(1),
        price: Joi.number().required().min(0),
        currency: Joi.string().optional()
    }
);

module.exports = class StocksController {
    static async getStocks(request, response, search) {
        console.log('Starting stocks retrieving.');
        try {
            let brapiUri = baseUrl.concat("/available");
            brapiUri = brapiUri.concat(`?token=${apiKey}`);
            if (search) {
                brapiUri = brapiUri.concat(`&search=${search}`)
            }
            console.log(brapiUri);
            const axiosResponse = await axios.get(brapiUri);

            const stocks = axiosResponse.data.stocks;
            //console.log(stocks);

            if (stocks.length === 0) {
                return response.status(404).json({message: `Stocks not found containing ${search}`});
            }
            return response.status(200).json(axiosResponse.data.stocks);
        } catch (error) {
            console.log(error);
        }
    };
    static async getStockByTicker(request, response, ticker) {
        if (ticker != null) {
            try {
                var brapiUri = baseUrl.concat(`/quote/${ticker}?range=1d&interval=1d&token=${apiKey}`);
                const res = await axios.get(brapiUri);
                const stock = res.data.results[0];

                console.log(stock);
                return response.status(200).json({
                    name: stock.longName,
                    price: stock.regularMarketPrice,
                    logo: stock.logourl
                });
            } catch (error) {
                console.error(`Erro ao buscar informações sobre a ação: ${ticker} error: [${error}]`)
            }
        }
    }

    static async getStockInfoByTicker(ticker) {
        if (ticker != null) {
            try {
                var brapiUri = baseUrl.concat(`/quote/${ticker}?range=1d&interval=1d&token=${apiKey}`);
                const res = await axios.get(brapiUri);
                const stock = res.data.results.at(0);

                return stock.regularMarketPrice;
            } catch (error) {
                console.error(`Erro ao buscar informações sobre a ação: ${ticker} error: [${error}]`)
            }
        }
    }

}
