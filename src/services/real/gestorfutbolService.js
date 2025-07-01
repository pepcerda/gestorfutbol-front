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

    duplicaSponsor(sponsor, idCampanya) {
        console.log(idCampanya);
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/duplica-patrocinador/" + idCampanya, JSON.stringify(sponsor), axiosConfig);
        return response;
    },

    deleteSponsor(id) {
        var response = apiClient.delete("/patrocinador/" + id);
        return response;
    },

    getReceipt(id) {
        var response = apiClient.get("/patrocinador/rebut/" + id);
        return response;
    },

    listRolsDirectiu() {
        var response = apiClient.get("/rols-directius");
        return response;
    },

    getDirectius(filter) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/directius", JSON.stringify(filter), axiosConfig);
        return response;
    },

    saveDirectiu(directiu) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/directiu", JSON.stringify(directiu), axiosConfig);
        return response;
    },

    deleteDirectiu(id) {
        var response = apiClient.delete("/directiu/" + id);
        return response;
    },

    listDirectiva() {
        var response = apiClient.get("/directiva");
        return response;
    },

    saveDirectiva(directiva) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/directiva", JSON.stringify(directiva), axiosConfig);
        return response;
    },

    baixaDirectiva(dataBaixa) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        var response = apiClient.post("/directiva-baixa", JSON.stringify(dataBaixa), axiosConfig);
        return response;
    },

    checkDirectiva() {
        var response = apiClient.get("/check-directiva");
        return response;
    },

    listHistoricDirectiva() {
        var response = apiClient.get("/directiva-historic")
        return response;
    },

    getConfiguration() {
        var response = apiClient.get("/configuracio")
        return response;
    },

    saveConfiguration(configuracio) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        var response = apiClient.post("/configuracio", JSON.stringify(configuracio), axiosConfig);
        return response;
    },

    getConfiguracioGeneral() {
        var response = apiClient.get("/config-general")
        return response;
    },

    getFacturas(filter) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        var response = apiClient.post("/factures", JSON.stringify(filter), axiosConfig);
        return response;
    },

    saveFactura(factura) {
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        console.log(factura);
        var response = apiClient.post("/factura", JSON.stringify(factura), axiosConfig);
        return response;
    },

    deleteFactura(id) {
        var response = apiClient.delete("/factura/" + id);
        return response;
    }



}