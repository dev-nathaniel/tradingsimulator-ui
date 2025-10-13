"use client";
import StockList, { Stock } from "@/components/StockList";
import StockDetails from "@/components/StockDetails";
import PositionsPanel from "@/components/PositionsPanel";
import NewsPanel from "@/components/NewsPanel";
import { useState } from "react";

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [user, setUser] = useState(null)

  const stocks = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      current_price: 150.25,
      previous_close: 148.50,
      sector: "Technology",
      id: "1",
      volume: 100000,
      market_cap: 2500000000,
      pe_ratio: 28.5,
      dividend_yield: 0.6,
    }
  ]; // Fetch or load your stocks data here
  const positions = [
    {
      id: "pos1",
      stock_symbol: "AAPL",
      quantity: 50,
      average_price: 145.00,
      stock_name: "Apple Inc.",
    }
  ]; // Fetch or load your positions data here
  const news = [
    {
      id: "news1",
      title: "Apple Releases New iPhone Model",
      sentiment: "positive",
      summary: "Apple has announced the release of its latest iPhone model, featuring advanced technology and improved performance.",
      published_date: new Date().toISOString(),
      source: "Tech News Daily",
      related_symbols: ["AAPL"],
    }
  ]; // Fetch or load your news data here
  const isProcessing = false; // Example state for processing trades
  const userPosition = null; // Example state for user's position

  const handleExecuteTrade = (trade: { type: "buy" | "sell"; quantity: number; price: number; commission: number; }) => {
    // Implement trade execution logic here
    console.log("Executing trade:", trade);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - Stocks List */}
      <div className="lg:col-span-3">
        <StockList
          stocks={stocks}
          selectedStock={selectedStock}
          onSelectStock={setSelectedStock}
        />
      </div>

      {/* Middle Column - Stock Details */}
      <div className="lg:col-span-5">
        <StockDetails
          stock={selectedStock}
          onExecuteTrade={handleExecuteTrade}
          isProcessing={isProcessing}
          userPosition={userPosition}
        />
      </div>

      {/* Right Column - Positions & News */}
      <div className="lg:col-span-4 space-y-6">
        <PositionsPanel positions={positions} stocks={stocks} />
        <NewsPanel news={news} />
      </div>
    </div>
  );
}
