import { Axios } from "./Axios";

const getSectionPage = (payload) => {
    const url = "/section-page/find-all";
    return Axios.get(url, payload);
}

const getSectionById = (id) => {
    const url = `/section-page/find-all?idSection=${id}`;
    return Axios.get(url);
}

const addSectionPage = (payload) => {
    const url = "/section-page/create";
    return Axios.post(url, payload);
}

const deleteSectionPage = (id) => {
    const url = `/section-page/delete/${id}`;
    return Axios.del(url);
}

const updateSectionPage = (id, payload) => {
    const url = `/section-page/update/${id}`;
    return Axios.put(url, payload);
}

const getSectionPageBySectionId = (id) => {
    const url = `/section-page/find-by-section?idSection=${id}`;
    return Axios.get(url);
}

export const sectionPageService = {
    getSectionPage,
    getSectionById,
    addSectionPage,
    deleteSectionPage,
    updateSectionPage,
    getSectionPageBySectionId
};
