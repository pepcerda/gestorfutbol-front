import axios from "axios";
import opcionsPagament from '../mock/opcionsPagament.json';

export const gestorfutbolService = {

    getAllCampaigns() {
        var response = axios.get(process.env.REACT_APP_URL_BACK + "/campanyas");
        return response;
    },

    getCampaigns(filter) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = axios.post(process.env.REACT_APP_URL_BACK + "/campanyas", JSON.stringify(filter), axiosConfig);
        return response;
    },

    newCampaign(campaign) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = axios.post(process.env.REACT_APP_URL_BACK + "/campanya", JSON.stringify(campaign), axiosConfig);
        return response;
    },

    deleteCampaign(id) {
        var response = axios.delete(process.env.REACT_APP_URL_BACK + "/campanya/" + id);
        return response;
    },

    getMembers(filter) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = axios.post(process.env.REACT_APP_URL_BACK + "/socis", JSON.stringify(filter), axiosConfig);
        return response;
    },

    saveMember(member) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = axios.post(process.env.REACT_APP_URL_BACK + "/soci", JSON.stringify(member), axiosConfig);
        return response;
    },

    deleteMember(id) {
        var response = axios.delete(process.env.REACT_APP_URL_BACK + "/soci/" + id);
        return response;
    },

    getOpcionsPagament() {
        return opcionsPagament.opcions_pagament;
    },

    getSponsors(filter) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = axios.post(process.env.REACT_APP_URL_BACK + "/patrocinadors", JSON.stringify(filter), axiosConfig);
        return response;
    },

    saveSponsor(sponsor) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = axios.post(process.env.REACT_APP_URL_BACK + "/patrocinador", JSON.stringify(sponsor), axiosConfig);
        return response;
    },

    deleteSponsor(id) {
        var response = axios.delete(process.env.REACT_APP_URL_BACK + "/patrocinador/" + id);
        return response;
    },

    getReceipt(id) {
        var response = axios.get(process.env.REACT_APP_URL_BACK + "/patrocinador/rebut/" + id);
        return response;
    }
}