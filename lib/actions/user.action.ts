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
    const user = User.findOne({email:userEmail})
    return JSON.parse(JSON.stringify(user));
  }catch(error){
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


