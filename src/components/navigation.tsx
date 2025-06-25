'use client';

import { motion } from "framer-motion";
import { FilmIcon, LogOutIcon, UserIcon, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navigation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Não mostra a navegação se estiver carregando a sessão ou na página de login
  if (status === "loading" || pathname === "/login" || !session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 mr-4">
              <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-600/30">
                <FilmIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <span className="font-semibold text-white hidden sm:inline">
                Coleção de Filmes
              </span>
            </Link>
            
            <div className="flex items-center space-x-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  className={`px-4 ${
                    isActive("/")
                      ? "bg-zinc-800/80 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <FilmIcon className="h-4 w-4 mr-2" />
                  Filmes
                </Button>
              </Link>
              
              {session.user.isAdmin && (
                <Link href="/usuarios">
                  <Button
                    variant="ghost"
                    className={`px-4 ${
                      isActive("/usuarios")
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Usuários
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative px-4 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{session.user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-zinc-900 border border-zinc-800">
                <DropdownMenuLabel className="text-zinc-400">
                  Minha Conta
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:text-red-400 focus:bg-red-950/50 cursor-pointer"
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 