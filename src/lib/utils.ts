import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getMonthName(month: number): string {
  return new Date(2024, month - 1).toLocaleString("default", { month: "long" });
}

export function calculatePrizePools(subscriberCount: number, planPrice: number = 9.99) {
  const totalPool = subscriberCount * planPrice * 0.4; // 40% of revenue to prize pool
  return {
    jackpot: totalPool * 0.4,
    fourMatch: totalPool * 0.35,
    threeMatch: totalPool * 0.25,
    total: totalPool,
  };
}

export function runDrawAlgorithm(
  type: "random" | "algorithmic",
  allScores: number[]
): number[] {
  if (type === "random") {
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }
    return numbers.sort((a, b) => a - b);
  }

  // Algorithmic: weighted by most frequent scores
  const freq: Record<number, number> = {};
  allScores.forEach((s) => (freq[s] = (freq[s] || 0) + 1));
  const weighted: number[] = [];
  Object.entries(freq).forEach(([score, count]) => {
    for (let i = 0; i < count; i++) weighted.push(Number(score));
  });

  const numbers: number[] = [];
  const pool = [...weighted];
  while (numbers.length < 5 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const n = pool[idx];
    if (!numbers.includes(n)) numbers.push(n);
    pool.splice(idx, 1);
  }
  while (numbers.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(n)) numbers.push(n);
  }
  return numbers.sort((a, b) => a - b);
}

export function checkMatch(userNumbers: number[], drawNumbers: number[]): number {
  return userNumbers.filter((n) => drawNumbers.includes(n)).length;
}
