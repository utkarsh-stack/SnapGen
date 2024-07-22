"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import Image from "../database/models/image.model"
import User from "../database/models/user.model"
import {v2 as cloudinary} from 'cloudinary'
import {redirect} from 'next/navigation'

const populateUser = (query: any) => query.populate({
  path: 'author',
  model: User,
  select: '_id firstName lastName clerkId'
})

//Add Image
export async function addImage({image, userId, path}: AddImageParams){
  try{
    await connectToDatabase()
    const author = await User.findById(userId)
    if(!author) throw new Error("User not found")
    const newImage = await Image.create({
      ...image,
      author: author._id
    })
    revalidatePath(path)
    return JSON.parse(JSON.stringify(newImage))
  }catch(error){
    handleError(error)
  }
}

//Update Image
export async function updateImage({image, userId, path}: UpdateImageParams){
  try{
    await connectToDatabase()
    const author = await User.findById(userId)
    if(!author) throw new Error("User not found")
    const imageToUpdate = await Image.findById(image._id)
    if(!imageToUpdate || imageToUpdate.author.toHexString()!=userId) 
      throw new Error("User not authorized or Image not found")

    const updatedImage = await User.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      {new: true}
    )
    revalidatePath(path)
    return JSON.parse(JSON.stringify(updatedImage))
  }catch(error){
    handleError(error)
  }
}

//Delete Image
export async function deleteImage(imageId: string){
  try{
    await connectToDatabase()
    await Image.findByIdAndDelete(imageId)
  }catch(error){
    handleError(error)
  }finally{
    redirect('/')
  }
}

//Get Image by ID
export async function getImageById(imageId: string){
  try{
    await connectToDatabase()
    const image = await populateUser(Image.findById(imageId))
    // const image = await Image.findById(imageId)
    if(!image) return new Error("Image not found")
    
    return JSON.parse(JSON.stringify(image))
  }catch(error){
    handleError(error)
  }
}

export async function getAllImages({limit=9, page=1, searchQuery=''}:{
  limit?: number;
  page:number;
  searchQuery?:string
}){
  try{
    await connectToDatabase()
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINART_API_SECRET,
      secure: true
    })

    let expression= 'folder=snapgen'
    if(searchQuery){
      expression+=`AND ${searchQuery}`
    }

    const {resources} = await cloudinary.search
            .expression(expression)
            .execute();
    
    
    const resourcesIds = resources.map((resource:any) => resource.public_id);
    let query = {}

    if(searchQuery){
      query = {
        publicId:{
          $in: resourcesIds
        }
      }
    }

    const skipAmount = (Number(page)-1)* limit;

    const images = await populateUser(Image.find(query))
                  .sort({updatedAt: -1})
                  .skip(skipAmount)
                  .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return{
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages/limit),
      savedImages
    }
    
  }catch(error){
    handleError(error)
  }
}

export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getFriendsImage({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string[];
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: {$in:userId}, public: true }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: {$in:userId}, public: true }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}