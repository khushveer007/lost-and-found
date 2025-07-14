import React, { useState } from 'react';
import { supabase } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

interface EmailVerificationAlertProps {
  email: string;
  className?: string;
}

export function EmailVerificationAlert({ email, className = '' }: EmailVerificationAlertProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleResendVerification = async () => {
    if (isResending) return;
    
    setIsResending(true);
    setResendStatus('idle');
    setErrorMessage('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      setResendStatus('success');
    } catch (error: unknown) {
      setResendStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
      setErrorMessage(errorMessage);
      console.error('Error resending verification:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">Verify your email address</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.</p>
            <p className="mt-1">
              If you don't see the email, check your spam folder or click below to resend it.
            </p>
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleResendVerification}
                disabled={isResending}
                className="bg-white hover:bg-blue-50 text-blue-600 border-blue-300"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {resendStatus === 'success' && (
        <Toast variant="success" className="mt-4">
          <div>
            <ToastTitle>Email Sent</ToastTitle>
            <ToastDescription>Verification email has been resent to your inbox.</ToastDescription>
          </div>
        </Toast>
      )}
      
      {resendStatus === 'error' && (
        <Toast variant="destructive" className="mt-4">
          <div>
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>{errorMessage}</ToastDescription>
          </div>
        </Toast>
      )}
    </div>
  );
}
