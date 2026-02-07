import {data} from "../../database/data.js"


export const search=(id)=>{
    return  data.find(u => u.id === id);
}

export const insert= ({id, name, age, branch, year, phone})=>{
  data.push({
      id,
      name,
      age: parseInt(age),
      branch,
      year: parseInt(year),
      phone: parseInt(phone),
    })
}

export const getdata=()=>{
    return data;
}

export const deleteId=(id)=>{
     const index = data.findIndex(element => element.id === req.params.search_id);
    if (index !== -1) {
      data.splice(index, 1);
    }
}