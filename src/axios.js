import axios from 'axios'
const instance = axios.create({});

instance.defaults.headers.common['Accept'] = 'application/json';

const api = {
    list: async () => {
        const resp = await instance.get("/employee/list")
        return resp.data;
    },
    create: async (data) => {
        var form_data = new FormData();

        for (var key in data) {
            form_data.append(key, data[key]);
        }
        form_data.append('_do', 'employeeForm-submit')
        return await instance({
            method: "post",
            url: "/employee/add",
            data: form_data,
            headers: {"Content-Type": "multipart/form-data"},
        })
    },
    edit: async (data) => {
        var form_data = new FormData();

        for (var key in data) {
            form_data.append(key, data[key]);
        }
        form_data.append('_do', 'employeeForm-submit')
        return await instance({
            method: "post",
            url: `/employee/edit?employeeId=${data.id}`,
            data: form_data,
            headers: {"Content-Type": "multipart/form-data"},
        })
    },
    remove: async (id) => {
        return await instance({
            method: "get",
            url: `/employee/remove?employeeId=${id}`,
            headers: {"Content-Type": "multipart/form-data"},
        })
    }
}
export {
    api
}
export default instance