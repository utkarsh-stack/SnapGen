"use server"
import { handleError } from "../utils"
import { connectToDatabase } from "../database/mongoose"
import { revalidatePath } from "next/cache";
import FriendRequest from "../database/models/friendRequest.model";

//Create friend request record
export async function createFriendRequest(friendRequestRecord:FriendRequestParams) {
  try{
    await connectToDatabase();
      const newRecord = await FriendRequest.create(friendRequestRecord);
      revalidatePath("/friends")
      return JSON.parse(JSON.stringify(newRecord));

  }catch(error)
  {
    handleError(error);
  }
}

//Update friend request record
export async function acceptFriendRequest(friendRequestRecord:FriendRequestParams) {
  try{
    await connectToDatabase();
    const newRecord = await FriendRequest.findOneAndUpdate(
      {from:friendRequestRecord.from, to: friendRequestRecord.to, status: friendRequestRecord.status},
      {status: 1},
      {new: true}
    );
    return JSON.parse(JSON.stringify(newRecord));

  }catch(error)
  {
    handleError(error);
  }
}

//Reject request
export async function rejectFriendRequest(friendRequestRecord:FriendRequestParams) {
  try{
    await connectToDatabase();
    const newRecord = await FriendRequest.findOneAndUpdate(
      {from:friendRequestRecord.from, to: friendRequestRecord.to, status: friendRequestRecord.status},
      {status: 2},
      {new: true}
    );
    revalidatePath("/friends");
    return JSON.parse(JSON.stringify(newRecord));

  }catch(error)
  {
    handleError(error);
  }
}

export async function findAllFriendRequests(userId:string) {
  try{
    await connectToDatabase();
    const openRequests = await FriendRequest.find(
      {to:userId, status:0}
    )
    return JSON.parse(JSON.stringify(openRequests))
  }catch(error){
    handleError(error);
  }
}

