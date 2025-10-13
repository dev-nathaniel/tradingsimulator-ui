import { Dispatch, SetStateAction, useState } from "react";
import { Card } from "@/components/ui/card"
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";

export type Stock = {
    symbol: string;
    name: string;
    current_price: number;
    previous_close: number;
    sector: string;
    id: string;
    volume: number;
    market_cap: number;
    pe_ratio: number;
    dividend_yield: number;
};

export default function StockList({ stocks, selectedStock, onSelectStock }: { stocks: Stock[]; selectedStock: Stock | null; onSelectStock: Dispatch<SetStateAction<Stock | null>>; }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStocks = stocks.filter(
        (stock) =>
            stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriceChange = (stock: Stock) => {
        const change = stock.current_price - stock.previous_close;
        const changePercent = (change / stock.previous_close) * 100;
        return { change, changePercent }
    }
    return (
        <Card className="bg-[#141b2d] border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl text-white font-bold mb-4">Available Stocks</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search stocks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-[#0a0e27] border-white/10 text-white placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
                {filteredStocks.map((stock) => {
                    const { change, changePercent } = getPriceChange(stock);
                    const isPositive = change >= 0;
                    const isSelected = selectedStock?.id === stock.id;

                    return (
                        <motion.div
                            key={stock.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => onSelectStock(stock)}
                            className={`p-4 border-b border-white/5 cursor-pointer transition-all ${isSelected ? "bg-blue-500/10 border-l-4 border-l-blue-500" : "hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{stock.symbol}</span>
                                        <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                                            {stock.sector}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{stock.name}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg text-white">
                                        ${stock.current_price.toFixed(2)}
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"
                                            }`}
                                    >
                                        {isPositive ? (
                                            <TrendingUp className="w-3 h-3" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3" />
                                        )}
                                        {isPositive ? "+" : ""}
                                        {changePercent.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </Card >
    );
}