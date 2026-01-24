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
    },

    getDadesExplotacioPatrocinis(idCampanya) {
        var response = apiClient.get("/explotacio-patrocinis/" + idCampanya);
        return response;
    },

    getDadesExplotacioSocis(idCampanya) {
        var response = apiClient.get("/explotacio-socis/" + idCampanya);
        return response;
    },

    getDadesExplotacioCaixaFixa(idCampanya) {
        var response = apiClient.get("/explotacio-caixa-fixa/" + idCampanya);
        return response;
    },

    getDadesExplotacioFactures(idCampanya) {
        var response = apiClient.get("/explotacio-factures/" + idCampanya);
        return response;
    },

    getDadesExplotacioNomines(idCampanya) {
        var response = apiClient.get("/explotacio-nomines/" + idCampanya);
        return response;
    },

    getDadesExplotacioQuotes(idCampanya, idEquip) {
        var response = apiClient.get("/explotacio-quotes/" + idCampanya + "/" + idEquip);
        return response;
    }

}