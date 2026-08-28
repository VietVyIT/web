const modules = [
  "Dang ky/Dang nhap (JWT + bcrypt)",
  "Tim kiem + loc + sap xep san pham",
  "Gio hang va dat hang",
  "Voucher",
  "Phan quyen Admin/Staff",
  "Tra cuu bao hanh bang Serial/IMEI"
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Web ban hang thiet bi - Starter</h1>
      <p className="mt-3 text-slate-700">
        Du an khoi tao theo yeu cau cua ban voi Next.js + PostgreSQL + Prisma, co Docker va
        tai lieu huong dan day du trong README.
      </p>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Module da san sang</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          {modules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="mt-8 text-sm text-slate-500">
        Chi tiet endpoint, cach chay, cau truc thu muc nam trong README.md
      </p>
    </main>
  );
}

