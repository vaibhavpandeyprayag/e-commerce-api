import CryptoJS from "crypto-js";
require("dotenv").config();
const CRYPTO_KEY = process.env.CRYPTO_KEY as string;

export const decrypt = (plaintext: string) => {
  return CryptoJS.AES.decrypt(plaintext, CRYPTO_KEY).toString(
    CryptoJS.enc.Utf8
  );
};
