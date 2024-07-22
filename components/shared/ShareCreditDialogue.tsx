import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCreditByClerkId } from "@/lib/actions/user.action"
import { DialogClose } from "@radix-ui/react-dialog"
import { revalidatePath } from "next/cache"
import Image from "next/image"
import { useState } from "react"

export const ShareCreditDialogue=({
  friendName,
  userCredit,
  friendId,
  userId
}:{
  friendName:string,
  userCredit:number,
  friendId:string,
  userId:string
}) => {
  const [creditToShare, setcreditToShare] = useState(userCredit)

  const updateCredits=async () =>{
    const loggedInUserUpdate = await updateCreditByClerkId(userId, -1*creditToShare )
    const friendUpdate = await updateCreditByClerkId(friendId, creditToShare)

  }
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Image
          src="/assets/icons/coins.svg"
          alt="coins"
          width={30}
          height={30}
          className='hover:cursor-pointer'
          />
        
      {/* <Button className=' bg-white'
          ><Image
          src="/assets/icons/coins.svg"
          alt="coins"
          width={50}
          height={50}
          /></Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send credits</DialogTitle>
          <DialogDescription>
            {"Send credits to " +friendName +" from your wallet"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Credit
            </Label>
            <Input
              id="name"
              defaultValue={userCredit}
              value={creditToShare}
              onChange={(e)=>setcreditToShare(e.target.value ==='' ? 0:parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
          <Button type="submit" onClick={updateCredits}>
            Send
          </Button>
          </DialogClose>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  )
}
