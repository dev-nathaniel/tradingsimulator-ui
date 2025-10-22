import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  LogIn,
  LogOut
} from "lucide-react";
import { Position } from "./PositionsPanel";
import { Stock } from "./StockList";
import { UserType } from "./AuthModal";

export default function UserDetailsBar({ 
  user, 
  positions, 
  stocks, 
  onLogin, 
  onLogout,
  isAuthenticated 
}: {
    user: UserType | null;
    positions: Position[];
    stocks: Stock[];
    onLogin: () => void;
    onLogout: () => void;
    isAuthenticated: boolean;
}) {
  const calculateUnrealizedPnL = () => {
    if (!positions || !stocks || positions.length === 0) return 0;
    
    return positions.reduce((total, position) => {
      const currentStock = stocks.find(s => s.stockCode === position.stock.stockCode);
      if (!currentStock) return total;
      
      const currentValue = position.positionVolume * currentStock.stockPrice;
      const costBasis = position.positionVolume * position.positionAvgPrice;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const unrealizedPnL = calculateUnrealizedPnL();
  const realizedPnL = user?.realizedPnl || 0;
  const totalPnL = unrealizedPnL + realizedPnL;
  const balance = user?.balance || 0;

  if (!isAuthenticated) {
    return (
      <div className="bg-[#141b2d]/80 backdrop-blur-xl border-b border-white/10 py-4">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm">Not logged in - Browse freely, login to trade</span>
              </div>
            </div>
            <Button
              onClick={onLogin}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141b2d]/80 backdrop-blur-xl border-b border-white/10 py-4">
      <div className="max-w-[1800px] mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-white">{user?.username}</div>
                <div className="text-xs text-gray-400">Trader</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Balance:</span>
                <span className="font-bold text-white">${balance.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Realized P&L:</span>
                <span className={`font-bold ${realizedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {realizedPnL >= 0 ? '+' : ''}${realizedPnL.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Unrealized P&L:</span>
                <span className={`font-bold ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${
                    totalPnL >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {totalPnL >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  Total P&L: {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            onClick={onLogout}
            size="sm"
            variant="outline"
            className="border-white/10 text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}