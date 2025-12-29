import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/endpoints';
import Toast from '../components/Toast';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Select, 
  MenuItem, 
  Grid, 
  Paper, 
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import { 
  LogOut, 
  Bell, 
  CheckCircle, 
  XCircle, 
  Monitor,
  Users
} from 'lucide-react';
import logo from '../assets/logo.svg';

const TerminalButton = ({ onClick, icon: Icon, label, color, subText, disabled }) => (
  <Paper
    elevation={disabled ? 0 : 2}
    onClick={!disabled ? onClick : undefined}
    sx={{
      p: 4,
      borderRadius: 4,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s',
      border: '1px solid',
      borderColor: 'divider',
      backgroundColor: disabled ? 'action.disabledBackground' : 'background.paper',
      '&:hover': !disabled && {
        elevation: 8,
        transform: 'translateY(-4px)',
        borderColor: `${color}.main`,
        boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 200
    }}
  >
     <Box sx={{ 
       p: 2, 
       borderRadius: '50%', 
       bgcolor: disabled ? 'action.disabled' : `${color}.50`, 
       color: disabled ? 'text.disabled' : `${color}.main`,
       mb: 2,
       transition: 'transform 0.2s',
       '&:hover': !disabled && { transform: 'scale(1.1)' }
     }}>
        <Icon size={40} strokeWidth={1.5} />
     </Box>
     <Typography variant="h5" fontWeight="bold" color="text.primary">
       {label}
     </Typography>
     {subText && (
       <Typography variant="body2" color="text.secondary" mt={0.5}>
         {subText}
       </Typography>
     )}
  </Paper>
);

const CounterTerminal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);
  const [counterName, setCounterName] = useState(localStorage.getItem('qms_counter') || '');
  const [toast, setToast] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [showCounterSelect, setShowCounterSelect] = useState(!localStorage.getItem('qms_counter'));

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchState = async () => {
    if (!counterName) return;
    try {
        const res = await api.admin.getTokens();
        if (res.tokens) {
            const active = res.tokens.find(t => 
                t.CounterName === counterName && 
                (t.Status === 'called' || t.Status === 'active')
            );
            
            if (active) {
               if (!currentToken || currentToken.TokenGuid !== active.TokenGuid || currentToken.Status !== active.Status) {
                   setCurrentToken(active);
               }
            } else if (currentToken) {
               setCurrentToken(null);
            }

            setPendingCount(res.tokens.filter(t => t.Status === 'pending').length);
        }
    } catch (e) {
        console.error("Sync error", e);
    }
  };

  useEffect(() => {
    fetchState();
    const timer = setInterval(fetchState, 3000);
    return () => clearInterval(timer);
  }, [counterName]);

  const handleAction = async (action) => {
    if (!counterName) {
      setShowCounterSelect(true);
      return;
    }
    setLoading(true);
    try {
        if (action === 'NEXT') {
            const res = await api.admin.callNext({ counterName });
            if (res.success) {
                showToast(`Called Token ${res.tokenNumber}`, 'success');
                setCurrentToken({ 
                    TokenGuid: res.tokenGuid, 
                    TokenNumber: res.tokenNumber, 
                    FullName: res.fullName || 'Guest', 
                    Purpose: res.purpose || 'General',
                    Status: 'called' 
                }); 
                fetchState();
            } else {
                showToast(res.message || 'No pending tokens', 'error');
            }
        } else if (action === 'SERVE' && currentToken) {
            await api.admin.updateStatus({ tokenGuid: currentToken.TokenGuid, status: 'served' });
            showToast('Marked as Served', 'success');
            setCurrentToken(null);
            fetchState();
        } else if (action === 'NOSHOW' && currentToken) {
            await api.admin.updateStatus({ tokenGuid: currentToken.TokenGuid, status: 'noshow' });
            showToast('Marked as No Show', 'error');
            setCurrentToken(null);
            fetchState();
        } else if (action === 'RECALL' && currentToken) {
             showToast('Re-announcing token...', 'success');
        }
    } catch (err) {
        showToast('Action Failed', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleCounterChange = (val) => {
    setCounterName(val);
    localStorage.setItem('qms_counter', val);
    setShowCounterSelect(false);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f1f5f9' }}>
      {/* Header */}
      <AppBar position="static" color="default" sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
           <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ width: 40, height: 40, p: 0.5, borderRadius: 2, bgcolor: 'white', boxShadow: 1, overflow: 'hidden' }}>
                <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                   Counter Terminal
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                  <Typography variant="caption" color="text.secondary">System Online</Typography>
                </Stack>
              </Box>
           </Stack>

           <Stack direction="row" alignItems="center" spacing={3}>
              <Button 
                variant="outlined" 
                onClick={() => setShowCounterSelect(true)} 
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {counterName || 'Select Counter'}
              </Button>

              <Chip 
                icon={<Users size={16} />} 
                label={`${pendingCount} Pending`} 
                color="secondary" 
                sx={{ fontWeight: 'bold' }} 
              />
              
              <IconButton color="error" onClick={() => navigate('/admin/dashboard')} title="Exit to Dashboard">
                 <LogOut size={24} />
              </IconButton>
           </Stack>
        </Toolbar>
      </AppBar>

      {/* Workspace */}
      <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
           
           {/* Left: Active Token (Center Stage) */}
           <Grid item xs={12} md={7} lg={8} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper 
                elevation={0}
                sx={{ 
                  flex: 1, 
                  borderRadius: 4, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: 'white'
                }}
              >
                 <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, bgcolor: currentToken ? 'primary.main' : 'divider' }} />
                 
                 {currentToken ? (
                   <Box textAlign="center" sx={{ animation: 'fadeIn 0.5s ease-out' }}>
                      <Chip 
                        label="Now Serving" 
                        color="primary" 
                        sx={{ mb: 4, fontWeight: 'bold', px: 2, py: 1 }} 
                      />
                      <Typography variant="h1" sx={{ fontWeight: 800, fontSize: '8rem', letterSpacing: -4, color: 'text.primary', lineHeight: 1 }}>
                        {currentToken.TokenNumber}
                      </Typography>
                      <Typography variant="h4" color="text.secondary" sx={{ mt: 2, mb: 6 }}>
                        {currentToken.FullName || 'Guest Visitor'}
                      </Typography>
                      
                      <Grid container spacing={4} justifyContent="center">
                          <Grid item>
                             <Typography variant="overline" color="text.secondary" fontWeight="bold">Service Type</Typography>
                             <Typography variant="h6">{currentToken.Purpose || 'General'}</Typography>
                          </Grid>
                          <Grid item>
                             <Typography variant="overline" color="text.secondary" fontWeight="bold">Wait Time</Typography>
                             <Typography variant="h6">--:--</Typography>
                          </Grid>
                      </Grid>
                   </Box>
                 ) : (
                    <Box textAlign="center" color="text.secondary">
                       <Box sx={{ bgcolor: 'action.hover', p: 4, borderRadius: '50%', display: 'inline-flex', mb: 3 }}>
                         <Bell size={64} className="opacity-20" />
                       </Box>
                       <Typography variant="h4" fontWeight="bold">Counter Idle</Typography>
                       <Typography variant="body1">Ready to call next customer</Typography>
                    </Box>
                 )}
              </Paper>
           </Grid>

           {/* Right: Actions */}
           <Grid item xs={12} md={5} lg={4}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                  <Grid item xs={12}>
                     <TerminalButton 
                        icon={Bell}
                        label={currentToken ? "Call Next" : "Call Next"}
                        color="primary"
                        subText={pendingCount > 0 ? `${pendingCount} waiting` : 'No pending tokens'}
                        onClick={() => handleAction('NEXT')}
                        disabled={loading || (currentToken && currentToken.Status === 'called')}
                     />
                  </Grid>

                  {currentToken && (
                    <>
                      <Grid item xs={6}>
                         <TerminalButton 
                            icon={CheckCircle}
                            label="Complete"
                            color="success"
                            onClick={() => handleAction('SERVE')}
                            disabled={loading}
                         />
                      </Grid>
                       <Grid item xs={6}>
                         <TerminalButton 
                            icon={XCircle}
                            label="No Show"
                            color="error"
                            onClick={() => handleAction('NOSHOW')}
                            disabled={loading}
                         />
                      </Grid>
                    </>
                  )}
              </Grid>
           </Grid>
        </Grid>
      </Box>

      {/* Counter Selection Dialog */}
      <Dialog open={showCounterSelect} maxWidth="xs" fullWidth>
         <DialogTitle>Select Counter</DialogTitle>
         <DialogContent>
             <Box sx={{ pt: 1 }}>
               <FormControl fullWidth>
                 <InputLabel>Counter</InputLabel>
                 <Select
                   value={counterName}
                   label="Counter"
                   onChange={(e) => handleCounterChange(e.target.value)}
                 >
                   <MenuItem value="Counter 1">Counter 1</MenuItem>
                   <MenuItem value="Counter 2">Counter 2</MenuItem>
                   <MenuItem value="Counter 3">Counter 3</MenuItem>
                   <MenuItem value="Reception">Reception</MenuItem>
                 </Select>
               </FormControl>
             </Box>
         </DialogContent>
      </Dialog>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Box>
  );
};

export default CounterTerminal;
