import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { User, CostBreakdown } from '../App';

interface CostDriversProps {
  user: User;
  onBack: () => void;
}

export function CostDrivers({ user, onBack }: CostDriversProps) {
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');

  // Mock data - would come from API
  const procedures = {
    Cardiology: ['Angioplasty', 'Bypass Surgery', 'Valve Replacement', 'Pacemaker Implant'],
    Orthopedics: ['Hip Replacement', 'Knee Replacement', 'Spine Surgery', 'Arthroscopy'],
    'General Surgery': ['Appendectomy', 'Gallbladder Surgery', 'Hernia Repair', 'Colonoscopy'],
    Neurology: ['Brain Surgery', 'Spinal Surgery', 'Tumor Removal', 'Deep Brain Stimulation']
  };

  const insuranceTypes = ['Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Self-Pay'];

  // Mock cost breakdown data
  const getCostBreakdown = (procedure: string, insurance: string): CostBreakdown[] => {
    // This would come from API based on procedure and insurance
    return [
      { category: 'Surgeon Fees', percentage: 25, insuranceCoverage: 80 },
      { category: 'Hospital Stay', percentage: 35, insuranceCoverage: 90 },
      { category: 'Operating Room', percentage: 15, insuranceCoverage: 85 },
      { category: 'Anesthesia', percentage: 8, insuranceCoverage: 85 },
      { category: 'Medical Devices', percentage: 12, insuranceCoverage: 70 },
      { category: 'Lab Tests', percentage: 5, insuranceCoverage: 95 }
    ];
  };

  const costData = selectedProcedure && selectedInsurance 
    ? getCostBreakdown(selectedProcedure, selectedInsurance)
    : [];

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316'];

  const pieData = costData.map((item, index) => ({
    name: item.category,
    value: item.percentage,
    color: COLORS[index % COLORS.length]
  }));

  const barData = costData.map((item) => ({
    category: item.category.replace(' ', '\n'),
    costPercentage: item.percentage,
    coveragePercentage: item.insuranceCoverage
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Cost Drivers Breakdown with Insurance Coverage</CardTitle>
          <p className="text-sm text-gray-600">Analyze cost components and insurance coverage for procedures</p>
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Procedure/Surgery</label>
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
              <label className="text-sm font-medium">Insurance/Payor Type</label>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Cost Distribution Pie Chart */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Cost Distribution</CardTitle>
              <p className="text-sm text-gray-600">Breakdown of cost components for {selectedProcedure}</p>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${value}%`}
                      outerRadius="70%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Coverage Comparison */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Insurance Coverage Analysis</CardTitle>
              <p className="text-sm text-gray-600">Cost vs Coverage for {selectedInsurance}</p>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                      interval={0}
                    />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="costPercentage" fill="#3b82f6" name="Cost %" />
                    <Bar dataKey="coveragePercentage" fill="#10b981" name="Coverage %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedProcedure && selectedInsurance && (
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Detailed Breakdown</CardTitle>
            <p className="text-sm text-gray-600">Cost drivers and insurance coverage details</p>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-4">
              {costData.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{item.category}</h4>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-blue-600">{item.percentage}%</span>
                      <p className="text-sm text-gray-600">of total cost</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Insurance Coverage</span>
                      <span className="font-medium">{item.insuranceCoverage}%</span>
                    </div>
                    <Progress value={item.insuranceCoverage} className="h-2" />
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Patient Responsibility</span>
                      <span>{100 - item.insuranceCoverage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Average Coverage</p>
                  <p className="text-xl font-semibold text-blue-900">
                    {Math.round(costData.reduce((acc, item) => acc + (item.insuranceCoverage * item.percentage / 100), 0))}%
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Patient Responsibility</p>
                  <p className="text-xl font-semibold text-blue-900">
                    {100 - Math.round(costData.reduce((acc, item) => acc + (item.insuranceCoverage * item.percentage / 100), 0))}%
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Total Components</p>
                  <p className="text-xl font-semibold text-blue-900">{costData.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex">
        <Button variant="outline" onClick={onBack} size="sm">Back to Dashboard</Button>
      </div>
    </div>
  );
}