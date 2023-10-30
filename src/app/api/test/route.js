import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");
    try {
      if (!postId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      const comments = await db.comment.findMany({
        where: { postId: postId },
        select: {
          id: true,
          text: true,
          commentreply: {
            select: {
              id: true,
              text: true,
              childReplies: {
                select: {
                  id: true,
                  text: true,
                  user: {
                    select: {
                      id: true,
                      username: true,
                      profile: {
                        select: {
                          profilePicture: true,
                        },
                      },
                    },
                  },
                  createdAt: true,
                  updatedAt: true,
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                  profile: {
                    select: {
                      profilePicture: true,
                    },
                  },
                },
              },
              createdAt: true,
              updatedAt: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              profile: {
                select: {
                  profilePicture: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
      if (comments) {
        return NextResponse.json(
          comments,
          { message: "Single Comment Returned" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Unable to load Comment" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }