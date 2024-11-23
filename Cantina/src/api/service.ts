import axios from 'axios'

export function postCriarPix(body: any) {
    console.log("chamou função")
    return axios.post('http://10.32.4.155:3000/criar-pix', body);

}