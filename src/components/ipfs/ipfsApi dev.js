// executar o server.js node server.js antes de iniciar
import { create } from "ipfs-http-client";
import { Buffer } from 'buffer';

async function fetchInfuraCredentials() {
  const response = await fetch('http://localhost:5000/getInfuraCredentials');
  if (!response.ok) {
    throw new Error('Failed to fetch Infura credentials');
  }
  return response.json();
}

export async function ipfsClient() {
  const { infuraId, infuraKey } = await fetchInfuraCredentials();
  const auth = 'Basic ' + Buffer.from(infuraId + ':' + infuraKey).toString('base64');

  try {
    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth, // Infura auth credentials
      },
    });
    return ipfs;
  } catch (error) {
    console.error('Failed to create IPFS client', error);
    throw error;
  }
}

export default ipfsClient;
