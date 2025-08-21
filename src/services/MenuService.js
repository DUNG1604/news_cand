import { Axios } from "./Axios";

const getMenu = (payload) => {
    const url = "/section/find-all";
    return Axios.get(url, payload);
}

export const menuService = {
    getMenu
};
