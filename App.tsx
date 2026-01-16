
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Receipt, 
  Package, 
  Settings as SettingsIcon, 
  LayoutDashboard,
  Search,
  Plus,
  AlertTriangle,
  FileText,
  Smartphone,
  History as HistoryIcon
} from 'lucide-react';
import { Customer, InventoryItem, Bill, AppSettings } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';
import CustomersTab from './components/CustomersTab';
import BillingTab from './components/BillingTab';
import InventoryTab from './components/InventoryTab';
import SettingsTab from './components/SettingsTab';
import DashboardTab from './components/DashboardTab';
import BillHistoryTab from './components/BillHistoryTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'billing' | 'inventory' | 'settings' | 'history'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Load Data from LocalStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    const savedInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const savedBills = localStorage.getItem(STORAGE_KEYS.BILLS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedBills) setBills(JSON.parse(savedBills));
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Ensure existing settings get the new default if missing
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
    } else {
      setSettings(DEFAULT_SETTINGS);
    }

    // Handle PWA Installation Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Save Data Helpers
  const updateCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(newCustomers));
  };

  const updateInventory = (newItems: InventoryItem[]) => {
    setInventory(newItems);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(newItems));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  const saveBill = (bill: Bill) => {
    const newBills = [bill, ...bills];
    setBills(newBills);
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(newBills));
    
    // Extract number from INV-XXXX
    const invoiceNumStr = bill.invoiceId.split('-')[1];
    const invoiceNum = parseInt(invoiceNumStr);
    
    if (!isNaN(invoiceNum)) {
      updateSettings({ ...settings, lastInvoiceNumber: invoiceNum });
    }
    
    // Update Customer last purchase date
    const updatedCustomers = customers.map(c => 
      c.id === bill.customerId ? { ...c, lastPurchaseDate: new Date().toISOString() } : c
    );
    updateCustomers(updatedCustomers);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab 
            bills={bills} 
            inventory={inventory} 
            customers={customers} 
            canInstall={!!deferredPrompt}
            onInstall={handleInstallClick}
          />
        );
      case 'customers':
        return <CustomersTab customers={customers} onUpdate={updateCustomers} />;
      case 'billing':
        return (
          <BillingTab 
            customers={customers} 
            inventory={inventory} 
            settings={settings}
            onSaveBill={saveBill}
            onUpdateInventory={updateInventory}
          />
        );
      case 'inventory':
        return <InventoryTab inventory={inventory} onUpdate={updateInventory} />;
      case 'history':
        return <BillHistoryTab bills={bills} settings={settings} />;
      case 'settings':
        return <SettingsTab settings={settings} onUpdate={updateSettings} />;
      default:
        return <DashboardTab bills={bills} inventory={inventory} customers={customers} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-64">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-indigo-600 text-white p-4 sticky top-0 z-50 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">Magizh Vastraa</h1>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <SettingsIcon size={18} />
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 fixed h-full left-0 top-0 z-40">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">Magizh Vastraa</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Billing Suite</p>
        </div>
        
        <nav className="flex-1 mt-4">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Receipt size={20} />} 
            label="Billing" 
            active={activeTab === 'billing'} 
            onClick={() => setActiveTab('billing')} 
          />
          <NavItem 
            icon={<HistoryIcon size={20} />} 
            label="History" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Customers" 
            active={activeTab === 'customers'} 
            onClick={() => setActiveTab('customers')} 
          />
          <NavItem 
            icon={<Package size={20} />} 
            label="Inventory" 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')} 
          />
          <NavItem 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        {deferredPrompt && (
          <div className="p-4 mx-4 mb-4 bg-indigo-600/10 border border-indigo-600/20 rounded-xl">
             <button 
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white p-2 rounded-lg text-xs font-bold shadow-lg"
              >
                <Smartphone size={14} />
                <span>Install as App</span>
              </button>
          </div>
        )}
        
        <div className="p-6 text-xs text-slate-500 border-t border-slate-800">
          v6.1-Android-Ready
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50">
        <MobileNavItem 
          icon={<LayoutDashboard size={22} />} 
          label="Home" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <MobileNavItem 
          icon={<Receipt size={22} />} 
          label="Billing" 
          active={activeTab === 'billing'} 
          onClick={() => setActiveTab('billing')} 
        />
        <MobileNavItem 
          icon={<HistoryIcon size={22} />} 
          label="History" 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
        />
        <MobileNavItem 
          icon={<Package size={22} />} 
          label="Stock" 
          active={activeTab === 'inventory'} 
          onClick={() => setActiveTab('inventory')} 
        />
        <MobileNavItem 
          icon={<Users size={22} />} 
          label="Users" 
          active={activeTab === 'customers'} 
          onClick={() => setActiveTab('customers')} 
        />
      </nav>
    </div>
  );
};

// UI Components
const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors ${active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'}`}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export default App;
