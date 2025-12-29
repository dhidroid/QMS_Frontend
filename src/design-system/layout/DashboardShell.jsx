import React from 'react';
import { 
  BarChart3, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Layers,
  Menu,
  X,
  Bell,
  PieChart,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Footer from '../../components/Footer';
import logo from '../../assets/logo.svg'; 

const NavItem = ({ item, activeView, onViewChange, depth = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeView === item.id || (hasChildren && item.children.some(c => c.id === activeView));
  const [expanded, setExpanded] = React.useState(isActive);

  // Auto-expand if child active
  React.useEffect(() => {
      if (hasChildren && item.children.some(c => c.id === activeView)) {
          setExpanded(true);
      }
  }, [activeView, hasChildren, item.children]);

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    } else {
      onViewChange(item.id);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={clsx(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group select-none",
          isActive && !hasChildren ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          depth > 0 && "pl-9"
        )}
      >
        <item.icon size={18} className={clsx("transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        <span className="flex-1 text-left">{item.label}</span>
        {hasChildren && (
            expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
        {!hasChildren && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(14,165,233,0.5)]" />}
      </button>

      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {item.children.map(child => (
             <button
               key={child.id}
               onClick={() => onViewChange(child.id)}
               className={clsx(
                 "w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all pl-11",
                 activeView === child.id 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
               )}
             >
                <div className={clsx("w-1.5 h-1.5 rounded-full transition-colors", activeView === child.id ? "bg-primary" : "bg-slate-300")} />
                {child.label}
             </button>
          ))}
        </div>
      )}
    </>
  );
};

const DashboardShell = ({ children, title, actions, activeView, onViewChange, user }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'tokens', label: 'Live Queue', icon: ClipboardList },
    { 
       id: 'analytics-group', 
       label: 'Token Management', 
       icon: PieChart,
       children: [
           { id: 'token-today', label: "Today's Activity" },
           { id: 'token-week', label: "Weekly Report" },
           { id: 'token-month', label: "Monthly Overview" }
       ]
    },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'forms', label: 'Form Builder', icon: BarChart3 }, 
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card/50 backdrop-blur-xl">
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-black/10 overflow-hidden">
               <img src={logo} alt="QMS" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight">QMS Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground mb-4 px-3 tracking-wider uppercase">Main Menu</div>
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              item={item}
              activeView={activeView}
              onViewChange={onViewChange}
            />
          ))}
          
          <div className="mt-8 text-xs font-semibold text-muted-foreground mb-4 px-3 tracking-wider uppercase">Shortcuts</div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50" onClick={()=>{}}>
             <Bell size={18} /> Notifications
          </button>
        </nav>

        <div className="p-4 border-t border-border/40">
          <button 
            onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/admin';
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {actions}
             <div onClick={() => onViewChange('profile')} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                A
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative flex flex-col">
           <div className="max-w-7xl mx-auto space-y-8 pb-10 flex-1 w-full">
              {children}
           </div>
           <Footer />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-3/4 max-w-sm bg-card border-r shadow-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2">
                 <img src={logo} alt="QMS" className="h-8 w-8 rounded-lg object-cover" />
                 <span className="font-bold text-lg">QMS Admin</span>
                </div>
               <button onClick={() => setMobileMenuOpen(false)}>
                 <X size={20} />
               </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeView === item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardShell;
