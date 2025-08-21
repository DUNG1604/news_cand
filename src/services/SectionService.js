import { Axios } from "./Axios";

const createSection = (payload) => {
    const url = "/section/create";
    return Axios.post(url, payload);
}

const updateSection = (id, payload) => {
    const url = `/section/update/${id}`;
    return Axios.put(url, payload);
}

const deleteSection = (id) => {
    const url = `/section/delete/${id}`;
    return Axios.del(url);
}

const uploadFile = (formData) => {
    const url = "/files/upload";
    return Axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const sectionService = {
    createSection,
    updateSection,
    deleteSection,
    uploadFile
};