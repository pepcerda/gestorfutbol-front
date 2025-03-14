import opcionsPagament from '../mock/opcionsPagament.json';
import apiClient from "./apiClient";

export const gestorfutbolService = {

    getAllCampaigns() {
        var response = apiClient.get("/campanyas");
        return response;
    },

    getCampaigns(filter) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/campanyas", JSON.stringify(filter), axiosConfig);
        return response;
    },

    newCampaign(campaign) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/campanya", JSON.stringify(campaign), axiosConfig);
        console.log(response)
        return response;
    },

    deleteCampaign(id) {
        var response = apiClient.delete("/campanya/" + id);
        return response;
    },

    getMembers(filter) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/socis", JSON.stringify(filter), axiosConfig);
        return response;
    },

    saveMember(member) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/soci", JSON.stringify(member), axiosConfig);
        return response;
    },

    deleteMember(id) {
        var response = apiClient.delete("/soci/" + id);
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

        var response = apiClient.post("/patrocinadors", JSON.stringify(filter), axiosConfig);
        return response;
    },

    saveSponsor(sponsor) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/patrocinador", JSON.stringify(sponsor), axiosConfig);
        return response;
    },

    deleteSponsor(id) {
        var response = apiClient.delete("/patrocinador/" + id);
        return response;
    },

    getReceipt(id) {
        var response = apiClient.get("/patrocinador/rebut/" + id);
        return response;
    }
}