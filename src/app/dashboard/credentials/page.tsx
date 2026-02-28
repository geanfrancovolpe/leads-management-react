'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { credentialsService } from '@/lib/services/credentials.service';
import { Credential } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const data = await credentialsService.getCredentials();
      setCredentials(data);
    } catch (error) {
      toast.error('Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to disconnect this credential?')) return;

    try {
      await credentialsService.deleteCredential(id);
      toast.success('Credential disconnected');
      fetchCredentials();
    } catch (error) {
      toast.error('Failed to disconnect credential');
    }
  };

  const handleConnect = (provider: string) => {
    credentialsService.initiateOAuth(provider);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credentials</h1>
          <p className="text-gray-600 mt-2">Manage your OAuth connections and API keys</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Microsoft</CardTitle>
              <CardDescription>Connect your Microsoft account for email access</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleConnect('microsoft')}>
                <Plus className="w-4 h-4 mr-2" />
                Connect Microsoft
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google</CardTitle>
              <CardDescription>Connect your Google account for email access</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleConnect('google')}>
                <Plus className="w-4 h-4 mr-2" />
                Connect Google
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Your currently connected credentials</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))}
              </div>
            ) : credentials.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No credentials connected. Connect an account to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {credentials.map((credential) => (
                  <div
                    key={credential.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{credential.provider}</h3>
                        <Badge className={getStatusColor(credential.status)}>
                          {credential.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{credential.email}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(credential.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
