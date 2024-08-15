import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
/*
for Login
1. npm i base-64
2. import base-64 and axios
3. const token = values.username+":"+values.password;
            const base64 = base_64.encode(token)
            try{
                const res = await axios.get("http://localhost:8085/user",{
                    headers:{
                        "Authorization": Basic ${base64}
                    }
                })
                console.log(res.data);
            }
            catch(err){
                alert("Can't login");
            }
Write this in handleSubmit.

for registration
1. import axios
2. let userData = {username: values.username,email:values.email,password:values.password,isAdmin: false}
            const res = await axios.post("http://localhost:8085/user/add",userData);
            console.log(res.data)
            */