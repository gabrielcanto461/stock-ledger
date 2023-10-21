const PositionController = require('../controller/positionController');

module.exports = {
    getPositions: ((app) => {
        console.log("Rota /api/positions criada");
        app.get('/api/positions', PositionController.getPositions);
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

    
}