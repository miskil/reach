import { ReactNode } from 'react';
import { headers } from 'next/headers';
import ServerComponent from './servercomponent';
import ClientComponent from './clientcomponent';
import { fetchData } from './serveractions';

interface LayoutProps {
  children: ReactNode;
}

// This is a Server-Side Component
export default async function Layout({ children }: LayoutProps) {
  

   
    

  const serverComponent = <ServerComponent data="STRING" />;
  const clientData = await fetchData();

  return (
    <div>
      <header className="p-4 bg-gray-800 text-white">
         <ClientComponent serverData={serverComponent} clientData={clientData} />
      </header>
      <main className="p-4">
       
      
        {children}
      </main>
    </div>
  );
}