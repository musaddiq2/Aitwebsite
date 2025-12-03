// Fees calculation utilities

export const calculateBalanceFees = (totalFees, paidAmount) => {
  return Math.max(0, totalFees - paidAmount);
};

export const calculateFeesPercentage = (paidAmount, totalFees) => {
  if (totalFees === 0) return 0;
  return Math.round((paidAmount / totalFees) * 100);
};

export const getFeesStats = (installments) => {
  const totalPaid = installments.reduce((sum, inst) => sum + (inst.paidAmount || 0), 0);
  const totalFees = installments[0]?.totalFees || 0;
  const balance = calculateBalanceFees(totalFees, totalPaid);
  const percentage = calculateFeesPercentage(totalPaid, totalFees);

  return {
    totalFees,
    totalPaid,
    balance,
    percentage,
    installmentsCount: installments.length
  };
};

