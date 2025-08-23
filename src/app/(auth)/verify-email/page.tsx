'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ArrowRight,
  Clock
} from 'lucide-react';

export default function VerifyEmailPage() {
  const { user, refreshSession } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Check for verification code in URL
  const verificationCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is already verified, redirect to home
    if (user.emailVerified) {
      router.push('/home');
      return;
    }

    // If there's a verification code, verify it
    if (verificationCode && mode === 'verifyEmail') {
      handleEmailVerification(verificationCode);
    }

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, router, verificationCode, mode]);

  const handleEmailVerification = async (_code: string) => {
    setVerificationStatus('verifying');
    setLoading(true);

    try {
      // TODO: Implement actual email verification
      // await authService.verifyEmail(code);
      
      // Mock verification for development
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh user session to get updated verification status
      if (refreshSession) {
        await refreshSession();
      }
      
      setVerificationStatus('success');
      toast({ 
        title: 'Email Verified!', 
        description: 'Your email has been successfully verified.' 
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/home');
      }, 2000);
      
    } catch (error) {
      setVerificationStatus('error');
      toast({ 
        variant: 'destructive', 
        title: 'Verification Failed', 
        description: 'Failed to verify your email. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      // TODO: Implement actual resend verification
      // await authService.sendEmailVerification();
      
      // Mock resend for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({ 
        title: 'Verification Email Sent', 
        description: 'Check your email for the verification link.' 
      });
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to send verification email. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithoutVerification = () => {
    // Allow users to continue without verification (with limitations)
    router.push('/home');
  };

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <CardTitle className="text-2xl">Verifying Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-900 dark:text-green-100">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Your email has been successfully verified. Redirecting you to the home page...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Redirecting in a few seconds...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-900 dark:text-red-100">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              We couldn't verify your email. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setVerificationStatus('pending')} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={handleContinueWithoutVerification} className="w-full">
              Continue Without Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{user?.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to activate your account.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Can't find the email?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes for delivery</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleResendVerification} 
              disabled={loading || !canResend}
              className="w-full"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
            </Button>

            <Button 
              variant="outline" 
              onClick={handleContinueWithoutVerification}
              className="w-full"
            >
              Continue Without Verification
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Already verified?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
