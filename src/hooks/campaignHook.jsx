
// context/CampaignContext.jsx
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState
} from 'react';
import { getCampaignStartYear, getSeasonLabel, getSeasonStartYear } from '../helpers/temporada';

const CampaignContext = createContext(undefined);

export const CampaignProvider = ({ campaigns, fallbackStrategy = 'latest', children }) => {
  const [seasonStartYear, setSeasonStartYear] = useState(getSeasonStartYear());
  const seasonLabel = useMemo(() => getSeasonLabel(seasonStartYear), [seasonStartYear]);

  const [activeId, setActiveId] = useState(null);

  const tabMenuItems = useMemo(
    () => (campaigns ?? []).map(c => ({ label: c.titol, id: c.id })),
    [campaigns]
  );

  const resolveDefaultCampaign = useCallback(() => {
    if (!campaigns?.length) return null;
    const exact = campaigns.find(c => getCampaignStartYear(c) === seasonStartYear);
    if (exact) return exact;

    if (fallbackStrategy === 'latest') {
      const sorted = [...campaigns].sort(
        (a, b) => getCampaignStartYear(b) - getCampaignStartYear(a)
      );
      return sorted[0] ?? null;
    }
    return campaigns[0] ?? null;
  }, [campaigns, seasonStartYear, fallbackStrategy]);

  useEffect(() => {
    if (!campaigns?.length) return;
    const stillExists = campaigns.some(c => c.id === activeId);
    if (!stillExists) {
      const def = resolveDefaultCampaign();
      setActiveId(def?.id ?? null);
    }
  }, [campaigns, seasonStartYear, resolveDefaultCampaign]);

  const activeIndex = useMemo(() => {
    if (!campaigns?.length || activeId == null) return -1;
    return campaigns.findIndex(c => c.id === activeId);
  }, [campaigns, activeId]);

  const activeCampaign = useMemo(() => {
    if (activeIndex < 0) return null;
    return campaigns[activeIndex] ?? null;
  }, [campaigns, activeIndex]);

  const setActiveById = useCallback((id) => setActiveId(id), []);
  const setActiveByIndex = useCallback((index) => {
    const id = campaigns?.[index]?.id ?? null;
    setActiveId(id);
  }, [campaigns]);

  const refreshSeason = useCallback(() => setSeasonStartYear(getSeasonStartYear()), []);

  const timerRef = useRef(null);
  useEffect(() => {
    const scheduleNextTick = () => {
      const now = new Date();
      const year = now.getFullYear();
      const nextBoundary = new Date(now.getMonth() >= 6 ? year + 1 : year, 6, 1, 0, 0, 0, 0);
      const ms = nextBoundary.getTime() - now.getTime();
      const delay = Math.min(ms, 24 * 60 * 60 * 1000);
      timerRef.current = window.setTimeout(() => {
        setSeasonStartYear(getSeasonStartYear());
        scheduleNextTick();
      }, Math.max(delay, 60 * 1000));
    };
    scheduleNextTick();
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, []);

  const value = {
    
    campaigns,
    seasonStartYear,
    seasonLabel,
    activeCampaignId: activeId,
    activeCampaign,
    activeIndex,
    tabMenuItems,
    setActiveById,
    setActiveByIndex,
    refreshSeason
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useActiveCampaign = () => {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useActiveCampaign debe usarse dentro de <CampaignProvider>');
  return ctx;
};
