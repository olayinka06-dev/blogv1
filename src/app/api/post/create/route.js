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
      const mediaFiles = formData.get("media");
      
      console.log("mediafiles", mediaFiles);// Access the uploaded files through request.files

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
        if (mediaFiles) {
          console.log("check",mediaFiles);
          // Create media records and associate them with the post
          await db.media.createMany({
            data: {
              url: `/uploads/${mediaFiles.name}`,
              type: mediaFiles.type,
              postId: post.id
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

export async function GET(){
  try {
    const allData = await db.tag.findMany();
    return NextResponse.json({allData, message: "all data returned"}, {status: 200})
  } catch (error) {
    return NextResponse.json({ message: "unable to get data"}, {status: 500})
  }
}




