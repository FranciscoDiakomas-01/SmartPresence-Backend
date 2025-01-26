import fs from 'node:fs'
import path from 'node:path'
import db from './dbConnection'

export default async function RunMigration() {
  
  const files = fs.readdirSync(path.join(process.cwd() + "/src/migrations"))
  if(files.length > 0 ){
    files.map(async(file) => {
      const filePath = path.join(process.cwd() + '/src/migrations/' + file)
      const content = fs.readFileSync(filePath).toString()
      if(content.length == 0){
        throw new Error("Migration Empty Error")
      }
      await db.query(content)
    })
  }else{
    throw new Error("No Migration Found")
  }
}