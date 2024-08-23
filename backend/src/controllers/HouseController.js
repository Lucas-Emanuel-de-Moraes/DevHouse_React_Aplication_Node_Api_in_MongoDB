import House from "../models/House";
import User from "../models/User";
import * as yup from 'yup'

class HouseController{

  async index(req, res){
    const schema = yup.object().shape({
      status: yup.boolean(),
      all: yup.boolean()
    })
    if(!(await schema.isValid(req.headers))) return res.status(400).json({ error: 'Falha na validação' }) 
    const { status, all } = req.headers
    if(all) {
      const houses = await House.find()
      return res.json(houses)
    } else {
      if(status) {
        const houses = await House.find({ status: true })
        return res.json(houses)
      } else {
        const houses = await House.find({ status: false })
        return res.json(houses)
      }
    }
  }

  async store(req, res){
    const schema = yup.object().shape({
      description: yup.string().required(),
      price: yup.number().required(),
      location: yup.string().required(),
      status: yup.boolean().required()
    })
    const { filename } = req.file
    const { description, price, location, status } = req.body
    const { user_id } = req.headers

    if(!(await schema.isValid(req.body))) return res.status(400).json({ error: 'Falha na validação' }) 

    const house = await House.create({
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
    })

    return res.json(house)
  }

  async update(req, res){
    const schema = yup.object().shape({
      description: yup.string().required(),
      price: yup.number().required(),
      location: yup.string().required(),
      status: yup.boolean().required()
    })
    const { filename } = req.file
    const { description, price, location, status } = req.body
    const { user_id, house_id } = req.headers

    if(!(await schema.isValid(req.body))) return res.status(400).json({ error: 'Falha na validação' }) 

    const user = await User.findById(user_id)
    const house = await House.findById(house_id)

    if (String(user._id) !== String(house.user)) {
      return res.status(401).json({ error: 'Não autorizado' })
    }
    
    await House.updateOne({ _id: house_id }, {
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
    })

    return res.send()
  }

  async destroy(req, res) {
    const schema = yup.object().shape({
      user_id: yup.string().required(),
      house_id: yup.string().required()
    })
    if(!(await schema.isValid(req.headers))) return res.status(400).json({ error: 'Falha na validação' }) 
    const { user_id, house_id } = req.headers

    const user = await User.findById(user_id)
    const house = await House.findById(house_id)
    console.log(user)
    console.log(house)
    if (String(user._id) !== String(house.user)) {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    await House.findByIdAndDelete({ _id: house_id })
  }
}

export default new HouseController();