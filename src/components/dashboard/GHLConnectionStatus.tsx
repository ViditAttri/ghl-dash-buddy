import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RefreshCw, Plug } from 'lucide-react';
import { useGHLData } from '@/hooks/useGHLData';

export const GHLConnectionStatus = () => {
  const { loading, connected, testConnection, fetchStats } = useGHLData();
  const [tested, setTested] = useState(false);

  const handleTest = async () => {
    const success = await testConnection();
    setTested(true);
    if (success) {
      await fetchStats();
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Plug className="h-5 w-5 text-primary" />
              GoHighLevel Integration
            </CardTitle>
            <CardDescription className="mt-1">
              Connect your GHL account to sync data
            </CardDescription>
          </div>
          {tested && (
            <Badge 
              variant={connected ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {connected ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Disconnected
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button 
            onClick={handleTest} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {tested ? 'Refresh Connection' : 'Test Connection'}
          </Button>
          
          {connected && (
            <Button 
              variant="outline" 
              onClick={fetchStats}
              disabled={loading}
            >
              Sync Data
            </Button>
          )}
        </div>
        
        {!tested && (
          <p className="text-sm text-muted-foreground mt-3">
            Click "Test Connection" to verify your GHL API credentials are working.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
