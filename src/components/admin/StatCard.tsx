import { Card } from "@/components/ui";

interface StatCardProps {
  label: string;
  value: string;
}

/**
 * /adminダッシュボードの数値指標を表示するカード。
 */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </Card>
  );
}
