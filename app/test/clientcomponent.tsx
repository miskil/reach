'use client';

interface ClientComponentProps {
  serverData: JSX.Element;
  clientData: { message: string };
}
const ClientComponent = ({ serverData, clientData }: ClientComponentProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Client-Side Component</h2>
      <p>{clientData.message}</p>
      <div className="mt-4">{serverData}</div>
    </div>
  );
};

export default ClientComponent;