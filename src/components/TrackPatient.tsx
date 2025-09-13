import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Phone, MessageCircle, MapPin, Calendar, User, FileText } from 'lucide-react';
import type { User, Patient } from '../App';

interface TrackPatientProps {
  user: User;
  onBack: () => void;
}

export function TrackPatient({ user, onBack }: TrackPatientProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  // Mock data - would come from API
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Smith',
      age: 65,
      gender: 'male',
      procedure: 'Angioplasty',
      insurance: 'Medicare',
      hospitalId: '1',
      hospitalName: 'St. Mary\'s Medical Center',
      status: 'in-treatment',
      referredDate: '2024-01-15',
      hcpId: '1'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      age: 45,
      gender: 'female',
      procedure: 'Knee Replacement',
      insurance: 'Blue Cross Blue Shield',
      hospitalId: '2',
      hospitalName: 'City General Hospital',
      status: 'recovering',
      referredDate: '2024-01-10',
      hcpId: '1'
    },
    {
      id: '3',
      name: 'Michael Brown',
      age: 58,
      gender: 'male',
      procedure: 'Gallbladder Surgery',
      insurance: 'Aetna',
      hospitalId: '1',
      hospitalName: 'St. Mary\'s Medical Center',
      status: 'admitted',
      referredDate: '2024-01-20',
      hcpId: '1'
    }
  ];

  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId);

  const getStatusBadge = (status: Patient['status']) => {
    const statusConfig = {
      referred: { label: 'Referred', color: 'bg-blue-100 text-blue-800' },
      admitted: { label: 'Admitted', color: 'bg-yellow-100 text-yellow-800' },
      'in-treatment': { label: 'In Treatment', color: 'bg-orange-100 text-orange-800' },
      recovering: { label: 'Recovering', color: 'bg-green-100 text-green-800' },
      discharged: { label: 'Discharged', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getJourneyProgress = (status: Patient['status']) => {
    const progressMap = {
      referred: 20,
      admitted: 40,
      'in-treatment': 60,
      recovering: 80,
      discharged: 100
    };
    return progressMap[status];
  };

  const getJourneySteps = (status: Patient['status']) => {
    const steps = [
      { label: 'Referred', completed: true },
      { label: 'Admitted', completed: ['admitted', 'in-treatment', 'recovering', 'discharged'].includes(status) },
      { label: 'In Treatment', completed: ['in-treatment', 'recovering', 'discharged'].includes(status) },
      { label: 'Recovering', completed: ['recovering', 'discharged'].includes(status) },
      { label: 'Discharged', completed: status === 'discharged' }
    ];
    return steps;
  };

  const handleCall = (patient: Patient) => {
    // In a real app, this would initiate a call
    alert(`Calling ${patient.name}...`);
  };

  const handleWhatsApp = (patient: Patient) => {
    // In a real app, this would open WhatsApp
    alert(`Opening WhatsApp chat with ${patient.name}...`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Track Patient</CardTitle>
          <p className="text-sm text-gray-600">Monitor your referred patients' journey and stay connected</p>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Patient</label>
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient to track" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="block">
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-600">{patient.procedure}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedPatient && (
        <div className="space-y-4 md:space-y-6">
          {/* Patient Overview */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                    <User className="h-5 w-5" />
                    <span>{selectedPatient.name}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedPatient.age} years old • {selectedPatient.gender} • {selectedPatient.insurance}
                  </p>
                </div>
                {getStatusBadge(selectedPatient.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Procedure:</span>
                      <span className="font-medium ml-1">{selectedPatient.procedure}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Hospital:</span>
                      <span className="font-medium ml-1 break-words">{selectedPatient.hospitalName}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Referred:</span>
                      <span className="font-medium ml-1">{new Date(selectedPatient.referredDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:space-y-2 lg:space-x-0 xl:space-y-0 xl:space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCall(selectedPatient)}
                    className="flex items-center justify-center space-x-2 flex-1"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleWhatsApp(selectedPatient)}
                    className="flex items-center justify-center space-x-2 flex-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Journey */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Patient Journey</CardTitle>
              <p className="text-sm text-gray-600">Track the progress of patient care</p>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{getJourneyProgress(selectedPatient.status)}%</span>
                </div>
                <Progress value={getJourneyProgress(selectedPatient.status)} className="h-2" />
              </div>

              <div className="space-y-4">
                {getJourneySteps(selectedPatient.status).map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={`text-sm ${
                      step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Recent Updates</h4>
                <div className="space-y-2 text-sm">
                  {selectedPatient.status === 'in-treatment' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Surgery completed successfully</span>
                        <span className="text-gray-500">2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Moved to recovery room</span>
                        <span className="text-gray-500">3 hours ago</span>
                      </div>
                    </>
                  )}
                  {selectedPatient.status === 'recovering' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Physical therapy session completed</span>
                        <span className="text-gray-500">1 day ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vital signs stable</span>
                        <span className="text-gray-500">2 days ago</span>
                      </div>
                    </>
                  )}
                  {selectedPatient.status === 'admitted' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pre-operative assessment completed</span>
                        <span className="text-gray-500">6 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient admitted to hospital</span>
                        <span className="text-gray-500">1 day ago</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Log */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Communication Log</CardTitle>
              <p className="text-sm text-gray-600">Recent communications with patient</p>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Pre-surgery consultation call</p>
                    <p className="text-gray-600">Discussed procedure details and answered questions</p>
                  </div>
                  <span className="text-gray-500">3 days ago</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">WhatsApp message sent</p>
                    <p className="text-gray-600">Shared pre-operative instructions</p>
                  </div>
                  <span className="text-gray-500">1 week ago</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Initial referral call</p>
                    <p className="text-gray-600">Explained referral process and hospital selection</p>
                  </div>
                  <span className="text-gray-500">2 weeks ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex">
        <Button variant="outline" onClick={onBack} size="sm">Back to Dashboard</Button>
      </div>
    </div>
  );
}