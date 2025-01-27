
import { NextFunction, Request, Response } from "express";


export default async function VerifyHeaders(req: Request,res: Response,next: NextFunction) {
  const AllowedHeaders = ["Authorization", "Content-Type" , "Host" , "Accept" , "User-Agent" , "Content-Legth"];
  const requestHeaders = Object.keys(req.headers)
  const invalidHeader = requestHeaders.filter((header) =>{ 
    return !AllowedHeaders.includes(header)
  })
  if(invalidHeader.length > 0){
    res.status(400).json({
      error : "Header Not Allowed"
    })
    return
  }else{
    next()
  }
}