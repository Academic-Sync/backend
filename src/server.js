const app = require('./app.js')
require('./database/connection.js')

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
