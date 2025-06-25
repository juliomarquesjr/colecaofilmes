import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");
  const isUsersPage = request.nextUrl.pathname.startsWith("/usuarios");

  // Não protege rotas de autenticação
  if (isApiAuthRoute) {
    return null;
  }

  // Redireciona para a home se tentar acessar login já autenticado
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return null;
  }

  // Verifica se o usuário está autenticado
  if (!token) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    );
  }

  // Verifica se o usuário tem permissão para acessar a página de usuários
  if (isUsersPage && !token.isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}; 