const routes = require('./app/route/routes')
const app = require('./config/server');

routes.addPosition(app);
routes.getPositions(app);
routes.getPositionById(app);
routes.updatePositionById(app);
routes.deletePositionById(app);

routes.getStocks(app);
routes.getStocksByTicket(app);