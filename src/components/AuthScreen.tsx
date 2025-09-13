import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Smartphone, Fingerprint } from 'lucide-react';
import type { User } from '../App';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState<'form' | 'otp' | 'biometric'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    otp: '',
    enableBiometric: false
  });
  const [error, setError] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Gastroenterology',
    'General Surgery',
    'Internal Medicine',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Urology'
  ];

  const handleSubmitForm = () => {
    if (isRegistering) {
      if (!formData.name || !formData.email || !formData.phone || !formData.specialty) {
        setError('Please fill in all required fields');
        return;
      }
    } else {
      if (!formData.phone) {
        setError('Please enter your phone number');
        return;
      }
    }

    // Generate mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setError('');
    setStep('otp');
    
    // In a real app, this would send SMS/call the user
    alert(`Your OTP is: ${otp} (This is a demo)`);
  };

  const handleVerifyOTP = () => {
    if (formData.otp !== generatedOTP) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    if (isRegistering && formData.enableBiometric) {
      setStep('biometric');
    } else {
      completeAuth();
    }
  };

  const handleBiometricSetup = () => {
    // Simulate biometric setup
    setTimeout(() => {
      completeAuth();
    }, 1000);
  };

  const completeAuth = () => {
    const user: User = {
      id: '1',
      name: formData.name || 'Dr. John Smith',
      email: formData.email || 'john.smith@example.com',
      phone: formData.phone,
      specialty: formData.specialty || 'Cardiology',
      hasBiometric: formData.enableBiometric
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Care-Continuity Portal</CardTitle>
          <p className="text-sm text-gray-600">
            {step === 'form' && (isRegistering ? 'Register as Healthcare Provider' : 'Sign in to your account')}
            {step === 'otp' && 'Verify your identity'}
            {step === 'biometric' && 'Set up biometric authentication'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-6">
          {error && (
            <Alert>
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {step === 'form' && (
            <>
              <Tabs value={isRegistering ? 'register' : 'login'} onValueChange={(value) => setIsRegistering(value === 'register')}>
                <TabsList className="grid w-full grid-cols-2 h-10">
                  <TabsTrigger value="login" className="text-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="text-sm">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Dr. John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@hospital.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="biometric"
                      checked={formData.enableBiometric}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableBiometric: checked })}
                    />
                    <Label htmlFor="biometric" className="text-sm">Enable biometric authentication</Label>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Button onClick={handleSubmitForm} className="w-full">
                {isRegistering ? 'Register & Send OTP' : 'Send OTP'}
              </Button>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center">
                <Smartphone className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a 6-digit code to {formData.phone}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
              </div>
              
              <Button onClick={handleVerifyOTP} className="w-full" disabled={formData.otp.length !== 6}>
                Verify OTP
              </Button>
              
              <Button variant="ghost" onClick={() => setStep('form')} className="w-full">
                Back
              </Button>
            </>
          )}

          {step === 'biometric' && (
            <>
              <div className="text-center">
                <Fingerprint className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Set up biometric authentication for faster future logins
                </p>
              </div>
              
              <Button onClick={handleBiometricSetup} className="w-full">
                Set Up Biometric
              </Button>
              
              <Button variant="ghost" onClick={completeAuth} className="w-full">
                Skip for now
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}