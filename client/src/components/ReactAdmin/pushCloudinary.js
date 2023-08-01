
// import { IosShareRounded } from '@mui/icons-material';

import axios from 'axios';
// import dotenv from "dotenv";
// dotenv.config();

const name = process.env.REACT_APP_NAME_CLOUDINARY;
let preset = '';

const pushCloudinary = async (files, folder) => {
    try {
        if (folder === 'users') preset = 'Users_ONG';
        if (folder ==='dogs') preset = 'el_campito_ONG';
        if (folder === 'interface') preset = 'Interface_ONG';
        if (folder === 'press') preset = 'Press_ONG';
        if (folder === 'escolar') preset = 'Escolar_ONG';


        if(!Array.isArray(files)){

            const data = new FormData();
            data.append('file', files.rawFile);
            data.append('upload_preset', preset);         
            let res = await axios.post(`https://api.cloudinary.com/v1_1/${name}/auto/upload`, data); 

            return res.data.url; 

        }else{

            const photos = []; 
    
            for(let element of files){
                const data = new FormData();
                data.append('file', element.rawFile);
                data.append('upload_preset', preset); 
                let res = await axios.post(`https://api.cloudinary.com/v1_1/${name}/auto/upload`, data); 
                photos.push(res.data.url)
            }
    
            return photos; 
        }


    }catch(e){
        console.error({error: e})
    }

};

export default pushCloudinary;