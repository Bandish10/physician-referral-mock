import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { UserPlus, Search, TrendingUp, Building } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: 'new-patient' | 'track-patient' | 'cost-drivers' | 'hospital-packages') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const features = [
    {
      id: 'new-patient',
      title: 'New Patient',
      description: 'Refer a new patient to the most suitable hospital based on procedure and insurance',
      icon: UserPlus,
      color: 'bg-blue-500',
      action: () => onNavigate('new-patient')
    },
    {
      id: 'track-patient',
      title: 'Track Patient',
      description: 'Monitor patient journey and communicate with referred patients',
      icon: Search,
      color: 'bg-green-500',
      action: () => onNavigate('track-patient')
    },
    {
      id: 'cost-drivers',
      title: 'Cost Drivers Breakdown',
      description: 'Analyze cost breakdown and insurance coverage for procedures',
      icon: TrendingUp,
      color: 'bg-orange-500',
      action: () => onNavigate('cost-drivers')
    },
    {
      id: 'hospital-packages',
      title: 'Find Hospital Packages',
      description: 'Compare hospital packages and customize with additional services',
      icon: Building,
      color: 'bg-purple-500',
      action: () => onNavigate('hospital-packages')
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-xl md:text-2xl mb-2">Welcome to Care-Continuity</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Streamline your patient referrals and track care continuity with our comprehensive platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow cursor-pointer active:scale-95" onClick={feature.action}>
              <CardHeader className="pb-3 p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base md:text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature.description}</p>
                <Button variant="outline" className="w-full" size="sm">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
        <Card>
          <CardContent className="pt-4 pb-4 px-3 md:pt-6 md:pb-6 md:px-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-semibold text-blue-600">24</p>
              <p className="text-xs md:text-sm text-gray-600">Active Referrals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-3 md:pt-6 md:pb-6 md:px-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-semibold text-green-600">156</p>
              <p className="text-xs md:text-sm text-gray-600">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-3 md:pt-6 md:pb-6 md:px-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-semibold text-purple-600">8</p>
              <p className="text-xs md:text-sm text-gray-600">Network Hospitals</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}