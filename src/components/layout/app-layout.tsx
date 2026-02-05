'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, BarChart, Languages, LayoutDashboard, Settings, LifeBuoy, LogOut, User, NotebookText } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/vocabulary', label: 'Vocabulary', icon: NotebookText },
  { href: '/translate', label: 'Translate', icon: Languages },
  { href: '/progress', label: 'Progress', icon: BarChart },
  { href: '/introduction', label: 'Self-Intro', icon: User },
];

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPages = ['/', '/login', '/register'];
  const isPublicPage = publicPages.includes(pathname);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    const currentNav = navItems.find(item => item.href === pathname);
    return currentNav ? currentNav.label : '';
  }

  if (isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <Link href="/" className="flex items-center gap-3 mr-6">
                <div className="p-2 rounded-lg bg-primary flex items-center justify-center">
                  <span className="font-bold text-lg text-primary-foreground">ES</span>
                </div>
                <h1 className="font-heading text-xl font-semibold text-foreground">
                  Euskal Sustatzailea
                </h1>
            </Link>
            <div className="flex flex-1 items-center justify-end space-x-2">
               <nav className="flex items-center gap-2">
                  <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                  <Button asChild><Link href="/register">Get Started</Link></Button>
               </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
              Built with Next.js and AI.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-lg text-primary-foreground">ES</span>
            </div>
            <h1 className="font-heading text-xl font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">
              Euskal Sustatzailea
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className='gap-4'>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{ children: 'Support' }} asChild>
                        <Link href="#"><LifeBuoy /><span>Support</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{ children: 'Settings' }} asChild>
                        <Link href="#"><Settings /><span>Settings</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
           <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
                {userAvatar && (
                    <Avatar className="size-10 border-2 border-primary">
                        <Image src={userAvatar.imageUrl} alt={userAvatar.description} data-ai-hint={userAvatar.imageHint} width={40} height={40} />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold text-sm truncate">Alex</p>
                    <p className="text-xs text-muted-foreground truncate">alex@example.com</p>
                </div>
                <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden">
                    <LogOut className="size-4" />
                </Button>
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card sm:p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h2 className="font-heading text-2xl font-bold">{getPageTitle()}</h2>
          </div>
          <Button asChild>
            <Link href="/learn">Start Learning</Link>
          </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
