import React, { useState, useRef, useEffect } from 'react';

export default function WorkerMarketplace() {
  const [currentView, setCurrentView] = useState('home');

  // --- MARKETPLACE STATE ---
  const [workers, setWorkers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Modal States
  const [detailedWorker, setDetailedWorker] = useState(null); 
  const [selectedWorker, setSelectedWorker] = useState(null); 
  
  // Booking State
  const [customerData, setCustomerData] = useState({ name: '', phone: '' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBookSubmitted, setIsBookSubmitted] = useState(false);

  // --- REGISTRATION STATE ---
  const [regData, setRegData] = useState({
    fullName: '', phone: '', whatsapp: '', area: '', 
    experience: '', hourlyRate: '', address: '', otherSkill: '', bio: ''
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isOtherSkillChecked, setIsOtherSkillChecked] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null); 
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegSubmitted, setIsRegSubmitted] = useState(false);

  // --- ANIMATED HERO TEXT STATE ---
  const animatedSkillsList = ["Plumber", "Electrician", "House Cleaner", "AC Repair", "Carpenter", "Maid", "Painter"];
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  useEffect(() => {
    const skillInterval = setInterval(() => {
      setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % animatedSkillsList.length);
    }, 2500);
    return () => clearInterval(skillInterval);
  }, []);

  const mumbaiAreas = ["Bandra East", "Bandra West", "Khar", "Santacruz", "Vile Parle", "Andheri East", "Andheri West", "Goregaon", "Malad", "Borivali"];
  const standardSkills = ["Electrician", "Plumber", "House Cleaner", "Helper", "Salesman", "AC Repair", "Maid", "Carpenter", "Painter"];

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchWorkers = async () => {
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
            location: worker.area, 
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
  }, []); 

  // --- DYNAMICALLY EXTRACT ALL CATEGORIES ---
  const allAvailableCategories = Array.from(
    new Set(
      workers.flatMap(w => w.skills ? w.skills.split(',').map(s => s.trim()) : [])
    )
  ).filter(Boolean);

  // --- FILTER LOGIC ---
  const filteredWorkers = workers.filter(worker => {
    const matchesSearchText = 
      worker.location?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      worker.skills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedArea === '' || worker.location === selectedArea;
    const matchesCategory = selectedCategory === '' || worker.skills?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearchText && matchesArea && matchesCategory;
  });

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
      <style>{`
        body { margin: 0; background-color: #f8fafc; color: #1e293b; -webkit-tap-highlight-color: transparent; }
        .app-container { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; width: 100%; max-width: 1440px; margin: 0 auto; padding: 24px; box-sizing: border-box; position: relative; min-height: 100vh; padding-bottom: 90px; }
        
        .header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 20px 36px; border-radius: 16px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); margin-bottom: 32px; border: 1px solid #e2e8f0; width: 100%; box-sizing: border-box; }
        .header-logo { margin: 0; color: #2563eb; cursor: pointer; font-weight: 800; font-size: 30px; letter-spacing: -0.5px; }
        
        .btn-primary { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 15px; text-decoration: none; display: inline-block; text-align: center; box-sizing: border-box; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3); }
        
        .btn-secondary { background: white; color: #2563eb; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 15px; }
        .btn-secondary:hover { background: #f1f5f9; border-color: #2563eb; transform: translateY(-1px); }
        
        .btn-success { background: #10b981; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 16px; transition: background 0.2s; text-decoration: none; display: inline-block; text-align: center; box-sizing: border-box; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); width: 100%; }
        .btn-success:hover { background: #059669; }
        .btn-success:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; }

        .btn-whatsapp { background: #25D366; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box; width: 100%; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25); }
        .btn-whatsapp:hover { background: #20ba5a; transform: translateY(-1px); }

        .btn-call { background: #0284c7; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box; width: 100%; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); }
        .btn-call:hover { background: #0369a1; transform: translateY(-1px); }
        
        .support-float { position: fixed; bottom: 28px; right: 28px; background: #25D366; color: white; padding: 14px 24px; border-radius: 35px; font-weight: bold; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35); display: flex; align-items: center; gap: 8px; text-decoration: none; z-index: 999; transition: transform 0.2s; font-size: 15px; }
        .support-float:hover { transform: scale(1.05); }

        /* STRICTLY SINGLE-LINE LOCKED HERO BANNER */
        .hero-banner { text-align: center; margin-bottom: 32px; padding: 10px; height: 60px; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; overflow: hidden; white-space: nowrap; }
        .animated-heading { font-size: clamp(20px, 2.6vw, 32px); font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2; letter-spacing: -0.5px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; }
        
        .animated-skill-wrapper { display: inline-block; min-width: 170px; text-align: center; }
        .animated-skill-span { color: #2563eb; display: inline-block; border-bottom: 4px solid #2563eb; animation: fadeInOut 2.5s infinite; }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(6px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }

        /* Loading Spinner */
        .spinner { width: 28px; height: 28px; border: 3px solid #f3f3f3; border-top: 3px solid #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Professional Filter Dashboard */
        .search-filter-container { background: white; padding: 36px; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.04); margin-bottom: 40px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 24px; width: 100%; box-sizing: border-box; }
        .main-search-input { width: 100%; padding: 16px 24px; border: 1px solid #cbd5e1; border-radius: 35px; font-size: 16px; box-sizing: border-box; background: #f8fafc; outline: none; transition: all 0.2s; }
        .main-search-input:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        
        .filters-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: center; width: 100%; box-sizing: border-box; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .filter-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-select { width: 100%; padding: 14px 18px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 15px; background: white; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .filter-select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

        .form-card { background: white; padding: 48px; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05); max-width: 760px; margin: 0 auto; box-sizing: border-box; width: 100%; border: 1px solid #e2e8f0; }
        .form-group { margin-bottom: 24px; }
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; width: 100%; box-sizing: border-box; }
        .form-label { display: block; font-weight: 600; margin-bottom: 8px; color: #334151; font-size: 15px; }
        .form-input { width: 100%; padding: 14px 18px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 15px; box-sizing: border-box; transition: all 0.2s; background: #f8fafc; resize: vertical; outline: none; }
        .form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); background: white; }
        .error-text { color: #ef4444; font-size: 13px; margin-top: 5px; display: block; font-weight: 500; }
        
        .multi-select-box { position: relative; width: 100%; user-select: none; box-sizing: border-box; }
        .multi-select-header { display: flex; flex-wrap: wrap; gap: 8px; min-height: 52px; padding: 10px 18px; border: 1px solid #cbd5e1; border-radius: 12px; background: #f8fafc; cursor: pointer; align-items: center; justify-content: space-between; box-sizing: border-box; }
        .multi-select-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #cbd5e1; border-radius: 12px; margin-top: 6px; max-height: 240px; overflow-y: auto; z-index: 20; box-shadow: 0 10px 20px -3px rgba(0,0,0,0.1); padding: 14px; display: flex; flex-direction: column; gap: 6px; box-sizing: border-box; }
        .dropdown-item { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 15px; padding: 9px; color: #475569; border-radius: 8px; }
        .dropdown-item input { width: 16px; height: 16px; cursor: pointer; accent-color: #2563eb; }
        
        .chip { background: #dbeafe; color: #1e40af; padding: 5px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
        .chip-close { cursor: pointer; font-weight: bold; color: #1e3a8a; }
        
        .file-dropzone { border: 2px dashed #cbd5e1; background: #f8fafc; padding: 32px; text-align: center; border-radius: 12px; cursor: pointer; transition: background 0.2s; box-sizing: border-box; width: 100%; }
        .file-dropzone:hover { background: #f1f5f9; }
        .file-dropzone.has-file { border: 2px solid #10b981; background: #f0fdf4; cursor: default; }
        .file-icon { font-size: 34px; color: #94a3b8; margin-bottom: 8px; display: block; }
        
        /* WORKER GRID */
        .worker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; width: 100%; box-sizing: border-box; }
        .worker-card { background: white; padding: 26px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; box-sizing: border-box; box-shadow: 0 4px 16px -2px rgba(0,0,0,0.03); }
        .worker-card:hover { transform: translateY(-4px); box-shadow: 0 18px 32px -6px rgba(0,0,0,0.08); border-color: #93c5fd; }
        
        .worker-bio { font-size: 14px; color: #475569; line-height: 1.5; margin: 16px 0; background: #f8fafc; padding: 14px; border-radius: 12px; border-left: 3px solid #2563eb; font-style: italic; }
        
        .worker-stats { display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 12px 0; margin-top: 12px; margin-bottom: 16px; }
        .stat-item { text-align: center; flex: 1; }
        .stat-value { font-weight: bold; color: #1e293b; font-size: 15px; display: block; }
        .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.65); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); padding: 20px; box-sizing: border-box; }

        @media (max-width: 768px) {
          .app-container { padding: 16px; }
          .header { padding: 16px 20px; margin-bottom: 24px; }
          .header-logo { font-size: 24px; }
          .form-card { padding: 24px; }
          .search-filter-container { padding: 20px; }
          .filters-row { grid-template-columns: 1fr; gap: 16px; }
          .form-row { grid-template-columns: 1fr; gap: 0; }
          .animated-heading { font-size: clamp(16px, 4.5vw, 22px); }
          .hero-banner { height: 50px; margin-bottom: 20px; }
          .animated-skill-wrapper { min-width: 120px; }
          .worker-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER */}
      <div className="header">
        <h1 className="header-logo" onClick={() => setCurrentView('home')}>CallKar</h1>
        <div>
          {currentView === 'home' ? (
            <button className="btn-primary" onClick={() => { setCurrentView('register'); setIsRegSubmitted(false); setErrors({}); }}>
              Join as a Specialist
            </button>
          ) : (
            <button className="btn-secondary" onClick={() => setCurrentView('home')}>
              ← Back to Home
            </button>
          )}
        </div>
      </div>

      {/* PAGE 1: HOME & FILTERS */}
      {currentView === 'home' && (
        <div>
          {/* STRICTLY SINGLE-LINE LOCKED HERO BANNER */}
          <div className="hero-banner">
            <h2 className="animated-heading">
              <span>Book</span>
              <span className="animated-skill-wrapper">
                <span className="animated-skill-span">{animatedSkillsList[currentSkillIndex]}</span>
              </span>
              <span>near you</span>
            </h2>
          </div>

          <div className="search-filter-container">
            <input 
              type="text" 
              className="main-search-input" 
              placeholder="Search by specialist name, service, or keyword..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />

            <div className="filters-row">
              <div className="filter-group">
                <label className="filter-label">Service Area</label>
                <select className="filter-select" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                  <option value="">All Mumbai Areas</option>
                  {mumbaiAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Work Category</label>
                <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {allAvailableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
              Loading specialists in your area...
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
              No specialists found matching your filter criteria.
            </div>
          ) : (
            <div className="worker-grid">
              {filteredWorkers.map(worker => (
                <div key={worker.id} className="worker-card">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                      {worker.photoUrl ? (
                        <img src={worker.photoUrl} alt={worker.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #bfdbfe' }} />
                      ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 'bold', color: '#1d4ed8' }}>
                          {worker.name ? worker.name.charAt(0) : 'W'}
                        </div>
                      )}
                      <div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '19px', textTransform: 'capitalize' }}>{worker.name}</h3>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>✓ Verified</span>
                      </div>
                    </div>
                    
                    <p style={{ margin: '12px 0 6px 0', color: '#1e293b', fontSize: '15px', fontWeight: '600', textTransform: 'capitalize' }}>🛠️ {worker.skills}</p>
                    <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '14px' }}>📍 {worker.location}</p>
                    
                    <div className="worker-stats">
                      <div className="stat-item" style={{ borderRight: '1px solid #f1f5f9' }}>
                        <span className="stat-value">{worker.experience} yrs</span>
                        <span className="stat-label">Experience</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">₹{worker.hourlyRate}</span>
                        <span className="stat-label">Per Hour</span>
                      </div>
                    </div>

                    {worker.bio && <div className="worker-bio">"{worker.bio}"</div>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '11px' }} onClick={() => setDetailedWorker(worker)}>
                      Details
                    </button>
                    <button className="btn-primary" style={{ flex: 1, padding: '11px' }} onClick={() => { setSelectedWorker(worker); setIsBookSubmitted(false); setCustomerData({name: '', phone: ''}); }}>
                      Contact
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
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '30px', margin: '0 0 8px 0', fontWeight: '800' }}>Partner With CallKar</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>Register your services and start getting hired.</p>
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
                <label className="form-label">Primary Service Area <span style={{color: 'red'}}>*</span></label>
                <select className="form-input" value={regData.area} onChange={(e) => setRegData({...regData, area: e.target.value})}>
                  <option value="">Select your area...</option>
                  {mumbaiAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
                {errors.area && <span className="error-text">{errors.area}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Work Categories <span style={{color: 'red'}}>*</span></label>
                <div className="multi-select-box">
                  <div className="multi-select-header" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {selectedSkills.length === 0 && !isOtherSkillChecked ? <span style={{ color: '#9ca3af', fontSize: '15px' }}>Select services...</span> : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {selectedSkills.map(skill => <span key={skill} className="chip">{skill} <span className="chip-close" onClick={(e) => removeSkill(e, skill)}>×</span></span>)}
                        {isOtherSkillChecked && <span className="chip" style={{ background: '#f3e8ff', color: '#7e22ce' }}>Other <span className="chip-close" onClick={(e) => { e.stopPropagation(); setIsOtherSkillChecked(false); }}>×</span></span>}
                      </div>
                    )}
                    <span style={{ color: '#64748b', fontSize: '12px' }}>▼</span>
                  </div>
                  {isDropdownOpen && (
                    <div className="multi-select-dropdown">
                      {standardSkills.map(skill => <label key={skill} className="dropdown-item"><input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => handleSkillToggle(skill)} /> {skill}</label>)}
                      <label className="dropdown-item" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}><input type="checkbox" checked={isOtherSkillChecked} onChange={() => setIsOtherSkillChecked(!isOtherSkillChecked)} /> Other</label>
                    </div>
                  )}
                </div>
                {isOtherSkillChecked && <input type="text" className="form-input" style={{marginTop: '10px'}} placeholder="Type skill here..." value={regData.otherSkill} onChange={(e) => setRegData({...regData, otherSkill: e.target.value})} />}
                {errors.skills && <span className="error-text">{errors.skills}</span>}
              </div>

              <div className="form-row form-group">
                <div><label className="form-label">Years of Experience <span style={{color: 'red'}}>*</span></label><input type="number" className="form-input" value={regData.experience} onChange={(e) => setRegData({...regData, experience: e.target.value})} />{errors.experience && <span className="error-text">{errors.experience}</span>}</div>
                <div><label className="form-label">Hourly Rate (₹) <span style={{color: 'red'}}>*</span></label><input type="number" className="form-input" value={regData.hourlyRate} onChange={(e) => setRegData({...regData, hourlyRate: e.target.value})} />{errors.hourlyRate && <span className="error-text">{errors.hourlyRate}</span>}</div>
              </div>
              
              <div className="form-group"><label className="form-label">About Me / Bio</label><textarea className="form-input" rows="3" value={regData.bio} onChange={(e) => setRegData({...regData, bio: e.target.value})}></textarea></div>
              <div className="form-group"><label className="form-label">Complete Home Address <span style={{color: 'red'}}>*</span></label><textarea className="form-input" rows="3" value={regData.address} onChange={(e) => setRegData({...regData, address: e.target.value})}></textarea>{errors.address && <span className="error-text">{errors.address}</span>}</div>

              <div className="form-group">
                <label className="form-label">Upload Profile Photo <span style={{color: 'red'}}>*</span></label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <div className={`file-dropzone ${photoFile ? 'has-file' : ''}`} onClick={() => !photoFile && fileInputRef.current.click()} >
                  {!photoFile ? <div><span className="file-icon">📸</span><p style={{ margin: '0', fontSize: '15px' }}>Click to browse photos</p></div> : <div><span className="file-icon" style={{ color: '#10b981' }}>✅</span><p style={{ margin: '0', fontSize: '15px' }}>{photoFile.name}</p><button type="button" onClick={(e) => { e.stopPropagation(); setPhotoFile(null); }} style={{ marginTop: '10px', background: 'none', border: '1px solid #10b981', color: '#10b981', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }} > Remove Photo </button></div>}
                </div>
                {errors.photo && <span className="error-text">{errors.photo}</span>}
              </div>

              <button type="submit" className="btn-success" style={{ width: '100%', marginTop: '14px' }} disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Submit Registration'}</button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', margin: '0 auto 16px auto' }}>✓</div>
              <h3>Application Received!</h3>
              <button className="btn-primary" onClick={() => setCurrentView('home')} style={{ marginTop: '16px' }}>Return to Home</button>
            </div>
          )}
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      {detailedWorker && (
        <div className="modal-overlay">
          <div className="form-card" style={{ maxWidth: '480px', position: 'relative' }}>
            <button onClick={() => setDetailedWorker(null)} style={{ position: 'absolute', top: '16px', right: '22px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '28px', color: '#94a3b8' }}>&times;</button>
            
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              {detailedWorker.photoUrl ? (
                <img src={detailedWorker.photoUrl} alt={detailedWorker.name} style={{ width: '92px', height: '92px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bfdbfe', marginBottom: '10px' }} />
              ) : (
                <div style={{ width: '92px', height: '92px', borderRadius: '50%', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#1d4ed8', margin: '0 auto 10px auto' }}>
                  {detailedWorker.name ? detailedWorker.name.charAt(0) : 'W'}
                </div>
              )}
              <h2 style={{ margin: '0 0 6px 0', textTransform: 'capitalize', fontSize: '23px' }}>{detailedWorker.name}</h2>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>✓ Verified</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0', fontSize: '15px' }}>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#334151' }}>Skills:</strong> <span style={{ color: '#475569', textTransform: 'capitalize' }}>{detailedWorker.skills}</span></p>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#334151' }}>Service Area:</strong> <span style={{ color: '#475569' }}>{detailedWorker.location}</span></p>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#334151' }}>Experience:</strong> <span style={{ color: '#475569' }}>{detailedWorker.experience} Years</span></p>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#334151' }}>Hourly Charges:</strong> <span style={{ color: '#475569' }}>₹{detailedWorker.hourlyRate} / hour</span></p>
              {detailedWorker.bio && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#334151', display: 'block', marginBottom: '4px' }}>About Me:</strong>
                  <p style={{ margin: 0, color: '#475569', fontStyle: 'italic', lineHeight: '1.5' }}>"{detailedWorker.bio}"</p>
                </div>
              )}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', fontSize: '16px', padding: '14px' }} 
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
          <div className="form-card" style={{ maxWidth: '440px', position: 'relative' }}>
            <button onClick={() => setSelectedWorker(null)} style={{ position: 'absolute', top: '16px', right: '22px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '26px', color: '#94a3b8' }}>&times;</button>
            <h2 style={{ textTransform: 'capitalize', fontSize: '22px', margin: '0 0 16px 0' }}>Contact {selectedWorker.name}</h2>
            
            {!isVerifying && !isBookSubmitted && (
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group"><label className="form-label">Your Name</label><input type="text" required className="form-input" value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Your Phone Number</label><input type="tel" required maxLength="10" className="form-input" value={customerData.phone} onChange={(e) => setCustomerData({...customerData, phone: e.target.value.replace(/\D/g, '')})} /></div>
                <button type="submit" className="btn-success" style={{ width: '100%' }}>View Contact Options</button>
              </form>
            )}

            {isVerifying && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div className="spinner"></div>
                <p style={{ color: '#64748b', fontWeight: '600', fontSize: '15px', margin: '12px 0 0 0' }}>Verifying & logging details...</p>
              </div>
            )}

            {!isVerifying && isBookSubmitted && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '17px', marginBottom: '20px' }}>Details Verified Successfully!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href={`tel:${selectedWorker.rawPhone || selectedWorker.phone}`} className="btn-call">
                    📞 Call Specialist Directly
                  </a>
                  <a href={`https://wa.me/91${selectedWorker.phone}?text=Hi%20${selectedWorker.name},%20I%20found%20you%20on%20CallKar%20and%20need%20your%20services.`} target="_blank" rel="noreferrer" className="btn-whatsapp">
                    💬 Connect on WhatsApp
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