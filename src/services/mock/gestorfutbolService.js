import campaign from './campaign.json';
import members from './members.json';
import opcionsPagament from './opcionsPagament.json';
import sponsors from './sponsors.json';

export const gestorfutbolService = {
    getAllCampaigns() {
        return Promise.resolve(campaign);
    },

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
        return Promise.resolve(members);
    },
    newMember(member) {
        console.log("Entra en new Member");
        console.log(member)
    },

    deleteMember(id) {
        console.log(id);
    },

    getOpcionsPagament() {
        return opcionsPagament.opcions_pagament;
    },

    getSponsors(apiFilter) {
        return Promise.resolve(sponsors);
    },

    newSponsor(data) {
        console.log(data)
    },

    deleteSponsor(id) {
        console.log(id);
    }
}