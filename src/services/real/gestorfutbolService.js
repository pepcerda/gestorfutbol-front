import opcionsPagament from "../mock/opcionsPagament.json";
import apiClient from "./apiClient";

export const gestorfutbolService = {
  getAllCampaigns() {
    var response = apiClient.get("/campanyas");
    return response;
  },

  getCampaigns(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/campanyas",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  newCampaign(campaign) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/campanya",
      JSON.stringify(campaign),
      axiosConfig
    );
    return response;
  },

  deleteCampaign(id) {
    var response = apiClient.delete("/campanya/" + id);
    return response;
  },

  getMembers(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/socis",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  getAllMembers(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/all-socis",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveMember(member) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/patrocinadors",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  getAllSponsors(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    console.log(filter);
    var response = apiClient.post(
      "/all-patrocinadors",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveSponsor(sponsor) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/patrocinador",
      JSON.stringify(sponsor),
      axiosConfig
    );
    return response;
  },

  duplicaSponsor(sponsor, idCampanya) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/duplica-patrocinador/" + idCampanya,
      JSON.stringify(sponsor),
      axiosConfig
    );
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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/directius",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveDirectiu(directiu) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/directiu",
      JSON.stringify(directiu),
      axiosConfig
    );
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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/directiva",
      JSON.stringify(directiva),
      axiosConfig
    );
    return response;
  },

  baixaDirectiva(dataBaixa) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/directiva-baixa",
      JSON.stringify(dataBaixa),
      axiosConfig
    );
    return response;
  },

  checkDirectiva() {
    var response = apiClient.get("/check-directiva");
    return response;
  },

  listHistoricDirectiva() {
    var response = apiClient.get("/directiva-historic");
    return response;
  },

  getConfiguration() {
    var response = apiClient.get("/configuracio");
    return response;
  },

  saveConfiguration(configuracio) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/configuracio",
      JSON.stringify(configuracio),
      axiosConfig
    );
    return response;
  },

  getConfiguracioGeneral() {
    var response = apiClient.get("/config-general");
    return response;
  },

  getFacturas(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/factures",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveFactura(factura, file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "caixaFixa",
      new Blob([JSON.stringify(factura)], { type: "application/json" })
    );

    return apiClient.post("/factura", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteFactura(id) {
    var response = apiClient.delete("/factura/" + id);
    return response;
  },

  getTipoSoci(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/tipo-socis",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  getAllTipoSocis(idCampanya) {
    var response = apiClient.get("/tipo-socis/" + idCampanya);
    return response;
  },

  saveTipoSoci(tipoSoci) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/tipo-soci",
      JSON.stringify(tipoSoci),
      axiosConfig
    );
    return response;
  },

  deleteTipoSoci(id) {
    var response = apiClient.delete("/tipo-soci/" + id);
    return response;
  },

  getMembresPlantilla(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/membres-plantilla",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;


  },

  getJugadors(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/jugadors",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveJugador(jugador) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    console.log(jugador);
    var response = apiClient.post(
      "/jugador",
      JSON.stringify(jugador),
      axiosConfig
    );
    return response;
  },

  deleteJugador(id) {
    var response = apiClient.delete("/jugador/" + id);
    return response;
  },

  getEntrenadors(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/entrenadors",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveEntrenador(entrenador) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/entrenador",
      JSON.stringify(entrenador),
      axiosConfig
    );
    return response;
  },

  deleteEntrenador(id) {
    var response = apiClient.delete("/entrenador/" + id);
    return response;
  },

  getDelegats(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post(
      "/delegats",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveDelegat(delegat) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/delegat",
      JSON.stringify(delegat),
      axiosConfig
    );
    return response;
  },

  deleteDelegat(id) {
    var response = apiClient.delete("/delegat/" + id);
    return response;
  },

  getPosicions() {
    var response = apiClient.get("/posicions");
    return response;
  },

  getEstatsPagament() {
    var response = apiClient.get("/estats-pagament");
    return response;
  },

  getMensualitats(filter) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/mensualitats",
      JSON.stringify(filter),
      axiosConfig
    );
    return response;
  },

  saveMensualitat(mensualitat) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = apiClient.post(
      "/mensualitat",
      JSON.stringify(mensualitat),
      axiosConfig
    );
    return response;
  },

  deleteMensualitat(id) {
    var response = apiClient.delete("/mensualitat/" + id);
    return response;
  },

  saveNomina(nomina) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };  
    var response = apiClient.post(
      "/nomina",
      JSON.stringify(nomina),
      axiosConfig
    );
    return response;
  },

  deleteNomina(id) {
    var response = apiClient.delete("/nomina/" + id);
    return response;
  }
};
