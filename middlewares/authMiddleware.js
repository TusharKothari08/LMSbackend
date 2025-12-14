import { clerkClient, getAuth } from "@clerk/express";

export  const protectEducator=async(req,res,next)=>{
    try{
        const userId=getAuth(req).userId;
        const response=await clerkClient.users.getUser(userId)

        if(response.publicMetadata.role !== 'educator'){
            return res.json({success:false,message:'unauthorizwd Access'})
        }
        next();
    } catch(error){
        res.json({success:false,message:error.message})
    }
}

