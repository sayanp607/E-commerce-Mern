import bcrypt from "bcrypt"

export const hashPassword = async(password)=>{
  try{
    const saltrounds = 10
      const hashedpassword = await bcrypt.hash(password,saltrounds)
      return hashedpassword
  }
  catch(error){
      console.log(error);
  }
}

export const comparepassword = async (password,hashedpassword)=>{
    return bcrypt.compare(password,hashedpassword)
}