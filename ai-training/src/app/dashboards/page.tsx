"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy as CopyIcon, Pencil as PencilIcon, Trash as TrashIcon, ArrowUpDown, ArrowUp, ArrowDown, Eye as EyeIcon } from "lucide-react";
import { useUser } from '@supabase/auth-helpers-react';
import { apiKeysService } from '@/services/api-keys.service';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  monthlyLimit?: number;
  usage: number;
}

type SortDirection = 'asc' | 'desc' | null;
type SortConfig = {
  column: keyof ApiKey | null;
  direction: SortDirection;
};

interface ApiKeyDialogProps {
  mode: 'create' | 'edit';
  apiKey?: ApiKey;
  onSubmit: (data: ApiKey) => void;
  onClose: () => void;
}

function ApiKeyDialog({ mode, apiKey, onSubmit, onClose }: ApiKeyDialogProps) {
  const [name, setName] = useState(apiKey?.name || '');
  const [key, setKey] = useState(apiKey?.key || '');
  const [hasLimit, setHasLimit] = useState(!!apiKey?.monthlyLimit);
  const [limit, setLimit] = useState<number>(apiKey?.monthlyLimit || 1000);

  useEffect(() => {
    if (apiKey) {
      setName(apiKey.name);
      setKey(apiKey.key);
      setHasLimit(!!apiKey.monthlyLimit);
      setLimit(apiKey.monthlyLimit || 1000);
    }
  }, [apiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newKey = {
      id: apiKey?.id || Math.random().toString(36).substr(2, 9),
      name,
      key,
      createdAt: apiKey?.createdAt || new Date().toISOString(),
      monthlyLimit: hasLimit ? limit : undefined,
      usage: apiKey?.usage || 0
    };
    
    onSubmit(newKey);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{mode === 'create' ? 'Create a new API key' : 'Edit API key'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Key Name</Label>
            <div className="text-sm text-gray-500">— A unique name to identify this key</div>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production API Key"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">API Key</Label>
            <div className="text-sm text-gray-500">— Your API key value</div>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="pk_live_..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="limitUsage"
                checked={hasLimit}
                onChange={(e) => setHasLimit(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="limitUsage">Limit monthly usage*</Label>
            </div>
            {hasLimit && (
              <Input
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                placeholder="1000"
                min="1"
              />
            )}
            <div className="text-sm text-gray-500">
              *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-200 hover:bg-blue-300 text-blue-800">
            {mode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

function obfuscateApiKey(key: string): string {
  if (key.startsWith('pk_')) {
    const parts = key.split('_');
    return `${parts[0]}_${parts[1]}_${'*'.repeat(6)}`;
  }
  return `${key.slice(0, 3)}${'*'.repeat(key.length - 3)}`;
}

function ViewApiKeyDialog({ apiKey, onClose }: { apiKey: ApiKey; onClose: () => void }) {
  const { toast } = useToast();
  
  const handleCopyAndClose = () => {
    navigator.clipboard.writeText(apiKey.key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
    onClose();
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Here's your API key</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg font-mono break-all">
          {apiKey.key}
        </div>
        <Button 
          onClick={handleCopyAndClose}
          className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800"
        >
          Copy to Clipboard
        </Button>
      </div>
    </DialogContent>
  );
}

import { User as UserIcon } from "lucide-react";

function Header() {
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <nav className="flex items-center space-x-8">
          <div className="font-semibold text-lg">Logo</div>
          <div className="flex items-center space-x-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/dashboard" className="text-blue-800 font-medium">My Dashboard</a>
            <a href="/settings" className="text-gray-600 hover:text-gray-900">Settings</a>
            <a href="/help" className="text-gray-600 hover:text-gray-900">Help</a>
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function DashboardPage() {
  const user = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sort, setSort] = useState<SortConfig>({ column: 'name', direction: 'asc' });
  const [editingKey, setEditingKey] = useState<ApiKey | undefined>();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [viewingKey, setViewingKey] = useState<ApiKey | undefined>();
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [addedKeyId, setAddedKeyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    loadApiKeys();
  }, [user]);

  const loadApiKeys = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const data = await apiKeysService.getApiKeys(user.id);
      setApiKeys(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (newKey: ApiKey) => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const createdKey = await apiKeysService.createApiKey({
        name: newKey.name,
        key: newKey.key,
        user_id: user.id,
        monthly_limit: newKey.monthlyLimit ?? null,
      });
      
      setApiKeys(prev => [...prev, createdKey]);
      setShowCreateDialog(false);
      setAddedKeyId(createdKey.id);
      
      setTimeout(() => {
        setAddedKeyId(null);
      }, 600);
      
      toast({
        title: 'API Key Created',
        description: `API key "${newKey.name}" has been created successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Failed to create API key: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (updatedKey: ApiKey) => {
    try {
      const updated = await apiKeysService.updateApiKey(updatedKey.id, updatedKey);
      setApiKeys(apiKeys.map((key) => 
        key.id === updated.id ? updated : key
      ));
      setShowEditDialog(false);
      toast({
        title: 'API Key Updated',
        description: `API key "${updated.name}" has been updated successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update API key',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiKeysService.deleteApiKey(id);
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      toast({
        title: 'API Key Deleted',
        description: 'API key has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };

  const handleSort = (column: keyof ApiKey) => {
    setSort((prev) => ({
      column,
      direction: 
        prev.column === column 
          ? prev.direction === 'asc' 
            ? 'desc' 
            : prev.direction === 'desc' 
              ? null 
              : 'asc'
          : 'asc'
    }));
  };

  const sortedApiKeys = [...apiKeys].sort((a, b) => {
    if (sort.column === null || sort.direction === null) return 0;
    
    const aValue = a[sort.column];
    const bValue = b[sort.column];

    if (sort.direction === 'asc') {
      return String(aValue ?? '') < String(bValue ?? '') ? -1 : String(aValue ?? '') > String(bValue ?? '') ? 1 : 0;
    } else {
      return String(aValue ?? '') > String(bValue ?? '') ? -1 : String(aValue ?? '') < String(bValue ?? '') ? 1 : 0;
    }
  });

  const handleCopy = (key: ApiKey) => {
    navigator.clipboard.writeText(key.key);
    setCopiedKeyId(key.id);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
    
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 600);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 space-y-6">
        {/* Current Plan Card */}
        <div className="rounded-lg p-6 bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-2">CURRENT PLAN</div>
              <h1 className="text-3xl font-bold text-gray-800">Professional</h1>
            </div>
            <Button variant="secondary" className="bg-white/80 hover:bg-white">
              Manage Plan
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">API Limit</div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: '30%' }}
              />
            </div>
            <div className="text-sm text-gray-600">300/1,000 Requests</div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-200 hover:bg-blue-300 text-blue-800">
                  Create New API Key
                </Button>
              </DialogTrigger>
              <ApiKeyDialog
                mode="create"
                onSubmit={(data) => {
                  handleCreate(data);
                  setShowCreateDialog(false);
                }}
                onClose={() => setShowCreateDialog(false)}
              />
            </Dialog>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="font-bold cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sort.column === 'name' ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('key')}
                  >
                    <div className="flex items-center gap-1">
                      API Key
                      {sort.column === 'key' ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('monthlyLimit')}
                  >
                    <div className="flex items-center gap-1">
                      Limit
                      {sort.column === 'monthlyLimit' ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('usage')}
                  >
                    <div className="flex items-center gap-1">
                      Usage
                      {sort.column === 'usage' ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-sm">{obfuscateApiKey(key.key)}</TableCell>
                    <TableCell>
                      {key.monthlyLimit 
                        ? `${key.monthlyLimit.toLocaleString()} requests`
                        : 'Unlimited'}
                    </TableCell>
                    <TableCell>
                      {key.usage.toLocaleString()} requests
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2 h-9">
                        <div className="w-[120px] flex justify-center">
                          {copiedKeyId === key.id ? (
                            <span className="text-sm animate-slide-fade-in">
                              Copied!
                            </span>
                          ) : addedKeyId === key.id ? (
                            <span className="text-sm animate-slide-fade-in">
                              Added!
                            </span>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopy(key)}
                              >
                                <CopyIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingKey(key)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingKey(key);
                                  setShowEditDialog(true);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(key.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <ApiKeyDialog
            mode="edit"
            apiKey={editingKey}
            onSubmit={handleEdit}
            onClose={() => setShowEditDialog(false)}
          />
        </Dialog>

        <Dialog open={!!viewingKey} onOpenChange={(open) => !open && setViewingKey(undefined)}>
          {viewingKey && <ViewApiKeyDialog apiKey={viewingKey} onClose={() => setViewingKey(undefined)} />}
        </Dialog>
      </div>
    </>
  );
}