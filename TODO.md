# POS Action Sidebar Implementation - Legendbit POS Cloud

## Overview
Convert popup menu in `pages/register/index.jsx` to collapsible right sidebar (72px icons-only ↔ 200px icon+label). Toggle from TopMenubar.

**Status**: ✅ Plan Approved  
**Target**: `/register/:terminalId` POS screen

## Breakdown Steps (6 total)

### ✅ 1. Create POSActionSidebar.jsx **DONE**
- New: `src/components/register/POSActionSidebar.jsx`
- Fixed 72px collapsed / 200px expanded
- Buttons: Item Lookup, Sales History, Add Custom Item, Day End
- Mobile: Overlay drawer
- Hover tooltips (collapsed)

### 2. Update pages/register/index.jsx
```
[ ] Replace ActionButtonsPopup → <POSActionSidebar isCollapsed={isSidebarCollapsed} />
[ ] Add state: const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
[ ] Grid: col-span-5 → col-span-4 (cart), add col-span-2 sidebar
[ ] Pass toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} to TopMenubar
[ ] Remove showMoreMenu/popup logic
```

### 3. Update components/navBar/TopMenubar.jsx
```
[ ] Add props: onTogglePOSSidebar, isPOSSidebarCollapsed
[ ] Repurpose toggle btn: Menu icon → toggle collapsed/expanded
[ ] Title: 'Expand/Collapse Menu'
```

### 4. Test Layout/Grid
```
[ ] Desktop: 6(main)+3(cart)+2(sidebar)+1(gutter)
[ ] Tablet: Stack or flex
[ ] Mobile: Sidebar as overlay drawer
[ ] Toggle smooth transition
```

### 5. Test Functionality
```
[ ] Buttons trigger existing handlers (AdvancedProductSearch, modals)
[ ] Redux cart unaffected
[ ] Fullscreen/store/profile work
[ ] Responsive: Chrome devtools
```

### 6. Completion
```
[ ] attempt_completion: "✅ POS Action Sidebar implemented"
[ ] Command: `npm start` → test /register/{terminalId}
```

## Notes
- Reuse existing: AdvancedProductSearch, modals, Redux
- No new deps/CSS needed (Tailwind)
- Backup: Original popup code in git/comments

**Next**: Create POSActionSidebar.jsx → Update register/index.jsx → Test**

