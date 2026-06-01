import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Target, Wallet, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface Props {
  weeklyTotal: number;
  monthlyTotal: number;
  totalSpent: number;
  expenseCount: number;
}

export default function StatsCards({ weeklyTotal, monthlyTotal, totalSpent, expenseCount }: Props) {
  const stats = [
    {
      label: 'Esta Semana',
      value: formatCurrency(weeklyTotal),
      icon: TrendingDown,
      color: 'text-toxic-red',
      bg: 'bg-toxic-red/10',
      border: 'border-toxic-red/20',
      comment: weeklyTotal > 1000 ? 'Fuera de control' : weeklyTotal > 500 ? 'Preocupante' : weeklyTotal > 0 ? 'Moderado' : 'Intocable'
    },
    {
      label: 'Este Mes',
      value: formatCurrency(monthlyTotal),
      icon: Target,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      comment: monthlyTotal > 5000 ? 'Necesitas ayuda' : monthlyTotal > 2000 ? 'Podría ser peor' : 'Bajo control'
    },
    {
      label: 'Total Acumulado',
      value: formatCurrency(totalSpent),
      icon: Wallet,
      color: 'text-toxic-green',
      bg: 'bg-toxic-green/10',
      border: 'border-toxic-green/20',
      comment: totalSpent > 10000 ? 'Estás donando dinero' : totalSpent > 5000 ? 'Duele, ¿verdad?' : 'Aún hay esperanza'
    },
    {
      label: 'Transacciones',
      value: expenseCount.toString(),
      icon: expenseCount > 20 ? AlertTriangle : TrendingUp,
      color: expenseCount > 20 ? 'text-toxic-red' : 'text-toxic-green',
      bg: expenseCount > 20 ? 'bg-toxic-red/10' : 'bg-toxic-green/10',
      border: expenseCount > 20 ? 'border-toxic-red/20' : 'border-toxic-green/20',
      comment: expenseCount > 20 ? 'Adicto a gastar' : expenseCount > 10 ? 'Activo' : 'Selectivo'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`${stat.bg} ${stat.border} border rounded-xl p-4`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              {stat.label}
            </span>
            <stat.icon size={16} className={stat.color} />
          </div>
          <p className={`text-2xl font-black font-mono ${stat.color}`}>
            {stat.value}
          </p>
          <p className="text-[9px] text-white/20 mt-1 italic">
            {stat.comment}
          </p>
        </motion.div>
      ))}
    </div>
  );
}