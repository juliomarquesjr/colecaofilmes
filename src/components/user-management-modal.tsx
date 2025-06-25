'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserManagementModalProps {
  userId?: number;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

interface User {
  id: number;
  username: string;
  name: string;
  phone: string;
  address: string;
  isAdmin: boolean;
}

export function UserManagementModal({ userId, onSuccess, children }: UserManagementModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userId && open) {
      fetchUser();
    }
  }, [userId, open]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error("Erro ao carregar usuário");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      toast.error("Erro ao carregar usuário");
      setOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        username: formData.get("username") as string,
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        password: formData.get("password") as string,
        isAdmin: formData.get("isAdmin") === "true"
      };

      const response = await fetch(`/api/users${userId ? `/${userId}` : ""}`, {
        method: userId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao salvar usuário");
      }

      toast.success(userId ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={userId ? "outline" : "default"} size={userId ? "sm" : "default"}>
            {userId ? "Editar" : "Novo Usuário"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{userId ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-zinc-300">Nome de Usuário</Label>
            <Input
              id="username"
              name="username"
              defaultValue={user?.username}
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Digite o nome de usuário para login"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Nome</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name}
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Digite o nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-zinc-300">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={user?.phone}
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Digite o telefone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-zinc-300">Endereço</Label>
            <Input
              id="address"
              name="address"
              defaultValue={user?.address}
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Digite o endereço"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required={!userId}
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder={userId ? "Digite para alterar a senha" : "Digite a senha"}
            />
            {userId && (
              <p className="text-sm text-zinc-500">
                Deixe em branco para manter a senha atual
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdmin"
              name="isAdmin"
              value="true"
              defaultChecked={user?.isAdmin}
              disabled={isLoading}
              className="border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <Label htmlFor="isAdmin" className="text-zinc-300">É administrador?</Label>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isLoading ? "Salvando..." : userId ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 