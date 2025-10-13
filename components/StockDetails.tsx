import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShoppingCart,
  DollarSign,
  Zap,
} from "lucide-react";
import { Stock } from "./StockList";
import { Position } from "./PositionsPanel";

export default function StockDetails({ stock, onExecuteTrade, isProcessing, userPosition }: { stock: Stock | null; onExecuteTrade: (trade: { type: "buy" | "sell"; quantity: number; price: number; commission: number; }) => void; isProcessing: boolean; userPosition: Position | null; }) {
  const [buyQuantity, setBuyQuantity] = useState(100);
  const [sellQuantity, setSellQuantity] = useState(100);
  const [commission, setCommission] = useState(0);
  const [spreadPercent, setSpreadPercent] = useState(0.1);

  if (!stock) {
    return (
      <Card className="bg-[#141b2d] border-white/10 p-12 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Select a Stock
        </h3>
        <p className="text-gray-500">
          Choose a stock from the list to view details and trade
        </p>
      </Card>
    );
  }

  const priceChange = stock.current_price - stock.previous_close;
  const priceChangePercent = (priceChange / stock.previous_close) * 100;
  const isPositive = priceChange >= 0;

  const spread = (stock.current_price * spreadPercent) / 100;
  const buyPrice = stock.current_price + spread;
  const sellPrice = stock.current_price - spread;

  const buyTotal = buyQuantity * buyPrice + commission;
  const sellTotal = sellQuantity * sellPrice - commission;

  const canSell = userPosition && userPosition.quantity >= sellQuantity;

  const handleBuy = () => {
    onExecuteTrade({
      type: "buy",
      quantity: buyQuantity,
      price: buyPrice,
      commission: commission,
    });
  };

  const handleSell = () => {
    onExecuteTrade({
      type: "sell",
      quantity: sellQuantity,
      price: sellPrice,
      commission: commission,
    });
  };

  return (
    <Card className="bg-[#141b2d] border-white/10">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white">{stock.symbol}</h2>
              <Badge variant="outline" className="border-white/20 text-gray-400">
                {stock.sector}
              </Badge>
            </div>
            <p className="text-gray-400">{stock.name}</p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">
              ${stock.current_price.toFixed(2)}
            </div>
            <div
              className={`flex items-center gap-1 text-lg font-medium ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {isPositive ? "+" : ""}
              {priceChangePercent.toFixed(2)}% (${Math.abs(priceChange).toFixed(2)})
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0a0e27] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <BarChart3 className="w-3 h-3" />
              <span>Volume</span>
            </div>
            <div className="text-white font-bold text-lg">
              {(stock.volume / 1000000).toFixed(2)}M
            </div>
          </div>

          <div className="bg-[#0a0e27] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <DollarSign className="w-3 h-3" />
              <span>Market Cap</span>
            </div>
            <div className="text-white font-bold text-lg">
              ${(stock.market_cap / 1000000000).toFixed(2)}B
            </div>
          </div>
        </div>

        {/* Trading Settings */}
        <div className="bg-[#0a0e27] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">Trading Parameters</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-400 text-xs">Commission ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={commission}
                onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                className="bg-[#141b2d] border-white/10 text-white h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs">Spread (%)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={spreadPercent}
                onChange={(e) => setSpreadPercent(parseFloat(e.target.value) || 0)}
                className="bg-[#141b2d] border-white/10 text-white h-9 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Buy Section */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-3">
            <ShoppingCart className="w-4 h-4" />
            <span>Buy Order</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-gray-400 text-xs">Quantity</Label>
              <Input
                type="number"
                min="1"
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                className="bg-[#141b2d] border-white/10 text-white h-10 mt-1"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Buy Price (+ spread)</span>
              <span className="text-white font-bold">${buyPrice.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleBuy}
              disabled={isProcessing || buyQuantity <= 0}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-base font-bold"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy {buyQuantity} @ ${buyTotal.toFixed(2)}
            </Button>
          </div>
        </div>

        {/* Sell Section */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-3">
            <DollarSign className="w-4 h-4" />
            <span>Sell Order</span>
            {userPosition && (
              <Badge variant="outline" className="ml-auto text-xs border-white/20 text-gray-400">
                {userPosition.quantity} shares available
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-gray-400 text-xs">Quantity</Label>
              <Input
                type="number"
                min="1"
                max={userPosition?.quantity || 0}
                value={sellQuantity}
                onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}
                className="bg-[#141b2d] border-white/10 text-white h-10 mt-1"
                disabled={!userPosition}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Sell Price (- spread)</span>
              <span className="text-white font-bold">${sellPrice.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleSell}
              disabled={isProcessing || !canSell || sellQuantity <= 0}
              className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Sell {sellQuantity} @ ${sellTotal.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}