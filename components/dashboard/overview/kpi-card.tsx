import { KpiCardProps } from "@/types/dashboard";

export default function KpiCard({ items }: KpiCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col px-6 py-6 min-h-[148px] relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-9 h-9 bg-primary/10 rounded-lg">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-base font-medium text-gray-600">{item.label}</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{item.value}</h3>
        </div>
      ))}
    </div>
  );
}
