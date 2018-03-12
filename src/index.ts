import * as bitcoin from 'bitcoinjs-lib'
import {HDNode} from "bitcoinjs-lib";


export default class P2CH {
  public contractBase: HDNode;
  public rootHash: string
  constructor(public docs: string[], private k: number=0, public master: string){
     this.contractBase = HDNode.fromBase58(master).derivePath(`m/175'/${k}'`);
    this.rootHash = this.deriveRootHash();
  }

  public deriveRootHash(): string {
    const hashes = this.docs.map(d => bitcoin.crypto.sha256(Buffer.from(d)).toString('hex')).sort()
    let hashConcatenated = this.contractBase.neutered().toBase58() +
      hashes.reduce((a: string, b: string) => a + b)
    let rootHash = bitcoin.crypto.sha256(Buffer.from(hashConcatenated)).toString('hex')
    return rootHash;
  };

  public deriveAddress(): any {
    const rootHashBuf = Buffer.from(this.rootHash, 'hex')
    const partialPath = [];
    for (let i = 0; i < 16;  i++) {
     let b = rootHashBuf.readUInt16BE(i * 2)
      partialPath.push(b)
    }
    let partialPathJoined = partialPath.join('\/')
    let pathString = `m/175'/${this.k}'/${partialPathJoined}`;
    const p2chPath = HDNode.fromBase58(this.master).derivePath(pathString);
    console.log("hd wallet path for p2ch is ", pathString);
    return p2chPath.getAddress();
  }
}