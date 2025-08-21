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

export const sectionService = {
    createSection,
    updateSection,
    deleteSection
};