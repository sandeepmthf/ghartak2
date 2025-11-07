import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import logo from 'figma:asset/140c39be02623ac8ea55ecdd5766cc44703fdb24.png';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (accessToken: string, user: any) => void;
}

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!signInEmail || !signInPassword) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08603d78/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      if (data.access_token && data.user) {
        toast.success('Successfully signed in!');
        onLoginSuccess(data.access_token, data.user);
        onNavigate('home');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      toast.error('Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08603d78/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: signUpEmail,
          password: signUpPassword,
          name: signUpName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      setSuccessMessage('Account created successfully! You can now sign in.');
      toast.success('Account created successfully!');
      
      // Clear form
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');

      // Switch to sign in tab after 2 seconds
      setTimeout(() => {
        const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
        if (signInTab) signInTab.click();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      toast.error('Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-16 px-4">
      <div className="container mx-auto max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Ghartak" 
            className="h-20 w-auto mx-auto mb-4 cursor-pointer"
            onClick={() => onNavigate('home')}
          />
          <h1 className="text-3xl text-gray-900 mb-2">Welcome to Ghartak</h1>
          <p className="text-gray-600">Your local grocery marketplace</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-green-600 hover:underline"
                      onClick={() => {
                        toast.info('Password reset feature coming soon!');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up to start ordering from local vendors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {successMessage && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="text-gray-600"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
