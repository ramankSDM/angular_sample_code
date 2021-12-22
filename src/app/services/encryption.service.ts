import { Injectable } from "@angular/core";
import * as CryptoTS from 'crypto-ts';

@Injectable({
  providedIn: "root"
})
export class EncryptionService {
//   key: string = "z!!!!!!!1sdfadsf56adf456asdfasdf";
//   appProperties = {
//     VALUES: {
//       KEY: "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O",
//       IV: "MTIzNDU2Nzg="
//     }
//   }

  constructor() {}

  encryptionAES (msg) {
    // Encrypt
    const ciphertext = CryptoTS.AES.encrypt(msg, 'StarIn_2020');
    return ciphertext.toString();
  }

  decryptionAES (msg) {
    // Decrypt
    const bytes  = CryptoTS.AES.decrypt(msg, 'StarIn_2020');
    const plaintext = bytes.toString(CryptoTS.enc.Utf8);
    return plaintext;
  }
}