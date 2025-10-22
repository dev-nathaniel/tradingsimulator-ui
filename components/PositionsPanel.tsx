import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Stock } from "./StockList";

export type Position = {
    id: string;
    stock: Stock;
    positionVolume: number;
    positionAvgPrice: number;
    // stockName: string;
}

export default function PositionsPanel({ positions, stocks }: { positions: Position[]; stocks: Stock[] }) {
  const getStockPrice = (symbol: string) => {
    const stock = stocks.find((s) => s.stockCode === symbol);
    return stock?.stockPrice || 0;
  };

  const calculatePositionValue = (position: Position) => {
    const currentPrice = getStockPrice(position.stock.stockCode);
    const currentValue = position.positionVolume * currentPrice;
    const costBasis = position.positionVolume * position.positionAvgPrice;
    const profitLoss = currentValue - costBasis;
    const profitLossPercent = (profitLoss / costBasis) * 100;

    return {
      currentValue,
      profitLoss,
      profitLossPercent,
      currentPrice,
    };
  };

  const totalPortfolioValue = positions.reduce((sum, position) => {
    const { currentValue } = calculatePositionValue(position);
    return sum + currentValue;
  }, 0);

  const totalProfitLoss = positions.reduce((sum, position) => {
    const { profitLoss } = calculatePositionValue(position);
    return sum + profitLoss;
  }, 0);

  return (
    <Card className="bg-[#141b2d] border-white/10">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your Positions</h2>
          <Badge
            variant="outline"
            className={`${
              totalProfitLoss >= 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)}
          </Badge>
        </div>

        <div className="bg-[#0a0e27] rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Total Portfolio Value</span>
          </div>
          <div className="text-3xl font-bold text-white">
            ${totalPortfolioValue.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        {positions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No positions yet</p>
            <p className="text-sm mt-2">Start trading to build your portfolio</p>
          </div>
        ) : (
          positions.map((position) => {
            const { currentValue, profitLoss, profitLossPercent, currentPrice } =
              calculatePositionValue(position);
            const isProfit = profitLoss >= 0;

            return (
              <div
                key={position.id}
                className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-white">{position.stock.stockCode}</div>
                    <div className="text-sm text-gray-400">{position.stock.stockName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">
                      ${currentValue.toFixed(2)}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium justify-end ${
                        isProfit ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isProfit ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {isProfit ? "+" : ""}${profitLoss.toFixed(2)} (
                      {profitLossPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Shares</span>
                    <div className="text-white font-medium mt-1">{position.positionVolume}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Avg Cost</span>
                    <div className="text-white font-medium mt-1">
                      ${position.positionAvgPrice.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Current</span>
                    <div className="text-white font-medium mt-1">
                      ${currentPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}