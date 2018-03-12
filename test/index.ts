import P2CH from '../src'
import test from 'ava'
import * as bitcoin from 'bitcoinjs-lib'
const tv = require("./fixtures")

tv.valid.forEach((suite: any) => {
  let docs: Array<string> = [];
  let derivedDocHash: Buffer[] = [];

  test("Hash derived from documents", t => {
    Object.keys(suite.docs).forEach((k, i) => {
      docs.push(k);
      derivedDocHash.push(bitcoin.crypto.sha256(Buffer.from(k)))
      t.deepEqual(derivedDocHash[i], Buffer.from(suite.docs[k], 'hex'))
    });
  });

  test("can make xpubContractBase", t => {
    if (!suite.xpubContractBase || !suite.master) {
      t.pass()
      return;
    }
    const docHashSorted = derivedDocHash.map(h => h.toString('hex')).sort();

    let master = suite.master;
    let p2ch = new P2CH(docs, 0, master);
    let hashConcatenated = p2ch.contractBase.neutered().toBase58()+
      docHashSorted.reduce((a: string, b: string) => a + b );
    t.deepEqual(suite.hashConcat, hashConcatenated);
  })

  test('can derive root Hash', t => {
    if (!suite.xpubContractBase || !suite.master) {
      t.pass()
      return;
    }
  const docHashSorted = derivedDocHash.map(h => h.toString('hex')).sort();
    console.log('master is ', suite.master);
    let p2ch = new P2CH(docs, 0, suite.master);
    let derivedRootHash = p2ch.deriveRootHash();
    t.deepEqual(derivedRootHash, suite.hashCombined)
  })

  test('can make address for payment', t => {
    if (!suite.xpubContractBase || !suite.master) {
      t.pass()
      return;
    };

    let p2ch = new P2CH(docs, 0, suite.master);
    let address = p2ch.deriveAddress();
    t.deepEqual(address, suite.P2PKHAddress);
  })
});