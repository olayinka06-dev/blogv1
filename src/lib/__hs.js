"use client";
import crypto from "crypto";
import { useSession } from "next-auth/react";
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = Buffer.from("9298987654565434567890987854329234567898c76564578909895467689789", "hex");
const initVector = Buffer.from("c8767656787656781276589768909854", "hex"); //

// Algorithm for encryption
export function _xX(text) {
  try {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), initVector);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString("hex");
  } catch (error) {
    console.error("_xX encryption error:", error);
    // Handle the error in a way that makes sense for your app
    return null;
  }
}

// Algorithm for decryption
export function _yY(text) {
  try {
    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key),
      initVector
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("_yY decryption error:", error);
    // Handle the error in a way that makes sense for your app
    return null;
  }
}

export function useUser() {
  const {data: session} = useSession();
  const userId = session?.user.id;
  return userId;
}
