import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Alert, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';
import { Switch } from './components/ui/switch';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { NewPatient } from './components/NewPatient';
import { TrackPatient } from './components/TrackPatient';
import { CostDrivers } from './components/CostDrivers';
import { HospitalPackages } from './components/HospitalPackages';
import { UserCircle, LogOut } from 'lucide-react';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  hasBiometric: boolean;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  procedure: string;
  insurance: string;
  hospitalId: string;
  hospitalName: string;
  status: 'referred' | 'admitted' | 'in-treatment' | 'recovering' | 'discharged';
  referredDate: string;
  hcpId: string;
};

export type Hospital = {
  id: string;
  name: string;
  isNetworkHospital: boolean;
  packageCost: number;
  rating: number;
  distance: string;
};

export type CostBreakdown = {
  category: string;
  percentage: number;
  insuranceCoverage: number;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-patient' | 'track-patient' | 'cost-drivers' | 'hospital-packages'>('dashboard');

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">Care-Continuity</h1>
            <Badge variant="secondary" className="hidden sm:inline-flex text-xs">{user.specialty}</Badge>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <UserCircle className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
              <span className="text-xs md:text-sm text-gray-700 truncate max-w-24 md:max-w-none">{user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
        {/* Mobile specialty badge */}
        <div className="sm:hidden mt-2">
          <Badge variant="secondary" className="text-xs">{user.specialty}</Badge>
        </div>
      </header>

      {/* Navigation */}
      {currentView !== 'dashboard' && (
        <div className="bg-white border-b border-gray-200 px-4 py-2 md:px-6 sticky top-16 md:top-20 z-30">
          <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="text-sm p-2">
            ← Back to Dashboard
          </Button>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-4 md:px-6 md:py-6 pb-safe">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard onNavigate={setCurrentView} />
          )}
          {currentView === 'new-patient' && (
            <NewPatient user={user} onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'track-patient' && (
            <TrackPatient user={user} onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'cost-drivers' && (
            <CostDrivers user={user} onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'hospital-packages' && (
            <HospitalPackages user={user} onBack={() => setCurrentView('dashboard')} />
          )}
        </div>
      </main>
    </div>
  );
}