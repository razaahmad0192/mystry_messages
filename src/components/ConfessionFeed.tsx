async function getConfessions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/confessions`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function ConfessionFeed() {
  const confessions = await getConfessions();

  return (
    <div className="space-y-4">
      {confessions.map((c: any) => (
        <div key={c._id} className="border p-3 rounded">
          <p>{c.content}</p>
          <span className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
