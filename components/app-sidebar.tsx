"use client"

import * as React from "react"
import { NavMain } from "./nav-main"

import {     
  BadgeDollarSign,
  CalendarCog,
  ContactRound,
  FolderKanban,
  GraduationCap,
  House,       
  NotebookTabs,       
  Projector,       
  School,       
  SquareChartGantt,       
  SquareM,       
  UserRound,
  Users,
  Workflow,         
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { RolSwitcher } from "@/components/rol-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IRolNav, IUserNav } from "@/interfaces/session"

export function AppSidebar({
  user, role
}: {
  user : IUserNav;
  role : IRolNav;
}) {  

  const menus = {
    navMainAdmin: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      },   
      {
        title: "Organización",      
        icon: School,
        isActive: true,
        url: "/organizations",      
      },   
      {
        title: "Gerencias",      
        icon: FolderKanban,
        isActive: true,
        url: "/gerencias",      
      },   
      {
        title: "Subgerencias",      
        icon: FolderKanban,
        isActive: true,
        url: "/subgerencias",      
      }, 
      {
        title: "Usuarios",      
        icon: UserRound,
        isActive: true,
        url: "/users",      
      },                         
    ],    
    navMainUser: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      },   
      {
        title: "Organización",      
        icon: School,
        isActive: true,
        url: "/organizations",      
      },                     
      {
        title: "Presupuestos",      
        icon: CalendarCog,
        isActive: true,
        url: "/periodos",      
      },                     
      {
        title: "Proyectos",      
        icon: Projector,
        isActive: true,
        url: "/proyectos",      
      },
      {
        title: "Planificación",      
        icon: SquareM,
        isActive: true,
        url: "/planificacion",      
      }, 
      {
        title: "Metas",      
        icon: SquareM,
        isActive: true,
        url: "/metas",      
      }, 
      {
        title: "Actividades",      
        icon: Workflow,
        isActive: true,
        url: "/actividades",      
      }, 
      {
        title: "Tareas",      
        icon: SquareChartGantt,
        isActive: true,
        url: "/tareas",      
      },
      {
        title: "Programación",      
        icon: SquareM,
        isActive: true,
        url: "/programacion",      
      }, 
      {
        title: "Bienes y Servicios",      
        icon: BadgeDollarSign,
        isActive: true,
        url: "/servicios",      
      }, 
      {
        title: "Perfil Académico",      
        icon: GraduationCap,
        isActive: true,
        url: "/perfilAcademico",      
      }, 
      {
        title: "Colaboradores",      
        icon: Users,
        isActive: true,
        url: "/colaboradores",      
      }, 
      {
        title: "Contratos",      
        icon: ContactRound,
        isActive: true,
        url: "/contracts",      
      }, 
      {
        title: "TDR's",      
        icon: NotebookTabs,
        isActive: true,
        url: "/tdrs",      
      }
    ]
  } 
    
  const navItems = role.name === "Administrador" ? menus.navMainAdmin : menus.navMainUser;
   
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <RolSwitcher role={role} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />              
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
