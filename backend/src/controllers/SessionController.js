import User from "../models/User"
import * as yup from 'yup'

class SessionController{
  async store(req, res){
    const schema = yup.object().shape({
      email: yup.string().required(),
      password: yup.string().required()
    })
    const { email, password } = req.body

    if(!(await schema.isValid(req.body))) return res.status(400).json({ error: 'Falha na validação' }) 
    
    let user = await User.findOne({ email })
    if(!user) {
      user = await User.create({ email, password })
    } else {
      if (user.password === password) {
        return res.json(user._id)
      } else {
        return res.status(401).json({ error: 'Senha incorreta' })
      }
    }

  }
}

export default new SessionController()