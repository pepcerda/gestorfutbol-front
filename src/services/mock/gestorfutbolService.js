import campaign from './campaign.json';
import members from './members.json';

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
        console.log(member)
    }
}