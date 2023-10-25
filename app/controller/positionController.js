const PositionModel = require("../model/positionModel");
const StocksController = require('../controller/stocksController');
const Joi = require('joi');
const {add} = require("nodemon/lib/rules");

const positionSchema = Joi.object().keys(
    {
        _id: Joi.string().optional(),
        date: Joi.string().optional(),
        name: Joi.string().required().min(1).max(50),
        ticker: Joi.string().required().min(1).max(7),
        logo: Joi.string().optional().uri(),
        quantity: Joi.number().required().min(1),
        price: Joi.number().required().min(0),
        currency: Joi.string().optional()
    }
);

module.exports = class PositionController {
    static async getPositions(request, response, next) {
        console.log('Starting positions retrieving.');

        try {
            const positions = await PositionModel.getPositions();
            if (!positions) {
                response.status(404).json('There is no positions registered.');
                return;
            }
            positions.forEach(position => {
                console.log("Position: ", position.name);
            });
            response.status(200).json({positions:positions});
        } catch (error) {
            console.log('Unexpected error: ' + error);
            response.status(500).json({error: error});
        }
    };

    static async getPositionByTicker(request, response, ticker) {
        console.log('Starting getPositionByTicker operation.');

        try {
            const position = await PositionModel.getPositionByTicker(ticker);

            if (!position) {
                response.status(404).json(`Position with ticker [${ticker}] not found. Check the ticker and try again.`);
                return;
            }

            console.log(`Position: ${position.ticker}, quantity: ${position.quantity}`);

            response.status(200).json({positions: position});
        } catch (error) {
            console.log('Unexpected error' + error);
            response.status(500).json({error: error});
        }
    }

    static async getPositionById(request, response, id) {
        console.log('Starting getPositionById operation.');

        try {
            const position = await PositionModel.getPositionById(id);

            if (!position) {
                response.status(404).json(`Position with id [${id}] not found. Check the id and try again.`);
                return;
            }

            console.log(`Position: ${position.ticker}, quantity: ${position.quantity}`);

            response.status(200).json(position);
        } catch (error) {
            console.log('Unexpected error' + error);
            response.status(500).json({error: error});
        }
    }

    static async getPositionsGroupedByTicker(request, response) {
        console.log('Starting getPositionsGrouped operation.');

        try {
            const positions = await PositionModel.getPositionsGroupedByTicker();

            if (!positions) {
                response.status(404).json({message:`Positions not found.`});
                return;
            }

            for (let position of positions) {
                const currentPrice = await StocksController.getStockInfoByTicker(position.ticker);

                const totalCurrentValue = position.quantity * currentPrice;

                const netAmount = totalCurrentValue - position.totalInvested;

                position.currentPrice = currentPrice;
                position.netAmount = netAmount;
            }
            console.log(`Position: ${positions.ticker}, quantity: ${positions.quantity}`);

            response.status(200).json(positions);
        } catch (error) {
            console.log('Unexpected error' + error);
            response.status(500).json({error: error});
        }
    }

    static async addNewPosition(request, response, next) {
        console.log('Starting addNewPosition operation.', request.body);

        const {error, value} = positionSchema.validate(request.body);

        if (error) {
            const badRequestResponse = {
                msg: 'Position not added due to invalid fields.',
                error: error.details
            }
            response.status(400).json(badRequestResponse);
            return;
        }

        try {
            const addedPosition = await PositionModel.addNewPosition(request.body);
            console.log(addedPosition)
            response.status(201).json(addedPosition);
        } catch (error) {
            response.status(500).json({message: "Unexpected error", error: error});
        }
    }


    static async updatePositionById(request, response, id) {
        console.log('Starting updatePositionById operation.');

        const {error, value} = positionSchema.validate(request.body);

        if (error) {
            const result = {
                msg: 'Position not updated due to invalid fields.',
                error: error.details
            }
            response.status(400).json(result);
            return;
        }

        try {
            const updatedPosition = await PositionModel.updatePosition(request.body, id);

            response.status(200).json(updatedPosition);
        } catch (error) {
            response.status(500).json({error: error});
        }
    }

    static async deletePositionById(request, response, id) {
        console.log('Starting deletePositionById operation.', request.body);

        try {
            const deletedPosition = await PositionModel.deletePositionById(id);
            response.status(200).json(deletedPosition);
        } catch (error) {
            response.status(400).json({error: error});
        }
    }
}
