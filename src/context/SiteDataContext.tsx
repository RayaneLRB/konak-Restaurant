import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SiteData, MenuCategory, MenuItem, MenuSubSection, Experience, Review, Service, GalleryItem, ParallaxSection } from '../types';
import { defaultData } from '../data/defaultData';

const KEY = 'konak_site_data';
const uid = () => Math.random().toString(36).substr(2, 9);

function merge(saved: Partial<SiteData>): SiteData {
  return {
    ...defaultData, ...saved,
    settings: { ...defaultData.settings, ...(saved.settings || {}) },
    hero: { ...defaultData.hero, ...(saved.hero || {}) },
    about: { ...defaultData.about, ...(saved.about || {}) },
    menuSection: { ...defaultData.menuSection, ...(saved.menuSection || {}) },
    reviewsSection: { ...defaultData.reviewsSection, ...(saved.reviewsSection || {}) },
    images: { ...defaultData.images, ...(saved.images || {}) },
    menu: saved.menu?.length ? saved.menu : defaultData.menu,
    experiences: saved.experiences?.length ? saved.experiences : defaultData.experiences,
    gallery: saved.gallery?.length ? saved.gallery : defaultData.gallery,
    reviews: saved.reviews?.length ? saved.reviews : defaultData.reviews,
    services: saved.services?.length ? saved.services : defaultData.services,
    parallaxSections: saved.parallaxSections?.length ? saved.parallaxSections : defaultData.parallaxSections,
  };
}

interface Ctx {
  data: SiteData;
  updateSettings: (s: Partial<SiteData['settings']>) => void;
  updateHero: (h: Partial<SiteData['hero']>) => void;
  updateAbout: (a: Partial<SiteData['about']>) => void;
  updateMenuSection: (m: Partial<SiteData['menuSection']>) => void;
  updateReviewsSection: (r: Partial<SiteData['reviewsSection']>) => void;
  updateImage: (k: string, u: string) => void;
  updateMenuCategory: (id: string, u: Partial<MenuCategory>) => void;
  addMenuCategory: (c: Omit<MenuCategory, 'id'>) => void;
  deleteMenuCategory: (id: string) => void;
  updateMenuSubSection: (c: string, s: string, u: Partial<MenuSubSection>) => void;
  addMenuSubSection: (c: string, s: Omit<MenuSubSection, 'id'>) => void;
  deleteMenuSubSection: (c: string, s: string) => void;
  updateMenuItem: (c: string, s: string, i: string, u: Partial<MenuItem>) => void;
  addMenuItem: (c: string, s: string, i: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (c: string, s: string, i: string) => void;
  updateExperience: (id: string, u: Partial<Experience>) => void;
  addExperience: (e: Omit<Experience, 'id'>) => void;
  deleteExperience: (id: string) => void;
  updateReview: (id: string, u: Partial<Review>) => void;
  addReview: (r: Omit<Review, 'id'>) => void;
  deleteReview: (id: string) => void;
  updateService: (id: string, u: Partial<Service>) => void;
  addService: (s: Omit<Service, 'id'>) => void;
  deleteService: (id: string) => void;
  updateGalleryItem: (id: string, u: Partial<GalleryItem>) => void;
  addGalleryItem: (g: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  updateParallax: (id: string, u: Partial<ParallaxSection>) => void;
  resetToDefaults: () => void;
}

const C = createContext<Ctx | undefined>(undefined);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => {
    try { const s = localStorage.getItem(KEY); if (s) return merge(JSON.parse(s)); } catch {}
    return defaultData;
  });

  // Save to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const u = useCallback((fn: (p: SiteData) => SiteData) => setData(fn), []);

  const updateSettings = useCallback((s: Partial<SiteData['settings']>) => u(p => ({ ...p, settings: { ...p.settings, ...s } })), [u]);
  const updateHero = useCallback((h: Partial<SiteData['hero']>) => u(p => ({ ...p, hero: { ...p.hero, ...h } })), [u]);
  const updateAbout = useCallback((a: Partial<SiteData['about']>) => u(p => ({ ...p, about: { ...p.about, ...a } })), [u]);
  const updateMenuSection = useCallback((m: Partial<SiteData['menuSection']>) => u(p => ({ ...p, menuSection: { ...p.menuSection, ...m } })), [u]);
  const updateReviewsSection = useCallback((r: Partial<SiteData['reviewsSection']>) => u(p => ({ ...p, reviewsSection: { ...p.reviewsSection, ...r } })), [u]);
  const updateImage = useCallback((k: string, v: string) => u(p => ({ ...p, images: { ...p.images, [k]: v } })), [u]);

  const updateMenuCategory = useCallback((id: string, x: Partial<MenuCategory>) => u(p => ({ ...p, menu: p.menu.map(c => c.id === id ? { ...c, ...x } : c) })), [u]);
  const addMenuCategory = useCallback((c: Omit<MenuCategory, 'id'>) => u(p => ({ ...p, menu: [...p.menu, { ...c, id: uid() }] })), [u]);
  const deleteMenuCategory = useCallback((id: string) => u(p => ({ ...p, menu: p.menu.filter(c => c.id !== id) })), [u]);
  const updateMenuSubSection = useCallback((ci: string, si: string, x: Partial<MenuSubSection>) => u(p => ({ ...p, menu: p.menu.map(c => c.id === ci ? { ...c, subSections: c.subSections.map(s => s.id === si ? { ...s, ...x } : s) } : c) })), [u]);
  const addMenuSubSection = useCallback((ci: string, s: Omit<MenuSubSection, 'id'>) => u(p => ({ ...p, menu: p.menu.map(c => c.id === ci ? { ...c, subSections: [...c.subSections, { ...s, id: uid() }] } : c) })), [u]);
  const deleteMenuSubSection = useCallback((ci: string, si: string) => u(p => ({ ...p, menu: p.menu.map(c => c.id === ci ? { ...c, subSections: c.subSections.filter(s => s.id !== si) } : c) })), [u]);
  const updateMenuItem = useCallback((ci: string, si: string, ii: string, x: Partial<MenuItem>) => u(p => ({ ...p, menu: p.menu.map(c => c.id === ci ? { ...c, subSections: c.subSections.map(s => s.id === si ? { ...s, items: s.items.map(i => i.id === ii ? { ...i, ...x } : i) } : s) } : c) })), [u]);
  const addMenuItem = useCallback((ci: string, si: string, item: Omit<MenuItem, 'id'>) => u(p => ({ ...p, menu: p.menu.map(c => c.id === ci ? { ...c, subSections: c.subSections.map(s => s.id === si ? { ...s, items: [...s.items, { ...item, id: uid() }] } : s) } : c) })), [u]);
  const deleteMenuItem = useCallback((ci: string, si: string, ii: string) => u(p => ({ ...p, menu: p.menu.map(c => c.id === ci ? { ...c, subSections: c.subSections.map(s => s.id === si ? { ...s, items: s.items.filter(i => i.id !== ii) } : s) } : c) })), [u]);

  const updateExperience = useCallback((id: string, x: Partial<Experience>) => u(p => ({ ...p, experiences: p.experiences.map(e => e.id === id ? { ...e, ...x } : e) })), [u]);
  const addExperience = useCallback((e: Omit<Experience, 'id'>) => u(p => ({ ...p, experiences: [...p.experiences, { ...e, id: uid() }] })), [u]);
  const deleteExperience = useCallback((id: string) => u(p => ({ ...p, experiences: p.experiences.filter(e => e.id !== id) })), [u]);

  const updateReview = useCallback((id: string, x: Partial<Review>) => u(p => ({ ...p, reviews: p.reviews.map(r => r.id === id ? { ...r, ...x } : r) })), [u]);
  const addReview = useCallback((r: Omit<Review, 'id'>) => u(p => ({ ...p, reviews: [...p.reviews, { ...r, id: uid() }] })), [u]);
  const deleteReview = useCallback((id: string) => u(p => ({ ...p, reviews: p.reviews.filter(r => r.id !== id) })), [u]);

  const updateService = useCallback((id: string, x: Partial<Service>) => u(p => ({ ...p, services: p.services.map(s => s.id === id ? { ...s, ...x } : s) })), [u]);
  const addService = useCallback((s: Omit<Service, 'id'>) => u(p => ({ ...p, services: [...p.services, { ...s, id: uid() }] })), [u]);
  const deleteService = useCallback((id: string) => u(p => ({ ...p, services: p.services.filter(s => s.id !== id) })), [u]);

  const updateGalleryItem = useCallback((id: string, x: Partial<GalleryItem>) => u(p => ({ ...p, gallery: p.gallery.map(g => g.id === id ? { ...g, ...x } : g) })), [u]);
  const addGalleryItem = useCallback((g: Omit<GalleryItem, 'id'>) => u(p => ({ ...p, gallery: [...p.gallery, { ...g, id: uid() }] })), [u]);
  const deleteGalleryItem = useCallback((id: string) => u(p => ({ ...p, gallery: p.gallery.filter(g => g.id !== id) })), [u]);

  const updateParallax = useCallback((id: string, x: Partial<ParallaxSection>) => u(p => ({ ...p, parallaxSections: p.parallaxSections.map(v => v.id === id ? { ...v, ...x } : v) })), [u]);

  const resetToDefaults = useCallback(() => { setData(defaultData); try { localStorage.removeItem(KEY); } catch {} }, []);

  return (
    <C.Provider value={{
      data, updateSettings, updateHero, updateAbout, updateMenuSection, updateReviewsSection, updateImage,
      updateMenuCategory, addMenuCategory, deleteMenuCategory,
      updateMenuSubSection, addMenuSubSection, deleteMenuSubSection,
      updateMenuItem, addMenuItem, deleteMenuItem,
      updateExperience, addExperience, deleteExperience,
      updateReview, addReview, deleteReview,
      updateService, addService, deleteService,
      updateGalleryItem, addGalleryItem, deleteGalleryItem,
      updateParallax, resetToDefaults,
    }}>
      {children}
    </C.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}
