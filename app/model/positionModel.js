const client = require('../../config/dbconnection');
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

    static async addNewPosition(positionPayload){
        console.log(`Adding new position:  [${positionPayload}]`);
        try {
            const newPosition = {
                ticker: positionPayload.ticker,
                quantity: positionPayload.quantity,
                price: positionPayload.price,
                currency: positionPayload.currency,
                date: new Date()
            }

            const addedPosition = await collection.insertOne(newPosition);

            console.log(`New movie inserted with the following id ${addedPosition.insertedId}`);
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