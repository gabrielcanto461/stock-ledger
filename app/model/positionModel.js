const client = require('../../config/dbconnection');
const {add} = require("nodemon/lib/rules");
const ObjectId = require('mongodb').ObjectId;

const collection = client.db('web-project').collection('stock-ledger')

module.exports = class PositionModel {
    static async getPositions(){
        console.log('Getting all positions from database.');
        const cursor = await collection.find();

        return await cursor.toArray();
    };

    static async getPositionById(positionId){
        console.log('Finding position by id: ', positionId);
        positionId = new ObjectId(positionId);

        const cursor = await collection.find({"_id": positionId});

        return await cursor.next();
    };

    static async getPositionByTicker(ticker){
        console.log('Finding position by ticker:', ticker);

        const cursor = await collection.find({"ticker": ticker});

        return await cursor.toArray();
    };

    static async getPositionsGroupedByTicker(){
        const aggregateQuery = [
            {
                $group: {
                    _id: "$ticker",
                    quantity: { $sum: "$quantity" },
                    averagePrice: { $avg: "$price" },
                    logo: { $first: "$logo" }
                }
            },
            {
                $project: {
                    ticker: "$_id",
                    _id: 0, // exclui o campo _id do resultado
                    totalInvested: { $multiply: ["$averagePrice", "$quantity"] },
                    quantity: 1, // inclui o campo totalQuantity no resultado
                    averagePrice: 1, // inclui o campo averagePrice no resultado
                    logo: 1 // inclui o campo logo no resultado
                }
            }
        ];

        const aggregatedResults = await collection.aggregate(aggregateQuery).toArray();
        console.log(aggregatedResults);

        return aggregatedResults;
    };

    static async addNewPosition(positionPayload){
        console.log(`Adding new position:  [${positionPayload}]`);
        try {
            const newPosition = {
                name: positionPayload.name,
                ticker: positionPayload.ticker,
                logo: positionPayload.logo,
                quantity: positionPayload.quantity,
                price: positionPayload.price,
                currency: positionPayload.currency,
                date: new Date()
            }

            const addedPosition = await collection.insertOne(newPosition);

            console.log(`New position inserted with the following id ${addedPosition.insertedId}`);
            return addedPosition.insertedId;
        } catch (error) {
            console.log(`Something wrong happened inserting new position: ${error}`);
        }
    };

    static async updatePosition(updatePayload, positionId){
        positionId = new ObjectId(positionId);
        console.log(`Updating position with id [${positionId}] to ${updatePayload}`);
        try {
            const newPosition = {
                ticker: updatePayload.ticker,
                quantity: updatePayload.quantity,
                price: updatePayload.price,
                currency: updatePayload.currency,
                date: new Date(),
            }

            const updatedPosition = await collection.updateOne(
                { _id: positionId},
                { $set: newPosition }
            );

            console.log(`Position updated with the following id ${updatedPosition.upsertedId}`);
            return updatedPosition;
        } catch (error) {
            console.log(`Something wrong happened updating new position: ${error}`);
        }
    };

    static async deletePositionById(positionId){
        positionId = new ObjectId(positionId);
        console.log(`Deleting position with id: ${positionId}`);
        try {
            const deletedPosition = await collection.findOneAndDelete(
                { _id: positionId}
            );
            console.log(`Movie deleted with the following id ${deletedPosition}`);
        } catch (error) {
            console.log(`Something wrong happened updating new position: ${error}`);
        }
    };
}