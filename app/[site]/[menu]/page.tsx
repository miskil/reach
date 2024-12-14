import { headers } from "next/headers";
export default async function MenuPage() {
  const headersList = await headers();
  const siteId = headersList.get("x-siteid");
  const menuItem = headersList.get("x-menu");

  return (
    <div>
      <main className="p-4">
        <p>
          Coming from {siteId} & {menuItem}!
        </p>
      </main>
    </div>
  );
}
