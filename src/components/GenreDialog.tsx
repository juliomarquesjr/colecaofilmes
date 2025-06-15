"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { GenreForm } from "./GenreForm"

export function GenreDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cadastrar Gênero</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Gênero</DialogTitle>
        </DialogHeader>
        <GenreForm />
      </DialogContent>
    </Dialog>
  )
} 