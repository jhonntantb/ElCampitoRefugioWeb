import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import pushCloudinary from "./pushCloudinary";

const apiUrl = "https://subdominio.api.elcampitorefugio.org";
const httpClient = fetchUtils.fetchJson;
let folder = '';

const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.map((resource) => ({ ...resource, id: resource._id })),
      total: parseInt(
        headers.get("Content-Range").toString().split("/").pop(),
        10
      ),
    }));
  },

  getOne: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`);

    return {
      data: { ...json, id: json._id },
    };
  },

  getMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await httpClient(url);

    return {
      data: json.map((res) => ({ ...res, id: res._id })),
    };
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.map((resource) => ({ ...resource, id: resource._id })),
      total: parseInt(headers.get("Content-Range").split("/").pop(), 10),
    }));
  },

  update: async (resource, params) => {
    switch (resource) {
      case "api/admin/users":   
        folder = 'users';
        if (params.data.image === null) params.data.image = "";
        else if (params.data.image.hasOwnProperty("rawFile"))
          params.data.image = await pushCloudinary(params.data.image, folder);
        else params.data.image = params.data.image.src;
        break;

      case "api/admin/dogs":
        folder = 'dogs';
        if (params.data.images.every((img) => img.hasOwnProperty("rawFile")))
          params.data.images = await pushCloudinary(params.data.images, folder);
        else if (params.data.images.every((img) => img.hasOwnProperty("index")))
          params.data.images = params.data.images.map((img) => img.src);
        else {
          const oldImages = params.data.images.filter((img) =>
            img.hasOwnProperty("src")
          );
          const urlsOld = oldImages.map((img) => img.src);
          const newImg = params.data.images.filter((img) => img.rawFile);

          const urlNew = await pushCloudinary(newImg, folder);
          params.data.images = [...urlsOld, ...urlNew];
        }
        break;

      case "api/admin/interfaces":
        folder = 'interface';
        if (params.data.imgVoluntarios === null)
          params.data.imgVoluntarios = "";
        else if (params.data.imgVoluntarios.hasOwnProperty("rawFile"))
          params.data.imgVoluntarios = await pushCloudinary(params.data.imgVoluntarios, folder);
        else params.data.imgVoluntarios = params.data.imgVoluntarios.src;

        if (params.data.imgNosotros === null) params.data.imgNosotros = "";
        else if (params.data.imgNosotros.hasOwnProperty("rawFile"))
          params.data.imgNosotros = await pushCloudinary(params.data.imgNosotros, folder);
        else params.data.imgVoluntarios = params.data.imgVoluntarios.src;

        if (params.data.slider.length > 0) {
          let newSlider = [];
          params.data.slider.forEach(async (e) => {
            if (e.hasOwnProperty("rawFile")) {
              e = await pushCloudinary(e, folder);
            } else {
              e = e.src;
            }
            newSlider.push(e);
          });
          params.data.slider = newSlider;
        }

        break;

      case "api/admin/press":
        folder = 'press';
        if (params.data.img === null) params.data.img = "";
        else if (params.data.img.hasOwnProperty("rawFile"))
          params.data.img = await pushCloudinary(params.data.img, folder);
        else params.data.img = params.data.img.src;
        break;
      
      case "api/admin/escolar":
        folder = 'escolar';
        if (params.data.img === null) params.data.img = "";
        else if (params.data.img.hasOwnProperty("rawFile"))
          params.data.img = await pushCloudinary(params.data.img, folder);
        else params.data.img = params.data.img.src;
        break;
        
      default:
        break;
    }

    const http = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    const { json } = http;

    return {
      data: { ...params.data, id: json._id },
    };
  },

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: async (resource, params) => {
    if (resource === "api/admin/dogs") {
      folder = 'dogs';
      params.data.images = await pushCloudinary(params.data.images, folder); //verificado
    }

    if (resource === "api/admin/users") {
      folder = 'users';
      params.data.image = await pushCloudinary(params.data.image, folder);
    }

    if (resource === "api/admin/interfaces") {
      folder = 'interface';
      params.data.slider = await pushCloudinary(params.data.slider, folder);
      params.data.imgNosotros = await pushCloudinary(params.data.imgNosotros, folder);
      params.data.imgVoluntarios = await pushCloudinary(params.data.imgVoluntarios, folder);
    }

    console.log(resource);
    console.log(params.data);

    const http = await httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });


    // const  json  = http.toObject();     
    const  json  = http; 
    

    return {
      data: { ...params.data, id: json._id },
    };
  },

  delete: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
      params: JSON.stringify(params.id),
    });

    return {
      //data: {...json, id: json._id, }
      ...json,
      id: json._id,
    };
  },

  deleteMany: async (resource, params) => {

    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    
    const { json } = await httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
      body: JSON.stringify(params.data),
    })
 
    return { data: json }
  }
};



export default dataProvider;
