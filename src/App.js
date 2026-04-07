import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const API = 'https://api.doorbite.ng/api';
const api = axios.create({ baseURL: API });
api.interceptors.request.use(c => { const t=localStorage.getItem('a_token'); if(t) c.headers.Authorization=`Bearer ${t}`; return c; });

const C = { primary:'#3B82F6', dark:'#1E2130', sidebar:'#151824', white:'#fff', bg:'#F4F6FA', border:'#E8ECF0', gray:'#9CA3AF', success:'#22C55E', error:'#EF4444', warning:'#F59E0B' };
const card = { background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:14 };
const btn = (bg,color='#fff') => ({ background:bg, color, border:'none', padding:'9px 18px', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:13 });
const inp = { border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', fontSize:14, width:'100%', outline:'none', background:'#fafafa', boxSizing:'border-box' };
const badge = color => ({ background:color+'22', color, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, display:'inline-block' });

const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

function AuthProvider({children}) {
  const [user,setUser]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ const u=localStorage.getItem('a_user'); if(u) setUser(JSON.parse(u)); setLoading(false); },[]);
  const login=async(email,password)=>{ const {data}=await api.post('/auth/login',{email,password}); if(data.user.role!=='admin') throw new Error('Not an admin account'); localStorage.setItem('a_token',data.token); localStorage.setItem('a_user',JSON.stringify(data.user)); setUser(data.user); };
  const logout=()=>{ localStorage.clear(); setUser(null); };
  if(loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:18}}>Loading...</div>;
  return <AuthCtx.Provider value={{user,login,logout}}>{children}</AuthCtx.Provider>;
}

function Login() {
  const {login}=useAuth();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const handle=async e=>{ e.preventDefault(); setLoading(true); setError(''); try{ await login(email,password); }catch(err){ setError(err.response?.data?.message||err.message); }finally{ setLoading(false); } };
  return (
    <div style={{display:'flex',height:'100vh'}}>
      <div style={{width:300,background:C.sidebar,padding:40,display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:40}}>
          <div style={{width:52,height:52,borderRadius:14,background:C.primary,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>⚡</div>
          <div><div style={{color:'#fff',fontWeight:800,fontSize:20}}>DoorBite</div><div style={{color:C.gray,fontSize:12,letterSpacing:1}}>ADMIN CONSOLE</div></div>
        </div>
        {['Platform-wide analytics','User management','Rider approvals','Withdrawal approvals','Customer refunds via Paystack','Promotional banners','Restaurant approvals','Menu categories','Commission management'].map(f=>(
          <div key={f} style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:C.primary}} />
            <span style={{color:'rgba(255,255,255,0.7)',fontSize:14}}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:C.bg}}>
        <form onSubmit={handle} style={{background:'#fff',borderRadius:24,padding:36,width:440,boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
          <h2 style={{fontSize:26,fontWeight:800,marginBottom:4}}>Admin Sign In</h2>
          <p style={{color:C.gray,marginBottom:24,fontSize:13}}>DoorBite operations console</p>
          {error&&<div style={{background:'#FEE2E2',color:C.error,padding:12,borderRadius:10,marginBottom:14,fontSize:13}}>{error}</div>}
          <label style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:1}}>EMAIL</label>
          <input style={{...inp,marginTop:6,marginBottom:16}} value={email} onChange={e=>setEmail(e.target.value)} />
          <label style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:1}}>PASSWORD</label>
          <input style={{...inp,marginTop:6,marginBottom:24}} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" style={{...btn(C.primary),width:'100%',padding:14,fontSize:16}} disabled={loading}>{loading?'Signing in...':'→ Sign in to Console'}</button>
        </form>
      </div>
    </div>
  );
}

function Sidebar({page,setPage,counts}) {
  const {user,logout}=useAuth();
  const nav=[
    {k:'overview',l:'Overview',i:'📊'},
    {k:'restaurants',l:'Restaurants',i:'🏪',badge:counts.p},
    {k:'riders',l:'Riders',i:'🏍️',badge:counts.ri},
    {k:'users',l:'Users',i:'👥'},
    {k:'orders',l:'Orders',i:'📦'},
    {k:'withdrawals',l:'Withdrawals',i:'💸',badge:counts.w},
    {k:'refunds',l:'Refunds',i:'↩️',badge:counts.r},
    {k:'promotions',l:'Promotions',i:'📢'},
    {k:'categories',l:'Categories',i:'🏷️'},
  ];
  return (
    <div style={{width:230,background:C.sidebar,height:'100vh',display:'flex',flexDirection:'column',padding:'24px 16px',position:'sticky',top:0}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <div style={{width:40,height:40,borderRadius:10,background:C.primary,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>⚡</div>
        <div><div style={{color:'#fff',fontWeight:800,fontSize:16}}>DoorBite</div><div style={{color:C.gray,fontSize:10,letterSpacing:1}}>ADMIN CONSOLE</div></div>
      </div>
      <div style={{background:'#1E2130',borderRadius:12,padding:10,marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:36,height:36,borderRadius:'50%',background:C.primary,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:16}}>{user?.name?.[0]}</div>
        <div><div style={{color:'#fff',fontWeight:700,fontSize:13}}>{user?.name}</div><div style={{color:C.gray,fontSize:11}}>Administrator</div></div>
      </div>
      <div style={{flex:1,overflowY:'auto'}}>
        {nav.map(n=>(
          <div key={n.k} onClick={()=>setPage(n.k)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,cursor:'pointer',marginBottom:2,background:page===n.k?C.primary:'transparent',color:page===n.k?'#fff':C.gray,fontWeight:600,fontSize:14}}>
            <span>{n.i}</span><span style={{flex:1}}>{n.l}</span>
            {n.badge>0&&<span style={{background:C.error,color:'#fff',borderRadius:10,padding:'2px 7px',fontSize:11,fontWeight:800}}>{n.badge}</span>}
          </div>
        ))}
      </div>
      <div onClick={logout} style={{color:C.gray,cursor:'pointer',padding:'10px 12px',fontWeight:600}}>↩ Sign out</div>
    </div>
  );
}

function CommissionModal({ restaurant, onClose, onSave }) {
  const [form, setForm] = useState({
    isActive: restaurant?.commissionOverride?.isActive || false,
    percentage: restaurant?.commissionOverride?.percentage ?? 10,
    reason: restaurant?.commissionOverride?.reason || '',
    expiresAt: restaurant?.commissionOverride?.expiresAt ? new Date(restaurant.commissionOverride.expiresAt).toISOString().split('T')[0] : '',
  });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try { await api.patch(`/admin/restaurants/${restaurant._id}/commission`, {...form, expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null}); onSave(); onClose(); }
    catch (err) { alert(err.response?.data?.message || err.message); }
    finally { setSaving(false); }
  };
  const isExpired = restaurant?.commissionOverride?.expiresAt && new Date() > new Date(restaurant.commissionOverride.expiresAt);
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:'#fff',borderRadius:20,padding:32,width:520,maxWidth:'92vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div><h2 style={{fontSize:20,fontWeight:800,marginBottom:4}}>💰 Commission Override</h2><p style={{color:C.gray,fontSize:13}}>{restaurant?.name} · {restaurant?.cuisineType}</p></div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:C.gray}}>✕</button>
        </div>
        {restaurant?.commissionOverride?.isActive && (
          <div style={{background:isExpired?'#FEF2F2':'#F0FDF4',border:`1px solid ${isExpired?'#FECACA':'#BBF7D0'}`,borderRadius:12,padding:12,marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:isExpired?C.error:C.success,marginBottom:4}}>{isExpired?'⚠️ Override has expired — reverted to default 10%':'✅ Override currently active'}</div>
            <div style={{fontSize:12,color:C.gray}}>Current rate: <strong>{restaurant.commissionOverride.percentage}%</strong>{restaurant.commissionOverride.expiresAt&&<span> · {isExpired?'Expired':'Expires'}: <strong>{new Date(restaurant.commissionOverride.expiresAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</strong></span>}</div>
            {restaurant.commissionOverride.reason&&<div style={{fontSize:12,color:C.gray,marginTop:2}}>📝 {restaurant.commissionOverride.reason}</div>}
          </div>
        )}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:C.bg,borderRadius:12,padding:16,marginBottom:20}}>
          <div><div style={{fontWeight:700,fontSize:14}}>Enable Commission Override</div><div style={{color:C.gray,fontSize:12,marginTop:2}}>Overrides the default 10% platform commission for this restaurant</div></div>
          <div onClick={()=>setForm({...form,isActive:!form.isActive})} style={{width:52,height:28,borderRadius:14,background:form.isActive?C.success:'#ddd',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
            <div style={{position:'absolute',top:3,left:form.isActive?26:3,width:22,height:22,borderRadius:'50%',background:'#fff',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}} />
          </div>
        </div>
        {form.isActive && (<>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:10}}>COMMISSION PERCENTAGE</label>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <input type="range" min={0} max={30} step={0.5} value={form.percentage} onChange={e=>setForm({...form,percentage:parseFloat(e.target.value)})} style={{flex:1,accentColor:C.primary,height:6}} />
              <div style={{width:72,textAlign:'center',background:form.percentage===0?C.success:form.percentage<10?'#8B5CF6':form.percentage===10?C.primary:C.error,color:'#fff',borderRadius:12,padding:'10px 0',fontWeight:900,fontSize:20,flexShrink:0}}>{form.percentage}%</div>
            </div>
            <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
              {[{v:0,l:'0% — Free'},{v:5,l:'5%'},{v:7.5,l:'7.5%'},{v:10,l:'10% — Default'},{v:12.5,l:'12.5%'},{v:15,l:'15%'},{v:20,l:'20%'}].map(({v,l})=>(
                <button key={v} onClick={()=>setForm({...form,percentage:v})} style={{...btn(form.percentage===v?C.primary:'#f0f0f0'),color:form.percentage===v?'#fff':'#555',padding:'6px 14px',fontSize:12,borderRadius:20,border:form.percentage===v?'none':`1px solid ${C.border}`}}>{l}</button>
              ))}
            </div>
            <div style={{background:C.bg,borderRadius:12,padding:16,marginTop:16,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:C.gray,marginBottom:10,letterSpacing:0.5}}>📊 EXAMPLE BREAKDOWN ON ₦10,000 ORDER</div>
              {[['Restaurant receives',`₦${Math.round(10000*(1-form.percentage/100)).toLocaleString()}`,form.percentage<10?C.success:'#333'],[`DoorBite commission (${form.percentage}%)`,`₦${Math.round(10000*form.percentage/100).toLocaleString()}`,form.percentage<10?'#8B5CF6':form.percentage>10?C.error:C.primary],['Rider earnings','₦900','#333']].map(([label,val,color])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:13,color:C.gray}}>{label}</span><span style={{fontSize:13,fontWeight:800,color}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>EXPIRY DATE <span style={{fontWeight:400}}>(optional)</span></label><input type="date" style={{...inp}} value={form.expiresAt} onChange={e=>setForm({...form,expiresAt:e.target.value})} min={new Date().toISOString().split('T')[0]} /></div>
          <div style={{marginBottom:24}}><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>REASON / NOTE <span style={{fontWeight:400}}>(optional)</span></label><input style={inp} placeholder="e.g. New restaurant promo, partnership deal..." value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} /></div>
        </>)}
        <div style={{display:'flex',gap:10}}>
          <button style={{...btn('#f5f5f5'),color:C.gray,padding:'11px 20px'}} onClick={onClose}>Cancel</button>
          <button style={{...btn(form.isActive?C.primary:C.success),flex:1,padding:'11px 0',fontSize:14}} onClick={save} disabled={saving}>{saving?'Saving...':form.isActive?`✓ Apply ${form.percentage}% Commission`:'✓ Reset to Default 10%'}</button>
        </div>
      </div>
    </div>
  );
}

function Overview({setPage}) {
  const [stats,setStats]=useState(null);
  const [earnings,setEarnings]=useState(null);
  const [overrides,setOverrides]=useState([]);
  useEffect(()=>{
    api.get('/admin/overview').then(r=>setStats(r.data)).catch(()=>{});
    api.get('/admin/earnings').then(r=>setEarnings(r.data)).catch(()=>{});
    api.get('/admin/commission-overrides').then(r=>setOverrides(r.data)).catch(()=>{});
  },[]);
  if(!stats) return <div style={{padding:28}}>Loading...</div>;
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <h1 style={{fontSize:26,fontWeight:800,marginBottom:4}}>Platform Overview</h1>
      <p style={{color:C.gray,marginBottom:24}}>{new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      {(stats.pendingWithdrawals>0||stats.pendingRefunds>0||stats.pendingRestaurants>0||stats.pendingRiders>0)&&(
        <div style={{display:'flex',gap:14,marginBottom:20,flexWrap:'wrap'}}>
          {stats.pendingRestaurants>0&&(<div onClick={()=>setPage('restaurants')} style={{flex:1,minWidth:160,background:'#fff',borderRadius:14,padding:14,borderLeft:`4px solid ${C.primary}`,cursor:'pointer'}}><div style={{color:C.gray,fontSize:12,fontWeight:600}}>Restaurant applications</div><div style={{fontSize:28,fontWeight:800,color:C.primary}}>{stats.pendingRestaurants}</div><div style={{color:C.primary,fontWeight:700,fontSize:13}}>Review →</div></div>)}
          {stats.pendingRiders>0&&(<div onClick={()=>setPage('riders')} style={{flex:1,minWidth:160,background:'#fff',borderRadius:14,padding:14,borderLeft:`4px solid ${C.warning}`,cursor:'pointer'}}><div style={{color:C.gray,fontSize:12,fontWeight:600}}>Rider applications</div><div style={{fontSize:28,fontWeight:800,color:C.warning}}>{stats.pendingRiders}</div><div style={{color:C.primary,fontWeight:700,fontSize:13}}>Review →</div></div>)}
          {stats.pendingWithdrawals>0&&(<div onClick={()=>setPage('withdrawals')} style={{flex:1,minWidth:160,background:'#fff',borderRadius:14,padding:14,borderLeft:`4px solid ${C.warning}`,cursor:'pointer'}}><div style={{color:C.gray,fontSize:12,fontWeight:600}}>Pending withdrawals</div><div style={{fontSize:28,fontWeight:800,color:C.warning}}>{stats.pendingWithdrawals}</div><div style={{color:C.primary,fontWeight:700,fontSize:13}}>Review →</div></div>)}
          {stats.pendingRefunds>0&&(<div onClick={()=>setPage('refunds')} style={{flex:1,minWidth:160,background:'#fff',borderRadius:14,padding:14,borderLeft:`4px solid ${C.error}`,cursor:'pointer'}}><div style={{color:C.gray,fontSize:12,fontWeight:600}}>Refund requests</div><div style={{fontSize:28,fontWeight:800,color:C.error}}>{stats.pendingRefunds}</div><div style={{color:C.primary,fontWeight:700,fontSize:13}}>Review →</div></div>)}
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:14}}>
        <div style={{...card,background:C.primary,marginBottom:0}}><div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.7)',letterSpacing:0.8,marginBottom:4}}>TOTAL GMV</div><div style={{fontSize:28,fontWeight:800,color:'#fff'}}>₦{(stats.totalGMV||0).toLocaleString()}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginTop:2}}>All time</div></div>
        {[['THIS WEEK','₦'+(stats.weekGMV||0).toLocaleString(),'7-day revenue'],['TODAY','₦'+(stats.todayGMV||0).toLocaleString(),"Today's revenue"],['DELIVERED',stats.deliveredOrders,'completed orders']].map(([l,v,s])=>(
          <div key={l} style={{...card,marginBottom:0}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.8,marginBottom:4}}>{l}</div><div style={{fontSize:22,fontWeight:800}}>{v}</div><div style={{fontSize:11,color:C.gray,marginTop:2}}>{s}</div></div>
        ))}
      </div>
      <div style={{...card,marginBottom:20,borderTop:`3px solid ${C.success}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div><h2 style={{fontSize:18,fontWeight:800,marginBottom:2}}>💰 DoorBite Earnings</h2><p style={{color:C.gray,fontSize:13}}>Commission from restaurants + ₦100/delivery from riders + small order fees</p></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5}}>TOTAL ALL TIME</div><div style={{fontSize:28,fontWeight:800,color:C.success}}>₦{(earnings?.totalPlatformEarnings||0).toLocaleString()}</div></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          <div style={{background:C.bg,borderRadius:12,padding:16,borderLeft:'3px solid #8B5CF6'}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:6}}>FROM RESTAURANTS</div><div style={{fontSize:22,fontWeight:800,color:'#8B5CF6'}}>₦{(earnings?.totalFromRestaurants||0).toLocaleString()}</div><div style={{fontSize:11,color:C.gray,marginTop:4}}>Variable commission</div></div>
          <div style={{background:C.bg,borderRadius:12,padding:16,borderLeft:`3px solid ${C.warning}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:6}}>FROM RIDERS</div><div style={{fontSize:22,fontWeight:800,color:C.warning}}>₦{(earnings?.totalFromRiders||0).toLocaleString()}</div><div style={{fontSize:11,color:C.gray,marginTop:4}}>₦100 per delivery</div></div>
          <div style={{background:C.bg,borderRadius:12,padding:16,borderLeft:`3px solid ${C.primary}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:6}}>THIS MONTH</div><div style={{fontSize:22,fontWeight:800,color:C.primary}}>₦{(earnings?.monthPlatformEarnings||0).toLocaleString()}</div><div style={{fontSize:11,color:C.gray,marginTop:4}}>{earnings?.monthOrders||0} orders</div></div>
          <div style={{background:C.bg,borderRadius:12,padding:16,borderLeft:`3px solid ${C.success}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:6}}>THIS MONTH BREAKDOWN</div><div style={{fontSize:13,fontWeight:700,color:'#8B5CF6',marginTop:4}}>Restaurants: ₦{(earnings?.monthFromRestaurants||0).toLocaleString()}</div><div style={{fontSize:13,fontWeight:700,color:C.warning,marginTop:4}}>Riders: ₦{(earnings?.monthFromRiders||0).toLocaleString()}</div></div>
        </div>
      </div>
      {overrides.length>0&&(
        <div style={{...card,marginBottom:20,borderTop:`3px solid ${C.warning}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div><h2 style={{fontSize:18,fontWeight:800,marginBottom:2}}>💰 Active Commission Overrides</h2><p style={{color:C.gray,fontSize:13}}>Restaurants not on the default 10% commission</p></div>
            <span style={{background:C.warning+'22',color:C.warning,padding:'5px 14px',borderRadius:20,fontSize:13,fontWeight:700}}>{overrides.length} active</span>
          </div>
          {overrides.map(r=>{
            const exp=r.commissionOverride?.expiresAt;
            const daysLeft=exp?Math.ceil((new Date(exp)-new Date())/(1000*60*60*24)):null;
            const pct=r.commissionOverride?.percentage;
            return(
              <div key={r._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:C.warning+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🏪</div>
                  <div><div style={{fontWeight:700,fontSize:14}}>{r.name}</div>{r.commissionOverride?.reason&&<div style={{color:C.gray,fontSize:12}}>📝 {r.commissionOverride.reason}</div>}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  {daysLeft!==null&&<span style={{color:daysLeft<=3?C.error:C.gray,fontSize:12,fontWeight:600}}>{daysLeft<=0?'⚠️ Expires today':`${daysLeft}d left`}</span>}
                  {!exp&&<span style={{color:C.gray,fontSize:12}}>Permanent</span>}
                  <div style={{background:pct<10?C.success+'22':pct>10?C.error+'22':C.primary+'22',color:pct<10?C.success:pct>10?C.error:C.primary,padding:'6px 16px',borderRadius:20,fontWeight:900,fontSize:16}}>{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[['CUSTOMERS',stats.totalUsers,'registered'],['RESTAURANTS',stats.totalRestaurants,'active'],['RIDERS',stats.totalRiders,'approved'],['TOTAL ORDERS',stats.totalOrders,'paid']].map(([l,v,s])=>(
          <div key={l} style={{...card,marginBottom:0}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.8}}>{l}</div><div style={{fontSize:22,fontWeight:800,margin:'4px 0'}}>{v}</div><div style={{fontSize:11,color:C.gray}}>{s}</div></div>
        ))}
      </div>
    </div>
  );
}

function Restaurants() {
  const [pending,setPending]=useState([]);
  const [approved,setApproved]=useState([]);
  const [tab,setTab]=useState('pending');
  const [loading,setLoading]=useState(true);
  const [commissionTarget,setCommissionTarget]=useState(null);
  const loadAll=()=>{ setLoading(true); Promise.all([api.get('/admin/restaurants/pending'),api.get('/admin/restaurants')]).then(([p,a])=>{ setPending(p.data); setApproved(a.data.filter(r=>r.isVerified)); }).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ loadAll(); },[]);
  const approve=async(id)=>{ await api.patch(`/admin/restaurants/${id}/verify`,{isVerified:true,isSuspended:false}); const r=pending.find(r=>r._id===id); setPending(prev=>prev.filter(r=>r._id!==id)); if(r) setApproved(prev=>[{...r,isVerified:true},...prev]); };
  const reject=async(id)=>{ if(!window.confirm('Reject and remove this application?')) return; await api.patch(`/admin/restaurants/${id}/verify`,{isVerified:false,isSuspended:true}); setPending(prev=>prev.filter(r=>r._id!==id)); };
  const suspend=async(id,isSuspended)=>{ await api.patch(`/admin/restaurants/${id}/verify`,{isVerified:true,isSuspended:!isSuspended}); setApproved(prev=>prev.map(r=>r._id===id?{...r,isSuspended:!isSuspended}:r)); };
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <h1 style={{fontSize:26,fontWeight:800,marginBottom:4}}>Restaurants 🏪</h1>
      <p style={{color:C.gray,marginTop:4,marginBottom:20}}>Approve applications, manage restaurants, and set custom commission rates.</p>
      <div style={{display:'flex',gap:14,marginBottom:24}}>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.warning}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>PENDING APPROVAL</div><div style={{fontSize:28,fontWeight:800,color:C.warning,margin:'4px 0'}}>{pending.length}</div><div style={{fontSize:11,color:C.gray}}>Awaiting review</div></div>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.success}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>ACTIVE</div><div style={{fontSize:28,fontWeight:800,color:C.success,margin:'4px 0'}}>{approved.filter(r=>!r.isSuspended).length}</div><div style={{fontSize:11,color:C.gray}}>Live on platform</div></div>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.error}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>SUSPENDED</div><div style={{fontSize:28,fontWeight:800,color:C.error,margin:'4px 0'}}>{approved.filter(r=>r.isSuspended).length}</div><div style={{fontSize:11,color:C.gray}}>Temporarily disabled</div></div>
        <div style={{...card,marginBottom:0,flex:1,borderTop:'3px solid #8B5CF6'}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>CUSTOM COMMISSION</div><div style={{fontSize:28,fontWeight:800,color:'#8B5CF6',margin:'4px 0'}}>{approved.filter(r=>r.commissionOverride?.isActive).length}</div><div style={{fontSize:11,color:C.gray}}>Non-default rate</div></div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {[['pending',`Pending (${pending.length})`],['approved',`Active (${approved.length})`]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{...btn(tab===key?C.primary:'#fff'),color:tab===key?'#fff':C.gray,border:`1px solid ${C.border}`,borderRadius:20}}>{label}</button>
        ))}
      </div>
      {loading?<div style={{textAlign:'center',padding:40,color:C.gray}}>Loading...</div>:
        tab==='pending'?(
          pending.length===0?(<div style={{...card,textAlign:'center',padding:60}}><div style={{fontSize:48,marginBottom:12}}>✅</div><p style={{color:C.gray,fontSize:16,fontWeight:600}}>No pending applications</p></div>):
          pending.map(r=>(
            <div key={r._id} style={{...card,borderLeft:`4px solid ${C.warning}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:44,height:44,borderRadius:12,background:C.warning+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>🏪</div>
                    <div><div style={{fontWeight:800,fontSize:18}}>{r.name}</div><div style={{color:C.gray,fontSize:13}}>{r.cuisineType}</div></div>
                    <span style={{...badge(C.warning),marginLeft:4}}>Pending</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    {[['👤 Owner',r.owner?.name],['📧 Email',r.owner?.email],['📞 Phone',r.owner?.phone||r.phone],['📍 Address',r.address],['🍽️ Cuisine',r.cuisineType],['📅 Applied',new Date(r.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})]].map(([label,value])=>(
                      <div key={label} style={{background:C.bg,borderRadius:8,padding:'8px 12px'}}><div style={{fontSize:11,color:C.gray,fontWeight:700}}>{label}</div><div style={{fontSize:13,fontWeight:600,marginTop:2}}>{value||'—'}</div></div>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginLeft:20,flexShrink:0}}>
                  <button style={{...btn(C.success),padding:'10px 24px',fontSize:14}} onClick={()=>approve(r._id)}>✓ Approve</button>
                  <button style={{...btn('#fff'),color:C.error,border:`1px solid ${C.error}`,padding:'10px 24px',fontSize:14}} onClick={()=>reject(r._id)}>✕ Reject</button>
                </div>
              </div>
            </div>
          ))
        ):(
          approved.length===0?(<div style={{...card,textAlign:'center',padding:60}}><div style={{fontSize:48,marginBottom:12}}>🏪</div><p style={{color:C.gray,fontSize:16,fontWeight:600}}>No active restaurants yet</p></div>):
          approved.map(r=>{
            const hasOverride=r.commissionOverride?.isActive;
            const overridePct=r.commissionOverride?.percentage;
            const isExpired=r.commissionOverride?.expiresAt&&new Date()>new Date(r.commissionOverride.expiresAt);
            return(
              <div key={r._id} style={{...card,borderLeft:hasOverride&&!isExpired?'4px solid #8B5CF6':'4px solid transparent'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:44,height:44,borderRadius:12,background:C.success+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>🏪</div>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2,flexWrap:'wrap'}}>
                        <strong style={{fontSize:16}}>{r.name}</strong>
                        <span style={badge(r.isSuspended?C.error:C.success)}>{r.isSuspended?'Suspended':'Active'}</span>
                        <span style={badge(r.isOpen?C.success:C.gray)}>{r.isOpen?'Open':'Closed'}</span>
                        {hasOverride&&!isExpired&&<span style={badge('#8B5CF6')}>{overridePct}% commission</span>}
                      </div>
                      <div style={{color:C.gray,fontSize:13}}>{r.cuisineType} · {r.address}</div>
                      <div style={{color:C.gray,fontSize:12,marginTop:2}}>Owner: {r.owner?.name} · {r.owner?.email}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    <button style={btn(r.isSuspended?C.success:C.error)} onClick={()=>suspend(r._id,r.isSuspended)}>{r.isSuspended?'Unsuspend':'Suspend'}</button>
                    <button style={{...btn('#fff'),color:'#8B5CF6',border:'1px solid #8B5CF6',fontWeight:700}} onClick={()=>setCommissionTarget(r)}>💰 {hasOverride&&!isExpired?`${overridePct}%`:'Commission'}</button>
                  </div>
                </div>
              </div>
            );
          })
        )
      }
      {commissionTarget&&<CommissionModal restaurant={commissionTarget} onClose={()=>setCommissionTarget(null)} onSave={()=>loadAll()} />}
    </div>
  );
}

function Riders() {
  const [pending,setPending]=useState([]);
  const [approved,setApproved]=useState([]);
  const [tab,setTab]=useState('pending');
  const [loading,setLoading]=useState(true);
  const [rejectModal,setRejectModal]=useState(null);
  const [rejectReason,setRejectReason]=useState('');
  const loadAll=()=>{ setLoading(true); Promise.all([api.get('/riders/pending'),api.get('/riders/all')]).then(([p,a])=>{ setPending(p.data); setApproved(a.data.filter(r=>r.isApproved)); }).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ loadAll(); },[]);
  const approve=async(id)=>{ try{ await api.patch(`/riders/${id}/approve`); const rider=pending.find(r=>r._id===id); setPending(prev=>prev.filter(r=>r._id!==id)); if(rider) setApproved(prev=>[{...rider,isApproved:true},...prev]); }catch(err){ alert(err.response?.data?.message||err.message); } };
  const reject=async()=>{ if(!rejectReason.trim()) return alert('Please provide a rejection reason'); try{ await api.patch(`/riders/${rejectModal._id}/reject`,{reason:rejectReason}); setPending(prev=>prev.filter(r=>r._id!==rejectModal._id)); setRejectModal(null); setRejectReason(''); }catch(err){ alert(err.response?.data?.message||err.message); } };
  const suspend=async(id,isSuspended)=>{ try{ await api.patch(`/users/${id}/suspend`,{isSuspended:!isSuspended}); setApproved(prev=>prev.map(r=>r._id===id?{...r,isSuspended:!isSuspended}:r)); }catch(err){ alert(err.response?.data?.message||err.message); } };
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <h1 style={{fontSize:26,fontWeight:800,marginBottom:4}}>Riders 🏍️</h1>
      <p style={{color:C.gray,marginBottom:20}}>Verify rider identities and approve accounts before they can deliver.</p>
      <div style={{display:'flex',gap:14,marginBottom:24}}>
        {[['PENDING APPROVAL',pending.length,C.warning,'Awaiting review'],['APPROVED',approved.filter(r=>!r.isSuspended).length,C.success,'Active riders'],['ONLINE NOW',approved.filter(r=>r.isOnline).length,C.primary,'Currently active'],['SUSPENDED',approved.filter(r=>r.isSuspended).length,C.error,'Suspended riders']].map(([label,val,color,sub])=>(
          <div key={label} style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${color}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>{label}</div><div style={{fontSize:28,fontWeight:800,color,margin:'4px 0'}}>{val}</div><div style={{fontSize:11,color:C.gray}}>{sub}</div></div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {[['pending',`Pending (${pending.length})`],['approved',`Approved (${approved.length})`]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{...btn(tab===key?C.primary:'#fff'),color:tab===key?'#fff':C.gray,border:`1px solid ${C.border}`,borderRadius:20}}>{label}</button>
        ))}
      </div>
      {loading?<div style={{textAlign:'center',padding:40,color:C.gray}}>Loading...</div>:
        tab==='pending'?(
          pending.length===0?(<div style={{...card,textAlign:'center',padding:60}}><div style={{fontSize:48,marginBottom:12}}>✅</div><p style={{color:C.gray,fontSize:16,fontWeight:600}}>No pending rider applications</p></div>):
          pending.map(rider=>(
            <div key={rider._id} style={{...card,borderLeft:`4px solid ${C.warning}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                    <div style={{width:48,height:48,borderRadius:24,background:C.warning+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800,border:`2px solid ${C.warning}44`,color:C.warning}}>{rider.name?.[0]?.toUpperCase()}</div>
                    <div><div style={{fontWeight:800,fontSize:17}}>{rider.name}</div><div style={{color:C.gray,fontSize:13}}>{rider.email}</div></div>
                    <span style={{...badge(C.warning),marginLeft:4}}>Pending</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[['📞 Phone',rider.phone||'—'],['🏍️ Vehicle',rider.vehicleType||'—'],['🪪 ID Type',rider.idType||'NIN'],['🔢 ID Number',rider.ninNumber||'—'],['📅 Applied',new Date(rider.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})],['📧 Email',rider.email]].map(([label,value])=>(
                      <div key={label} style={{background:C.bg,borderRadius:8,padding:'8px 12px'}}><div style={{fontSize:11,color:C.gray,fontWeight:700}}>{label}</div><div style={{fontSize:13,fontWeight:600,marginTop:2}}>{value}</div></div>
                    ))}
                  </div>
                  {rider.idDocumentUrl&&(<div style={{marginTop:12}}><div style={{fontSize:11,color:C.gray,fontWeight:700,marginBottom:4}}>📎 UPLOADED ID DOCUMENT</div><a href={rider.idDocumentUrl} target="_blank" rel="noreferrer" style={{color:C.primary,fontSize:13,fontWeight:600,textDecoration:'none'}}>🔗 View Document →</a></div>)}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginLeft:20,flexShrink:0}}>
                  <button style={{...btn(C.success),padding:'10px 24px',fontSize:14}} onClick={()=>approve(rider._id)}>✓ Approve</button>
                  <button style={{...btn('#fff'),color:C.error,border:`1px solid ${C.error}`,padding:'10px 24px',fontSize:14}} onClick={()=>{ setRejectModal(rider); setRejectReason(''); }}>✕ Reject</button>
                </div>
              </div>
            </div>
          ))
        ):(
          approved.length===0?(<div style={{...card,textAlign:'center',padding:60}}><div style={{fontSize:48,marginBottom:12}}>🏍️</div><p style={{color:C.gray,fontSize:16,fontWeight:600}}>No approved riders yet</p></div>):
          approved.map(rider=>(
            <div key={rider._id} style={{...card}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:44,height:44,borderRadius:22,background:C.success+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:C.success,border:`2px solid ${C.success}44`}}>{rider.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2,flexWrap:'wrap'}}>
                      <strong style={{fontSize:15}}>{rider.name}</strong>
                      <span style={badge(rider.isSuspended?C.error:C.success)}>{rider.isSuspended?'Suspended':'Active'}</span>
                      <span style={badge(rider.isOnline?C.success:C.gray)}>{rider.isOnline?'● Online':'● Offline'}</span>
                    </div>
                    <div style={{color:C.gray,fontSize:12}}>{rider.email} · {rider.phone}</div>
                    <div style={{color:C.gray,fontSize:12,marginTop:2}}>{rider.vehicleType&&`${rider.vehicleType} · `}{rider.idType}: {rider.ninNumber||'—'} · ⭐ {rider.rating?.toFixed(1)} · {rider.totalTrips} trips · ₦{(rider.totalEarnings||0).toLocaleString()} earned</div>
                    {rider.approvedAt&&<div style={{color:C.gray,fontSize:11,marginTop:2}}>Approved {new Date(rider.approvedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>}
                  </div>
                </div>
                <button style={btn(rider.isSuspended?C.success:C.error)} onClick={()=>suspend(rider._id,rider.isSuspended)}>{rider.isSuspended?'Unsuspend':'Suspend'}</button>
              </div>
            </div>
          ))
        )
      }
      {rejectModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={e=>e.target===e.currentTarget&&setRejectModal(null)}>
          <div style={{background:'#fff',borderRadius:20,padding:32,width:480,boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <h2 style={{fontSize:20,fontWeight:800,marginBottom:4}}>✕ Reject Rider Application</h2>
            <p style={{color:C.gray,fontSize:13,marginBottom:20}}>{rejectModal.name} · {rejectModal.email}</p>
            <label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>REJECTION REASON *</label>
            <textarea style={{...inp,height:100,resize:'vertical',fontFamily:'inherit'}} placeholder="e.g. Invalid NIN number provided, ID document unclear..." value={rejectReason} onChange={e=>setRejectReason(e.target.value)} />
            <p style={{color:C.gray,fontSize:12,marginTop:6,marginBottom:20}}>This reason will be sent to the rider by email.</p>
            <div style={{display:'flex',gap:10}}>
              <button style={{...btn('#f5f5f5'),color:C.gray,padding:'11px 20px'}} onClick={()=>setRejectModal(null)}>Cancel</button>
              <button style={{...btn(C.error),flex:1,padding:'11px 0'}} onClick={reject}>✕ Reject &amp; Notify Rider</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Withdrawals() {
  const [list,setList]=useState([]);
  const [tab,setTab]=useState('pending');
  const [selected,setSelected]=useState(null);
  const [editingBank,setEditingBank]=useState(false);
  const [bankForm,setBankForm]=useState({bankName:'',accountNumber:'',accountName:'',bankCode:''});
  const [savingBank,setSavingBank]=useState(false);
  const TABS=['pending','approved','processing','paid','rejected','all'];
  const SC={pending:C.warning,approved:C.primary,processing:'#8B5CF6',paid:C.success,rejected:C.error};
  const NIGERIAN_BANKS=[{name:'Access Bank',code:'044'},{name:'Citibank Nigeria',code:'023'},{name:'Ecobank Nigeria',code:'050'},{name:'Fidelity Bank',code:'070'},{name:'First Bank of Nigeria',code:'011'},{name:'FCMB',code:'214'},{name:'GTBank',code:'058'},{name:'Heritage Bank',code:'030'},{name:'Keystone Bank',code:'082'},{name:'Kuda Bank',code:'50211'},{name:'Moniepoint MFB',code:'50515'},{name:'Opay',code:'999992'},{name:'Palmpay',code:'999991'},{name:'Polaris Bank',code:'076'},{name:'Providus Bank',code:'101'},{name:'Stanbic IBTC',code:'221'},{name:'Sterling Bank',code:'232'},{name:'UBA',code:'033'},{name:'Union Bank',code:'032'},{name:'Unity Bank',code:'215'},{name:'Wema Bank',code:'035'},{name:'Zenith Bank',code:'057'},{name:'Standard Chartered',code:'068'},{name:'Taj Bank',code:'302'}];
  useEffect(()=>{ api.get(`/withdrawals?status=${tab}`).then(r=>setList(r.data)).catch(()=>{}); },[tab]);
  const update=async(id,status)=>{ await api.patch(`/withdrawals/${id}`,{status}); setList(l=>l.filter(x=>x._id!==id)); if(selected?._id===id) setSelected(null); };
  const openModal=(w)=>{ setSelected(w); setEditingBank(false); setBankForm(w.bankDetails||{bankName:'',accountNumber:'',accountName:'',bankCode:''}); };
  const saveBank=async()=>{ if(!bankForm.accountNumber||!bankForm.bankName||!bankForm.accountName) return alert('Please fill in all bank details'); setSavingBank(true); try{ await api.patch(`/withdrawals/${selected._id}`,{bankDetails:bankForm}); setList(l=>l.map(x=>x._id===selected._id?{...x,bankDetails:bankForm}:x)); setSelected(prev=>({...prev,bankDetails:bankForm})); setEditingBank(false); alert('Bank details updated!'); }catch(err){ alert(err.response?.data?.message||err.message); }finally{ setSavingBank(false); } };
  const hasBankDetails=(w)=>w.bankDetails?.accountNumber&&w.bankDetails?.bankName;
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <h1 style={{fontSize:26,fontWeight:800,marginBottom:4}}>Withdrawals 💸</h1>
      <p style={{color:C.gray,marginBottom:20}}>Review and process withdrawal requests from restaurants and riders.</p>
      <div style={{display:'flex',gap:14,marginBottom:24}}>
        {[['PENDING',list.filter(w=>w.status==='pending').length,C.warning],['PROCESSING',list.filter(w=>w.status==='processing').length,'#8B5CF6'],['PAID',list.filter(w=>w.status==='paid').length,C.success],['REJECTED',list.filter(w=>w.status==='rejected').length,C.error]].map(([label,val,color])=>(
          <div key={label} style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${color}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>{label}</div><div style={{fontSize:28,fontWeight:800,color,margin:'4px 0'}}>{val}</div></div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {TABS.map(t=>(<button key={t} onClick={()=>setTab(t)} style={{...btn(tab===t?C.primary:'#fff'),color:tab===t?'#fff':C.gray,border:`1px solid ${C.border}`,borderRadius:20,textTransform:'capitalize'}}>{t}</button>))}
      </div>
      {list.length===0?(<p style={{color:C.gray,textAlign:'center',marginTop:60,fontSize:15}}>No {tab} withdrawals</p>):list.map(w=>(
        <div key={w._id} style={{...card,cursor:'pointer',transition:'box-shadow 0.15s'}} onClick={()=>openModal(w)} onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.1)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:C.primary+'22',display:'flex',alignItems:'center',justifyContent:'center',color:C.primary,fontWeight:800,fontSize:18}}>{w.requester?.name?.[0]}</div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                  <strong style={{fontSize:15}}>{w.requester?.name}</strong>
                  <span style={badge(SC[w.status]||C.gray)}>{w.status}</span>
                  {w.requester?.role&&<span style={badge(C.primary)}>{w.requester.role}</span>}
                  {!hasBankDetails(w)&&<span style={badge(C.error)}>⚠️ No bank details</span>}
                </div>
                <div style={{color:C.gray,fontSize:12}}>{w.requester?.email}</div>
                <div style={{color:C.gray,fontSize:12,marginTop:2}}>{hasBankDetails(w)?`🏦 ${w.bankDetails.bankName} · ${w.bankDetails.accountNumber} · ${w.bankDetails.accountName}`:'⚠️ Bank details not set — click to add'}</div>
                {w.adminNote&&<div style={{color:C.warning,fontSize:12,marginTop:2}}>📝 {w.adminNote}</div>}
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>₦{w.amount?.toLocaleString()}</div>
              <div style={{color:C.gray,fontSize:12,marginBottom:8}}>{new Date(w.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
              <div style={{display:'flex',gap:8,justifyContent:'flex-end'}} onClick={e=>e.stopPropagation()}>
                {w.status==='pending'&&(<><button style={btn(C.primary)} onClick={()=>update(w._id,'approved')}>✓ Approve & Pay</button><button style={{...btn('#fff'),color:C.error,border:`1px solid ${C.error}`}} onClick={()=>update(w._id,'rejected')}>✕ Reject</button></>)}
                {w.status==='approved'&&<button style={btn(C.primary)} onClick={()=>update(w._id,'paid')}>Mark Paid</button>}
                {w.status==='processing'&&<span style={{color:'#8B5CF6',fontWeight:600,fontSize:13}}>↻ Paystack transfer in progress</span>}
                {w.status==='paid'&&<span style={{color:C.success,fontWeight:600,fontSize:13}}>✓ Paid</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
      {selected&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div style={{background:'#fff',borderRadius:20,padding:32,width:540,maxWidth:'92vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div><h2 style={{fontSize:20,fontWeight:800,marginBottom:4}}>Withdrawal Details</h2><p style={{color:C.gray,fontSize:13}}>{selected.requester?.name} · {selected.requester?.email}</p></div>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:C.gray}}>✕</button>
            </div>
            <div style={{display:'flex',gap:14,marginBottom:20}}>
              <div style={{flex:1,background:C.bg,borderRadius:14,padding:16,textAlign:'center'}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:4}}>AMOUNT</div><div style={{fontSize:28,fontWeight:800,color:C.primary}}>₦{selected.amount?.toLocaleString()}</div></div>
              <div style={{flex:1,background:C.bg,borderRadius:14,padding:16,textAlign:'center'}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:4}}>STATUS</div><span style={{...badge(SC[selected.status]||C.gray),fontSize:14,padding:'5px 14px'}}>{selected.status}</span></div>
              <div style={{flex:1,background:C.bg,borderRadius:14,padding:16,textAlign:'center'}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:4}}>ROLE</div><span style={{...badge(C.primary),fontSize:13,padding:'5px 14px'}}>{selected.requester?.role}</span></div>
            </div>
            <div style={{background:C.bg,borderRadius:14,padding:16,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:10}}>👤 REQUESTER INFO</div>
              {[['Name',selected.requester?.name],['Email',selected.requester?.email],['Role',selected.requester?.role],['Requested',new Date(selected.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})]].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${C.border}`}}><span style={{color:C.gray,fontSize:13}}>{label}</span><span style={{fontWeight:600,fontSize:13}}>{value||'—'}</span></div>
              ))}
            </div>
            <div style={{background:C.bg,borderRadius:14,padding:16,marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5}}>🏦 BANK DETAILS</div>
                <button onClick={()=>setEditingBank(!editingBank)} style={{...btn(editingBank?'#f5f5f5':C.primary),color:editingBank?C.gray:'#fff',padding:'5px 14px',fontSize:12}}>{editingBank?'Cancel':hasBankDetails(selected)?'✏️ Edit':'+ Add Bank Details'}</button>
              </div>
              {!editingBank?(
                hasBankDetails(selected)?(
                  <div>{[['Bank Name',selected.bankDetails?.bankName],['Account Number',selected.bankDetails?.accountNumber],['Account Name',selected.bankDetails?.accountName],['Bank Code',selected.bankDetails?.bankCode||'—']].map(([label,value])=>(
                    <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}><span style={{color:C.gray,fontSize:13}}>{label}</span><span style={{fontWeight:700,fontSize:13}}>{value||'—'}</span></div>
                  ))}</div>
                ):(
                  <div style={{textAlign:'center',padding:'20px 0'}}><div style={{fontSize:32,marginBottom:8}}>🏦</div><p style={{color:C.error,fontWeight:600,fontSize:13}}>No bank details on file</p><p style={{color:C.gray,fontSize:12,marginTop:4}}>Click "Add Bank Details" to add them manually</p></div>
                )
              ):(
                <div>
                  <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>BANK NAME</label><select style={{...inp,height:44,cursor:'pointer'}} value={bankForm.bankName} onChange={e=>{ const bank=NIGERIAN_BANKS.find(b=>b.name===e.target.value); setBankForm({...bankForm,bankName:e.target.value,bankCode:bank?.code||''}); }}><option value="">— Select bank —</option>{NIGERIAN_BANKS.map(b=>(<option key={b.code} value={b.name}>{b.name}</option>))}</select>{bankForm.bankCode&&<div style={{color:C.gray,fontSize:11,marginTop:4}}>Bank code: {bankForm.bankCode}</div>}</div>
                  <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>ACCOUNT NUMBER</label><input style={inp} placeholder="10-digit account number" maxLength={10} value={bankForm.accountNumber} onChange={e=>setBankForm({...bankForm,accountNumber:e.target.value})} /></div>
                  <div style={{marginBottom:16}}><label style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>ACCOUNT NAME</label><input style={inp} placeholder="As it appears on bank records" value={bankForm.accountName} onChange={e=>setBankForm({...bankForm,accountName:e.target.value})} /></div>
                  <button style={{...btn(C.success),width:'100%',padding:'11px 0',fontSize:14}} onClick={saveBank} disabled={savingBank}>{savingBank?'Saving...':'✓ Save Bank Details'}</button>
                </div>
              )}
            </div>
            {selected.paystackTransferCode&&(<div style={{background:'#F5F3FF',borderRadius:14,padding:14,marginBottom:16,border:'1px solid #DDD6FE'}}><div style={{fontSize:11,fontWeight:700,color:'#8B5CF6',letterSpacing:0.5,marginBottom:4}}>PAYSTACK TRANSFER</div><div style={{fontFamily:'monospace',fontSize:13,color:'#8B5CF6',fontWeight:700}}>{selected.paystackTransferCode}</div></div>)}
            {selected.adminNote&&(<div style={{background:'#FFFBEB',borderRadius:14,padding:14,marginBottom:16,border:`1px solid ${C.warning}44`}}><div style={{fontSize:11,fontWeight:700,color:C.warning,letterSpacing:0.5,marginBottom:4}}>ADMIN NOTE</div><div style={{fontSize:13,color:'#92400E'}}>{selected.adminNote}</div></div>)}
            <div style={{display:'flex',gap:10}}>
              <button style={{...btn('#f5f5f5'),color:C.gray,padding:'11px 20px'}} onClick={()=>setSelected(null)}>Close</button>
              {selected.status==='pending'&&(<><button style={{...btn(C.primary),flex:1,padding:'11px 0'}} onClick={()=>update(selected._id,'approved')}>✓ Approve & Pay</button><button style={{...btn(C.error),padding:'11px 20px'}} onClick={()=>update(selected._id,'rejected')}>✕ Reject</button></>)}
              {selected.status==='approved'&&(<button style={{...btn(C.primary),flex:1,padding:'11px 0'}} onClick={()=>update(selected._id,'paid')}>✓ Mark as Paid</button>)}
              {selected.status==='processing'&&(<div style={{flex:1,textAlign:'center',padding:11,color:'#8B5CF6',fontWeight:700}}>↻ Paystack transfer in progress</div>)}
              {selected.status==='paid'&&(<div style={{flex:1,textAlign:'center',padding:11,color:C.success,fontWeight:700}}>✓ Payment completed</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── USERS ─────────────────────────────────────────────────────────────────────
function Users() {
  const [users,setUsers]=useState([]);
  const [total,setTotal]=useState(0);
  const [role,setRole]=useState('all');
  const [search,setSearch]=useState('');
  const RC={customer:'#3B82F6',restaurant:C.warning,rider:C.success,admin:C.error};

  const fetch_=async()=>{
    const p={}; if(role!=='all') p.role=role.replace(/s$/,''); if(search) p.search=search;
    const {data}=await api.get('/users',{params:p}); setUsers(data.users); setTotal(data.total);
  };
  useEffect(()=>{ fetch_(); },[role]);

  const suspend=async u=>{ await api.patch(`/users/${u._id}/suspend`,{isSuspended:!u.isSuspended}); fetch_(); };

  const deleteUser=async u=>{
    if(!window.confirm(`⚠️ Delete ${u.name} (${u.email})?\n\nRole: ${u.role}\n\nThis permanently removes them from the database and cannot be undone.`)) return;
    try{ await api.delete(`/users/${u._id}`); fetch_(); }
    catch(err){ alert(err.response?.data?.message||err.message); }
  };

  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div><h1 style={{fontSize:26,fontWeight:800}}>Users</h1><p style={{color:C.gray}}>{total} total</p></div>
        <input style={{...inp,width:300}} placeholder="Search name, email..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetch_()} />
      </div>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {['all','customers','restaurants','riders'].map(r=><button key={r} onClick={()=>setRole(r)} style={{...btn(role===r?C.primary:'#fff'),color:role===r?'#fff':C.gray,border:`1px solid ${C.border}`,borderRadius:20,textTransform:'capitalize'}}>{r==='all'?'All':r}</button>)}
      </div>
      <div style={card}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>{['Name','Email','Role','Joined','Actions'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 14px',fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {users.map(u=>(
              <tr key={u._id}>
                <td style={{padding:'12px 14px',fontSize:13,borderBottom:`1px solid ${C.border}`}}>
                  <strong>{u.name}</strong>{u.isSuspended&&<span style={{...badge(C.error),marginLeft:8}}>Suspended</span>}
                </td>
                <td style={{padding:'12px 14px',fontSize:13,color:C.gray,borderBottom:`1px solid ${C.border}`}}>{u.email}</td>
                <td style={{padding:'12px 14px',borderBottom:`1px solid ${C.border}`}}><span style={badge(RC[u.role]||C.gray)}>{u.role}</span></td>
                <td style={{padding:'12px 14px',fontSize:12,color:C.gray,borderBottom:`1px solid ${C.border}`}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{padding:'12px 14px',borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <button onClick={()=>suspend(u)} style={{...btn(u.isSuspended?C.success:C.error),padding:'6px 12px',fontSize:12}}>
                      {u.isSuspended?'Unsuspend':'Suspend'}
                    </button>
                    {u.role!=='admin'&&(
                      <button onClick={()=>deleteUser(u)} style={{background:'#FEF2F2',color:C.error,border:`1px solid ${C.error}44`,padding:'6px 12px',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:12}}>
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length===0&&<p style={{color:C.gray,textAlign:'center',padding:40}}>No users found</p>}
      </div>
    </div>
  );
}

function Orders() {
  const [orders,setOrders]=useState([]); const [total,setTotal]=useState(0); const [status,setStatus]=useState('all');
  const SC={pending:C.warning,confirmed:'#3B82F6',preparing:'#8B5CF6',ready_for_pickup:'#06B6D4',picked_up:C.warning,delivered:C.success,cancelled:C.gray,rejected:C.error,awaiting_payment:'#94A3B8'};
  useEffect(()=>{ const p=status!=='all'?{status}:{}; api.get('/orders',{params:p}).then(r=>{ setOrders(r.data.orders); setTotal(r.data.total); }).catch(()=>{}); },[status]);
  const override=async(id,newStatus)=>{ await api.patch(`/orders/${id}/status`,{status:newStatus,note:'Admin override'}); setOrders(prev=>prev.map(o=>o._id===id?{...o,status:newStatus}:o)); };
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><div><h1 style={{fontSize:26,fontWeight:800}}>Orders</h1><p style={{color:C.gray}}>{total} total</p></div></div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {['all','pending','confirmed','preparing','delivered','rejected'].map(s=><button key={s} onClick={()=>setStatus(s)} style={{...btn(status===s?C.primary:'#fff'),color:status===s?'#fff':C.gray,border:`1px solid ${C.border}`,borderRadius:20,textTransform:'capitalize'}}>{s}</button>)}
      </div>
      <div style={card}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Order','Customer','Restaurant','Total','Status','Payment','Date','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 14px',fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {orders.map(o=>(
              <tr key={o._id}>
                <td style={{padding:'12px 14px',fontSize:13,borderBottom:`1px solid ${C.border}`,color:C.primary,fontWeight:700}}>#{o.orderCode}</td>
                <td style={{padding:'12px 14px',fontSize:13,borderBottom:`1px solid ${C.border}`}}>{o.customer?.name}</td>
                <td style={{padding:'12px 14px',fontSize:13,borderBottom:`1px solid ${C.border}`}}>{o.restaurant?.name}</td>
                <td style={{padding:'12px 14px',fontSize:13,fontWeight:700,borderBottom:`1px solid ${C.border}`}}>₦{o.total?.toLocaleString()}</td>
                <td style={{padding:'12px 14px',borderBottom:`1px solid ${C.border}`}}><span style={badge(SC[o.status]||C.gray)}>{o.status}</span></td>
                <td style={{padding:'12px 14px',borderBottom:`1px solid ${C.border}`}}><span style={badge(o.paymentStatus==='paid'?C.success:C.warning)}>{o.paymentStatus}</span></td>
                <td style={{padding:'12px 14px',fontSize:12,color:C.gray,borderBottom:`1px solid ${C.border}`}}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={{padding:'12px 14px',borderBottom:`1px solid ${C.border}`}}>
                  {o.status==='pending'&&<button style={{...btn(C.error),fontSize:12,padding:'5px 10px'}} onClick={()=>override(o._id,'cancelled')}>Cancel</button>}
                  {o.status==='picked_up'&&<button style={{...btn(C.success),fontSize:12,padding:'5px 10px'}} onClick={()=>override(o._id,'delivered')}>Mark Delivered</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length===0&&<p style={{color:C.gray,textAlign:'center',padding:40}}>No orders found</p>}
      </div>
    </div>
  );
}

function Refunds() {
  const [list,setList]=useState([]); const [tab,setTab]=useState('requested');
  useEffect(()=>{ api.get(`/refunds?status=${tab}`).then(r=>setList(r.data)).catch(()=>{}); },[tab]);
  const update=async(id,refundStatus)=>{ await api.patch(`/refunds/${id}`,{refundStatus}); setList(l=>l.filter(x=>x._id!==id)); };
  const processPaystackRefund=async(id)=>{ await api.post(`/payments/refund/${id}`); setList(l=>l.filter(x=>x._id!==id)); alert('Refund processed via Paystack!'); };
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <h1 style={{fontSize:26,fontWeight:800,marginBottom:20}}>Refunds</h1>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {['requested','approved','refunded','rejected','all'].map(t=><button key={t} onClick={()=>setTab(t)} style={{...btn(tab===t?C.primary:'#fff'),color:tab===t?'#fff':C.gray,border:`1px solid ${C.border}`,borderRadius:20,textTransform:'capitalize'}}>{t}</button>)}
      </div>
      {list.map(o=>(
        <div key={o._id} style={card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
            <div><strong>Order #{o.orderCode}</strong><span style={{...badge(C.primary),marginLeft:8}}>{o.restaurant?.name}</span><span style={{...badge(C.gray),marginLeft:8}}>{o.customer?.name}</span></div>
            <strong style={{fontSize:18}}>₦{o.total?.toLocaleString()}</strong>
          </div>
          <p style={{color:C.gray,fontSize:13,fontStyle:'italic',marginBottom:12}}>"{o.refundReason}"</p>
          <div style={{display:'flex',gap:8}}>
            {o.refundStatus==='requested'&&(<><button style={btn(C.primary)} onClick={()=>processPaystackRefund(o._id)}>↩ Refund via Paystack</button><button style={{...btn('#fff'),color:C.error,border:`1px solid ${C.error}`}} onClick={()=>update(o._id,'rejected')}>✕ Reject</button></>)}
            {o.refundStatus==='approved'&&<span style={{color:C.success,fontWeight:600}}>✓ Approved</span>}
            {o.refundStatus==='refunded'&&<span style={{color:C.success,fontWeight:600}}>✓ Refunded via Paystack</span>}
          </div>
        </div>
      ))}
      {list.length===0&&<p style={{color:C.gray,textAlign:'center',marginTop:60}}>No {tab} refunds</p>}
    </div>
  );
}

function Promotions() {
  const [promos,setPromos]=useState([]);
  const [restaurants,setRestaurants]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({title:'',subtitle:'',bgColor:'#FF6B2C',emoji:'🔥',ctaText:'Order Now',isActive:true,linkRestaurantId:''});
  const COLORS_LIST=['#FF6B2C','#8B5CF6','#22C55E','#3B82F6','#EF4444','#F59E0B','#06B6D4','#EC4899','#1A1A1A','#0F172A'];
  const EMOJIS=['🔥','🎉','⚡','🍕','🎁','💥','🚀','🍔','🛵','🎊','🏷️','💫'];
  useEffect(()=>{ api.get('/promotions/all').then(r=>setPromos(r.data)).catch(()=>api.get('/promotions').then(r=>setPromos(r.data)).catch(()=>{})); api.get('/restaurants').then(r=>setRestaurants(r.data)).catch(()=>{}); },[]);
  const resetForm=()=>setForm({title:'',subtitle:'',bgColor:'#FF6B2C',emoji:'🔥',ctaText:'Order Now',isActive:true,linkRestaurantId:''});
  const save=async()=>{ if(!form.title) return alert('Title is required'); setSaving(true); try{ const {data}=await api.post('/promotions',form); setPromos(prev=>[data,...prev]); resetForm(); setShowForm(false); }catch(err){ alert(err.response?.data?.message||err.message); }finally{ setSaving(false); } };
  const toggle=async(id,isActive)=>{ await api.patch(`/promotions/${id}`,{isActive:!isActive}); setPromos(prev=>prev.map(p=>p._id===id?{...p,isActive:!isActive}:p)); };
  const del=async(id)=>{ if(!window.confirm('Delete this promotion?')) return; await api.delete(`/promotions/${id}`); setPromos(prev=>prev.filter(p=>p._id!==id)); };
  const linkedRestaurant=restaurants.find(r=>r._id===form.linkRestaurantId);
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div><h1 style={{fontSize:26,fontWeight:800}}>Promotions 📢</h1><p style={{color:C.gray,marginTop:4}}>Banners shown on the customer home screen.</p></div>
        <button style={{...btn(C.primary),padding:'10px 20px',fontSize:14}} onClick={()=>{ setShowForm(!showForm); resetForm(); }}>{showForm?'✕ Cancel':'+ New Banner'}</button>
      </div>
      <div style={{display:'flex',gap:14,marginBottom:24,marginTop:16}}>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.success}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>LIVE BANNERS</div><div style={{fontSize:28,fontWeight:800,color:C.success,margin:'4px 0'}}>{promos.filter(p=>p.isActive).length}</div><div style={{fontSize:11,color:C.gray}}>Showing to customers</div></div>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.gray}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>PAUSED</div><div style={{fontSize:28,fontWeight:800,margin:'4px 0'}}>{promos.filter(p=>!p.isActive).length}</div><div style={{fontSize:11,color:C.gray}}>Hidden from customers</div></div>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.primary}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>TOTAL CREATED</div><div style={{fontSize:28,fontWeight:800,color:C.primary,margin:'4px 0'}}>{promos.length}</div><div style={{fontSize:11,color:C.gray}}>All time</div></div>
      </div>
      {showForm&&(
        <div style={{...card,borderTop:`3px solid ${C.primary}`,marginBottom:24}}>
          <h3 style={{fontWeight:800,fontSize:18,marginBottom:16}}>Create New Banner</h3>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:C.gray,letterSpacing:0.5,marginBottom:8}}>LIVE PREVIEW</div>
            <div style={{borderRadius:16,padding:22,background:form.bgColor,display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:120,maxWidth:520}}>
              <div><div style={{fontSize:30,marginBottom:6}}>{form.emoji}</div><div style={{color:'#fff',fontWeight:800,fontSize:22,marginBottom:4}}>{form.title||'Banner Title'}</div>{form.subtitle&&<div style={{color:'rgba(255,255,255,0.85)',fontSize:14,marginBottom:10}}>{form.subtitle}</div>}<div style={{background:'rgba(255,255,255,0.25)',color:'#fff',padding:'7px 18px',borderRadius:20,fontSize:13,fontWeight:800,display:'inline-block'}}>{form.ctaText}</div>{linkedRestaurant&&<div style={{color:'rgba(255,255,255,0.6)',fontSize:11,marginTop:6}}>📍 {linkedRestaurant.name}</div>}</div>
              <div style={{fontSize:72,opacity:0.18,marginLeft:16}}>{form.emoji}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>BANNER TITLE *</label><input style={inp} placeholder="e.g. 50% Off This Weekend!" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>SUBTITLE</label><input style={inp} placeholder="e.g. Valid today only!" value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} /></div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>BUTTON TEXT</label><input style={inp} placeholder="e.g. Order Now" value={form.ctaText} onChange={e=>setForm({...form,ctaText:e.target.value})} /></div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>STATUS</label><select style={{...inp,height:44,cursor:'pointer'}} value={form.isActive} onChange={e=>setForm({...form,isActive:e.target.value==='true'})}><option value="true">● Live</option><option value="false">○ Draft</option></select></div>
          </div>
          <div style={{background:'#F0FDF4',borderRadius:12,padding:16,border:'1px solid #BBF7D0',marginBottom:16}}>
            <label style={{fontSize:12,fontWeight:700,color:'#15803D',letterSpacing:0.5,display:'block',marginBottom:4}}>🏪 LINK TO RESTAURANT</label>
            <select style={{...inp,height:46,cursor:'pointer',background:'#fff',fontWeight:600}} value={form.linkRestaurantId} onChange={e=>setForm({...form,linkRestaurantId:e.target.value})}>
              <option value="">— No restaurant (display only) —</option>
              {restaurants.map(r=><option key={r._id} value={r._id}>{r.name}{r.cuisineType?` · ${r.cuisineType}`:''} {r.isOpen?'🟢':'🔴'}</option>)}
            </select>
          </div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:8}}>EMOJI</label><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{EMOJIS.map(e=><button key={e} onClick={()=>setForm({...form,emoji:e})} style={{...btn(form.emoji===e?C.primary:'#f5f5f5',form.emoji===e?'#fff':'#333'),padding:'8px 12px',fontSize:20,borderRadius:10,border:form.emoji===e?'none':`1px solid ${C.border}`}}>{e}</button>)}</div></div>
          <div style={{marginBottom:20}}><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:8}}>BACKGROUND COLOR</label><div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>{COLORS_LIST.map(color=><div key={color} onClick={()=>setForm({...form,bgColor:color})} style={{width:40,height:40,borderRadius:10,background:color,cursor:'pointer',border:form.bgColor===color?'3px solid #000':'3px solid transparent'}} />)<input type="color" value={form.bgColor} onChange={e=>setForm({...form,bgColor:e.target.value})} style={{width:40,height:40,borderRadius:10,border:`1px solid ${C.border}`,cursor:'pointer',padding:2}} /></div></div>
          <div style={{display:'flex',gap:10}}><button style={{...btn('#f5f5f5'),color:C.gray,padding:'10px 20px'}} onClick={()=>{ setShowForm(false); resetForm(); }}>Cancel</button><button style={{...btn(C.primary),padding:'10px 24px',fontSize:14}} onClick={save} disabled={saving}>{saving?'Publishing...':'🚀 Publish Banner'}</button></div>
        </div>
      )}
      {promos.length===0&&!showForm?(<div style={{...card,textAlign:'center',padding:60}}><div style={{fontSize:52,marginBottom:12}}>📢</div><p style={{color:C.gray,fontSize:16,fontWeight:600}}>No promotions yet</p><button style={{...btn(C.primary),marginTop:16,padding:'10px 24px'}} onClick={()=>setShowForm(true)}>+ Create First Banner</button></div>):
      promos.map(p=>{ const linkedR=restaurants.find(r=>r._id===p.linkRestaurantId); return(
        <div key={p._id} style={{...card,display:'flex',gap:16,alignItems:'center'}}>
          <div style={{width:210,minHeight:100,borderRadius:12,background:p.bgColor,padding:14,flexShrink:0,display:'flex',flexDirection:'column',justifyContent:'center',overflow:'hidden'}}><div style={{fontSize:22,marginBottom:4}}>{p.emoji}</div><div style={{color:'#fff',fontWeight:800,fontSize:14,marginBottom:2}}>{p.title}</div>{p.subtitle&&<div style={{color:'rgba(255,255,255,0.8)',fontSize:11,marginBottom:4}}>{p.subtitle}</div>}<div style={{background:'rgba(255,255,255,0.2)',color:'#fff',fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:10,alignSelf:'flex-start'}}>{p.ctaText}</div></div>
          <div style={{flex:1}}><div style={{fontWeight:800,fontSize:16,marginBottom:2}}>{p.title}</div>{p.subtitle&&<div style={{color:C.gray,fontSize:13,marginBottom:6}}>{p.subtitle}</div>}{linkedR?(<div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#F0FDF4',padding:'5px 12px',borderRadius:20,border:'1px solid #BBF7D0',marginBottom:6}}><span>🏪</span><span style={{color:'#15803D',fontSize:12,fontWeight:700}}>→ {linkedR.name}</span></div>):(<div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#F5F5F5',padding:'5px 12px',borderRadius:20,marginBottom:6}}><span style={{color:C.gray,fontSize:12}}>Display only</span></div>)}<div style={{color:C.gray,fontSize:12}}>Created {new Date(p.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div></div>
          <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end',flexShrink:0}}><span style={{background:p.isActive?C.success+'22':C.gray+'22',color:p.isActive?C.success:C.gray,padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:700}}>{p.isActive?'● Live':'○ Paused'}</span><div style={{display:'flex',gap:8}}><button style={btn(p.isActive?C.warning:C.success)} onClick={()=>toggle(p._id,p.isActive)}>{p.isActive?'Pause':'Activate'}</button><button style={btn(C.error)} onClick={()=>del(p._id)}>Delete</button></div></div>
        </div>
      );})}
    </div>
  );
}

function Categories() {
  const [categories,setCategories]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [form,setForm]=useState({name:'',emoji:'🍔',color:'#FF6B2C',isActive:true});
  const [saving,setSaving]=useState(false);
  const EMOJI_OPTIONS=['🍔','🍕','🍜','🍗','🥗','🌮','🍣','🧃','🍰','🥩','🌯','🥪','🍱','🥘','🍛','🍲','🥞','🧆','🌽','🥑','🍦','☕','🧋','🍺','🍹','🎂','🥐','🍞','🫕','🥙'];
  const COLOR_OPTIONS=['#FF6B2C','#EF4444','#F59E0B','#22C55E','#3B82F6','#8B5CF6','#EC4899','#06B6D4','#1A1A1A','#0F172A','#065F46','#92400E'];
  const fetch_=async()=>{ setLoading(true); try{ const {data}=await api.get('/categories/all'); setCategories(data); }catch{ alert('Could not load categories'); }finally{ setLoading(false); } };
  useEffect(()=>{ fetch_(); },[]);
  const resetForm=()=>{ setForm({name:'',emoji:'🍔',color:'#FF6B2C',isActive:true}); setEditingId(null); };
  const save=async()=>{ if(!form.name.trim()) return alert('Category name is required'); setSaving(true); try{ if(editingId){ const {data}=await api.patch(`/categories/${editingId}`,form); setCategories(prev=>prev.map(c=>c._id===editingId?data:c)); }else{ const {data}=await api.post('/categories',form); setCategories(prev=>[...prev,data]); } resetForm(); setShowForm(false); }catch(err){ alert(err.response?.data?.message||err.message); }finally{ setSaving(false); } };
  const del=async(id,name)=>{ if(!window.confirm(`Delete "${name}"?`)) return; await api.delete(`/categories/${id}`); setCategories(prev=>prev.filter(c=>c._id!==id)); };
  const startEdit=(cat)=>{ setForm({name:cat.name,emoji:cat.emoji,color:cat.color,isActive:cat.isActive}); setEditingId(cat._id); setShowForm(true); window.scrollTo({top:0,behavior:'smooth'}); };
  const toggleActive=async(cat)=>{ const {data}=await api.patch(`/categories/${cat._id}`,{isActive:!cat.isActive}); setCategories(prev=>prev.map(c=>c._id===cat._id?data:c)); };
  const moveUp=async(i)=>{ if(i===0) return; const cats=[...categories]; [cats[i-1],cats[i]]=[cats[i],cats[i-1]]; setCategories(cats); await api.patch('/categories/reorder',{categories:cats.map((c,idx)=>({_id:c._id,order:idx}))}).catch(()=>{}); };
  const moveDown=async(i)=>{ if(i===categories.length-1) return; const cats=[...categories]; [cats[i],cats[i+1]]=[cats[i+1],cats[i]]; setCategories(cats); await api.patch('/categories/reorder',{categories:cats.map((c,idx)=>({_id:c._id,order:idx}))}).catch(()=>{}); };
  return (
    <div style={{padding:28,overflowY:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
        <div><h1 style={{fontSize:26,fontWeight:800}}>Categories 🏷️</h1><p style={{color:C.gray,marginTop:4}}>Manage the browse-by-category section on the customer home screen.</p></div>
        <button style={{...btn(C.primary),padding:'10px 20px',fontSize:14}} onClick={()=>{ resetForm(); setShowForm(!showForm); }}>{showForm&&!editingId?'✕ Cancel':'+ Add Category'}</button>
      </div>
      <div style={{display:'flex',gap:14,marginBottom:24,marginTop:16}}>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.primary}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>TOTAL</div><div style={{fontSize:28,fontWeight:800,color:C.primary,margin:'4px 0'}}>{categories.length}</div></div>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.success}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>ACTIVE</div><div style={{fontSize:28,fontWeight:800,color:C.success,margin:'4px 0'}}>{categories.filter(c=>c.isActive).length}</div></div>
        <div style={{...card,marginBottom:0,flex:1,borderTop:`3px solid ${C.gray}`}}><div style={{fontSize:10,fontWeight:700,color:C.gray,letterSpacing:0.5}}>HIDDEN</div><div style={{fontSize:28,fontWeight:800,margin:'4px 0'}}>{categories.filter(c=>!c.isActive).length}</div></div>
      </div>
      {showForm&&(
        <div style={{...card,borderTop:`3px solid ${C.primary}`,marginBottom:24}}>
          <h3 style={{fontWeight:800,fontSize:18,marginBottom:20}}>{editingId?'✏️ Edit Category':'➕ New Category'}</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>CATEGORY NAME *</label><input style={inp} placeholder="e.g. Burgers" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:6}}>STATUS</label><select style={{...inp,height:44,cursor:'pointer'}} value={form.isActive} onChange={e=>setForm({...form,isActive:e.target.value==='true'})}><option value="true">● Active</option><option value="false">○ Hidden</option></select></div>
          </div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:8}}>ACCENT COLOR</label><div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>{COLOR_OPTIONS.map(color=>(<div key={color} onClick={()=>setForm({...form,color})} style={{width:32,height:32,borderRadius:8,background:color,cursor:'pointer',border:form.color===color?'3px solid #000':'3px solid transparent'}} />))}<input type="color" value={form.color} onChange={e=>setForm({...form,color:e.target.value})} style={{width:32,height:32,borderRadius:8,border:`1px solid ${C.border}`,cursor:'pointer',padding:2}} /></div></div>
          <div style={{marginBottom:20}}><label style={{fontSize:12,fontWeight:700,color:C.gray,letterSpacing:0.5,display:'block',marginBottom:8}}>EMOJI ICON</label><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{EMOJI_OPTIONS.map(e=>(<button key={e} onClick={()=>setForm({...form,emoji:e})} style={{...btn(form.emoji===e?C.primary:'#f5f5f5',form.emoji===e?'#fff':'#333'),padding:'8px 10px',fontSize:22,borderRadius:10,border:form.emoji===e?'none':`1px solid ${C.border}`,minWidth:46}}>{e}</button>))}</div></div>
          <div style={{display:'flex',gap:10}}><button style={{...btn('#f5f5f5'),color:C.gray,padding:'10px 20px'}} onClick={()=>{ setShowForm(false); resetForm(); }}>Cancel</button><button style={{...btn(C.primary),padding:'10px 28px',fontSize:14}} onClick={save} disabled={saving}>{saving?'Saving...':editingId?'✓ Update':'✓ Add Category'}</button></div>
        </div>
      )}
      {loading?<div style={{textAlign:'center',padding:60,color:C.gray}}>Loading...</div>:
        categories.length===0?(<div style={{...card,textAlign:'center',padding:60}}><div style={{fontSize:52,marginBottom:12}}>🏷️</div><p style={{color:C.gray,fontSize:16,fontWeight:600}}>No categories yet</p></div>):(
          <div style={card}>
            {categories.map((cat,i)=>(
              <div key={cat._id} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:i<categories.length-1?`1px solid ${C.border}`:'none'}}>
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  <button onClick={()=>moveUp(i)} disabled={i===0} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:6,width:26,height:26,cursor:i===0?'default':'pointer',color:i===0?C.border:'#555',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>↑</button>
                  <button onClick={()=>moveDown(i)} disabled={i===categories.length-1} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:6,width:26,height:26,cursor:i===categories.length-1?'default':'pointer',color:i===categories.length-1?C.border:'#555',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>↓</button>
                </div>
                <div style={{width:52,height:52,borderRadius:16,backgroundColor:cat.color+'22',border:`2px solid ${cat.color}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:24}}>{cat.emoji}</span></div>
                <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontWeight:800,fontSize:15}}>{cat.name}</span><span style={{background:cat.isActive?C.success+'22':C.gray+'22',color:cat.isActive?C.success:C.gray,padding:'2px 8px',borderRadius:10,fontSize:11,fontWeight:700}}>{cat.isActive?'● Active':'○ Hidden'}</span></div></div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{...btn(cat.isActive?'#FFF7ED':'#F0FDF4'),color:cat.isActive?C.warning:C.success,border:`1px solid ${cat.isActive?C.warning:C.success}33`,padding:'7px 12px',fontSize:12}} onClick={()=>toggleActive(cat)}>{cat.isActive?'Hide':'Show'}</button>
                  <button style={{...btn('#EFF6FF'),color:C.primary,border:`1px solid ${C.primary}33`,padding:'7px 12px'}} onClick={()=>startEdit(cat)}>✏️</button>
                  <button style={{...btn('#FEF2F2'),color:C.error,border:`1px solid ${C.error}33`,padding:'7px 12px'}} onClick={()=>del(cat._id,cat.name)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

function AppContent() {
  const {user}=useAuth();
  const [page,setPage]=useState('overview');
  const [counts,setCounts]=useState({w:0,r:0,p:0,ri:0});
  useEffect(()=>{ if(user){ api.get('/admin/overview').then(r=>setCounts({w:r.data.pendingWithdrawals||0,r:r.data.pendingRefunds||0,p:r.data.pendingRestaurants||0,ri:r.data.pendingRiders||0})).catch(()=>{}); } },[user]);
  if(!user) return <Login />;
  const pages={overview:<Overview setPage={setPage}/>,restaurants:<Restaurants/>,riders:<Riders/>,users:<Users/>,orders:<Orders/>,withdrawals:<Withdrawals/>,refunds:<Refunds/>,promotions:<Promotions/>,categories:<Categories/>};
  return (
    <div style={{display:'flex',width:'100%'}}>
      <Sidebar page={page} setPage={setPage} counts={counts} />
      <div style={{flex:1,overflowY:'auto',background:C.bg}}>{pages[page]||<Overview setPage={setPage}/>}</div>
    </div>
  );
}

export default function App() { return <AuthProvider><AppContent /></AuthProvider>; }