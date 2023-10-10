// import { NextResponse } from "next/server";
// import { db } from "@/lib/db"; 
// import multer from "multer";

// // Create a Multer storage engine to specify where to store uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Set the destination folder where uploaded files will be stored
//     cb(null, "./uploads"); // Replace with your desired storage location
//   },
//   filename: (req, file, cb) => {
//     // Set the filename for the uploaded file
//     cb(null, file.originalname); // You can customize the filename if needed
//   },
// });


// // Initialize Multer with the storage configuration
// const upload = multer({ storage });

// export async function POST(request) {
//   try {

//     // Use the `upload` middleware to handle file uploads
//     upload.array("media")(request, null, async (err) => {
//       if (err) {
//         console.error(err);
//         return NextResponse.json({ message: "File upload failed" }, { status: 500 });
//       }

//     const formData = await request.formData();
//     console.log(formData);

//     // Extract form fields from formData
//     const title = formData.get("title");
//     const content = formData.get("content");
//     const tagId = formData.get("tagId");
//     const mediaFiles  = formData.get("media");
//     console.log(mediaFiles);

//     if (!title) {
//       return NextResponse.json({message: "Title is required"}, { status: 400 });
//     }
//     const post = await db.post.create({
//       data: {
//         title: title,
//         content: content,
//         tagId: tagId,
//       },
//     });

//     // Check if there are media files to associate
//     if (mediaFiles && mediaFiles.length > 0) {
//       const mediaRecords = mediaFiles.map((file) => {
//         return {
//           url: `/uploads/${file.originalname}`, // Set the storage path for the media
//           type: file.mimetype.startsWith("image") ? "image" : "video",
//           postId: post.id, // Associate the media with the created post
//         };
//       });

//       // Create media records and associate them with the post
//       await db.media.createMany({
//         data: mediaRecords,
//       });
//     }

//     return NextResponse.json({post: post, message: "User successfully created Post"}, { status: 200 });
//   });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Could not create post" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import multer from "multer";

// // Create a Multer storage engine to specify where to store uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Set the destination folder where uploaded files will be stored
//     cb(null, "./uploads"); // Replace with your desired storage location
//   },
//   filename: (req, file, cb) => {
//     // Set the filename for the uploaded file
//     cb(null, file.originalname); // You can customize the filename if needed
//   },
// });

// // Initialize Multer with the storage configuration
// const upload = multer({ storage });

// export async function POST(request) {
//   try {
//     // Use the `upload` middleware to handle file uploads
//     upload.array("media")(request, null, async (err) => {
//       if (err) {
//         console.error(err);
//         return NextResponse.json({ message: "File upload failed" }, { status: 500 });
//       }

//       // Extract form fields from formData
//       const formData = await request.formData();
//       const title = formData.get("title");
//       const content = formData.get("content");
//       const tagId = formData.get("tagId");
//       const mediaFiles = request.files; // Access the uploaded files through request.files
//       console.log(mediaFiles);

//       if (!title) {
//         return NextResponse.json({ message: "Title is required" }, { status: 400 });
//       }

//       const post = await db.post.create({
//         data: {
//           title: title,
//           content: content,
//           tagId: tagId,
//         },
//       });

//       // Check if there are media files to associate
//       if (mediaFiles && mediaFiles.length > 0) {
//         const mediaRecords = mediaFiles.map((file) => {
//           return {
//             url: `/uploads/${file.originalname}`, // Set the storage path for the media
//             type: file.mimetype.startsWith("image") ? "image" : "video",
//             postId: post.id, // Associate the media with the created post
//           };
//         });

//         // Create media records and associate them with the post
//         await db.media.createMany({
//           data: mediaRecords,
//         });
//       }

//       return NextResponse.json(
//         { post: post, message: "User successfully created Post" },
//         { status: 200 }
//       );
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Could not create post" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import multer from "multer";

// Create a Multer storage engine to specify where to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder where uploaded files will be stored
    cb(null, "./uploads"); // Replace with your desired storage location
  },
  filename: (req, file, cb) => {
    // Set the filename for the uploaded file
    cb(null, file.originalname); // You can customize the filename if needed
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

export async function POST(request) {
  return new Promise((resolve, reject) => {
    // Use the `upload` middleware to handle file uploads
    upload.array("media")(request, null, async (err) => {
      if (err) {
        console.error(err);
        return reject(
          NextResponse.json({ message: "File upload failed" }, { status: 500 })
        );
      }

      // Extract form fields from formData
      const formData = await request.formData();
      const title = formData.get("title");
      const content = formData.get("content");
      const tagId = formData.get("tagId");
      const mediaFiles = formData.get("media"); // Access the uploaded files through request.files

      if (!title) {
        return reject(
          NextResponse.json({ message: "Title is required" }, { status: 400 })
        );
      }

      try {
        const post = await db.post.create({
          data: {
            title: title,
            content: content,
            tagId: tagId,
          },
        });

        // Check if there are media files to associate
        if (mediaFiles && mediaFiles.length > 0) {
          const mediaRecords = mediaFiles.map((file) => {
            return {
              url: `/uploads/${file.originalname}`, // Set the storage path for the media
              type: file.mimetype.startsWith("image") ? "image" : "video",
              postId: post.id, // Associate the media with the created post
            };
          });

          console.log(mediaRecords);

          // Create media records and associate them with the post
          await db.media.createMany({
            data: {
              url: mediaRecords.url,
              type: mediaRecords.type,
              postId: mediaRecords.postId
            },
          });
        }

        resolve(
          NextResponse.json(
            { post: post, message: "User successfully created Post" },
            { status: 200 }
          )
        );
      } catch (error) {
        console.log(error);
        reject(
          NextResponse.json(
            { message: "Could not create post" },
            { status: 500 }
          )
        );
      }
    });
  });
}

// export async function GET()




