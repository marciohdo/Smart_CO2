import { create } from "ipfs-http-client";
import {Buffer} from 'buffer';

const INFURA_ID="2NIXYXr0cLjWLx4aTWUHLxr3osw";
const INFURA_SECRET_KEY="664c86ea22b325860c5d232117eee6bb"

const auth = 'Basic ' + Buffer.from(INFURA_ID + ':' + INFURA_SECRET_KEY).toString('base64');
export async function ipfsClient() {
    const ipfs = /*await*/ create(
        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
              headers: {
               authorization: auth, // infura auth credentails
           },
        }
    );
   return ipfs;
}

export default ipfsClient;


