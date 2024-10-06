import campaign from './campaign.json'

export const gestorfutbolService = {
    getCampaigns() {
        return Promise.resolve(campaign);
    },

    newCampaign(campaign) {
        console.log(campaign);
        return;
    }
}