
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterForm() {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'details'>('phone');
  const { login, updateUser } = useAuth();
  const navigate = useNavigate();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would verify the phone number here
    // For now, we'll just proceed to the next step
    setStep('details');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(phone, role);
      updateUser({ name });
      
      // Redirect to the appropriate dashboard based on the user role
      navigate(`/dashboard/${role}`);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {step === 'phone' ? 'أدخل رقم الهاتف' : 'أكمل التسجيل'}
        </CardTitle>
        <CardDescription className="text-center">
          {step === 'phone' ? 'سيتم إرسال رمز التحقق' : 'اختر نوع الحساب وأدخل اسمك'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-right"
                required
                dir="ltr"
              />
            </div>
            <Button type="submit" className="w-full bg-primary">متابعة</Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                placeholder="أدخل اسمك الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-right"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <RadioGroup value={role} onValueChange={(val) => setRole(val as UserRole)} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">زبون</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label htmlFor="vendor">صاحب متجر</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="driver" id="driver" />
                  <Label htmlFor="driver">سائق توصيل</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">مدير نظام</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full bg-primary">تسجيل</Button>
          </form>
        )}
      </CardContent>

      {step === 'details' && (
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => setStep('phone')}
            className="text-sm text-muted-foreground"
          >
            العودة لرقم الهاتف
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
