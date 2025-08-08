import apiClient from "./apiClient";

export const explotacioDadesService = {

    getTotalImportSocisPerCampanya(idCampanya) {
        var response = apiClient.get("/total-socis/" + idCampanya);
        return response;
    },

    getTotalImportSocisPerCampanyaiEstatPagat(idCampanya) {
        var response = apiClient.get("/total-socis-pagat/" + idCampanya);
        return response;
    },

    getTotalImportSocisPerCampanyaiEstatNoPagat(idCampanya) {
        var response = apiClient.get("/total-socis-no-pagat/" + idCampanya);
        return response;
    },

    getTotalImportPatrocinis(idCampanya) {
        var response = apiClient.get("/total-patrocinis/" + idCampanya);
        return response;
    },

    getTotalImportPatrocinisiEstatPagat(idCampanya) {
        var response = apiClient.get("/total-patrocinis-pagat/" + idCampanya);
        return response;
    },

    getTotalImportPatrocinisiEstatNoPagat(idCampanya) {
        var response = apiClient.get("/total-patrocinis-no-pagat/" + idCampanya);
        return response;
    }

}