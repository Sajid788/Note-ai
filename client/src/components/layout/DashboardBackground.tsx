export function DashboardBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-[20%] -top-[10%] h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-[120px]" />
      <div className="absolute -right-[15%] top-[20%] h-[400px] w-[400px] rounded-full bg-indigo-600/6 blur-[100px]" />
      <div className="absolute bottom-0 left-[30%] h-[350px] w-[350px] rounded-full bg-fuchsia-600/5 blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
