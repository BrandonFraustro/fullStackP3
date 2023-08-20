import axios from "axios";
const baseUrl = 'https://phonebook-backend-six.vercel.app/api/persons'
//const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
    .catch(error => console.log(error))
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, deletePerson }