import { create } from "ipfs-http-client";
import { Buffer } from 'buffer';

// Verifique se as variáveis de ambiente estão definidas
const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const INFURA_SECRET_KEY = process.env.REACT_APP_INFURA_SECRET_KEY;

if (!INFURA_ID || !INFURA_SECRET_KEY) {
  throw new Error('As variáveis de ambiente REACT_APP_INFURA_ID e REACT_APP_INFURA_SECRET_KEY devem ser definidas.');
}

const auth = 'Basic ' + Buffer.from(`${INFURA_ID}:${INFURA_SECRET_KEY}`).toString('base64');

export async function ipfsClient() {
  try {
    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });
    return ipfs;
  } catch (error) {
    console.error('Failed to create IPFS client', error);
    throw error;
  }
}

export default ipfsClient;
