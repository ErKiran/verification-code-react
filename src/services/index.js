import Axios from 'axios';
const SERVER_URL = "https://backend-verify-code.herokuapp.com"

export const SubmitCode = async(codes)=>{
    return Axios.post(`${SERVER_URL}/verify`, {...codes})
}