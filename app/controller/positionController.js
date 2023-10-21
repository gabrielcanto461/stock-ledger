const PositionModel = require("../model/positionModel");
const Joi = require('joi');

const positionSchema = Joi.object().keys(
    {
        ticker: Joi.string().required().min(1).max(7),
        quantity: Joi.number().required().min(1).max(50),
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
            response.status(200).json(positions);
        } catch (error) {
            console.log('Unexpected error: ' + error);
            response.status(500).json({error: error});
        }
    };

    static async getPositionById(request, response, id) {
        console.log('Starting getPositionById operation.');

        try {
            const position = await PositionModel.getMovieById(id);

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
            response.status(201).json(deletedPosition);
        } catch (error) {
            response.status(400).json({error: error});
        }
    }
}
