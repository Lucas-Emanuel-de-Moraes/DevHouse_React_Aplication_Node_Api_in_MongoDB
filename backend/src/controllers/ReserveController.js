import Reserve from "../models/Reserve";
import User from "../models/User";
import House from "../models/House";

class ReserveController{

  async index(req, res) {
    const schema = yup.object().shape({
      user_id: yup.string().required(),
    })
    if(!(await schema.isValid(req.headers))) return res.status(400).json({ error: 'Falha na validação' }) 
    const { user_id } = req.headers
    const reserves = await Reserve.find({ user: user_id }).populate('house')

    return res.json(reserves)
  }

  async store(req, res) {
    const schema_headers = yup.object().shape({
      user_id: yup.string().required()
    })
    const schema_body = yup.object().shape({
      date: yup.string().required(),
      house_id: yup.string().required()
    })
    if(!(await schema_headers.isValid(req.headers))) return res.status(400).json({ error: 'Falha na validação' }) 
    if(!(await schema_body.isValid(req.body))) return res.status(400).json({ error: 'Falha na validação' }) 
    const { user_id } = req.headers
    const { date, house_id } = req.body

    const house = await House.findById(house_id)
    if(!house) return res.status(400).json({ error: 'Casa não existe' })
    if(house.status !== true) return res.status(400).json({ error: 'Solicitação indisponível' })
    
    const user = await User.findById(user_id)
    if(String(user._id) === String(house.user)) return res.status(401).json({ error: 'Não autorizado' })

    const reserve = await Reserve.create({
      user: user_id,
      house: house_id,
      date
    })

    await reserve.populate('house')

    return res.json(reserve)
  }

  async destroy(req, res) {
    const schema_headers = yup.object().shape({
      reserve_id: yup.string().required()
    })
    if(!(await schema_headers.isValid(req.headers))) return res.status(400).json({ error: 'Falha na validação' }) 
    const { reserve_id } = req.headers

    await Reserve.findByIdAndDelete({ _id: reserve_id })

    return res.send();
  }
}

export default new ReserveController()