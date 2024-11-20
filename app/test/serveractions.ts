'use server';

export async function fetchData() {
  // Simulate data fetching from a database or external source
  const data = await new Promise((resolve) =>
    setTimeout(() => resolve({ message: 'Hello from Server Action!' }), 1000)
  );
  return data;
}

