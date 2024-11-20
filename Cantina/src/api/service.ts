import axios from 'axios'

export function postCriarPix(body: any) {
    return axios.post('http://192.168.1.11:3000/criar-pix', body);

}