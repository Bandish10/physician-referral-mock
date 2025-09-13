import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ChevronDown, ChevronUp, Plus, Star, MapPin } from 'lucide-react';
import type { User } from '../App';

interface HospitalPackagesProps {
  user: User;
  onBack: () => void;
}

interface PackageItem {
  name: string;
  cost: number;
  description: string;
}

interface HospitalPackage {
  id: string;
  hospitalName: string;
  isNetworkHospital: boolean;
  packageCost: number;
  rating: number;
  distance: string;
  includedItems: PackageItem[];
}

interface VariableItem {
  id: string;
  category: 'pre-op' | 'post-op' | 'implant';
  name: string;
  details: Record<string, string>;
  cost: number;
}

export function HospitalPackages({ user, onBack }: HospitalPackagesProps) {
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [selectedPackageForCustomization, setSelectedPackageForCustomization] = useState<string | null>(null);
  const [variableItems, setVariableItems] = useState<VariableItem[]>([]);
  const [showAddVariable, setShowAddVariable] = useState(false);
  const [newVariable, setNewVariable] = useState({
    category: 'pre-op' as const,
    name: '',
    details: {} as Record<string, string>,
    cost: 0
  });

  // Mock data - would come from API
  const procedures = {
    Cardiology: ['Angioplasty', 'Bypass Surgery', 'Valve Replacement', 'Pacemaker Implant'],
    Orthopedics: ['Hip Replacement', 'Knee Replacement', 'Spine Surgery', 'Arthroscopy'],
    'General Surgery': ['Appendectomy', 'Gallbladder Surgery', 'Hernia Repair', 'Colonoscopy'],
    Neurology: ['Brain Surgery', 'Spinal Surgery', 'Tumor Removal', 'Deep Brain Stimulation']
  };

  const insuranceTypes = ['Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Self-Pay'];

  const getHospitalPackages = (procedure: string, insurance: string): HospitalPackage[] => {
    return [
      {
        id: '1',
        hospitalName: 'St. Mary\'s Medical Center',
        isNetworkHospital: true,
        packageCost: 45000,
        rating: 4.8,
        distance: '2.3 miles',
        includedItems: [
          { name: 'Surgeon Fee', cost: 12000, description: 'Primary surgeon professional fee' },
          { name: 'Hospital Stay (3 days)', cost: 15000, description: 'Room and board for 3 days' },
          { name: 'Operating Room', cost: 8000, description: 'OR time and equipment' },
          { name: 'Anesthesia', cost: 3500, description: 'Anesthesiologist fee and medications' },
          { name: 'Basic Monitoring', cost: 2500, description: 'Standard post-op monitoring' },
          { name: 'Standard Lab Tests', cost: 4000, description: 'Pre and post-op blood work' }
        ]
      },
      {
        id: '2',
        hospitalName: 'City General Hospital',
        isNetworkHospital: true,
        packageCost: 38000,
        rating: 4.6,
        distance: '1.8 miles',
        includedItems: [
          { name: 'Surgeon Fee', cost: 10000, description: 'Primary surgeon professional fee' },
          { name: 'Hospital Stay (2 days)', cost: 12000, description: 'Room and board for 2 days' },
          { name: 'Operating Room', cost: 7000, description: 'OR time and equipment' },
          { name: 'Anesthesia', cost: 3000, description: 'Anesthesiologist fee and medications' },
          { name: 'Basic Monitoring', cost: 2000, description: 'Standard post-op monitoring' },
          { name: 'Standard Lab Tests', cost: 4000, description: 'Pre and post-op blood work' }
        ]
      },
      {
        id: '3',
        hospitalName: 'Regional Healthcare Center',
        isNetworkHospital: false,
        packageCost: 52000,
        rating: 4.9,
        distance: '5.1 miles',
        includedItems: [
          { name: 'Surgeon Fee', cost: 15000, description: 'Senior surgeon professional fee' },
          { name: 'Hospital Stay (4 days)', cost: 18000, description: 'Private room for 4 days' },
          { name: 'Operating Room', cost: 9000, description: 'Advanced OR time and equipment' },
          { name: 'Anesthesia', cost: 4000, description: 'Anesthesiologist fee and medications' },
          { name: 'Advanced Monitoring', cost: 3000, description: 'Enhanced post-op monitoring' },
          { name: 'Comprehensive Lab Tests', cost: 3000, description: 'Extended pre and post-op testing' }
        ]
      }
    ];
  };

  const hospitalPackages = selectedProcedure && selectedInsurance 
    ? getHospitalPackages(selectedProcedure, selectedInsurance)
    : [];

  const sortedPackages = [...hospitalPackages].sort((a, b) => {
    if (a.isNetworkHospital && !b.isNetworkHospital) return -1;
    if (!a.isNetworkHospital && b.isNetworkHospital) return 1;
    return a.packageCost - b.packageCost;
  });

  const handleAddVariable = () => {
    if (!newVariable.name || newVariable.cost <= 0) return;

    const variable: VariableItem = {
      id: Date.now().toString(),
      category: newVariable.category,
      name: newVariable.name,
      details: newVariable.details,
      cost: newVariable.cost
    };

    setVariableItems([...variableItems, variable]);
    setNewVariable({ category: 'pre-op', name: '', details: {}, cost: 0 });
    setShowAddVariable(false);
  };

  const removeVariable = (id: string) => {
    setVariableItems(variableItems.filter(item => item.id !== id));
  };

  const getVariableTotalCost = () => {
    return variableItems.reduce((total, item) => total + item.cost, 0);
  };

  const getDetailFields = (category: string) => {
    switch (category) {
      case 'implant':
        return [
          { key: 'manufacturer', label: 'Manufacturer' },
          { key: 'material', label: 'Material' }
        ];
      case 'pre-op':
        return [
          { key: 'testName', label: 'Test/Scan Name' }
        ];
      case 'post-op':
        return [
          { key: 'type', label: 'Type' },
          { key: 'units', label: 'No. of Units' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Find Hospital Packages</CardTitle>
          <p className="text-sm text-gray-600">Compare hospital packages and customize with additional services</p>
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Procedure/Surgery</Label>
              <Select value={selectedProcedure} onValueChange={setSelectedProcedure}>
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
              <Label>Insurance/Payor Type</Label>
              <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
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
          </div>
        </CardContent>
      </Card>

      {selectedProcedure && selectedInsurance && (
        <div className="space-y-3 md:space-y-4">
          {sortedPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-2">
                        <h3 className="font-semibold text-base md:text-lg">{pkg.hospitalName}</h3>
                        {pkg.isNetworkHospital && (
                          <Badge className="bg-green-100 text-green-800 text-xs w-fit">Network Hospital</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 md:space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{pkg.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{pkg.distance}</span>
                        </div>
                      </div>
                      
                      <div className="text-2xl md:text-3xl font-semibold text-blue-600">
                        ${pkg.packageCost.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-500">Standard package for {selectedProcedure}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                        className="w-full sm:w-auto"
                      >
                        {expandedPackage === pkg.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span className="ml-1">Details</span>
                      </Button>
                      <Button onClick={() => setSelectedPackageForCustomization(pkg.id)} size="sm" className="w-full sm:w-auto">
                        Customize
                      </Button>
                    </div>
                  </div>

                  {expandedPackage === pkg.id && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-medium mb-3">Package Includes:</h4>
                        <div className="space-y-2">
                          {pkg.includedItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                              <span className="font-medium text-blue-600">${item.cost.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Customization Modal */}
      {selectedPackageForCustomization && (
        <Dialog open={!!selectedPackageForCustomization} onOpenChange={() => setSelectedPackageForCustomization(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Customize Package</DialogTitle>
              <DialogDescription>
                Add variable items to customize the hospital package for your patient's specific needs.
              </DialogDescription>
            </DialogHeader>
            
            {(() => {
              const pkg = sortedPackages.find(p => p.id === selectedPackageForCustomization);
              if (!pkg) return null;
              
              return (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{pkg.hospitalName}</h3>
                    <div className="flex justify-between items-center">
                      <span>Base Package Cost:</span>
                      <span className="text-xl font-semibold text-blue-600">
                        ${pkg.packageCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Additional Variables</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddVariable(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variable
                      </Button>
                    </div>

                    {variableItems.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {variableItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge variant="outline" className="capitalize">
                                    {item.category.replace('-', ' ')}
                                  </Badge>
                                  <span className="font-medium">{item.name}</span>
                                </div>
                                {Object.entries(item.details).map(([key, value]) => (
                                  <p key={key} className="text-sm text-gray-600">
                                    {key}: {value}
                                  </p>
                                ))}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  +${item.cost.toLocaleString()}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeVariable(item.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAddVariable && (
                      <Card className="mb-4">
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Select
                                value={newVariable.category}
                                onValueChange={(value: any) => setNewVariable({ ...newVariable, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pre-op">Pre-op</SelectItem>
                                  <SelectItem value="post-op">Post-op</SelectItem>
                                  <SelectItem value="implant">Implant</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Item Name</Label>
                              <Input
                                placeholder="Enter item name"
                                value={newVariable.name}
                                onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                              />
                            </div>
                          </div>

                          {getDetailFields(newVariable.category).map((field) => (
                            <div key={field.key} className="space-y-2">
                              <Label>{field.label}</Label>
                              <Input
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                value={newVariable.details[field.key] || ''}
                                onChange={(e) => setNewVariable({
                                  ...newVariable,
                                  details: { ...newVariable.details, [field.key]: e.target.value }
                                })}
                              />
                            </div>
                          ))}

                          <div className="space-y-2">
                            <Label>Cost ($)</Label>
                            <Input
                              type="number"
                              placeholder="Enter cost"
                              value={newVariable.cost || ''}
                              onChange={(e) => setNewVariable({ ...newVariable, cost: parseFloat(e.target.value) || 0 })}
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button onClick={handleAddVariable} className="flex-1">Add Item</Button>
                            <Button variant="outline" onClick={() => setShowAddVariable(false)} className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Package Cost:</span>
                      <span className="text-blue-600">
                        ${(pkg.packageCost + getVariableTotalCost()).toLocaleString()}
                      </span>
                    </div>
                    {getVariableTotalCost() > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        Base: ${pkg.packageCost.toLocaleString()} + Variables: ${getVariableTotalCost().toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}

      <div className="flex">
        <Button variant="outline" onClick={onBack} size="sm">Back to Dashboard</Button>
      </div>
    </div>
  );
}