
// helpers/season.ts
export const getSeasonStartYear = (d = new Date()) => {
  const m = d.getMonth(); // 0=Ene ... 6=Jul
  const y = d.getFullYear();
  return m >= 6 ? y : y - 1; // Jul es 6
};

export const getSeasonLabel = (startYear) => `${startYear}-${startYear + 1}`;

export const getCampaignStartYear = (c) =>
  new Date(c.any).getFullYear();