import House from "../models/House";

class DashboardController{
  async show(req, res) {
    const schema = yup.object().shape({
      status: yup.boolean(),
      all: yup.boolean(),
      user_id: yup.string().required()
    })
    if(!(await schema.isValid(req.headers))) return res.status(400).json({ error: 'Falha na validação' }) 
    const { status, all, user_id } = req.headers
    if(all) {
      const houses = await House.find({ user: user_id })
      return res.json(houses)
    } else {
      if(status) {
        const houses = await House.find({ status: true, user: user_id })
        return res.json(houses)
      } else {
        const houses = await House.find({ status: false, user: user_id })
        return res.json(houses)
      }
    }
  }
}

export default new DashboardController();