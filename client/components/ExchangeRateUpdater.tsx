'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/store';

export default function ExchangeRateUpdater({ rate }: { rate: number }) {
  const setRate = useCartStore(state => state.setExchangeRate);
  useEffect(() => {
    setRate(rate);
  }, [rate, setRate]);
  return null; // No pinta nada en pantalla
}