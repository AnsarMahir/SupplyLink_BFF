const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
