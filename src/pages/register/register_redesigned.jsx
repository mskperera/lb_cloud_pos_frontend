/**
 * Legend POS — Premium Redesign
 * Drop-in replacement for Register.jsx + ProductList.jsx + ProductItem.jsx
 * Matches the legend-pos_redesign_7.html design system exactly.
 *
 * Usage: Replace your existing Register page with <RegisterPage />
 * All Redux dispatch calls, API hooks, and prop signatures are preserved.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── CSS VARIABLES (inject once at root) ──────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  :root {
    --lpos-bg: #f2f2f7;
    --lpos-surface: #ffffff;
    --lpos-border: rgba(0,0,0,0.08);
    --lpos-text-primary: #1c1c1e;
    --lpos-text-secondary: #6e6e73;
    --lpos-text-tertiary: #aeaeb2;
    --lpos-accent: #0071e3;
    --lpos-accent-soft: rgba(0,113,227,0.10);
    --lpos-accent-medium: rgba(0,113,227,0.15);
    --lpos-red: #ff3b30;
    --lpos-green: #34c759;
    --lpos-shadow-sm: 0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
    --lpos-shadow-md: 0 4px 16px rgba(0,0,0,0.08),0 2px 6px rgba(0,0,0,0.04);
    --lpos-shadow-lg: 0 12px 36px rgba(0,0,0,0.12),0 4px 12px rgba(0,0,0,0.06);
    --lpos-radius-sm: 10px;
    --lpos-radius-md: 14px;
    --lpos-sidebar-w: 58px;
    --lpos-sidebar-w-exp: 216px;
    --lpos-cart-w: 340px;
    --lpos-trans: 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  .lpos-app * { box-sizing: border-box; }
  .lpos-app {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--lpos-bg);
    color: var(--lpos-text-primary);
    -webkit-font-smoothing: antialiased;
  }
  /* Sidebar transitions */
  .lpos-sidebar { width: var(--lpos-sidebar-w); transition: width var(--lpos-trans); }
  .lpos-sidebar.expanded { width: var(--lpos-sidebar-w-exp); }
  .lpos-si-label { opacity:0; width:0; overflow:hidden; transition: opacity var(--lpos-trans), width var(--lpos-trans); flex:1; white-space:nowrap; }
  .lpos-sidebar.expanded .lpos-si-label { opacity:1; width:auto; }
  .lpos-si-badge { opacity:0; width:0; overflow:hidden; transition: opacity var(--lpos-trans), width var(--lpos-trans); flex-shrink:0; }
  .lpos-sidebar.expanded .lpos-si-badge { opacity:1; width:auto; }
  .lpos-sidebar-label { opacity:0; height:0; overflow:hidden; transition: opacity var(--lpos-trans), height var(--lpos-trans); }
  .lpos-sidebar.expanded .lpos-sidebar-label { opacity:1; height:22px; }
  /* Tooltip */
  .lpos-si-wrap { position:relative; }
  .lpos-si-tooltip {
    position:absolute; left:calc(100% + 10px); top:50%; transform:translateY(-50%);
    background: var(--lpos-text-primary); color:white; font-size:12px; font-weight:600;
    padding:5px 10px; border-radius:7px; white-space:nowrap;
    pointer-events:none; opacity:0; z-index:9999;
    box-shadow: var(--lpos-shadow-md); transition:opacity .15s;
  }
  .lpos-si-tooltip::before {
    content:''; position:absolute; left:-5px; top:50%; transform:translateY(-50%);
    border-width:5px 5px 5px 0; border-style:solid;
    border-color:transparent var(--lpos-text-primary) transparent transparent;
  }
  .lpos-sidebar:not(.expanded) .lpos-si-wrap:hover .lpos-si-tooltip { opacity:1; }
  /* Logo */
  .lpos-logo { opacity:0; width:0; overflow:hidden; transition: opacity var(--lpos-trans), width var(--lpos-trans); }
  .lpos-sidebar.expanded .lpos-logo { opacity:1; width:130px; }
  /* Product card hover */
  .lpos-product-card {
    background: var(--lpos-surface);
    border-radius: var(--lpos-radius-md);
    padding: 14px;
    cursor: pointer;
    transition: all .2s cubic-bezier(.34,1.56,.64,1);
    box-shadow: var(--lpos-shadow-sm);
    border: 1.5px solid transparent;
    position: relative;
    overflow: hidden;
  }
  .lpos-product-card:hover { transform:translateY(-3px) scale(1.01); box-shadow: var(--lpos-shadow-md); border-color: var(--lpos-border); }
  .lpos-product-card.in-cart { border-color: var(--lpos-accent); box-shadow: 0 0 0 1px var(--lpos-accent-medium), var(--lpos-shadow-md); }
  .lpos-product-card:active { transform:scale(.97); }
  /* Category tab */
  .lpos-cat-tab {
    padding: 8px 16px; border-radius: var(--lpos-radius-sm); border: none;
    background: var(--lpos-surface);
    font-size: 13.5px; font-weight: 600; color: var(--lpos-text-secondary);
    cursor: pointer; transition: all .18s; white-space: nowrap;
    box-shadow: var(--lpos-shadow-sm); flex-shrink: 0; font-family: inherit;
  }
  .lpos-cat-tab:hover { background:white; color: var(--lpos-text-primary); transform:translateY(-1px); box-shadow: var(--lpos-shadow-md); }
  .lpos-cat-tab.active { background: var(--lpos-accent); color:white; box-shadow: 0 4px 12px rgba(0,113,227,.3); transform:translateY(-1px); }
  /* Search */
  .lpos-search-input:focus { outline:none; border-color: var(--lpos-accent); background:white; box-shadow: 0 0 0 3px var(--lpos-accent-soft); }
  /* Cart item slide-in */
  @keyframes lpos-slideIn { from { transform:translateX(20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes lpos-popIn { from { transform:scale(0); opacity:0; } to { transform:scale(1); opacity:1; } }
  .lpos-cart-item { animation: lpos-slideIn .2s cubic-bezier(.34,1.56,.64,1); }
  /* Toast */
  #lpos-toast { position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(20px); background: var(--lpos-text-primary); color:white; padding:10px 18px; border-radius:20px; font-size:13px; font-weight:600; opacity:0; transition:all .25s; z-index:9999; pointer-events:none; white-space:nowrap; }
  #lpos-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
  /* Custom scrollbar */
  .lpos-scroll { scrollbar-width:thin; scrollbar-color: var(--lpos-border) transparent; }
  .lpos-scroll::-webkit-scrollbar { width:4px; }
  .lpos-scroll::-webkit-scrollbar-thumb { background: var(--lpos-border); border-radius:4px; }
  /* Qty btn */
  .lpos-qty-btn { width:24px; height:24px; border-radius:6px; border:none; background:white; color: var(--lpos-text-secondary); cursor:pointer; font-size:15px; font-weight:700; display:flex; align-items:center; justify-content:center; transition:all .15s; box-shadow: var(--lpos-shadow-sm); line-height:1; }
  .lpos-qty-btn:hover { background: var(--lpos-accent); color:white; }
  /* Proceed btn */
  .lpos-btn-proceed { background: linear-gradient(135deg, var(--lpos-accent), #0a84ff); box-shadow: 0 4px 14px rgba(0,113,227,.35); transition: all .2s; }
  .lpos-btn-proceed:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,113,227,.4); }
  /* Mobile */
  @media (max-width: 639px) {
    :root { --lpos-cart-w: 100%; }
    .lpos-sidebar { position:absolute; left:0; top:0; bottom:0; width: var(--lpos-sidebar-w-exp) !important; z-index:500; transform:translateX(-100%); transition:transform var(--lpos-trans); }
    .lpos-sidebar.mob-open { transform:translateX(0); box-shadow:4px 0 24px rgba(0,0,0,0.14); }
    .lpos-main { position:absolute; inset:0; z-index:300; transform:translateY(100%); transition:transform var(--lpos-trans); border-radius:20px 20px 0 0; overflow:hidden; background: var(--lpos-bg); }
    .lpos-main.mob-open { transform:translateY(0); }
    .lpos-cart { width:100% !important; }
    .lpos-sidebar .lpos-si-label { opacity:1 !important; width:auto !important; }
    .lpos-sidebar .lpos-sidebar-label { opacity:1 !important; height:22px !important; }
    .lpos-sidebar .lpos-logo { opacity:1 !important; width:130px !important; }
  }
  @media (max-width: 1024px) {
    :root { --lpos-cart-w: 300px; }
  }
`;

// ─── ICONS (inline SVGs) ──────────────────────────────────────────────────────
const Icon = {
  Menu: () => <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Search: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Barcode: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5v14M7 5v14M11 5v14M15 5v8M19 5v8M15 17v2M19 17v2M3 3h4M3 21h4M17 3h4M17 21h4"/></svg>,
  Bell: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Refresh: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  Location: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Cart: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7h11.8M10 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0m7 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/></svg>,
  History: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v3l2 2"/></svg>,
  Doc: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Plus: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Calendar: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Home: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Grid: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  X: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronDown: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  Tag: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Discount: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 14 5-5"/><circle cx="9.5" cy="9.5" r=".5" fill="currentColor"/><circle cx="14.5" cy="14.5" r=".5" fill="currentColor"/></svg>,
  User: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Trash: () => <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Clone: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M3 16V5a2 2 0 0 1 2-2h11"/></svg>,
  Expand: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
  Compress: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>,
  Back: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>,
  Package: () => <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  EmptyCart: () => <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Note: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Return: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 14l-5-5 5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>,
};

// ─── FORMAT CURRENCY ──────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  if (amount == null) return "Rs 0.00";
  return `Rs ${Number(amount).toFixed(2)}`;
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
let _toastTimer;
const showToast = (msg) => {
  const el = document.getElementById("lpos-toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
};

// ═════════════════════════════════════════════════════════════════════════════
// PRODUCT ITEM
// ═════════════════════════════════════════════════════════════════════════════
const ProductItem = ({ p, handleProductClick, inCart }) => {
  const isVariation = p.productTypeId === 2;
  const hasImage = Boolean(p.imageUrl);
  const isStockTracked = Boolean(p.isStockTracked);
  const stockText = isStockTracked && p.stockQty > 0 ? `${p.stockQty} ${p.measurementUnitName || ""}`.trim() : "";
  const sku = p.sku || (p.variationProducts ? JSON.parse(p.variationProducts)?.[0]?.sku : null);
  const unitPrice = p.unitPrice || (p.variationProducts ? JSON.parse(p.variationProducts)?.[0]?.unitPrice : null);

  const initial = (p.productName || "P").charAt(0).toUpperCase();
  const colors = ["#0071e3","#34c759","#ff9500","#ff3b30","#af52de","#5ac8fa","#ff2d55","#007aff"];
  const colorIdx = p.productName ? p.productName.charCodeAt(0) % colors.length : 0;
  const bgColor = colors[colorIdx];

  return (
    <div
      className={`lpos-product-card${inCart ? " in-cart" : ""}`}
      onClick={() => handleProductClick(p)}
      title={p.productName}
    >
      {inCart && (
        <div style={{
          position:"absolute",top:10,right:10,
          width:22,height:22,background:"var(--lpos-accent)",borderRadius:"50%",
          display:"flex",alignItems:"center",justifyContent:"center",
          color:"white",fontSize:11,fontWeight:700,
          boxShadow:"0 2px 6px rgba(0,113,227,.4)",
          animation:"lpos-popIn .2s cubic-bezier(.34,1.56,.64,1)",
        }}>{inCart}</div>
      )}
      {/* Thumb */}
      <div style={{
        width:"100%",aspectRatio:"1",borderRadius:10,
        background:"var(--lpos-bg)",display:"flex",alignItems:"center",
        justifyContent:"center",marginBottom:10,overflow:"hidden",
      }}>
        {hasImage ? (
          <img
            src={p.imageUrl}
            alt={p.productName}
            style={{width:"100%",height:"100%",objectFit:"cover"}}
            onError={(e)=>{ e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
          />
        ) : null}
        {!hasImage && (
          <div style={{
            width:"100%",height:"100%",display:"flex",alignItems:"center",
            justifyContent:"center",background:bgColor+"18",
            fontSize:28,fontWeight:800,color:bgColor,
          }}>
            {isVariation ? <Icon.Clone /> : initial}
          </div>
        )}
      </div>
      {/* Name */}
      <div style={{fontSize:12.5,fontWeight:600,lineHeight:1.35,marginBottom:3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
        {p.productName}
      </div>
      {/* SKU */}
      {sku && <div style={{fontSize:10.5,color:"var(--lpos-text-tertiary)",marginBottom:5,fontWeight:500,fontFamily:"monospace"}}>{sku}</div>}
      {/* Price row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--lpos-accent)"}}>
          {isVariation ? <span style={{fontSize:11,color:"var(--lpos-text-secondary)",fontWeight:600}}>Multiple prices</span> : formatCurrency(unitPrice)}
        </div>
        {stockText && (
          <div style={{fontSize:10,fontWeight:600,color:"var(--lpos-green)",background:"rgba(52,199,89,.1)",padding:"1px 6px",borderRadius:20}}>
            {stockText}
          </div>
        )}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// CATEGORY TABS BAR
// ═════════════════════════════════════════════════════════════════════════════
const CategoryBar = ({ categories, selectedCategoryId, onSelect }) => {
  const [overflowIds, setOverflowIds] = useState([]);
  const [dropOpen, setDropOpen] = useState(false);
  const barRef = useRef();
  const moreRef = useRef();

  const allCats = [{ categoryId: -1, categoryName: "All Items" }, ...categories];

  useEffect(() => {
    measureTabs();
  }, [categories]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measureTabs());
    if (barRef.current) ro.observe(barRef.current);
    return () => ro.disconnect();
  }, [categories]);

  const measureTabs = () => {
    if (!barRef.current) return;
    const containerW = barRef.current.offsetWidth - 80; // reserve for "More" btn
    let used = 0;
    const overflow = [];
    allCats.forEach((c, i) => {
      const approxW = c.categoryName.length * 8.5 + 34;
      if (i > 0 && used + approxW > containerW) {
        overflow.push(c.categoryId);
      } else {
        used += approxW + 8;
      }
    });
    setOverflowIds(overflow);
  };

  const visibleCats = allCats.filter(c => !overflowIds.includes(c.categoryId));
  const hiddenCats = allCats.filter(c => overflowIds.includes(c.categoryId));
  const activeInOverflow = overflowIds.includes(selectedCategoryId);

  return (
    <div style={{padding:"14px 20px 0",display:"flex",alignItems:"center",gap:8,flexShrink:0,position:"relative"}}>
      <div ref={barRef} style={{display:"flex",gap:8,flex:1,overflow:"hidden",minWidth:0}}>
        {visibleCats.map(c => (
          <button
            key={c.categoryId}
            className={`lpos-cat-tab${selectedCategoryId===c.categoryId?" active":""}`}
            onClick={() => onSelect(c)}
          >
            {c.categoryName}
          </button>
        ))}
      </div>
      {hiddenCats.length > 0 && (
        <div ref={moreRef} style={{position:"relative",flexShrink:0}}>
          <button
            onClick={() => setDropOpen(v=>!v)}
            style={{
              display:"flex",alignItems:"center",gap:5,padding:"8px 13px",
              borderRadius:"var(--lpos-radius-sm)",border:activeInOverflow?"1.5px solid var(--lpos-accent-medium)":"none",
              background:activeInOverflow?"var(--lpos-accent-soft)":"var(--lpos-surface)",
              fontFamily:"inherit",fontSize:13.5,fontWeight:600,
              color:activeInOverflow?"var(--lpos-accent)":"var(--lpos-text-secondary)",
              cursor:"pointer",boxShadow:"var(--lpos-shadow-sm)",flexShrink:0,
            }}
          >
            More <span style={{background:"var(--lpos-accent)",color:"white",fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:10}}>{hiddenCats.length}</span>
            <span style={{transform:dropOpen?"rotate(180deg)":"rotate(0)",transition:"transform .2s",display:"flex"}}><Icon.ChevronDown /></span>
          </button>
          {dropOpen && (
            <div style={{
              position:"absolute",right:0,top:"calc(100% + 8px)",
              minWidth:210,background:"var(--lpos-surface)",
              borderRadius:"var(--lpos-radius-md)",
              boxShadow:"0 8px 30px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.07)",
              border:"1px solid var(--lpos-border)",padding:6,zIndex:2000,
            }}>
              {hiddenCats.map(c => (
                <div
                  key={c.categoryId}
                  onClick={() => { onSelect(c); setDropOpen(false); }}
                  style={{
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"9px 12px",borderRadius:9,cursor:"pointer",
                    fontSize:13.5,fontWeight:c.categoryId===selectedCategoryId?600:500,
                    color:c.categoryId===selectedCategoryId?"var(--lpos-accent)":"var(--lpos-text-secondary)",
                    background:c.categoryId===selectedCategoryId?"var(--lpos-accent-soft)":"transparent",
                    transition:"background .13s",gap:10,
                  }}
                  onMouseEnter={e=>{ if(c.categoryId!==selectedCategoryId) e.currentTarget.style.background="var(--lpos-bg)"; }}
                  onMouseLeave={e=>{ if(c.categoryId!==selectedCategoryId) e.currentTarget.style.background="transparent"; }}
                >
                  {c.categoryName}
                  {c.categoryId===selectedCategoryId && (
                    <div style={{width:16,height:16,borderRadius:"50%",background:"var(--lpos-accent)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {dropOpen && <div style={{position:"fixed",inset:0,zIndex:1999}} onClick={()=>setDropOpen(false)}/>}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═════════════════════════════════════════════════════════════════════════════
const Sidebar = ({ expanded, onNavigate, onAction, storeName, isMobOpen, onMobClose }) => {
  const navItems = [
    { id:"sale", icon:<Icon.Cart/>, label:"New Sale", active:true },
    { id:"lookup", icon:<Icon.Search/>, label:"Item Lookup" },
    { id:"history", icon:<Icon.History/>, label:"Sales History", badge:null },
    { id:"custom", icon:<Icon.Plus/>, label:"Add Custom Item" },
  ];
  const bottomItems = [
    { id:"dayend", icon:<Icon.Calendar/>, label:"Day End" },
    { id:"home", icon:<Icon.Home/>, label:"Home" },
  ];

  const cls = `lpos-sidebar${expanded?" expanded":""}${isMobOpen?" mob-open":""}`;
  return (
    <>
      {isMobOpen && <div onClick={onMobClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",zIndex:490,backdropFilter:"blur(2px)"}}/>}
      <aside className={cls} style={{
        background:"var(--lpos-surface)",borderRight:"1px solid var(--lpos-border)",
        display:"flex",flexDirection:"column",padding:"10px 8px",gap:2,
        overflowX:"hidden",flexShrink:0,position:"relative",zIndex:100,
      }}>
        {/* Section label */}
        <div className="lpos-sidebar-label" style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"var(--lpos-text-tertiary)",padding:"6px 8px 2px",whiteSpace:"nowrap"}}>Sales</div>
        {navItems.map(item => (
          <div key={item.id} className="lpos-si-wrap">
            <div
              onClick={() => onAction(item.id)}
              style={{
                display:"flex",alignItems:"center",gap:10,
                padding:"9px 10px",borderRadius:10,cursor:"pointer",
                fontSize:13.5,fontWeight:500,
                color:item.active?"var(--lpos-accent)":"var(--lpos-text-secondary)",
                background:item.active?"var(--lpos-accent-soft)":"transparent",
                transition:"background .15s, color .15s",
                userSelect:"none",whiteSpace:"nowrap",overflow:"hidden",
              }}
              onMouseEnter={e=>{ if(!item.active){e.currentTarget.style.background="var(--lpos-bg)";e.currentTarget.style.color="var(--lpos-text-primary)";} }}
              onMouseLeave={e=>{ if(!item.active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--lpos-text-secondary)";} }}
            >
              <span style={{flexShrink:0,display:"flex",width:18,height:18}}>{item.icon}</span>
              <span className="lpos-si-label">{item.label}</span>
              {item.badge && <span className="lpos-si-badge" style={{background:"var(--lpos-accent)",color:"white",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:20,minWidth:18,textAlign:"center"}}>{item.badge}</span>}
            </div>
            <div className="lpos-si-tooltip">{item.label}</div>
          </div>
        ))}

        <div style={{height:1,background:"var(--lpos-border)",margin:"6px 4px",flexShrink:0}}/>
        <div className="lpos-sidebar-label" style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"var(--lpos-text-tertiary)",padding:"6px 8px 2px",whiteSpace:"nowrap"}}>Settings</div>

        <div style={{marginTop:"auto",borderTop:"1px solid var(--lpos-border)",paddingTop:8,display:"flex",flexDirection:"column",gap:2}}>
          {bottomItems.map(item => (
            <div key={item.id} className="lpos-si-wrap">
              <div
                onClick={() => onAction(item.id)}
                style={{
                  display:"flex",alignItems:"center",gap:10,
                  padding:"9px 10px",borderRadius:10,cursor:"pointer",
                  fontSize:13.5,fontWeight:500,
                  color:"var(--lpos-text-secondary)",
                  transition:"background .15s, color .15s",
                  userSelect:"none",whiteSpace:"nowrap",overflow:"hidden",
                }}
                onMouseEnter={e=>{ e.currentTarget.style.background="var(--lpos-bg)";e.currentTarget.style.color="var(--lpos-text-primary)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--lpos-text-secondary)"; }}
              >
                <span style={{flexShrink:0,display:"flex",width:18,height:18}}>{item.icon}</span>
                <span className="lpos-si-label">{item.label}</span>
              </div>
              <div className="lpos-si-tooltip">{item.label}</div>
            </div>
          ))}
          {/* Store chip */}
          {storeName && (
            <div className="lpos-si-wrap">
              <div style={{
                display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,
                fontSize:12,fontWeight:600,color:"var(--lpos-text-secondary)",
                whiteSpace:"nowrap",overflow:"hidden",
              }}>
                <span style={{flexShrink:0,display:"flex",width:18,height:18}}><Icon.Location/></span>
                <span className="lpos-si-label" style={{overflow:"hidden",textOverflow:"ellipsis"}}>{storeName}</span>
              </div>
              <div className="lpos-si-tooltip">{storeName}</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// TOPBAR
// ═════════════════════════════════════════════════════════════════════════════
const Topbar = ({ expanded, onToggle, storeName, isFullScreen, onToggleFullscreen, onMobMenu, isMobile }) => {
  const [searchVal, setSearchVal] = useState("");
  const [searchMode, setSearchMode] = useState("search"); // "search" | "barcode"

  return (
    <header style={{
      height:60,background:"var(--lpos-surface)",
      borderBottom:"1px solid var(--lpos-border)",
      display:"flex",alignItems:"center",
      padding:"0 18px",gap:12,zIndex:200,flexShrink:0,position:"relative",
    }}>
      {/* Left: toggle + logo */}
      <div style={{
        display:"flex",alignItems:"center",gap:10,
        width:expanded?"calc(var(--lpos-sidebar-w-exp) - 18px)":"calc(var(--lpos-sidebar-w) - 18px)",
        transition:"width var(--lpos-trans)",overflow:"hidden",
      }}>
        {!isMobile ? (
          <button onClick={onToggle} style={{
            width:34,height:34,borderRadius:9,border:"none",
            background:"var(--lpos-bg)",color:"var(--lpos-text-secondary)",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,transition:"all .15s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--lpos-border)";e.currentTarget.style.color="var(--lpos-text-primary)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="var(--lpos-bg)";e.currentTarget.style.color="var(--lpos-text-secondary)";}}
          ><Icon.Menu/></button>
        ) : (
          <button onClick={onMobMenu} style={{width:34,height:34,borderRadius:9,border:"none",background:"var(--lpos-bg)",color:"var(--lpos-text-secondary)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon.Menu/></button>
        )}
        <div className="lpos-logo" style={{display:"flex",alignItems:"center",gap:8,fontWeight:700,fontSize:16,letterSpacing:"-0.3px",whiteSpace:"nowrap"}}>
          <div style={{width:28,height:28,background:"linear-gradient(135deg,#0071e3,#0a84ff)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:800,boxShadow:"0 2px 8px rgba(0,113,227,.35)",flexShrink:0}}>L</div>
          Legend<span style={{color:"var(--lpos-accent)"}}>POS</span>
        </div>
      </div>
      {/* Search */}
      <div style={{flex:1,maxWidth:520,display:"flex",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",background:"var(--lpos-bg)",borderRadius:"10px 0 0 10px",height:36,padding:3,gap:2,flexShrink:0}}>
          {["search","barcode"].map(m => (
            <button key={m} onClick={()=>setSearchMode(m)} style={{
              height:28,padding:"0 9px",borderRadius:7,border:"none",
              background:searchMode===m?"var(--lpos-accent)":"transparent",
              color:searchMode===m?"white":"var(--lpos-text-tertiary)",
              fontFamily:"inherit",fontSize:11.5,fontWeight:700,cursor:"pointer",
              display:"flex",alignItems:"center",gap:5,transition:"all .18s",whiteSpace:"nowrap",
              boxShadow:searchMode===m?"0 1px 4px rgba(0,113,227,.3)":"none",
            }}>
              {m==="search"?<Icon.Search/>:<Icon.Barcode/>}
              <span className="mob-hide">{m==="search"?"Search":"Barcode"}</span>
            </button>
          ))}
        </div>
        <div style={{flex:1,position:"relative"}}>
          <input
            type="text"
            className="lpos-search-input"
            value={searchVal}
            onChange={e=>setSearchVal(e.target.value)}
            placeholder={searchMode==="barcode"?"Scan barcode or enter SKU...":"Search product name or SKU..."}
            style={{
              width:"100%",height:36,background:"var(--lpos-bg)",
              border:"1.5px solid transparent",borderRadius:"0 10px 10px 0",
              padding:"0 34px 0 36px",fontSize:14,fontFamily:"inherit",
              color:"var(--lpos-text-primary)",
              borderLeft:"none",
            }}
          />
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:searchMode==="barcode"?"var(--lpos-accent)":"var(--lpos-text-tertiary)",display:"flex",pointerEvents:"none"}}>
            {searchMode==="barcode"?<Icon.Barcode/>:<Icon.Search/>}
          </span>
          {searchVal && (
            <button onClick={()=>setSearchVal("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:18,height:18,borderRadius:"50%",border:"none",background:"var(--lpos-text-tertiary)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0}}>
              <Icon.X/>
            </button>
          )}
        </div>
      </div>
      {/* Right */}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
        {[<Icon.Bell/>,<Icon.Refresh/>].map((ic,i) => (
          <button key={i} style={{width:36,height:36,borderRadius:10,border:"none",background:"var(--lpos-bg)",color:"var(--lpos-text-secondary)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--lpos-border)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="var(--lpos-bg)";}}>
            {ic}
          </button>
        ))}
        {storeName && (
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"0 12px",height:36,background:"var(--lpos-bg)",borderRadius:10,fontSize:13,fontWeight:500,color:"var(--lpos-text-secondary)",cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>
            <Icon.Location/>{storeName}
          </div>
        )}
        <button onClick={onToggleFullscreen} style={{width:36,height:36,borderRadius:10,border:"none",background:"var(--lpos-bg)",color:"var(--lpos-text-secondary)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} title={isFullScreen?"Exit Full Screen":"Full Screen"}>
          {isFullScreen?<Icon.Compress/>:<Icon.Expand/>}
        </button>
        <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#0071e3,#0a84ff)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"var(--lpos-shadow-sm)"}}>
          {storeName ? storeName.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// CART PANEL
// ═════════════════════════════════════════════════════════════════════════════
const CartPanel = ({ orderList = [], onUpdateQty, onRemove, onClear, onProceed, onHoldOrder }) => {
  const [discountRows, setDiscountRows] = useState({});
  const [lineDiscInputs, setLineDiscInputs] = useState({});

  const subtotal = orderList.reduce((s, i) => s + Number(i.unitPrice) * i.qty, 0);
  const totalDiscount = orderList.reduce((s, i) => s + (Number(i.unitPrice) * i.qty * (i.discount||0) / 100), 0);
  const afterDiscount = subtotal - totalDiscount;
  const tax = orderList.reduce((s, i) => {
    const lineTotal = Number(i.unitPrice) * i.qty * (1 - (i.discount||0)/100);
    return s + lineTotal * ((i.lineTaxRate||0)/100);
  }, 0);
  const grand = afterDiscount + tax;
  const itemCount = orderList.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{width:"var(--lpos-cart-w)",background:"var(--lpos-surface)",borderLeft:"1px solid var(--lpos-border)",display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}} className="lpos-cart">
      {/* Header */}
      <div style={{padding:"16px 18px 14px",borderBottom:"1px solid var(--lpos-border)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:17,fontWeight:700,letterSpacing:"-.3px"}}>Order</span>
          {itemCount > 0 && <span style={{background:"var(--lpos-accent)",color:"white",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{itemCount} item{itemCount!==1?"s":""}</span>}
        </div>
        {orderList.length > 0 && (
          <button onClick={onClear} style={{fontSize:13,color:"var(--lpos-red)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:6}}>Clear all</button>
        )}
      </div>

      {/* Customer */}
      <div style={{padding:"12px 18px",borderBottom:"1px solid var(--lpos-border)",flexShrink:0}}>
        <button style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"10px 14px",borderRadius:"var(--lpos-radius-sm)",border:"1.5px dashed var(--lpos-border)",background:"transparent",fontFamily:"inherit",fontSize:13.5,fontWeight:500,color:"var(--lpos-text-secondary)",cursor:"pointer",transition:"all .15s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--lpos-accent)";e.currentTarget.style.color="var(--lpos-accent)";e.currentTarget.style.background="var(--lpos-accent-soft)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--lpos-border)";e.currentTarget.style.color="var(--lpos-text-secondary)";e.currentTarget.style.background="transparent";}}>
          <Icon.User/> Add customer (optional)
        </button>
      </div>

      {/* Order type pills */}
      <div style={{padding:"10px 18px",display:"flex",gap:8,borderBottom:"1px solid var(--lpos-border)",flexShrink:0}}>
        {["Walk-in","Delivery","Take-Away"].map((t,i) => (
          <button key={t} style={{flex:1,padding:7,borderRadius:9,border:`1.5px solid ${i===0?"var(--lpos-accent)":"var(--lpos-border)"}`,background:i===0?"var(--lpos-accent)":"transparent",fontFamily:"inherit",fontSize:12,fontWeight:600,color:i===0?"white":"var(--lpos-text-secondary)",cursor:"pointer",transition:"all .15s"}}>{t}</button>
        ))}
      </div>

      {/* Items */}
      <div className="lpos-scroll" style={{flex:1,overflowY:"auto",padding:"10px 18px",display:"flex",flexDirection:"column",gap:6}}>
        {orderList.length === 0 ? (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,color:"var(--lpos-text-tertiary)",fontSize:14,fontWeight:500,minHeight:120,opacity:.5}}>
            <Icon.EmptyCart/>
            <span>No products added</span>
          </div>
        ) : (
          orderList.map((item, idx) => {
            const lineTotal = Number(item.unitPrice) * item.qty;
            const disc = item.discount || 0;
            const finalTotal = lineTotal * (1 - disc/100);
            const hasDisc = disc > 0;
            const drOpen = discountRows[item.productId || idx];
            return (
              <div key={item.productId || idx} className="lpos-cart-item" style={{background:"var(--lpos-bg)",borderRadius:"var(--lpos-radius-sm)",padding:"10px 11px",border:"1px solid transparent",transition:"border-color .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--lpos-border)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";}}>
                {/* Top */}
                <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
                  <div style={{width:36,height:36,borderRadius:8,background:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,boxShadow:"var(--lpos-shadow-sm)",overflow:"hidden"}}>
                    {item.imageUrl ? <img src={item.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <Icon.Package/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:2}}>{item.description}</div>
                    {item.sku && <div style={{fontSize:10,color:"var(--lpos-text-tertiary)",fontFamily:"monospace",letterSpacing:".03em",fontWeight:600,background:"rgba(0,0,0,.05)",display:"inline-block",padding:"1px 5px",borderRadius:4,marginBottom:2}}>{item.sku}</div>}
                    <div style={{fontSize:11.5,color:"var(--lpos-text-secondary)",fontWeight:500}}>{formatCurrency(item.unitPrice)} / unit</div>
                  </div>
                  <button onClick={()=>onRemove(item)} style={{width:20,height:20,borderRadius:"50%",border:"none",background:"none",color:"var(--lpos-text-tertiary)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",flexShrink:0}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,59,48,.1)";e.currentTarget.style.color="var(--lpos-red)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--lpos-text-tertiary)";}}>
                    <Icon.X/>
                  </button>
                </div>
                {/* Bottom */}
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button className="lpos-qty-btn" onClick={()=>onUpdateQty(item,-1)}>−</button>
                    <span style={{fontSize:14,fontWeight:700,minWidth:22,textAlign:"center"}}>{item.qty}</span>
                    <button className="lpos-qty-btn" onClick={()=>onUpdateQty(item,1)}>+</button>
                  </div>
                  <button onClick={()=>setDiscountRows(p=>({...p,[item.productId||idx]:!p[item.productId||idx]}))} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,border:`1px solid ${hasDisc?"var(--lpos-green)":"var(--lpos-border)"}`,background:hasDisc?"rgba(52,199,89,.1)":"white",fontFamily:"inherit",fontSize:11,fontWeight:600,color:hasDisc?"var(--lpos-green)":"var(--lpos-text-secondary)",cursor:"pointer",boxShadow:"var(--lpos-shadow-sm)",whiteSpace:"nowrap"}}>
                    <Icon.Discount/>{hasDisc?`${disc}% off`:"Discount"}
                  </button>
                  <div style={{marginLeft:"auto",fontSize:13.5,fontWeight:700,color:hasDisc?"var(--lpos-accent)":"var(--lpos-text-primary)",flexShrink:0}}>{formatCurrency(finalTotal)}</div>
                </div>
                {/* Discount row */}
                {drOpen && (
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6,padding:"7px 9px",background:"rgba(52,199,89,.07)",borderRadius:8,border:"1px solid rgba(52,199,89,.2)"}}>
                    <label style={{fontSize:11,fontWeight:600,color:"var(--lpos-green)",whiteSpace:"nowrap"}}>Line Discount</label>
                    <input
                      type="number" min="0" max="100" step="0.5"
                      value={lineDiscInputs[item.productId||idx]??disc}
                      onChange={e=>setLineDiscInputs(p=>({...p,[item.productId||idx]:e.target.value}))}
                      style={{width:60,height:26,border:"1px solid rgba(52,199,89,.3)",borderRadius:6,padding:"0 8px",fontSize:12,fontFamily:"inherit",fontWeight:600,outline:"none",background:"white"}}
                    />
                    <span style={{fontSize:12,fontWeight:600,color:"var(--lpos-text-secondary)"}}>%</span>
                    <button style={{marginLeft:"auto",padding:"4px 10px",borderRadius:6,border:"none",background:"var(--lpos-green)",color:"white",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer"}}>Apply</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Extras */}
      <div style={{padding:"10px 18px",display:"flex",gap:8,borderTop:"1px solid var(--lpos-border)",flexShrink:0}}>
        {[{icon:<Icon.Note/>,label:"Note"},{icon:<Icon.Discount/>,label:"Discount"},{icon:<Icon.Return/>,label:"Return"}].map(({icon,label})=>(
          <button key={label} style={{flex:1,display:"flex",alignItems:"center",gap:5,padding:"7px 10px",borderRadius:8,background:"var(--lpos-bg)",border:"none",fontFamily:"inherit",fontSize:12,fontWeight:600,color:"var(--lpos-text-secondary)",cursor:"pointer",transition:"all .15s",justifyContent:"center"}}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--lpos-border)";e.currentTarget.style.color="var(--lpos-text-primary)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="var(--lpos-bg)";e.currentTarget.style.color="var(--lpos-text-secondary)";}}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Totals */}
      <div style={{padding:"12px 18px",borderTop:"1px solid var(--lpos-border)",display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
        {[
          {label:"Subtotal",val:formatCurrency(subtotal)},
          {label:"Discount",val:`- ${formatCurrency(totalDiscount)}`,color:"var(--lpos-green)"},
          {label:"Tax",val:formatCurrency(tax)},
        ].map(({label,val,color})=>(
          <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,color:"var(--lpos-text-secondary)"}}>
            <span style={{fontWeight:500}}>{label}</span>
            <span style={{fontWeight:600,color:color||undefined}}>{val}</span>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:16,fontWeight:700,color:"var(--lpos-text-primary)",marginTop:4,paddingTop:10,borderTop:"1px solid var(--lpos-border)"}}>
          <span>Total</span>
          <span style={{color:"var(--lpos-accent)"}}>{formatCurrency(grand)}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{padding:"14px 18px",display:"flex",gap:10,flexShrink:0}}>
        <button onClick={onHoldOrder} style={{flex:1,padding:13,borderRadius:"var(--lpos-radius-sm)",border:"1.5px solid var(--lpos-border)",background:"var(--lpos-surface)",fontFamily:"inherit",fontSize:14,fontWeight:700,color:"var(--lpos-text-secondary)",cursor:"pointer",transition:"all .15s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--lpos-text-secondary)";e.currentTarget.style.color="var(--lpos-text-primary)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--lpos-border)";e.currentTarget.style.color="var(--lpos-text-secondary)";}}>
          Hold
        </button>
        <button onClick={onProceed} className="lpos-btn-proceed" style={{flex:2,padding:13,borderRadius:"var(--lpos-radius-sm)",border:"none",fontFamily:"inherit",fontSize:14,fontWeight:700,color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon.Cart/> Charge {grand>0?formatCurrency(grand):""}
        </button>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PRODUCT LIST (MAIN CONTENT AREA)
// ═════════════════════════════════════════════════════════════════════════════
const ProductListPanel = ({
  products,
  categories,
  selectedCategoryId,
  onCategorySelect,
  onProductClick,
  isLoading,
  cartQtyMap,
  totalRecords,
  rowsPerPage,
  currentPage,
  onPageChange,
  onMobClose,
}) => {
  const activeCatLabel = selectedCategoryId === -1 ? "All Items" : (categories.find(c=>c.categoryId===selectedCategoryId)?.categoryName || "Products");

  return (
    <div className="lpos-main lpos-scroll" style={{display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--lpos-bg)",flex:1}}>
      {/* Mobile sheet handle */}
      <div className="mob-sheet-handle" style={{display:"none",alignItems:"center",justifyContent:"space-between",padding:"12px 16px 0",flexShrink:0}}>
        <span style={{fontSize:16,fontWeight:700,letterSpacing:"-.3px"}}>Browse Products</span>
        <button onClick={onMobClose} style={{width:32,height:32,borderRadius:"50%",border:"none",background:"var(--lpos-bg)",color:"var(--lpos-text-secondary)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <Icon.X/>
        </button>
      </div>
      {/* Category tabs */}
      <CategoryBar categories={categories} selectedCategoryId={selectedCategoryId} onSelect={onCategorySelect} />
      {/* Section header */}
      <div style={{padding:"14px 20px 2px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontSize:18,fontWeight:700,letterSpacing:"-.3px"}}>{activeCatLabel}</span>
        <span style={{fontSize:13,color:"var(--lpos-text-tertiary)",fontWeight:500}}>{products.length} item{products.length!==1?"s":""}</span>
      </div>
      {/* Products grid */}
      <div className="lpos-scroll" style={{flex:1,overflowY:"auto",padding:"12px 20px 20px"}}>
        {isLoading ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:14,color:"var(--lpos-text-secondary)"}}>
            <div style={{width:40,height:40,borderRadius:"50%",border:"3px solid var(--lpos-accent-medium)",borderTopColor:"var(--lpos-accent)",animation:"spin 0.8s linear infinite"}}/>
            <span style={{fontSize:14,fontWeight:500}}>Loading products…</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:12,color:"var(--lpos-text-tertiary)"}}>
            <Icon.Package/>
            <span style={{fontSize:17,fontWeight:700,color:"var(--lpos-text-secondary)"}}>No products found</span>
            <span style={{fontSize:13,color:"var(--lpos-text-tertiary)"}}>Try selecting a different category</span>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
            {products.map((p, i) => (
              <ProductItem
                key={p.productId || i}
                p={p}
                handleProductClick={onProductClick}
                inCart={cartQtyMap?.[p.productId] || 0}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        {totalRecords > rowsPerPage && (
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginTop:20}}>
            <button disabled={currentPage===0} onClick={()=>onPageChange({page:currentPage-1,rows:rowsPerPage})} style={{padding:"6px 14px",borderRadius:8,border:"1px solid var(--lpos-border)",background:"var(--lpos-surface)",cursor:currentPage===0?"not-allowed":"pointer",fontSize:13,fontWeight:600,color:"var(--lpos-text-secondary)",opacity:currentPage===0?.5:1}}>← Prev</button>
            <span style={{fontSize:13,color:"var(--lpos-text-secondary)",fontWeight:500}}>Page {currentPage+1} of {Math.ceil(totalRecords/rowsPerPage)}</span>
            <button disabled={(currentPage+1)*rowsPerPage>=totalRecords} onClick={()=>onPageChange({page:currentPage+1,rows:rowsPerPage})} style={{padding:"6px 14px",borderRadius:8,border:"1px solid var(--lpos-border)",background:"var(--lpos-surface)",cursor:(currentPage+1)*rowsPerPage>=totalRecords?"not-allowed":"pointer",fontSize:13,fontWeight:600,color:"var(--lpos-text-secondary)",opacity:(currentPage+1)*rowsPerPage>=totalRecords?.5:1}}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// REGISTER PAGE — MAIN EXPORT
// Wraps everything. Replace your existing Register.jsx default export with this.
//
// Props you can pass in (all optional, for integration with your real Redux store):
//   products, categories, orderList, selectedStore,
//   onProductClick, onUpdateQty, onRemoveOrder, onClearOrder,
//   onCategorySelect, onProceed, onHoldOrder,
//   onNavigateHome, onOpenHistory, onOpenDayEnd, onOpenCustomItem, onOpenSearch
// ═════════════════════════════════════════════════════════════════════════════
const RegisterPage = ({
  // Data
  products = DEMO_PRODUCTS,
  categories = DEMO_CATEGORIES,
  orderList = [],
  selectedStore = null,
  isLoading = false,
  totalRecords = 0,
  rowsPerPage = 100,
  currentPage = 0,
  // Callbacks
  onProductClick,
  onUpdateQty,
  onRemoveOrder,
  onClearOrder,
  onCategorySelect,
  onProceed,
  onHoldOrder,
  onPageChange,
  onNavigateHome,
  onOpenHistory,
  onOpenDayEnd,
  onOpenCustomItem,
  onOpenSearch,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mobSidebarOpen, setMobSidebarOpen] = useState(false);
  const [mobProductsOpen, setMobProductsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [internalProducts, setInternalProducts] = useState(products);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  useEffect(() => {
    const handleFS = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFS);
    return () => document.removeEventListener("fullscreenchange", handleFS);
  }, []);

  


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(()=>{});
    else document.exitFullscreen?.().catch(()=>{});
  };

  const handleAction = (id) => {
    setMobSidebarOpen(false);
    if (id === "home") { onNavigateHome?.(); return; }
    if (id === "history") { onOpenHistory?.(); return; }
    if (id === "dayend") { onOpenDayEnd?.(); return; }
    if (id === "custom") { onOpenCustomItem?.(); return; }
    if (id === "lookup") { onOpenSearch?.(); return; }
  };

  const handleCategorySelect = (c) => {
    setSelectedCategoryId(c.categoryId);
    onCategorySelect?.(c);
  };

  const handleProductClick = (p) => {
    onProductClick?.(p);
    showToast(`${p.productName} added`);
  };

  const cartQtyMap = orderList.reduce((acc, item) => {
    acc[item.productId] = (acc[item.productId] || 0) + item.qty;
    return acc;
  }, {});

  const storeName = selectedStore?.storeName || null;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div id="lpos-toast" />
      <div className="lpos-app" style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}}>
        <Topbar
          expanded={expanded}
          onToggle={() => setExpanded(v => !v)}
          storeName={storeName}
          isFullScreen={isFullScreen}
          onToggleFullscreen={toggleFullscreen}
          onMobMenu={() => setMobSidebarOpen(true)}
          isMobile={isMobile}
        />
        <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
          <Sidebar
            expanded={expanded}
            onAction={handleAction}
            storeName={storeName}
            isMobOpen={mobSidebarOpen}
            onMobClose={() => setMobSidebarOpen(false)}
          />
          <ProductListPanel
            products={internalProducts.length ? internalProducts : products}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            onProductClick={handleProductClick}
            isLoading={isLoading}
            cartQtyMap={cartQtyMap}
            totalRecords={totalRecords || products.length}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
            onMobClose={() => setMobProductsOpen(false)}
          />
          <CartPanel
            orderList={orderList}
            onUpdateQty={onUpdateQty || (() => {})}
            onRemove={onRemoveOrder || (() => {})}
            onClear={onClearOrder || (() => {})}
            onProceed={onProceed || (() => showToast("Processing payment… ✓"))}
            onHoldOrder={onHoldOrder || (() => showToast("Order held"))}
          />
          {/* Mobile: browse button */}
          {isMobile && !mobProductsOpen && (
            <button onClick={() => setMobProductsOpen(true)} style={{
              display:"flex",position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",
              alignItems:"center",gap:8,padding:"12px 24px",
              background:"linear-gradient(135deg,rgba(0,113,227,0.1),rgba(0,113,227,0.08))",
              border:"1.5px solid var(--lpos-accent-medium)",borderRadius:"var(--lpos-radius-sm)",
              fontFamily:"inherit",fontSize:13.5,fontWeight:700,color:"var(--lpos-accent)",
              cursor:"pointer",zIndex:310,whiteSpace:"nowrap",
              boxShadow:"var(--lpos-shadow-md)",
            }}>
              <Icon.Grid/>Browse Products
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

// ─── DEMO DATA (remove when integrating with your real data) ─────────────────
const DEMO_CATEGORIES = [
  { categoryId: 1, categoryName: "Beverages" },
  { categoryId: 2, categoryName: "Snacks" },
  { categoryId: 3, categoryName: "Electronics" },
  { categoryId: 4, categoryName: "Dairy" },
  { categoryId: 5, categoryName: "Bakery" },
  { categoryId: 6, categoryName: "Frozen Foods" },
  { categoryId: 7, categoryName: "Personal Care" },
  { categoryId: 8, categoryName: "Household" },
];
const DEMO_PRODUCTS = [
  { productId:1, productName:"Coca-Cola 330ml", sku:"BEV-001", unitPrice:120, productTypeId:1, isStockTracked:1, stockQty:48, measurementUnitName:"pcs", categoryId:1 },
  { productId:2, productName:"Nescafé Gold 200g", sku:"BEV-002", unitPrice:780, productTypeId:1, isStockTracked:1, stockQty:12, measurementUnitName:"pcs", categoryId:1 },
  { productId:3, productName:"Milo Chocolate Drink", sku:"BEV-003", unitPrice:340, productTypeId:1, isStockTracked:0, categoryId:1 },
  { productId:4, productName:"Sprite Zero", sku:"BEV-004", unitPrice:110, productTypeId:1, isStockTracked:1, stockQty:0, measurementUnitName:"pcs", categoryId:1 },
  { productId:5, productName:"Lay's Classic Chips", sku:"SNK-001", unitPrice:90, productTypeId:1, isStockTracked:1, stockQty:30, measurementUnitName:"pcs", categoryId:2 },
  { productId:6, productName:"KitKat Wafer Bar", sku:"SNK-002", unitPrice:75, productTypeId:1, isStockTracked:1, stockQty:60, measurementUnitName:"pcs", categoryId:2 },
  { productId:7, productName:"USB-C Hub 7-in-1", sku:"ELC-001", unitPrice:3800, productTypeId:1, isStockTracked:1, stockQty:5, measurementUnitName:"pcs", categoryId:3 },
  { productId:8, productName:"Wireless Earbuds", sku:"ELC-002", unitPrice:4500, productTypeId:1, isStockTracked:1, stockQty:8, measurementUnitName:"pcs", categoryId:3 },
  { productId:9, productName:"Anchor Full Cream Milk", sku:"DAI-001", unitPrice:280, productTypeId:1, isStockTracked:1, stockQty:20, measurementUnitName:"L", categoryId:4 },
  { productId:10, productName:"Cheddar Cheese 250g", sku:"DAI-002", unitPrice:490, productTypeId:1, isStockTracked:0, categoryId:4 },
  { productId:11, productName:"Croissant", sku:"BAK-001", unitPrice:160, productTypeId:1, isStockTracked:1, stockQty:14, measurementUnitName:"pcs", categoryId:5 },
  { productId:12, productName:"Sourdough Loaf", sku:"BAK-002", unitPrice:420, productTypeId:1, isStockTracked:1, stockQty:6, measurementUnitName:"pcs", categoryId:5 },
  { productId:13, productName:"Custom T-Shirt", sku:null, unitPrice:1200, productTypeId:2, isStockTracked:0, categoryId:3, variationProducts:JSON.stringify([{sku:"TSH-S",unitPrice:1200},{sku:"TSH-M",unitPrice:1200}]) },
];
