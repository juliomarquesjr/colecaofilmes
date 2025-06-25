'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserManagementModal } from "@/components/user-management-modal";
import { motion } from "framer-motion";
import { Edit2Icon, Plus, Shield, ShieldAlert, Trash2Icon, UserIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: number;
  username: string;
  name: string;
  phone: string;
  address: string;
  isAdmin: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Erro ao carregar usuários");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao excluir usuário");
      await fetchUsers();
      toast.success("Usuário excluído com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-8 p-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800/50 animate-pulse">
              <div className="h-6 w-6 rounded bg-zinc-700/50" />
            </div>
            <div className="h-8 w-36 rounded bg-zinc-800/50 animate-pulse" />
          </div>
          <div className="h-10 w-[160px] rounded bg-zinc-800/50 animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800 animate-pulse">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-2" />
              <div className="h-8 w-16 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 animate-pulse">
            <div className="h-8 w-full bg-zinc-800/50 rounded" />
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-zinc-800/50 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calcular estatísticas
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.isAdmin).length;
  const regularUsers = totalUsers - adminUsers;

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-600/30">
            <Users className="h-6 w-6 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
        </div>

        <UserManagementModal onSuccess={fetchUsers}>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </UserManagementModal>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-2">Total de Usuários</p>
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-indigo-500" />
            <span className="text-2xl font-bold text-white">{totalUsers}</span>
          </div>
        </div>
        <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-2">Administradores</p>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold text-white">{adminUsers}</span>
          </div>
        </div>
        <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-2">Usuários Comuns</p>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            <span className="text-2xl font-bold text-white">{regularUsers}</span>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="text-zinc-400">Nome</TableHead>
              <TableHead className="text-zinc-400">Nome de Usuário</TableHead>
              <TableHead className="text-zinc-400">Telefone</TableHead>
              <TableHead className="text-zinc-400">Endereço</TableHead>
              <TableHead className="text-zinc-400">Tipo</TableHead>
              <TableHead className="text-zinc-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-medium text-zinc-100">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-zinc-400" />
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300">{user.username}</TableCell>
                <TableCell className="text-zinc-300">{user.phone}</TableCell>
                <TableCell className="text-zinc-300">{user.address}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.isAdmin ? "default" : "secondary"}
                    className={user.isAdmin 
                      ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" 
                      : "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                    }
                  >
                    {user.isAdmin ? (
                      <div className="flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        <span>Administrador</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Usuário</span>
                      </div>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserManagementModal userId={user.id} onSuccess={fetchUsers}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        <Edit2Icon className="h-3 w-3" />
                      </Button>
                    </UserManagementModal>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-950/30 border-red-900/30 text-red-400 hover:bg-red-950/50 hover:text-red-300"
                    >
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
} 