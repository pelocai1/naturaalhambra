const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER;

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function uploadImageToAzure(filePath, fileName) {
   console.log('➡️ Subiendo imagen a Azure:', filePath); // 👈 Añadir esto
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadFile(filePath, {
    blobHTTPHeaders: {
      blobContentType: mime.lookup(filePath) || 'application/octet-stream'
    }
  });

  return blockBlobClient.url;
}

module.exports = { uploadImageToAzure };
