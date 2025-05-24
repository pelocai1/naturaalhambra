// backend/services/azureBlobService.js
const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER;

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function uploadImageToAzure(filePath, fileName) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const fileStream = fs.createReadStream(filePath);
  const stat = fs.statSync(filePath);

  await blockBlobClient.uploadStream(fileStream, stat.size);
  return blockBlobClient.url;
}

module.exports = { uploadImageToAzure };
