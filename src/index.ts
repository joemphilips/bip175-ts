import * as bitcoin from 'bitcoinjs-lib'
import {HDNode} from "bitcoinjs-lib";


export default class P2CH {
  public contractBase: HDNode;
  constructor(public docs: string[], private k: number=0, master: string){
     this.contractBase = HDNode.fromBase58(master).derivePath(`m/175'/${k}'`)
  }


  public derive() {
    const hashes = this.docs.map(d => bitcoin.crypto.sha256(Buffer.from(d))).sort()
    this.contractBase.getPublicKeyBuffer().toString()
  };
}