import { Axios } from "./Axios";

const getSectionPage = (payload) => {
    const url = "/section-page/find-all";
    return Axios.get(url, payload);
}

const getSectionById = (id) => {
    const url = `/section-page/find-all?idSection=${id}`;
    return Axios.get(url);
}

export const sectionPageService = {
    getSectionPage,
    getSectionById
};
