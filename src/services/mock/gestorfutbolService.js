import campaign from './campaign.json';
import members from './members.json';
import opcionsPagament from './opcionsPagament.json';

export const gestorfutbolService = {
    getCampaigns(apiFilter) {
        return Promise.resolve(campaign);
    },

    newCampaign(campaign) {
        console.log(campaign);
        return;
    },
    deleteCampaign(id) {
        console.log(id);
    },
    getMembers(apiFilter) {
        return Promise.resolve(members)
    },
    newMember(member) {
        console.log("Entra en new Member");
        console.log(member)
    },

    getOpcionsPagament() {
        return opcionsPagament.opcions_pagament;
    }
}