"use client";
import crypto from "crypto";
import { firebaseConfig } from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";



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

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, "gs://blog-website-a3ed3.appspot.com"); // Corrected a typo: "stroage" to "storage"

function createUniqueFileName(fileName) {
  const timeStamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);

  return `${fileName}-${timeStamp}-${randomString}`;
}

export const handleImageSaveToFireBase = async (file) => {
  const extractUniqueFileName = createUniqueFileName(file?.name);
  const storageRef = ref(storage, `blog/${extractUniqueFileName}`);
  const uploadImg = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadImg.on(
      "state_changed",
      (snapshot) => {},
      (error) => reject(error),
      () => {
        getDownloadURL(uploadImg.snapshot.ref)
          .then((url) => resolve(url))
          .catch((error) => reject(error));
      }
    );
  });
}

export const formatDate = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const interval in intervals) {
    const count = Math.floor(seconds / intervals[interval]);
    if (count > 0) {
      if (count === 1) {
        return `${count} ${interval} ago`;
      } else {
        return `${count} ${interval}s ago`;
      }
    }
  }

  return "just now";
};

