import apiClient from "./apiClient";

export const plantillesService = {

  getPlantilles() {
    var response = apiClient.get("/plantilles");
    return response;
  },

  getPlantilla(codiPlantilla) {
    var response = apiClient.get("/plantilla/" + codiPlantilla);
    return response;
  },

  savePlantilla(plantilla) {
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    var response = apiClient.post("/plantilla", JSON.stringify(plantilla), axiosConfig);
    return response;
  },
};
