
import { NextFunction, Request, Response } from "express";


export default async function VerifyHeaders(req: Request,res: Response,next: NextFunction) {
  const AllowedHeaders = ["Authorization", "Content-Type"];
  let finish = 0
  for(let header = 0 ; req.header.length ; header ++){
    if(finish == AllowedHeaders.length){
      break
    }
    else if(req.headers[header] == AllowedHeaders[header]){
      finish += 1
    }else{
      res.status(403).json({
        error : "Headers Not Allowed"
      })
      break
    }
  }
}