const PositionController = require('../controller/positionController');
const StocksController = require('../controller/stocksController');

module.exports = {
    getPositions: ((app) => {
        console.log("Rota /api/positions criada");
        app.get('/api/positions', (req, res) => {
            const {ticker} = req.query;
            if (ticker) {
                console.log(`Ticker [${ticker}] present in request`)
                PositionController.getPositionByTicker(req, res, ticker);
            } else {
                PositionController.getPositions(req, res);
            }
        });
    }),

    getPositionsGrouped: ((app) => {
        console.log("Rota /api/positions/grouped criada");
        app.get('/api/positions/grouped', PositionController.getPositionsGroupedByTicker);
    }),

    getPositionById: ((app) => {
        console.log("rota /api/positions/{id} criada");
        app.get('/api/positions/:idPosition', (req, res) => {
            const positionId = req.params.idPosition;
            PositionController.getPositionById(req, res, positionId);
        });
    }),

    addPosition: ((app) => {
        app.post('/api/positions', PositionController.addNewPosition);
    }),

    updatePositionById: ((app) => {
        app.put('/api/positions/:idPosition', (req, res) => {
            const positionId = req.params.idPosition;
            PositionController.updatePositionById(req, res, positionId);
        });
    }),

    deletePositionById: ((app) => {
        console.log("rota /api/positions/{id} criada");
        app.delete('/api/positions/:idPosition', (req, res) => {
            const positionId = req.params.idPosition;
            PositionController.deletePositionById(req, res, positionId);
        });
    }),

    getPositionByTicker: ((app) => {
        console.log("rota /api/positions/{ticker} criada");
        app.get('/api/positions', (req, res) => {
            const {ticker} = req.query;
            PositionController.getPositionByTicker(req, res, ticker);
        });
    }),

    getStocks: ((app) => {
        console.log("rota /api/stocks criada");

        app.get('/api/stocks', (req, res) => {
            const {search} = req.query;
            StocksController.getStocks(req, res, search);
        });
    }),

    getStocksByTicket: ((app) => {
        console.log("rota /api/stocks criada");

        app.get('/api/stocks/:ticker', (req, res) => {
            const ticket = req.params.ticker;
            StocksController.getStockByTicker(req, res, ticket);
        });
    }),


}