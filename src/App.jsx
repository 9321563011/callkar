import React, { useState, useRef, useEffect, useMemo } from 'react';

const globalStyles = `
  body { margin: 0; background-color: #f8fafc; color: #1e293b; -webkit-tap-highlight-color: transparent; }
  .app-container { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; width: 100%; max-width: 1440px; margin: 0 auto; padding: 24px; box-sizing: border-box; position: relative; min-height: 100vh; padding-bottom: 90px; }
  
  .header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 16px 28px; border-radius: 16px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.05); margin-bottom: 24px; border: 1px solid #e2e8f0; width: 100%; box-sizing: border-box; }
  .header-logo { margin: 0; color: #2563eb; cursor: pointer; font-weight: 800; font-size: 28px; letter-spacing: -0.5px; }
  .header-logo span { color: #1e40af; }
  
  /* --- UNIVERSAL INPUT CROSS-BROWSER/OS VISIBILITY FIX --- */
  input, select, textarea, button {
    color: #1e293b !important;
    -webkit-text-fill-color: #1e293b !important;
    opacity: 1 !important;
    -webkit-opacity: 1 !important;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  input::placeholder, textarea::placeholder {
    color: #94a3b8 !important;
    -webkit-text-fill-color: #94a3b8 !important;
    opacity: 1 !important;
  }

  /* --- PROFESSIONAL ROYAL BLUE TOP BANNER --- */
  .top-promo-banner { background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); color: white; padding: 28px 36px; border-radius: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25); position: relative; overflow: hidden; box-sizing: border-box; gap: 24px; animation: slideDown 0.4s ease-out; }
  .top-promo-banner::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; pointer-events: none; }
  .top-promo-content { flex: 1; min-width: 0; text-align: left; }
  .top-promo-badge { background: rgba(255, 255, 255, 0.2); color: #eff6ff; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 10px; border: 1px solid rgba(255, 255, 255, 0.3); }
  .top-promo-title { margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.4px; }
  .top-promo-text { margin: 0; font-size: 14px; opacity: 0.92; line-height: 1.5; max-width: 720px; }
  .top-promo-actions { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }
  .top-btn-light { background: white; color: #1e40af; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: inline-flex; align-items: center; justify-content: center; }
  .top-btn-light:hover { background: #f8fafc; transform: translateY(-2px); }
  .top-banner-close { background: none; border: none; color: rgba(255, 255, 255, 0.75); font-size: 22px; cursor: pointer; padding: 4px; transition: color 0.2s; }
  .top-banner-close:hover { color: white; }

  .btn-primary { background: #2563eb; color: white !important; -webkit-text-fill-color: white !important; border: none; padding: 11px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 14px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2); white-space: nowrap; flex-shrink: 0; }
  .btn-primary:hover { background: #1d4ed8; }
  
  .btn-secondary { background: white; color: #2563eb !important; -webkit-text-fill-color: #2563eb !important; border: 1px solid #cbd5e1; padding: 11px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; white-space: nowrap; flex-shrink: 0; }
  .btn-secondary:hover { background: #f8fafc; border-color: #2563eb; }

  .btn-success { background: #10b981; color: white !important; -webkit-text-fill-color: white !important; border: none; padding: 14px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; transition: background 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; width: 100%; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
  .btn-success:hover { background: #059669; }
  .btn-success:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; }

  .btn-whatsapp { background: #25D366; color: white !important; -webkit-text-fill-color: white !important; border: none; padding: 14px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box; width: 100%; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25); }
  .btn-whatsapp:hover { background: #20ba5a; }

  .btn-call { background: #0284c7; color: white !important; -webkit-text-fill-color: white !important; border: none; padding: 14px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box; width: 100%; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); }
  .btn-call:hover { background: #0369a1; }
  
  .support-float { position: fixed; bottom: 24px; right: 24px; background: #25D366; color: white !important; -webkit-text-fill-color: white !important; padding: 12px 20px; border-radius: 30px; font-weight: bold; box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35); display: flex; align-items: center; gap: 6px; text-decoration: none; z-index: 999; font-size: 14px; }
  .support-float:hover { transform: scale(1.05); }

  .spinner { width: 28px; height: 28px; border: 3px solid #f3f3f3; border-top: 3px solid #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px auto; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* --- PROFESSIONAL ROYAL BLUE SEARCH CONTAINER --- */
  .search-filter-container { background: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.04); margin-bottom: 24px; border: 1px solid #e2e8f0; display: flex; gap: 12px; align-items: center; width: 100%; box-sizing: border-box; position: relative; }
  .search-bar-wrapper { position: relative; flex: 2; }
  
  .main-search-input { width: 100%; padding: 12px 16px 12px 44px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 14px; box-sizing: border-box; background: #f8fafc; outline: none; transition: all 0.2s ease; color: #1e293b !important; -webkit-text-fill-color: #1e293b !important; }
  .main-search-input:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); color: #1e293b !important; -webkit-text-fill-color: #1e293b !important; }
  .search-icon-abs { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #64748b; pointer-events: none; }
  
  /* --- LIVE AUTO-SUGGEST DROPDOWN --- */
  .search-suggestions-box { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: white; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); z-index: 100; max-height: 220px; overflow-y: auto; padding: 6px; box-sizing: border-box; animation: slideDown 0.2s ease-out; }
  .suggestion-item { padding: 10px 14px; font-size: 14px; color: #334151; cursor: pointer; border-radius: 8px; text-align: left; display: flex; justify-content: space-between; align-items: center; }
  .suggestion-item:hover { background: #eff6ff; color: #2563eb; font-weight: 500; }
  .suggestion-tag { font-size: 11px; background: #e2e8f0; color: #64748b; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }

  .filter-drawer { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); margin-bottom: 24px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 1fr auto auto; gap: 16px; align-items: flex-end; box-sizing: border-box; animation: slideDown 0.3s ease-out; }
  .filter-group { display: flex; flex-direction: column; gap: 6px; }
  .filter-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .filter-select { width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; background: white; outline: none; cursor: pointer; box-sizing: border-box; color: #1e293b !important; }
  .filter-select:focus { border-color: #2563eb; }

  /* --- NOT FOUND STATE STYLES --- */
  .not-found-card { text-align: center; padding: 60px 24px; background: white; border-radius: 20px; border: 1px solid #e2e8f0; margin: 24px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.02); animation: slideDown 0.3s ease-out; width: 100%; box-sizing: border-box; }
  .not-found-icon { font-size: 48px; margin-bottom: 12px; display: inline-block; }
  .not-found-title { margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0f172a; }
  .not-found-text { color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0; max-width: 440px; margin-left: auto; margin-right: auto; }

  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
  .skeleton-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
  .skeleton-header { display: flex; gap: 16px; align-items: center; }
  .skeleton-avatar { width: 68px; height: 68px; border-radius: 50%; background: #e2e8f0; flex-shrink: 0; }
  .skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .skeleton-line { height: 14px; border-radius: 4px; background: #e2e8f0; }

  .worker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; width: 100%; box-sizing: border-box; animation: slideDown 0.3s ease-out; }
  .profile-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: transform 0.2s ease, box-shadow 0.2s ease; position: relative; z-index: 1; }
  .profile-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(37, 99, 235, 0.08); border-color: #93c5fd; }
  
  .profile-card-header { padding: 24px 24px 18px 24px; display: flex; gap: 16px; align-items: flex-start; border-bottom: 1px solid #f1f5f9; background: #ffffff; text-align: left; }
  .profile-avatar-wrapper { position: relative; flex-shrink: 0; }
  .profile-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #f8fafc; box-shadow: 0 4px 12px rgba(0,0,0,0.06); background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: bold; color: #2563eb; }
  
  .profile-info { flex: 1; min-width: 0; text-align: left; }
  .profile-name-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .profile-name { margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; }
  .verified-badge { background: #dcfce7; color: #166534; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; }
  
  .profile-skills { font-size: 14px; font-weight: 600; color: #2563eb; margin: 0 0 6px 0; text-transform: capitalize; text-align: left; display: block; }
  .profile-location { font-size: 13px; color: #64748b; margin: 0; display: flex; align-items: center; gap: 4px; text-align: left; }

  .profile-card-body { padding: 20px 24px; flex: 1; display: flex; flex-direction: column; gap: 16px; }
  
  .profile-metrics { display: grid; grid-template-columns: 1fr 1fr; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center; }
  .metric-box:first-child { border-right: 1px solid #e2e8f0; }
  .metric-val { font-size: 15px; font-weight: 700; color: #0f172a; display: block; }
  .metric-lbl { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

  .profile-bio-box { font-size: 13px; color: #475569; font-style: italic; background: #fdfbf7; border-left: 3px solid #2563eb; padding: 12px 14px; border-radius: 8px; line-height: 1.45; margin: 0; text-align: left; }
  .profile-card-footer { padding: 20px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; }

  .form-card { background: white; padding: 36px; border-radius: 20px; box-shadow: 0 4px 25px rgba(0,0,0,0.04); max-width: 760px; margin: 0 auto; box-sizing: border-box; width: 100%; border: 1px solid #e2e8f0; animation: slideDown 0.3s ease-out; }
  .form-group { margin-bottom: 22px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; }
  .form-label { display: block; font-weight: 600; margin-bottom: 6px; color: #334151; font-size: 14px; text-align: left; }
  .form-input { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 15px; box-sizing: border-box; background: #f8fafc; color: #1e293b !important; -webkit-text-fill-color: #1e293b !important; outline: none; }
  .form-input:focus { border-color: #2563eb; background: white; color: #1e293b !important; -webkit-text-fill-color: #1e293b !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
  .error-text { color: #ef4444; font-size: 12px; margin-top: 4px; display: block; font-weight: 500; text-align: left; }
  
  .multi-select-box { position: relative; width: 100%; user-select: none; box-sizing: border-box; }
  .multi-select-header { display: flex; flex-wrap: wrap; gap: 6px; min-height: 48px; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 12px; background: #f8fafc; cursor: pointer; align-items: center; justify-content: space-between; box-sizing: border-box; color: #1e293b !important; }
  .multi-select-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #cbd5e1; border-radius: 12px; margin-top: 6px; max-height: 200px; overflow-y: auto; z-index: 50; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 10px; display: flex; flex-direction: column; gap: 4px; box-sizing: border-box; text-align: left; animation: slideDown 0.2s ease-out; }
  .dropdown-item { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #475569; border-radius: 8px; padding: 8px; }
  .dropdown-item:hover { background: #eff6ff; color: #2563eb; }
  .dropdown-item input { width: 16px; height: 16px; cursor: pointer; accent-color: #2563eb; }
  
  .chip { background: #dbeafe; color: #1e40af; padding: 5px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
  .chip-close { cursor: pointer; font-weight: bold; color: #1d4ed8; }
  
  .file-dropzone { border: 2px dashed #cbd5e1; background: #f8fafc; padding: 28px; text-align: center; border-radius: 12px; cursor: pointer; box-sizing: border-box; width: 100%; transition: border-color 0.2s; }
  .file-dropzone:hover { border-color: #2563eb; }
  .file-icon { font-size: 32px; color: #64748b; margin-bottom: 8px; display: block; }
  
  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.65); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(4px); padding: 16px; box-sizing: border-box; animation: slideDown 0.2s ease-out; }

  @media (max-width: 768px) {
    .top-promo-banner { flex-direction: column; align-items: flex-start; padding: 20px; }
    .top-promo-actions { width: 100%; display: flex; gap: 10px; }
    .top-btn-light { flex: 1; text-align: center; }
    .filter-drawer { grid-template-columns: 1fr; gap: 12px; padding: 18px; }
    .search-filter-container { flex-direction: column; align-items: stretch; gap: 10px; padding: 14px; }
    .search-bar-wrapper { width: 100%; }
    .search-filter-container button { width: 100%; }
  }

  @media (max-width: 640px) {
    .app-container { padding: 12px; }
    .header { padding: 12px 18px; margin-bottom: 16px; }
    .header-logo { font-size: 22px; }
    .btn-primary, .btn-secondary { padding: 9px 12px; font-size: 13px; }
    .search-filter-container { padding: 12px; gap: 8px; }
    .main-search-input { padding: 10px 12px 10px 38px; font-size: 13px; }
    .search-icon-abs { left: 12px; }
  }
`;

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = globalStyles;
  if (!document.getElementById('global-injected-styles')) {
    styleTag.id = 'global-injected-styles';
    document.head.appendChild(styleTag);
  }
}

export default function WorkerMarketplace() {
  const [currentView, setCurrentView] = useState('home');

  const [workers, setWorkers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedArea, setAppliedArea] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPopup, setShowPopup] = useState(true); 
  const [showBanner, setShowBanner] = useState(true); 
  
  const [detailedWorker, setDetailedWorker] = useState(null); 
  const [selectedWorker, setSelectedWorker] = useState(null); 
  
  const [customerData, setCustomerData] = useState({ name: '', phone: '' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBookSubmitted, setIsBookSubmitted] = useState(false);

  const [regData, setRegData] = useState({
    fullName: '', phone: '', whatsapp: '', area: '', 
    experience: '', hourlyRate: '', address: '', otherSkill: '', bio: ''
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isOtherSkillChecked, setIsOtherSkillChecked] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  
  const fileInputRef = useRef(null); 
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegSubmitted, setIsRegSubmitted] = useState(false);

  const defaultMumbaiAreas = [
    "Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central", 
    "Mahalaxmi", "Lower Parel", "Prabhadevi", "Dadar", "Matunga Road", 
    "Mahim Junction", "Bandra", "Khar Road", "Santacruz", "Vile Parle", 
    "Andheri", "Jogeshwari", "Ram Mandir", "Goregaon", "Malad", 
    "Kandivali", "Borivali", "Dahisar",
    "Masjid", "Sandhurst Road", "Byculla", "Chinchpokli", "Currey Road", 
    "Parel", "Matunga", "Sion", "Kurla Junction", "Vidyavihar", 
    "Ghatkopar", "Vikhroli", "Kanjurmarg", "Bhandup", "Nahur", "Mulund",
    "Dockyard Road", "Reay Road", "Cotton Green", "Sewri", "Vadala Road", 
    "King's Circle", "Guru Tegh Bahadur Nagar", "Chunabhatti", "Tilak Nagar", 
    "Chembur", "Govandi", "Mankhurd"
  ];

  const standardSkills = ["Electrician", "Plumber", "House Cleaner", "Helper", "Salesman", "AC Repair", "Maid", "Carpenter", "Painter"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true);
      try {
        const appsScriptUrl = 'https://script.google.com/macros/s/AKfycby5MHPqsJj5UmaxSWGGaFaD85AIAtoG3b0kMiXy6x3VOxbIBRRGNq-3R2Kt1hO_k3zT8A/exec';
        const response = await fetch(appsScriptUrl);
        const data = await response.json();
        
        const approvedWorkers = data
          .filter(worker => worker.Approved === 'Yes')
          .map(worker => ({
            id: worker.workerId || 'WK-1', 
            name: worker.fullName, 
            skills: worker.skills,
            location: worker.area ? worker.area.trim() : '', 
            phone: worker.whatsapp, 
            rawPhone: worker.phone,
            bio: worker.bio,
            photoUrl: worker.photoUrl,
            experience: Number(worker.experience) || 0,
            hourlyRate: Number(worker.hourlyRate) || 0,
            address: worker.address
          }));
          
        setWorkers(approvedWorkers);
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkers();
  }, [currentView]); 

  const activeWorkerAreas = useMemo(() => {
    return Array.from(
      new Set(workers.map(w => w.location).filter(Boolean))
    ).sort();
  }, [workers]);

  const registrationAreas = useMemo(() => {
    return Array.from(
      new Set([...defaultMumbaiAreas, ...workers.map(w => w.location).filter(Boolean)])
    ).sort();
  }, [workers]);

  const dynamicCategories = useMemo(() => {
    const targetWorkers = selectedArea 
      ? workers.filter(w => w.location?.toLowerCase().trim() === selectedArea.toLowerCase().trim())
      : workers;

    return Array.from(
      new Set(
        targetWorkers.flatMap(w => w.skills ? w.skills.split(',').map(s => s.trim()) : [])
      )
    ).filter(Boolean);
  }, [workers, selectedArea]);

  // --- LIVE SUGGESTIONS COMPUTATION ---
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length === 0) return [];
    const q = searchTerm.toLowerCase().trim();
    
    const matchedNames = workers.map(w => w.name).filter(name => name?.toLowerCase().includes(q));
    const matchedSkills = standardSkills.concat(dynamicCategories).filter(skill => skill?.toLowerCase().includes(q));
    const matchedAreas = activeWorkerAreas.filter(area => area?.toLowerCase().includes(q));

    return Array.from(new Set([...matchedNames, ...matchedSkills, ...matchedAreas])).slice(0, 5);
  }, [searchTerm, workers, activeWorkerAreas, dynamicCategories]);

  // --- ROBUST LIVE FILTER ENGINE ---
  const filteredWorkers = useMemo(() => {
    return workers.filter(worker => {
      const query = appliedSearch.toLowerCase().trim();
      const queryWords = query.split(/\s+/).filter(Boolean);
      
      const workerText = `${worker.name || ''} ${worker.skills || ''} ${worker.location || ''}`.toLowerCase();
      const matchesSearch = queryWords.length === 0 || queryWords.every(word => workerText.includes(word));

      const workerLoc = worker.location?.toLowerCase().trim() || '';
      const filterArea = appliedArea.toLowerCase().trim();
      const matchesArea = !filterArea || workerLoc === filterArea;

      const workerSkills = worker.skills?.toLowerCase().trim() || '';
      const filterCat = appliedCategory.toLowerCase().trim();
      const matchesCategory = !filterCat || workerSkills.includes(filterCat);

      return matchesSearch && matchesArea && matchesCategory;
    });
  }, [workers, appliedSearch, appliedArea, appliedCategory]);

  const handleApplyFilters = () => {
    setAppliedSearch(searchTerm);
    setAppliedArea(selectedArea);
    setAppliedCategory(selectedCategory);
    setShowSuggestions(false);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedArea('');
    setSelectedCategory('');
    setAppliedSearch('');
    setAppliedArea('');
    setAppliedCategory('');
    setShowSuggestions(false);
    setIsFilterOpen(false);
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) setSelectedSkills(selectedSkills.filter(s => s !== skill));
    else setSelectedSkills([...selectedSkills, skill]);
    if (errors.skills) setErrors({ ...errors, skills: null });
  };

  const removeSkill = (e, skill) => {
    e.stopPropagation(); 
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      if (errors.photo) setErrors({ ...errors, photo: null });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (regData.fullName.trim().length < 3) newErrors.fullName = "Required.";
    if (!/^\d{10}$/.test(regData.phone)) newErrors.phone = "10 digits required.";
    if (!/^\d{10}$/.test(regData.whatsapp)) newErrors.whatsapp = "10 digits required.";
    if (!regData.area) newErrors.area = "Required.";
    if (selectedSkills.length === 0 && !isOtherSkillChecked) newErrors.skills = "Required.";
    if (regData.experience === '') newErrors.experience = "Required.";
    if (regData.hourlyRate === '') newErrors.hourlyRate = "Required.";
    if (regData.address.trim().length < 5) newErrors.address = "Required.";
    if (!photoFile) newErrors.photo = "Required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    
    setIsSubmitting(true);
    let uploadedImageUrl = '';

    try {
      if (photoFile) {
        const formData = new FormData();
        formData.append('image', photoFile);
        
        const imgbbKey = '61b34b25428beab10e7aeca4942ae789'; 
        
        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: 'POST', body: formData });
        const imgData = await imgRes.json();
        if (imgData.success) uploadedImageUrl = imgData.data.display_url;
      }

      const finalSkillsList = [...selectedSkills];
      if (isOtherSkillChecked && regData.otherSkill.trim() !== '') finalSkillsList.push(regData.otherSkill.trim());

      const finalSubmissionData = {
        formType: 'registration', 
        ...regData,
        skills: finalSkillsList.join(', '),
        photoUrl: uploadedImageUrl,
        Approved: 'No'
      };

      const appsScriptUrl = 'https://script.google.com/macros/s/AKfycby5MHPqsJj5UmaxSWGGaFaD85AIAtoG3b0kMiXy6x3VOxbIBRRGNq-3R2Kt1hO_k3zT8A/exec';

      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(finalSubmissionData),
      });

      setIsSubmitting(false);
      setIsRegSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true); 

    const bookingData = { 
      formType: 'booking', 
      CustomerName: customerData.name, 
      CustomerPhone: customerData.phone, 
      WorkerBooked: selectedWorker.name 
    };
    
    try {
      const appsScriptUrl = 'https://script.google.com/macros/s/AKfycby5MHPqsJj5UmaxSWGGaFaD85AIAtoG3b0kMiXy6x3VOxbIBRRGNq-3R2Kt1hO_k3zT8A/exec';

      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(bookingData),
      });

      setTimeout(() => {
        setIsVerifying(false);
        setIsBookSubmitted(true);
      }, 800);

    } catch (error) {
      console.error("Error saving booking:", error);
      setIsVerifying(false);
    }
  };

  // --- UI RENDERING ---
  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header">
        <h1 className="header-logo" onClick={() => setCurrentView('home')}>Call<span>Kar</span></h1>
        <div>
          {currentView === 'home' ? (
            <button className="btn-primary" onClick={() => { setCurrentView('register'); setIsRegSubmitted(false); setErrors({}); }}>
              Join as a Specialist
            </button>
          ) : (
            <button className="btn-secondary" onClick={() => setCurrentView('home')}>
              ← Home
            </button>
          )}
        </div>
      </div>

      {/* WELCOME POPUP */}
      {showPopup && currentView === 'home' && (
        <div className="modal-overlay">
          <div className="form-card" style={{ maxWidth: '440px', textAlign: 'center', position: 'relative', padding: '36px 28px' }}>
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: '14px', right: '18px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '26px', color: '#94a3b8' }}>&times;</button>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌟</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0', color: '#0f172a' }}>Welcome to CallKar!</h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              Book verified local specialists across Mumbai stations instantly, or join our network as a specialist to grow your business!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn-primary" style={{ padding: '12px', fontSize: '15px' }} onClick={() => setShowPopup(false)}>
                🔍 Book a Specialist Now
              </button>
              <button className="btn-secondary" style={{ padding: '12px', fontSize: '15px' }} onClick={() => { setShowPopup(false); setCurrentView('register'); }}>
                💼 Join as a Specialist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 1: HOME & SEARCH */}
      {currentView === 'home' && (
        <div>
          {/* TOP BANNER */}
          {showBanner && (
            <div className="top-promo-banner">
              <div className="top-promo-content">
                <span className="top-promo-badge">✨ Mumbai's #1 Local Marketplace</span>
                <h2 className="top-promo-title">Book Trusted Specialists or Grow Your Business</h2>
                <p className="top-promo-text">
                  Connect instantly with verified electricians, plumbers, and local professionals near your station, or register your own profile to start receiving direct client bookings!
                </p>
              </div>
              <div className="top-promo-actions">
                <button className="top-btn-light" onClick={() => { setCurrentView('register'); setIsRegSubmitted(false); setErrors({}); }}>
                  Join as a Specialist
                </button>
                <button className="top-banner-close" onClick={() => setShowBanner(false)} title="Close Banner">&times;</button>
              </div>
            </div>
          )}

          {/* BALANCED SEARCH CONTAINER */}
          <div className="search-filter-container" ref={searchContainerRef}>
            <div className="search-bar-wrapper">
              <span className="search-icon-abs">🔍</span>
              <input 
                type="text" 
                className="main-search-input" 
                placeholder="Search name, service, keyword..." 
                value={searchTerm} 
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  setAppliedSearch(val); // Instant live sync so search works continuously without breaking
                  setShowSuggestions(true);
                }} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyFilters();
                  }
                }}
              />

              {/* LIVE SUGGESTIONS DROPDOWN */}
              {showSuggestions && searchTerm.trim().length > 0 && searchSuggestions.length > 0 && (
                <div className="search-suggestions-box">
                  {searchSuggestions.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="suggestion-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchTerm(item);
                        setAppliedSearch(item);
                        setShowSuggestions(false);
                      }}
                    >
                      <span>{item}</span>
                      <span className="suggestion-tag">Suggestion</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn-primary" onClick={handleApplyFilters}>
              Search
            </button>

            <button className="btn-secondary" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              ⚙️ Filters {(appliedArea || appliedCategory) ? '• Active' : ''}
            </button>

            {(appliedArea || appliedCategory || appliedSearch || searchTerm) && (
              <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={handleResetFilters} title="Reset All">
                ✕ Reset
              </button>
            )}
          </div>

          {/* EXPANDABLE FILTER DRAWER */}
          {isFilterOpen && (
            <div className="filter-drawer">
              <div className="filter-group">
                <label className="filter-label">Service Area / Station</label>
                <select 
                  className="filter-select" 
                  value={selectedArea} 
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    setSelectedCategory('');
                  }}
                >
                  <option value="">All Available Areas</option>
                  {activeWorkerAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Work Category</label>
                <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <button className="btn-primary" style={{ padding: '12px 18px', height: '44px' }} onClick={handleApplyFilters}>
                Apply Filters
              </button>

              <button className="btn-secondary" style={{ padding: '12px 16px', height: '44px' }} onClick={handleResetFilters}>
                Clear
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="worker-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-header">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-lines">
                      <div className="skeleton-line" style={{ width: '70%' }}></div>
                      <div className="skeleton-line" style={{ width: '45%' }}></div>
                      <div className="skeleton-line" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                  <div className="skeleton-box" style={{ height: '44px', background: '#e2e8f0', borderRadius: '8px' }}></div>
                  <div className="skeleton-footer" style={{ display: 'flex', gap: '10px' }}>
                    <div className="skeleton-line" style={{ height: '38px', flex: 1, borderRadius: '8px' }}></div>
                    <div className="skeleton-line" style={{ height: '38px', flex: 1, borderRadius: '8px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorkers.length === 0 ? (
            /* --- ISOLATED NOT FOUND CARD --- */
            <div className="not-found-card">
              <div className="not-found-icon">🔍</div>
              <h3 className="not-found-title">No specialists found</h3>
              <p className="not-found-text">
                {appliedSearch ? (
                  <>We couldn't find any specialist matching "<strong>{appliedSearch}</strong>". Check for typos or try searching with another keyword.</>
                ) : (
                  <>No specialists available for the selected area or category. Try clearing your filters.</>
                )}
              </p>
              <button className="btn-primary" onClick={handleResetFilters}>
                Reset Search & Filters
              </button>
            </div>
          ) : (
            <div className="worker-grid">
              {filteredWorkers.map(worker => (
                <div key={worker.id} className="profile-card">
                  {/* PROFILE HEADER */}
                  <div className="profile-card-header">
                    <div className="profile-avatar-wrapper">
                      {worker.photoUrl ? (
                        <img src={worker.photoUrl} alt={worker.name} className="profile-avatar" />
                      ) : (
                        <div className="profile-avatar">
                          {worker.name ? worker.name.charAt(0) : 'W'}
                        </div>
                      )}
                    </div>
                    <div className="profile-info">
                      <div className="profile-name-row">
                        <h3 className="profile-name">{worker.name}</h3>
                        <span className="verified-badge">✓ Verified</span>
                      </div>
                      <p className="profile-skills">🛠️ {worker.skills}</p>
                      <p className="profile-location">📍 {worker.location}</p>
                    </div>
                  </div>

                  {/* PROFILE BODY */}
                  <div className="profile-card-body">
                    <div className="profile-metrics">
                      <div className="metric-box">
                        <span className="metric-val">{worker.experience} Years</span>
                        <span className="metric-lbl">Experience</span>
                      </div>
                      <div className="metric-box">
                        <span className="metric-val">₹{worker.hourlyRate}/hr</span>
                        <span className="metric-lbl">Rate</span>
                      </div>
                    </div>

                    {worker.bio && (
                      <p className="profile-bio-box">"{worker.bio}"</p>
                    )}
                  </div>

                  {/* PROFILE FOOTER ACTIONS */}
                  <div className="profile-card-footer">
                    <button className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '13px' }} onClick={() => setDetailedWorker(worker)}>
                      View Details
                    </button>
                    <button className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '13px' }} onClick={() => { setSelectedWorker(worker); setIsBookSubmitted(false); setCustomerData({name: '', phone: ''}); }}>
                      Contact Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE 2: REGISTRATION FORM */}
      {currentView === 'register' && (
        <div className="form-card">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', margin: '0 0 6px 0', fontWeight: '800' }}>Partner With CallKar</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Register your services and start getting hired.</p>
          </div>

          {!isRegSubmitted ? (
            <form onSubmit={handleRegistrationSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name <span style={{color: 'red'}}>*</span></label>
                <input type="text" className="form-input" value={regData.fullName} onChange={(e) => setRegData({...regData, fullName: e.target.value})} />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>
              
              <div className="form-row form-group">
                <div>
                  <label className="form-label">Mobile Number <span style={{color: 'red'}}>*</span></label>
                  <input type="tel" className="form-input" maxLength="10" value={regData.phone} onChange={(e) => setRegData({...regData, phone: e.target.value.replace(/\D/g, '')})} />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                <div>
                  <label className="form-label">WhatsApp Number <span style={{color: 'red'}}>*</span></label>
                  <input type="tel" className="form-input" maxLength="10" value={regData.whatsapp} onChange={(e) => setRegData({...regData, whatsapp: e.target.value.replace(/\D/g, '')})} />
                  {errors.whatsapp && <span className="error-text">{errors.whatsapp}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Service Area / Station <span style={{color: 'red'}}>*</span></label>
                <select className="form-input" value={regData.area} onChange={(e) => setRegData({...regData, area: e.target.value})}>
                  <option value="">Select your area / station...</option>
                  {registrationAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
                {errors.area && <span className="error-text">{errors.area}</span>}
              </div>

              {/* MULTI-SELECT DROPDOWN WITH OUTSIDE CLICK CLOSE */}
              <div className="form-group" ref={dropdownRef}>
                <label className="form-label">Work Categories <span style={{color: 'red'}}>*</span></label>
                <div className="multi-select-box">
                  <div className="multi-select-header" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {selectedSkills.length === 0 && !isOtherSkillChecked ? <span style={{ color: '#9ca3af', fontSize: '14px' }}>Select services...</span> : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {selectedSkills.map(skill => <span key={skill} className="chip">{skill} <span className="chip-close" onClick={(e) => removeSkill(e, skill)}>×</span></span>)}
                        {isOtherSkillChecked && <span className="chip" style={{ background: '#dbeafe', color: '#1e40af' }}>Other <span className="chip-close" onClick={(e) => { e.stopPropagation(); setIsOtherSkillChecked(false); }}>×</span></span>}
                      </div>
                    )}
                    <span style={{ color: '#64748b', fontSize: '10px' }}>▼</span>
                  </div>
                  {isDropdownOpen && (
                    <div className="multi-select-dropdown">
                      {standardSkills.map(skill => <label key={skill} className="dropdown-item"><input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => handleSkillToggle(skill)} /> {skill}</label>)}
                      <label className="dropdown-item" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}><input type="checkbox" checked={isOtherSkillChecked} onChange={() => setIsOtherSkillChecked(!isOtherSkillChecked)} /> Other</label>
                    </div>
                  )}
                </div>
                {isOtherSkillChecked && <input type="text" className="form-input" style={{marginTop: '8px'}} placeholder="Type skill here..." value={regData.otherSkill} onChange={(e) => setRegData({...regData, otherSkill: e.target.value})} />}
                {errors.skills && <span className="error-text">{errors.skills}</span>}
              </div>

              <div className="form-row form-group">
                <div><label className="form-label">Experience (Yrs) <span style={{color: 'red'}}>*</span></label><input type="number" className="form-input" value={regData.experience} onChange={(e) => setRegData({...regData, experience: e.target.value})} />{errors.experience && <span className="error-text">{errors.experience}</span>}</div>
                <div><label className="form-label">Hourly Rate (₹) <span style={{color: 'red'}}>*</span></label><input type="number" className="form-input" value={regData.hourlyRate} onChange={(e) => setRegData({...regData, hourlyRate: e.target.value})} />{errors.hourlyRate && <span className="error-text">{errors.hourlyRate}</span>}</div>
              </div>
              
              <div className="form-group"><label className="form-label">About Me / Bio</label><textarea className="form-input" rows="2" value={regData.bio} onChange={(e) => setRegData({...regData, bio: e.target.value})}></textarea></div>
              <div className="form-group"><label className="form-label">Complete Home Address <span style={{color: 'red'}}>*</span></label><textarea className="form-input" rows="2" value={regData.address} onChange={(e) => setRegData({...regData, address: e.target.value})}></textarea>{errors.address && <span className="error-text">{errors.address}</span>}</div>

              <div className="form-group">
                <label className="form-label">Upload Profile Photo <span style={{color: 'red'}}>*</span></label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <div className="file-dropzone" onClick={() => !photoFile && fileInputRef.current.click()} >
                  {!photoFile ? <div><span className="file-icon">📸</span><p style={{ margin: '0', fontSize: '14px' }}>Click to browse photo</p></div> : <div><span className="file-icon" style={{ color: '#2563eb' }}>✅</span><p style={{ margin: '0', fontSize: '14px' }}>{photoFile.name}</p><button type="button" onClick={(e) => { e.stopPropagation(); setPhotoFile(null); }} style={{ marginTop: '8px', background: 'none', border: '1px solid #2563eb', color: '#2563eb', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }} > Remove </button></div>}
                </div>
                {errors.photo && <span className="error-text">{errors.photo}</span>}
              </div>

              <button type="submit" className="btn-success" style={{ width: '100%', marginTop: '10px' }} disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Submit Registration'}</button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ width: '64px', height: '64px', background: '#dbeafe', color: '#1e40af', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px auto' }}>✓</div>
              <h3>Application Received!</h3>
              <button className="btn-primary" onClick={() => setCurrentView('home')} style={{ marginTop: '12px' }}>Return to Home</button>
            </div>
          )}
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      {detailedWorker && (
        <div className="modal-overlay">
          <div className="form-card" style={{ maxWidth: '420px', position: 'relative' }}>
            <button onClick={() => setDetailedWorker(null)} style={{ position: 'absolute', top: '12px', right: '16px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '24px', color: '#94a3b8' }}>&times;</button>
            
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              {detailedWorker.photoUrl ? (
                <img src={detailedWorker.photoUrl} alt={detailedWorker.name} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', marginBottom: '8px' }} />
              ) : (
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 'bold', color: '#1e40af', margin: '0 auto 8px auto' }}>
                  {detailedWorker.name ? detailedWorker.name.charAt(0) : 'W'}
                </div>
              )}
              <h2 style={{ margin: '0 0 4px 0', textTransform: 'capitalize', fontSize: '20px' }}>{detailedWorker.name}</h2>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>✓ Verified</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0', fontSize: '14px', textAlign: 'left' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong style={{ color: '#334151' }}>Skills:</strong> <span style={{ color: '#475569', textTransform: 'capitalize' }}>{detailedWorker.skills}</span></p>
              <p style={{ margin: '0 0 8px 0' }}><strong style={{ color: '#334151' }}>Service Area:</strong> <span style={{ color: '#475569' }}>{detailedWorker.location}</span></p>
              <p style={{ margin: '0 0 8px 0' }}><strong style={{ color: '#334151' }}>Experience:</strong> <span style={{ color: '#475569' }}>{detailedWorker.experience} Years</span></p>
              <p style={{ margin: '0 0 8px 0' }}><strong style={{ color: '#334151' }}>Hourly Charges:</strong> <span style={{ color: '#475569' }}>₹{detailedWorker.hourlyRate} / hour</span></p>
              {detailedWorker.bio && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#334151', display: 'block', marginBottom: '2px' }}>About Me:</strong>
                  <p style={{ margin: 0, color: '#475569', fontStyle: 'italic', fontSize: '13px', lineHeight: '1.4' }}>"{detailedWorker.bio}"</p>
                </div>
              )}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', fontSize: '15px', padding: '12px' }} 
              onClick={() => { 
                setSelectedWorker(detailedWorker); 
                setDetailedWorker(null); 
                setIsBookSubmitted(false); 
                setCustomerData({name: '', phone: ''}); 
              }}
            >
              Contact for Booking
            </button>
          </div>
        </div>
      )}

      {/* CONTACT / BOOKING MODAL */}
      {selectedWorker && currentView === 'home' && (
        <div className="modal-overlay">
          <div className="form-card" style={{ maxWidth: '380px', position: 'relative' }}>
            <button onClick={() => setSelectedWorker(null)} style={{ position: 'absolute', top: '12px', right: '16px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '24px', color: '#94a3b8' }}>&times;</button>
            <h2 style={{ textTransform: 'capitalize', fontSize: '19px', margin: '0 0 14px 0', textAlign: 'left' }}>Contact {selectedWorker.name}</h2>
            
            {!isVerifying && !isBookSubmitted && (
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group"><label className="form-label">Your Name</label><input type="text" required className="form-input" value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Your Phone Number</label><input type="tel" required maxLength="10" className="form-input" value={customerData.phone} onChange={(e) => setCustomerData({...customerData, phone: e.target.value.replace(/\D/g, '')})} /></div>
                <button type="submit" className="btn-success" style={{ width: '100%' }}>View Contact Options</button>
              </form>
            )}

            {isVerifying && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div className="spinner"></div>
                <p style={{ color: '#64748b', fontWeight: '600', fontSize: '14px', margin: '10px 0 0 0' }}>Verifying details...</p>
              </div>
            )}

            {!isVerifying && isBookSubmitted && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Details Verified!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href={`tel:${selectedWorker.rawPhone || selectedWorker.phone}`} className="btn-call">
                    📞 Call Specialist
                  </a>
                  <a href={`https://wa.me/91${selectedWorker.phone}?text=Hi%20${selectedWorker.name},%20I%20found%20you%20on%20CallKar%20and%20need%20your%20services.`} target="_blank" rel="noreferrer" className="btn-whatsapp">
                    💬 WhatsApp Connect
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING SUPPORT BUTTON */}
      <a href="https://wa.me/919321563011?text=Hello%20CallKar%20Support,%20I%20need%20help!" target="_blank" rel="noreferrer" className="support-float">
        💬 Support
      </a>
    </div>
  );
}