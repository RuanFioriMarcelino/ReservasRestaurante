import axios from 'axios'

export function postCriarPix(body: any) {
    console.log("chamou função")
    return axios.post('http://192.168.1.27:3000/criar-pix', body);

}