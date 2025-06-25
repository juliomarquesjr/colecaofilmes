'use client';

import { AnimatedFormPage } from "@/components/animated-form-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FilmIcon, KeyIcon, UserIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        router.push(from);
        router.refresh();
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedFormPage>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-600/20 border border-indigo-600/30 mb-4">
              <FilmIcon className="h-8 w-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">Coleção de Filmes</h1>
            <p className="text-zinc-400 mt-2">Faça login para acessar sua coleção</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden"
          >
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-zinc-300">
                    Nome de Usuário
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <UserIcon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Digite seu nome de usuário"
                      required
                      disabled={isLoading}
                      className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">
                    Senha
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <KeyIcon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Digite sua senha"
                      required
                      disabled={isLoading}
                      className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedFormPage>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
} 