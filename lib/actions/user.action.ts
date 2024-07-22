"use server"
import { handleError } from "../utils"
import { connectToDatabase } from "../database/mongoose"
import User from "../database/models/user.model";
import { revalidatePath } from "next/cache";

//Create User
export async function createUser(user:CreateUserParams) {
  try{
    await connectToDatabase();
      const newUser = await User.create(user);
      return JSON.parse(JSON.stringify(newUser));

  }catch(error)
  {
    handleError(error);
  }
}

export async function getUserByEmail(userEmail: String){
  try{
    await connectToDatabase();
    const user = await User.findOne({email:userEmail})
    if(!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  }catch(error){
    handleError(error);
  }
}

export async function removeFriend(clerkId: string, friendId: string) {
  try {
    await connectToDatabase();

    // Find the user and update the friends array
    const updatedUser = await User.findOneAndUpdate(
      { clerkId }, // Match by userId
      { $pull: { friends: friendId } }, // Remove friendId from the friends array
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }
    revalidatePath("/friends");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function addFriend(clerkId: string, friendId: string) {
  try {
    await connectToDatabase();

    // Find the user and update the friends array
    const updatedUser = await User.findOneAndUpdate(
      { clerkId }, // Match by userId
      { $addToSet: { friends: friendId } }, // Add friendId to the friends array
      { new: true } // Return the updated document
    );


    if (!updatedUser) {
      throw new Error("User not found");
    }

    revalidatePath("/friends");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

//Read User
export async function getUserById(userId: String){
  try{
    await connectToDatabase();
    const user = await User.findOne({clerkId: userId});
    if(!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  }catch(error){
    handleError(error);
  }
}


//Update User
export async function updateUser(clerkId: String, updatedData: UpdateUserParams){
  try{
    await connectToDatabase();
    const updatedUser =await User.findOneAndUpdate({clerkId}, updatedData, {new: true})
    if(!updatedUser) throw new Error("User not found");
    return JSON.parse(JSON.stringify(updatedUser));
  }catch(error){
    handleError(error);
  }
}

//Delete User
export async function deleteUserById(clerkId: String){
  try{
    await connectToDatabase();
    const userToDelete = await User.findOne({clerkId})
    if(!userToDelete) throw new Error("User not found");
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");
    return deletedUser? JSON.parse(JSON.stringify(deletedUser)): null;
  }catch(error){
    handleError(error);
  }
}

//Use credit

export async function updateCredit(userId: string, creditFee: Number){
  try{
    await connectToDatabase();
    const updatedUserCredit = await User.findOneAndUpdate(
      {_id: userId},
      {$inc: {creditBalance: creditFee}},
      {new: true}
    )
    if(!updatedUserCredit) throw new Error("User credit update failed")
    return JSON.parse(JSON.stringify(updatedUserCredit))

  }catch(error){
    handleError(error)
  }
}

export async function updateCreditByClerkId(userId: string, creditFee: Number){
  try{
    await connectToDatabase();
    const updatedUserCredit = await User.findOneAndUpdate(
      {clerkId: userId},
      {$inc: {creditBalance: creditFee}},
      {new: true}
    )
    if(!updatedUserCredit) throw new Error("User credit update failed")
    return JSON.parse(JSON.stringify(updatedUserCredit))

  }catch(error){
    handleError(error)
  }
}


