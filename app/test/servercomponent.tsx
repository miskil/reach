const ServerComponent = ( {data}) => {
  return (
    <div className="bg-blue-100 p-4 rounded-md">
      <h2 className="text-xl font-semibold">Server-Side Component</h2>
      <p> {data}</p>
      <p>This component is rendered on the server.</p>
    </div>
  );
};

export default ServerComponent;