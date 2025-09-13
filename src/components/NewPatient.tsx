import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Check, Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import type { User, Hospital } from '../App';

interface NewPatientProps {
  user: User;
  onBack: () => void;
}

export function NewPatient({ user, onBack }: NewPatientProps) {
  const [step, setStep] = useState<'form' | 'hospitals' | 'review'>('form');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    procedure: '',
    insurance: ''
  });
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Mock data - would come from API
  const procedures = {
    Cardiology: ['Angioplasty', 'Bypass Surgery', 'Valve Replacement', 'Pacemaker Implant'],
    Orthopedics: ['Hip Replacement', 'Knee Replacement', 'Spine Surgery', 'Arthroscopy'],
    'General Surgery': ['Appendectomy', 'Gallbladder Surgery', 'Hernia Repair', 'Colonoscopy'],
    Neurology: ['Brain Surgery', 'Spinal Surgery', 'Tumor Removal', 'Deep Brain Stimulation']
  };

  const insuranceTypes = ['Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Self-Pay'];

  const mockHospitals: Hospital[] = [
    { id: '1', name: 'St. Mary\'s Medical Center', isNetworkHospital: true, packageCost: 45000, rating: 4.8, distance: '2.3 miles' },
    { id: '2', name: 'City General Hospital', isNetworkHospital: true, packageCost: 38000, rating: 4.6, distance: '1.8 miles' },
    { id: '3', name: 'Regional Healthcare Center', isNetworkHospital: false, packageCost: 52000, rating: 4.9, distance: '5.1 miles' },
    { id: '4', name: 'Metro Surgical Institute', isNetworkHospital: true, packageCost: 41000, rating: 4.7, distance: '3.2 miles' }
  ];

  const handleFormSubmit = () => {
    if (!formData.name || !formData.age || !formData.gender || !formData.procedure || !formData.insurance) {
      alert('Please fill in all fields');
      return;
    }
    setStep('hospitals');
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setStep('review');
  };

  const handleSubmitReferral = () => {
    // In a real app, this would submit to backend
    alert('Referral submitted successfully!');
    onBack();
  };

  if (step === 'form') {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">New Patient Referral</CardTitle>
            <p className="text-sm text-gray-600">Enter patient details to find the best hospital match</p>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="65"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedure">Procedure/Surgery *</Label>
              <Select value={formData.procedure} onValueChange={(value) => setFormData({ ...formData, procedure: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select procedure" />
                </SelectTrigger>
                <SelectContent>
                  {procedures[user.specialty as keyof typeof procedures]?.map((procedure) => (
                    <SelectItem key={procedure} value={procedure}>
                      {procedure}
                    </SelectItem>
                  )) || <SelectItem value="general">General Procedure</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance/Payor Type *</Label>
              <Select value={formData.insurance} onValueChange={(value) => setFormData({ ...formData, insurance: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceTypes.map((insurance) => (
                    <SelectItem key={insurance} value={insurance}>
                      {insurance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button variant="outline" onClick={onBack} className="order-2 sm:order-1">Cancel</Button>
              <Button onClick={handleFormSubmit} className="flex-1 order-1 sm:order-2">Find Hospitals</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'hospitals') {
    const sortedHospitals = [...mockHospitals].sort((a, b) => {
      if (a.isNetworkHospital && !b.isNetworkHospital) return -1;
      if (!a.isNetworkHospital && b.isNetworkHospital) return 1;
      return a.packageCost - b.packageCost;
    });

    return (
      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Select Hospital</CardTitle>
            <p className="text-sm text-gray-600">
              Hospitals for {formData.procedure} with {formData.insurance} insurance
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-3 md:space-y-4">
          {sortedHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-md transition-shadow active:scale-[0.98]">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-base md:text-lg">{hospital.name}</h3>
                      {hospital.isNetworkHospital && (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs w-fit">
                          Network Hospital
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 md:space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{hospital.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{hospital.distance}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-xl md:text-2xl font-semibold text-blue-600">
                          ${hospital.packageCost.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-500">Package cost for {formData.procedure}</p>
                      </div>
                      
                      <Button onClick={() => handleHospitalSelect(hospital)} className="w-full sm:w-auto" size="sm">
                        Select Hospital
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex">
          <Button variant="outline" onClick={() => setStep('form')} size="sm">Back</Button>
        </div>
      </div>
    );
  }

  if (step === 'review' && selectedHospital) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Review & Submit Referral</CardTitle>
            <p className="text-sm text-gray-600">Please review the referral details before submitting</p>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
            <div>
              <h4 className="font-medium mb-3">Patient Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Age:</span>
                  <p className="font-medium">{formData.age} years</p>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <p className="font-medium capitalize">{formData.gender}</p>
                </div>
                <div>
                  <span className="text-gray-600">Insurance:</span>
                  <p className="font-medium">{formData.insurance}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Procedure</h4>
              <p className="text-sm">{formData.procedure}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Selected Hospital</h4>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{selectedHospital.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedHospital.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedHospital.distance}</span>
                    </div>
                  </div>
                  {selectedHospital.isNetworkHospital && (
                    <Badge variant="default" className="bg-green-100 text-green-800 mt-2">
                      Network Hospital
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-blue-600">
                    ${selectedHospital.packageCost.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Package cost</p>
                </div>
              </div>
            </div>

            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                The referral will be sent to {selectedHospital.name} and the patient will be contacted within 24 hours.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button variant="outline" onClick={() => setStep('hospitals')} className="order-2 sm:order-1">Back</Button>
              <Button onClick={handleSubmitReferral} className="flex-1 order-1 sm:order-2">Submit Referral</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}