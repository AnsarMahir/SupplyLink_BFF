// controllers/productController.js
const axios = require('axios');
const handleError = require('../utils/errorHandler');
const BASE_URL = 'http://localhost:8080/api/v1/products';

exports.createProduct = async (req, res) => {
  try {
    const response = await axios.post(BASE_URL, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    handleError(error, res, 'Error creating product');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(error, res, 'Error updating product');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(error, res, 'Error deleting product');
  }
};

exports.getProductById = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(error, res, 'Error fetching product');
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 0, size = 10 } = req.query;
    const response = await axios.get(`${BASE_URL}?page=${page}&size=${size}`);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(error, res, 'Error fetching products');
  }
};
